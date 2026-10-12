const ALLOWED_HOSTS = new Set([
    "callen.page",
    "blog.callen.page",
    "mastodon.callen.page",
    "rss.callen.page",
    "cflix.callen.page",
    "search.callen.page",
    "dash.callen.page",
    "netdata.callen.page",
    "uptime-kuma.callen.page",
    "n8n.callen.page",
    "omniroute.callen.page",
    "webui.callen.page",
    "penpot.callen.page",
    "callenflynn.github.io"
]);

function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=30");
    res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
    if (req.method && req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return sendJson(res, 405, { error: "Method not allowed" });
    }

    const rawUrl = Array.isArray(req.query?.url) ? req.query.url[0] : req.query?.url;
    if (!rawUrl) {
        return sendJson(res, 400, { error: "Missing url parameter" });
    }

    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return sendJson(res, 400, { error: "Invalid URL" });
    }

    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
        return sendJson(res, 403, { error: "Host not allowed for health check" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    try {
        const response = await fetch(parsed.href, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        // Check for Cloudflare error codes or HTTP >= 500
        const status = response.status;
        let isHealthy = status >= 200 && status < 400;

        // If status is 401 or 403, service is up and serving an auth gate (e.g. basic auth / dashboard login)
        if (status === 401 || status === 403) {
            isHealthy = true;
        }

        // Even on 200, if text indicates Cloudflare error or status >= 500, mark unhealthy
        if (status >= 500) {
            isHealthy = false;
        } else if (response.headers.get("server")?.toLowerCase().includes("cloudflare")) {
            // Check if Cloudflare served an error page (e.g. 521/522/530 rendered or error code in text)
            try {
                const text = await response.text();
                if (text.includes("error code: 10") || text.includes("Cloudflare Ray ID") && text.includes("Error")) {
                    isHealthy = false;
                }
            } catch {}
        }

        return sendJson(res, 200, {
            url: parsed.href,
            status,
            healthy: isHealthy
        });
    } catch (err) {
        clearTimeout(timeout);
        return sendJson(res, 200, {
            url: parsed.href,
            status: 0,
            healthy: false,
            error: err.name === "AbortError" ? "Timeout" : "Connection failed"
        });
    }
};
