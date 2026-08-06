const MAX_QUERY_LENGTH = 120;
const STEAM_SEARCH_BASE = "https://steamcommunity.com/actions/SearchApps/";
const STEAM_ART_BASE = "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps";

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
            ? "public, s-maxage=86400, stale-while-revalidate=604800"
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

module.exports = async function handler(req, res) {
    if (req.method && req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { success: false, error: "Method not allowed" });
    }

    const rawName = Array.isArray(req.query?.name) ? req.query.name[0] : req.query?.name;
    const name = String(rawName || "").trim();
    if (!name || name.length > MAX_QUERY_LENGTH) {
        return sendJson(res, 400, { success: false, error: "A valid game name is required" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    try {
        const response = await fetch(`${STEAM_SEARCH_BASE}${encodeURIComponent(name)}`, {
            headers: { Accept: "application/json" },
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`Steam search returned ${response.status}`);

        const matches = await response.json();
        if (!Array.isArray(matches) || !matches.length) {
            return sendJson(res, 404, { success: false, error: "No Steam match found" });
        }

        const wanted = normalizeName(name);
        const exact = matches.find((match) => normalizeName(match.name) === wanted);
        const scored = matches
            .map((match) => ({ match, score: matchScore(wanted, normalizeName(match.name)) }))
            .sort((a, b) => b.score - a.score);
        const best = scored[0];
        const runnerUp = scored[1];
        const confident = best?.score >= 0.75 &&
            (!runnerUp || best.score - runnerUp.score >= 0.2);
        const match = exact || (confident ? best.match : null);
        const appId = String(match?.appid || "");
        if (!/^\d+$/.test(appId)) {
            return sendJson(res, 404, { success: false, error: "Steam result had no valid app ID" });
        }

        const candidates = [
            `${STEAM_ART_BASE}/${appId}/library_600x900.jpg`,
            `${STEAM_ART_BASE}/${appId}/header.jpg`,
            match.icon,
            match.logo
        ].filter((url, index, urls) =>
            typeof url === "string" && /^https:\/\//i.test(url) && urls.indexOf(url) === index
        );

        if (!candidates.length) {
            return sendJson(res, 404, { success: false, error: "Steam result had no artwork" });
        }

        return sendJson(res, 200, {
            success: true,
            data: {
                appid: appId,
                name: match.name || name,
                art: candidates[0],
                artCandidates: candidates,
                source: "steam-cdn-search"
            }
        });
    } catch (error) {
        console.warn("Steam artwork lookup failed:", error);
        return sendJson(res, 502, { success: false, error: "Steam artwork lookup failed" });
    } finally {
        clearTimeout(timeout);
    }
};
