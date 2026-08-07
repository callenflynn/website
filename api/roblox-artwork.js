const MAX_QUERY_LENGTH = 120;
const ROBLOX_SEARCH_BASE = "https://apis.roblox.com/search-api/omni-search";
const ROBLOX_PRESENCE_BASE = "https://presence.roblox.com/v1/presence/users";
const ROBLOX_GAME_DETAILS_BASE = "https://games.roblox.com/v1/games?universeIds=";
const ROBLOX_PLACE_DETAILS_BASE = "https://games.roblox.com/v1/games/multiget-place-details?placeIds=";
const ROBLOX_THUMBNAIL_BASE = "https://thumbnails.roblox.com/v1/games/icons";
const ROBLOX_PLACE_THUMBNAIL_BASE = "https://thumbnails.roblox.com/v1/places/gameicons";

function normalizeName(name) {
    return String(name || "")
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/[^a-z0-9']+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
        "Cache-Control",
        status === 200
            ? "public, s-maxage=15, stale-while-revalidate=30"
            : "no-store"
    );
    res.end(JSON.stringify(body));
}

function matchScore(wanted, candidate) {
    const wantedTokens = new Set(wanted.split(" ").filter(Boolean));
    const candidateTokens = new Set(candidate.split(" ").filter(Boolean));
    if (!wantedTokens.size) return 0;
    let matched = 0;
    for (const token of wantedTokens) {
        if (candidateTokens.has(token)) matched += 1;
    }
    return matched / wantedTokens.size;
}

function getGameResults(payload) {
    if (!Array.isArray(payload?.searchResults)) return [];
    return payload.searchResults
        .filter((group) => String(group?.contentGroupType || "").toLowerCase() === "game")
        .flatMap((group) => Array.isArray(group.contents) ? group.contents : [])
        .filter((game) => game && /^\d+$/.test(String(game.universeId || "")));
}

async function getJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) return null;
    return response.json();
}

async function getThumbnail({ universeId, placeId }, signal) {
    const endpoint = universeId
        ? `${ROBLOX_THUMBNAIL_BASE}?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
        : `${ROBLOX_PLACE_THUMBNAIL_BASE}?placeIds=${placeId}&size=512x512&format=Png&isCircular=false`;
    const payload = await getJson(endpoint, {
        headers: { Accept: "application/json" },
        signal
    });
    const thumbnail = payload?.data?.[0];
    return thumbnail?.state === "Completed" && /^https:\/\//i.test(String(thumbnail.imageUrl || ""))
        ? thumbnail.imageUrl
        : "";
}

async function resolveCurrentExperience(userId, signal) {
    const presence = await getJson(ROBLOX_PRESENCE_BASE, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userIds: [Number(userId)] }),
        signal
    });
    const current = presence?.userPresences?.[0];
    if (current?.userPresenceType !== 2) return null;

    const placeId = String(current.placeId || current.rootPlaceId || "");
    let universeId = String(current.universeId || "");
    let details = null;

    if (/^\d+$/.test(universeId)) {
        details = (await getJson(`${ROBLOX_GAME_DETAILS_BASE}${universeId}`, {
            headers: { Accept: "application/json" },
            signal
        }))?.data?.[0] || null;
    } else if (/^\d+$/.test(placeId)) {
        details = (await getJson(`${ROBLOX_PLACE_DETAILS_BASE}${placeId}`, {
            headers: { Accept: "application/json" },
            signal
        }))?.[0] || null;
        universeId = String(details?.universeId || "");
    }

    if (!/^\d+$/.test(universeId) && !/^\d+$/.test(placeId)) return null;

    const art = await getThumbnail({
        universeId: /^\d+$/.test(universeId) ? universeId : "",
        placeId: /^\d+$/.test(placeId) ? placeId : ""
    }, signal);
    if (!art) return null;

    return {
        universeId,
        placeId,
        name: details?.name || "Roblox experience",
        art,
        artCandidates: [art],
        source: "roblox-presence"
    };
}

async function resolveByName(name, signal) {
    const searchUrl = `${ROBLOX_SEARCH_BASE}?searchQuery=${encodeURIComponent(name)}&sessionId=00000000-0000-0000-0000-000000000000&pageType=all`;
    const payload = await getJson(searchUrl, {
        headers: { Accept: "application/json" },
        signal
    });
    const games = getGameResults(payload);
    if (!games.length) return null;

    const wanted = normalizeName(name);
    const exact = games.find((game) => normalizeName(game.name) === wanted);
    const best = games
        .map((game) => ({ game, score: matchScore(wanted, normalizeName(game.name)) }))
        .sort((a, b) => b.score - a.score)[0];
    const match = exact || (best?.score >= 0.5 ? best.game : null);
    const universeId = String(match?.universeId || "");
    if (!/^\d+$/.test(universeId)) return null;

    const art = await getThumbnail({ universeId }, signal);
    if (!art) return null;
    return {
        universeId,
        name: match.name || name,
        art,
        artCandidates: [art],
        source: "roblox-thumbnail"
    };
}

module.exports = async function handler(req, res) {
    if (req.method && req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { success: false, error: "Method not allowed" });
    }

    const rawName = Array.isArray(req.query?.name) ? req.query.name[0] : req.query?.name;
    const rawUserId = Array.isArray(req.query?.userId) ? req.query.userId[0] : req.query?.userId;
    const name = String(rawName || "").trim();
    const userId = String(rawUserId || "").trim();
    if ((!name && !userId) || name.length > MAX_QUERY_LENGTH || (userId && !/^\d+$/.test(userId))) {
        return sendJson(res, 400, { success: false, error: "A valid Roblox name or user ID is required" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    try {
        let result = null;
        if (userId) {
            try {
                result = await resolveCurrentExperience(userId, controller.signal);
            } catch (error) {
                console.warn("Roblox presence lookup failed:", error);
            }
        }
        if (!result && name) result = await resolveByName(name, controller.signal);
        if (!result) {
            return sendJson(res, 404, { success: false, error: "No active Roblox experience or game match found" });
        }

        return sendJson(res, 200, { success: true, data: result });
    } catch (error) {
        console.warn("Roblox artwork lookup failed:", error);
        return sendJson(res, 502, { success: false, error: "Roblox artwork lookup failed" });
    } finally {
        clearTimeout(timeout);
    }
};
