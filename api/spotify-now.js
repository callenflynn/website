// /api/spotify-now.js — server-side Spotify "now playing" fallback.
//
// Purpose: when Discord is closed, Lanyard reports discord_status "offline" and
// spotify: null, so the site card goes idle even if music is playing. This
// function talks to Spotify directly (server-side, so the refresh token never
// reaches the browser) and returns a Lanyard-shaped payload the existing
// render() path already understands.
//
// Env vars (set in Vercel project settings, Production scope):
//   SPOTIFY_CLIENT_ID      — Spotify app client ID
//   SPOTIFY_REFRESH_TOKEN  — long-lived refresh token (non-rotating)
//
// Response (always 200 unless misconfigured):
//   { success: true, playing: false }
//   { success: true, playing: true, data: { spotify: {...}, discord_status: "offline", discord_user: {...} } }

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

// Module-level token cache. Vercel keeps the module warm between invocations,
// so we only hit the token endpoint ~once per hour instead of every request.
let cachedToken = null; // { access_token, expires_at }

function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // Never cache: the whole point is a realtime "now playing" signal.
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
}

async function getAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !refreshToken) {
        throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_REFRESH_TOKEN");
    }

    // Reuse a token that still has ~60s of life left.
    if (cachedToken && cachedToken.expires_at - 60000 > Date.now()) {
        return cachedToken.access_token;
    }

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
    });

    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Token refresh failed (${response.status}): ${detail.slice(0, 200)}`);
    }

    const json = await response.json();
    if (!json.access_token) {
        throw new Error("Token refresh returned no access_token");
    }

    cachedToken = {
        access_token: json.access_token,
        // Spotify returns expires_in (seconds, usually 3600).
        expires_at: Date.now() + (json.expires_in || 3600) * 1000,
    };

    return cachedToken.access_token;
}

// Map Spotify's currently-playing payload into the subset of the Lanyard shape
// that script.js render() actually reads for a Spotify activity.
function mapToLanyardShape(nowPlaying) {
    const item = nowPlaying?.item;
    if (!item) return null;

    // Spotify returns an array of images, largest first.
    const art =
        (item.album && Array.isArray(item.album.images) && item.album.images[0]?.url) || "";

    const progress = typeof nowPlaying.progress_ms === "number" ? nowPlaying.progress_ms : 0;
    const start = Date.now() - progress;

    return {
        song: item.name || "Unknown track",
        artist: Array.isArray(item.artists) && item.artists.length
            ? item.artists.map((a) => a.name).join(", ")
            : "Unknown artist",
        album: (item.album && item.album.name) || "",
        album_art_url: art,
        timestamps: { start: Math.round(start) },
    };
}

module.exports = async function handler(req, res) {
    if (req.method && req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { success: false, error: "Method not allowed" });
    }

    let accessToken;
    try {
        accessToken = await getAccessToken();
    } catch (error) {
        // Surface config/refresh problems clearly rather than a silent blank card.
        return sendJson(res, 500, { success: false, error: error.message });
    }

    try {
        const response = await fetch(NOW_PLAYING_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // 204 => authenticated fine, just nothing playing.
        if (response.status === 204) {
            return sendJson(res, 200, { success: true, playing: false });
        }

        if (response.status === 401) {
            // Token went stale mid-flight; drop the cache so the next call refreshes.
            cachedToken = null;
            return sendJson(res, 200, { success: true, playing: false });
        }

        if (!response.ok) {
            return sendJson(res, 200, { success: true, playing: false });
        }

        const nowPlaying = await response.json();
        // item === null can happen for private sessions / podcasts; treat as not playing.
        const spotify = mapToLanyardShape(nowPlaying);
        if (!spotify || nowPlaying.is_playing === false) {
            return sendJson(res, 200, { success: true, playing: false });
        }

        return sendJson(res, 200, {
            success: true,
            playing: true,
            data: {
                // discord_status "offline" reflects that this data did NOT come from
                // Discord — render() still shows the song, we just tweak the signal text.
                discord_status: "offline",
                discord_user: null,
                spotify,
                activities: [],
            },
        });
    } catch (error) {
        return sendJson(res, 200, { success: true, playing: false, error: error.message });
    }
};
