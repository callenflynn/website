const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

async function buildGameMosaic() {
    const mosaic = document.getElementById("gameMosaic");
    const track = document.getElementById("bgMosaicTrack");
    if (!mosaic || !track) return;

    const fallbackSources = [
        "assets/sections/optimized/battlefield6/bg.webp",
        "assets/sections/optimized/battlefield6/IMG_0676.webp",
        "assets/sections/optimized/battlefield6/IMG_0677.webp",
        "assets/sections/optimized/battlefield6/IMG_0678.webp",
        "assets/sections/optimized/cod/Ghost wallpaper.webp",
        "assets/sections/optimized/forza/IMG_0679.webp",
        "assets/sections/optimized/forza/IMG_0682.webp",
        "assets/sections/optimized/forza/IMG_0684.webp",
        "assets/sections/optimized/nomansky/IMG_0916.webp",
        "assets/sections/optimized/nomansky/IMG_0925.webp",
        "assets/sections/optimized/nomansky/IMG_0926.webp",
        "assets/sections/optimized/readyornot/IMG_0924.webp",
        "assets/sections/optimized/readyornot/IMG_0927.webp",
        "assets/sections/optimized/readyornot/IMG_0930.webp",
        "assets/sections/optimized/readyornot/IMG_0931.webp",
        "assets/sections/optimized/readyornot/Ready or Not.webp"
    ];

    let sources = [...fallbackSources];
    try {
        const response = await fetch("assets/sections/manifest.json");
        if (response.ok) {
            const manifestSources = await response.json();
            if (Array.isArray(manifestSources) && manifestSources.length) sources = [...manifestSources];
        }
    } catch {
        // File previews cannot fetch JSON. The checked-in fallback still builds the wall.
    }

    // ── Progressive image pool ──
    // The wall renders instantly with placeholder tiles; images stream into
    // tiles as they download (concurrency-limited) instead of the build
    // blocking on every image. This kills the "background pops in late" delay.
    const CONCURRENCY = 8;
    const imageMeta = [];
    const onMetaCallbacks = new Set();
    const loaderQueue = shuffleArray([...sources]);
    let activeLoads = 0;

    function shuffleArray(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function pumpLoader() {
        while (activeLoads < CONCURRENCY && loaderQueue.length) {
            const src = loaderQueue.pop();
            activeLoads += 1;
            const image = new Image();
            image.decoding = "async";
            image.onload = () => {
                activeLoads -= 1;
                const meta = { src, width: image.naturalWidth, height: image.naturalHeight };
                imageMeta.push(meta);
                onMetaCallbacks.forEach((callback) => callback(meta));
                pumpLoader();
            };
            image.onerror = () => {
                activeLoads -= 1;
                pumpLoader();
            };
            image.src = src;
        }
    }

    // ── Helpers ──
    // Deck: draw images without replacement so duplicates are minimised.
    // Reshuffles automatically when the deck runs out.
    let deck = [];

    function shuffledDeck() {
        return shuffleArray(imageMeta);
    }

    function drawMeta() {
        if (deck.length === 0) deck = shuffledDeck();
        return deck.pop();
    }

    function makeTile(data) {
        const tile = document.createElement("div");
        tile.className = "game-mosaic-item";
        const img = document.createElement("img");
        img.decoding = "async";
        img.alt = "";
        if (data.src) {
            img.src = data.src;
            if (img.complete) img.classList.add("loaded");
            else img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        }
        if (data.isColored) img.classList.add("colored");
        tile.append(img);
        return tile;
    }

    // ── Smooth color transition with variety ──
    function setImageColor(img, wantsColored) {
        const hasColor = img.classList.contains("colored");
        if (wantsColored === hasColor) return; // no change

        // Increment generation counter so stale handlers are ignored
        const gen = (img._colorGen || 0) + 1;
        img._colorGen = gen;

        // Cancel any in-progress transition
        img.classList.remove("losing-color", "gaining-color", "fading-color", "glowing-color");
        void img.offsetWidth;

        if (wantsColored) {
            // Gaining color: 50% flicker on, 50% smooth glow
            if (Math.random() < 0.5) {
                img.classList.add("gaining-color");
            } else {
                img.classList.add("glowing-color");
            }
            img.classList.add("colored");
        } else {
            // Losing color: 50% flicker off, 40% slow fade, 10% instant
            const roll = Math.random();
            if (roll < 0.5) {
                img.classList.add("losing-color");
            } else if (roll < 0.9) {
                img.classList.add("fading-color");
            }
            // else: instant (no animation class)
            img.classList.remove("colored");
        }

        // Only attach cleanup if an animation class was added
        if (img.classList.contains("losing-color") ||
            img.classList.contains("gaining-color") ||
            img.classList.contains("fading-color") ||
            img.classList.contains("glowing-color")) {
            img.addEventListener("animationend", function handler() {
                if (img._colorGen !== gen) return; // stale, ignore
                img.classList.remove("losing-color", "gaining-color", "fading-color", "glowing-color");
                img._colorGen = 0;
            }, { once: true });
        }
    }

    function createTileData(count) {
        return Array.from({ length: count }, () => ({
            src: "",
            width: 0,
            height: 0,
            isColored: Math.random() < 0.08
        }));
    }

    function generateTileData(count) {
        return Array.from({ length: count }, () => {
            const meta = drawMeta();
            if (!meta) return { src: "", width: 0, height: 0, isColored: false };
            return { src: meta.src, width: meta.width, height: meta.height, isColored: Math.random() < 0.08 };
        });
    }

    // Computes grid spans for a single tile. Placeholder tiles (no dimensions
    // yet) assume a 16:9 ratio so the wall lays out immediately.
    function tileLayout(data, index, columns, gap, rowHeight, columnWidth) {
        const puzzleSpans = [2, 3, 4, 2, 3, 2, 5, 2, 3, 4, 2, 3, 2, 4, 3, 2];
        const ratio = data.width > 0 && data.height > 0 ? data.width / data.height : 1.78;
        let columnSpan;
        if (ratio > 1.6) {
            columnSpan = Math.min(columns, Math.max(3, Math.round(ratio * (columns <= 5 ? 1.6 : 2.8))));
        } else if (ratio < 0.7) {
            columnSpan = Math.min(columns, Math.max(2, Math.round(ratio * (columns <= 5 ? 1.0 : 2.0))));
        } else {
            columnSpan = Math.min(columns, puzzleSpans[index % puzzleSpans.length]);
        }
        const tileHeight = (columnWidth * columnSpan) / ratio;
        const rowSpan = Math.max(5, Math.ceil((tileHeight + gap) / (rowHeight + gap)));
        return { columnSpan, rowSpan };
    }

    function applyTileLayout(grid, tileData, index) {
        const columns = window.innerWidth <= 700 ? 5 : 16;
        const gap = window.innerWidth <= 700 ? 5 : 8;
        const rowHeight = 10;
        const columnWidth = (grid.clientWidth - ((columns - 1) * gap) - (gap * 2)) / columns;
        const data = tileData[index];
        if (!data) return;
        const { columnSpan, rowSpan } = tileLayout(data, index, columns, gap, rowHeight, columnWidth);
        const tile = grid.children[index];
        tile.style.gridColumn = `span ${columnSpan}`;
        tile.style.gridRow = `span ${rowSpan}`;
    }

    function layoutGrid(grid, tileData) {
        tileData.forEach((data, i) => {
            if (!data) return;
            applyTileLayout(grid, tileData, i);
        });
    }

    // ── Create two different grids ──
    const TILES_PER_GRID = 65;
    const GRID_GAP = 14;

    const grid1 = document.createElement("div");
    grid1.className = "bg-mosaic-grid";
    grid1.id = "gameMosaic";
    let tileData1 = createTileData(TILES_PER_GRID);
    tileData1.forEach((d) => grid1.append(makeTile(d)));

    const grid2 = document.createElement("div");
    grid2.className = "bg-mosaic-grid";
    grid2.setAttribute("aria-hidden", "true");
    let tileData2 = createTileData(TILES_PER_GRID);
    tileData2.forEach((d) => grid2.append(makeTile(d)));

    mosaic.replaceWith(grid1);

    // Remove any stale extra grids from the track, then append grid2
    const staleGrids = track.querySelectorAll(".bg-mosaic-grid");
    staleGrids.forEach((g) => { if (g !== grid1) g.remove(); });
    track.appendChild(grid2);

    // Wait for layout so offsetWidth is available
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    layoutGrid(grid1, tileData1);
    layoutGrid(grid2, tileData2);

    let pos1 = 0;
    let pos2 = grid1.offsetWidth + GRID_GAP;
    grid1.style.transform = `translateX(${pos1}px)`;
    grid2.style.transform = `translateX(${pos2}px)`;

    // ── Stream loaded images into tiles as they arrive ──
    const unassignedTiles = new Set();
    [grid1, grid2].forEach((grid, gridIndex) => {
        const tileData = gridIndex === 0 ? tileData1 : tileData2;
        [...grid.children].forEach((tile, index) => {
            const entry = { grid, tile, index, data: tileData[index] };
            unassignedTiles.add(entry);
        });
    });

    const assignMeta = (meta) => {
        if (!unassignedTiles.size) return;
        const entries = [...unassignedTiles];
        const entry = entries[Math.floor(Math.random() * entries.length)];
        unassignedTiles.delete(entry);
        const liveTileData = entry.grid === grid1 ? tileData1 : tileData2;
        // If this grid was regenerated while images were still streaming, the
        // entry's data object is no longer live — leave the recycled tile alone.
        if (entry.data !== liveTileData[entry.index]) return;
        entry.data.src = meta.src;
        entry.data.width = meta.width;
        entry.data.height = meta.height;
        const img = entry.tile.querySelector("img");
        img.src = meta.src;
        if (img.complete) img.classList.add("loaded");
        else img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        applyTileLayout(entry.grid, liveTileData, entry.index);
    };
    onMetaCallbacks.add(assignMeta);

    // Start downloading. Tiles already on screen fill in as each image
    // completes instead of waiting for the whole set.
    pumpLoader();

    // ── Tile recycling: regenerate a grid when it scrolls off-screen ──
    function regenerateGrid(grid, tileData) {
        const newData = generateTileData(TILES_PER_GRID);
        tileData.length = 0;
        tileData.push(...newData);

        const tiles = [...grid.children];
        tiles.forEach((tile, i) => {
            const d = newData[i];
            if (!d) return;
            const img = tile.querySelector("img");
            // Cancel any in-progress transitions since this is off-screen
            img.classList.remove("losing-color", "gaining-color", "fading-color", "glowing-color");
            if (d.src) {
                img.classList.remove("loaded");
                img.src = d.src;
                if (img.complete) img.classList.add("loaded");
                else img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
            }
            if (d.isColored) {
                img.classList.add("colored");
            } else {
                img.classList.remove("colored");
            }
        });

        layoutGrid(grid, tileData);
    }

    // ── JS-driven infinite scroll ──
    let lastTime = performance.now();
    const SPEED = 0.018; // pixels per ms (~ 1.08 px per frame at 60 fps)
    let rafId = null;

    function animate(now) {
        const dt = Math.min(now - lastTime, 50);
        lastTime = now;
        const dx = dt * SPEED;

        pos1 -= dx;
        pos2 -= dx;

        const w1 = grid1.offsetWidth;
        const w2 = grid2.offsetWidth;

        // Grid1 scrolled completely off-screen left → recycle it
        if (pos1 + w1 < -100) {
            pos1 = pos2 + w2 + GRID_GAP;
            regenerateGrid(grid1, tileData1);
            pos1 = pos2 + grid2.offsetWidth + GRID_GAP;
        }

        // Grid2 scrolled completely off-screen left → recycle it
        if (pos2 + w2 < -100) {
            pos2 = pos1 + w1 + GRID_GAP;
            regenerateGrid(grid2, tileData2);
            pos2 = pos1 + grid1.offsetWidth + GRID_GAP;
        }

        grid1.style.transform = `translateX(${pos1}px)`;
        grid2.style.transform = `translateX(${pos2}px)`;

        rafId = requestAnimationFrame(animate);
    }

    // ── Reduced motion: skip animation ──
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
    }

    // ── Resize: re-layout and reposition ──
    let resizeTimeout;
    const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            layoutGrid(grid1, tileData1);
            layoutGrid(grid2, tileData2);
            pos2 = pos1 + grid1.offsetWidth + GRID_GAP;
            grid2.style.transform = `translateX(${pos2}px)`;
        }, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── Periodically re-randomize colored state for dynamic feel ──
    // Updates a random subset each cycle; uses flicker animation for transitions
    const colorInterval = setInterval(() => {
        const updateSubset = (grid, tileData, count) => {
            const tiles = [...grid.children];
            const indices = new Set();
            while (indices.size < Math.min(count, tiles.length)) {
                indices.add(Math.floor(Math.random() * tiles.length));
            }
            indices.forEach((i) => {
                const d = tileData[i];
                if (!d) return;
                d.isColored = Math.random() < 0.08;
                setImageColor(tiles[i].querySelector("img"), d.isColored);
            });
        };
        const subsetSize = Math.floor(TILES_PER_GRID * 0.3);
        updateSubset(grid1, tileData1, subsetSize);
        updateSubset(grid2, tileData2, subsetSize);
    }, 4000);

    // ── Cleanup: guard against double-init and allow teardown ──
    if (buildGameMosaic._cleanup) buildGameMosaic._cleanup();
    buildGameMosaic._cleanup = () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearInterval(colorInterval);
        window.removeEventListener("resize", onResize);
    };
}

const LANYARD_URL = "https://lanyard.callen.page/v1/users/1409705687159668736";
const LIVE_REFRESH_MS = 5000;

function formatPresenceStatus(status) {
    const labels = { online: "ONLINE", idle: "IDLE", dnd: "DO NOT DISTURB", offline: "OFFLINE" };
    return labels[status] || "UNKNOWN";
}

function formatActivityType(type) {
    return {
        0: "PLAYING",
        1: "STREAMING",
        2: "LISTENING TO",
        3: "WATCHING",
        5: "COMPETING IN"
    }[type] || "ACTIVE IN";
}

function formatWatchingState(state) {
    if (!state) return "";
    const match = state.match(/(?:season|s)\s*(\d+)\s*(?:,|[-–—|])?\s*(?:episode|ep|e)\.?\s*(\d+)/i);
    return match ? `S${match[1]} E${match[2]}` : state;
}

function resolveActivityAsset(activity, imageKey) {
    const image = activity?.assets?.[imageKey];
    if (!image) return "";

    if (image.startsWith("mp:external/")) {
        // Keep Discord's complete external proxy token. The encoded segment before
        // `https/<host>` can contain required source URL/query data (notably Hulu).
        return `https://media.discordapp.net/${image.slice("mp:".length)}`;
    }

    if (/^https?:\/\//i.test(image)) return image;
    if (activity.application_id) {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png?size=256`;
    }
    return "";
}

const GAME_ARTWORK_MANIFEST_URL = "assets/game-artwork.json";
const ROBLOX_ARTWORK_API_URL = "/api/roblox-artwork";
const ROBLOX_USER_ID = "2530785068";
const STEAM_ARTWORK_API_URL = "/api/steam-artwork";
const STEAM_ARTWORK_API_VERSION = "3";
const gameArtworkCache = new Map();

function isRobloxActivity(activity) {
    const name = normalizeGameName(activity?.name);
    const platform = String(activity?.platform || "").toLowerCase();
    return platform === "roblox" || name === "roblox" || name.startsWith("roblox ");
}

async function fetchArtworkResolver(url, name, fallbackSource, query = {}) {
    const params = new URLSearchParams(query);
    if (name) params.set("name", name);
    const response = await fetch(`${url}?${params.toString()}`, {
        cache: "no-store"
    });
    if (!response.ok) return null;
    const payload = await response.json();
    if (!payload?.success || !payload.data?.art) return null;
    return {
        art: payload.data.art,
        artCandidates: Array.isArray(payload.data.artCandidates) && payload.data.artCandidates.length
            ? payload.data.artCandidates
            : [payload.data.art],                    source: payload.data.source || fallbackSource,
                    resolvedName: payload.data.name || "",
                    universeId: payload.data.universeId || "",
                    placeId: payload.data.placeId || ""
                };
}
let gameArtworkManifestPromise;

function normalizeGameName(name) {
    return String(name || "")
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/[^a-z0-9']+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}

function loadGameArtworkManifest() {
    if (!gameArtworkManifestPromise) {
        gameArtworkManifestPromise = fetch(GAME_ARTWORK_MANIFEST_URL, { cache: "force-cache" })
            .then((response) => response.ok ? response.json() : {})
            .catch(() => ({}));
    }
    return gameArtworkManifestPromise;
}

async function resolveGameArtwork(activity) {
    if (activity?.type !== 0) return { art: "", source: "none" };

    const applicationId = String(activity.application_id || "");
    const gameName = normalizeGameName(activity.name);
    const cacheKey = `${applicationId}:${gameName}:${String(activity.platform || "").toLowerCase()}`;
    const cached = gameArtworkCache.get(cacheKey);
    if (cached && (!isRobloxActivity(activity) || Date.now() - cached.cachedAt < 15000)) {
        return cached.result;
    }

    const manifest = await loadGameArtworkManifest();
    const entry = manifest?.applications?.[applicationId] || manifest?.games?.[gameName] || {};
    if (entry.art) {
        const result = { art: entry.art, source: entry.source || "local-manifest" };
        gameArtworkCache.set(cacheKey, { result, cachedAt: Date.now() });
        return result;
    }

    const activityName = activity.name || "";
    const resolvers = isRobloxActivity(activity)
        ? [
            [ROBLOX_ARTWORK_API_URL, "roblox-thumbnail"],
            [STEAM_ARTWORK_API_URL, "steam-cdn-search"]
        ]
        : [[STEAM_ARTWORK_API_URL, "steam-cdn-search"]];

    for (const [resolverUrl, fallbackSource] of resolvers) {
        try {
            const result = await fetchArtworkResolver(
                resolverUrl,
                activityName,
                fallbackSource,
                resolverUrl === ROBLOX_ARTWORK_API_URL ? { userId: ROBLOX_USER_ID } : {}
            );
            if (result) {
                gameArtworkCache.set(cacheKey, { result, cachedAt: Date.now() });
                return result;
            }
        } catch {
            // A resolver is secondary artwork; continue to the next source.
        }
    }

    return { art: "assets/gamepad.svg", source: "platform-fallback" };
}

function formatElapsed(start) {
    if (!start) return "";
    const elapsed = Math.max(0, Date.now() - start);
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours) return `${hours}H ${String(minutes % 60).padStart(2, "0")}M`;
    return `${minutes}M`;
}

function setupLiveActivity() {
    const card = document.getElementById("liveActivityCard");
    if (!card) return;

    const signal = document.getElementById("liveSignal");
    const status = document.getElementById("liveStatus");
    const presence = document.getElementById("livePresence");
    const avatar = document.getElementById("liveAvatar");
    const name = document.getElementById("liveName");
    const handle = document.getElementById("liveHandle");
    const art = document.getElementById("liveActivityArt");
    const artIdle = document.getElementById("liveArtIdle");
    const artPlaceholder = document.getElementById("liveArtPlaceholder");
    const kicker = document.getElementById("liveActivityKicker");
    const title = document.getElementById("liveActivityTitle");
    const details = document.getElementById("liveActivityDetails");
    const platform = document.getElementById("liveActivityPlatform");
    const elapsed = document.getElementById("liveActivityElapsed");
    const customStatus = document.getElementById("liveCustomStatus");
    const spotifyPill = document.getElementById("liveSpotifyPill");
    const spotifyPillArt = spotifyPill?.querySelector(".live-spotify-art");
    const spotifyPillSong = spotifyPill?.querySelector(".live-spotify-song");
    const spotifyPillArtist = spotifyPill?.querySelector(".live-spotify-artist");
    const updated = document.getElementById("liveUpdated");
    let currentStart = null;
    let syncInFlight = false;
    let renderGeneration = 0;

    const setSignal = (text, state = "") => {
        signal.textContent = text;
        signal.dataset.state = state;
        const dot = document.createElement("i");
        signal.prepend(dot);
    };

    let artGeneration = 0;

    const setArt = (src, alt, fallbackSrc = "", candidates = []) => {
        const generation = ++artGeneration;
        art.classList.remove("has-art");
        art.removeAttribute("src");
        art.alt = "";
        if (artIdle) artIdle.hidden = true;
        artPlaceholder.hidden = !src;
        if (!src) return;

        const sources = [...new Set([src, ...candidates, fallbackSrc].filter(Boolean))];
        let sourceIndex = 0;
        art.onload = () => {
            if (generation !== artGeneration) return;
            art.classList.add("has-art");
            if (artIdle) artIdle.hidden = true;
            artPlaceholder.hidden = true;
        };
        art.onerror = () => {
            if (generation !== artGeneration) return;
            sourceIndex += 1;
            if (sourceIndex < sources.length) {
                art.src = sources[sourceIndex];
                return;
            }
            art.classList.remove("has-art");
            artPlaceholder.hidden = false;
            if (artIdle) artIdle.hidden = true;
        };
        art.alt = alt || "Current activity artwork";
        art.src = sources[0];
    };

    const showIdleArt = () => {
        const generation = ++artGeneration;
        art.classList.remove("has-art");
        art.removeAttribute("src");
        art.alt = "";
        if (!artIdle) {
            artPlaceholder.hidden = false;
            return;
        }

        artIdle.onload = () => {
            if (generation !== artGeneration) return;
            artIdle.hidden = false;
            artPlaceholder.hidden = true;
        };
        artIdle.onerror = () => {
            if (generation !== artGeneration) return;
            artIdle.hidden = true;
            artPlaceholder.hidden = false;
        };

        artIdle.hidden = false;
        artPlaceholder.hidden = true;
        if (artIdle.complete) {
            if (artIdle.naturalWidth > 0) return;
            artIdle.hidden = true;
            artPlaceholder.hidden = false;
        }
    };

    const render = async (payload) => {
        const generation = ++renderGeneration;
        const data = payload?.data;
        if (!payload?.success || !data) throw new Error("Invalid Lanyard response");

        const user = data.discord_user || {};
        const activities = Array.isArray(data.activities) ? data.activities : [];
        const custom = activities.find((activity) => activity.type === 4);
        const spotifyActivity = data.spotify || activities.find((activity) => activity.type === 2);
        const gameActivity = activities.find((item) => item.type !== 4 && item.type !== 2) || null;
        const activity = gameActivity || spotifyActivity || null;
        const hasDualPresence = !!(gameActivity && spotifyActivity);
        const discordStatus = data.discord_status || "offline";
        const displayName = user.display_name || user.global_name || user.username || "CALLEN";

        name.textContent = displayName;
        handle.textContent = user.username ? `@${user.username}` : "DISCORD PRESENCE FEED";
        presence.textContent = `DISCORD: ${formatPresenceStatus(discordStatus)}`;
        status.textContent = `STATUS: ${discordStatus === "offline" ? "AWAY" : "ACTIVE"}`;
        setSignal(discordStatus === "offline" ? "OFFLINE" : "LIVE", discordStatus === "offline" ? "offline" : "active");

        if (user.avatar && user.id) {
            avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=96`;
            avatar.alt = `${displayName}'s Discord avatar`;
        } else {
            avatar.src = "assets/discord.ico";
            avatar.alt = "Discord";
        }

        if (custom?.state) {
            customStatus.hidden = false;
            customStatus.textContent = `${custom.emoji?.name ? `${custom.emoji.name} ` : ""}${custom.state}`;
        } else {
            customStatus.hidden = true;
            customStatus.textContent = "";
        }

        currentStart = activity?.timestamps?.start || spotifyActivity?.timestamps?.start || null;
        if (!activity) {
            card.dataset.state = "idle";
            showIdleArt();
            if (spotifyPill) spotifyPill.hidden = true;
            kicker.textContent = discordStatus === "offline" ? "NO ACTIVE SIGNAL" : "NO RICH PRESENCE";
            title.textContent = discordStatus === "offline" ? "Currently offline" : "Just hanging out";
            details.textContent = custom?.state || "Nothing is being broadcast right now.";
            platform.textContent = "DISCORD / LIVE";
            elapsed.textContent = "";
        } else if (spotifyActivity && !gameActivity) {
            card.dataset.state = "active";

            const song = spotifyActivity.song || spotifyActivity.details || "Unknown track";
            const artist = spotifyActivity.artist || spotifyActivity.state || "Unknown artist";
            setArt(data.spotify?.album_art_url || resolveActivityAsset(spotifyActivity, "large_image"), `${song} album art`);
            kicker.textContent = "LISTENING TO";
            title.textContent = song;
            details.textContent = artist;
            platform.textContent = spotifyActivity.album ? `SPOTIFY / ${spotifyActivity.album}` : "SPOTIFY / LIVE";
            elapsed.textContent = formatElapsed(currentStart);
            if (spotifyPill) spotifyPill.hidden = true;
        } else {
            card.dataset.state = "active";
            const activityName = activity.name || "Activity";
            const watchingState = activity.type === 3 ? formatWatchingState(activity.state) : "";
            const activityDetails = activity.details || "";
            const detailsText = activity.type === 3 && watchingState && activityDetails
                ? `${watchingState} • ${activityDetails}`
                : activityDetails || watchingState || activity.state || "Active right now.";
            const discordArtwork = resolveActivityAsset(activity, "large_image");
            const gameArtwork = discordArtwork
                ? { art: "", artCandidates: [], source: "discord-rpc", resolvedName: "" }
                : await resolveGameArtwork(activity);
            // A manifest lookup can finish after the next five-second sync. Never
            // let an older lookup overwrite newer presence data.
            if (generation !== renderGeneration) return;
            const artworkSource = discordArtwork || gameArtwork.art;
            const gameFallback = activity.type === 0 && artworkSource !== "assets/gamepad.svg"
                ? "assets/gamepad.svg"
                : "";
            const resolvedActivityName = gameArtwork.resolvedName || activityName;
            setArt(artworkSource, `${resolvedActivityName} artwork`, gameFallback, gameArtwork.artCandidates || []);
            kicker.textContent = formatActivityType(activity.type);
            title.textContent = resolvedActivityName;
            details.textContent = resolvedActivityName !== activityName
                ? `${activityName} • ${detailsText}`
                : detailsText;
            const activityPlatform = activity.platform ? `${String(activity.platform).toUpperCase()} / ` : "";
            platform.textContent = activity.type === 3
                ? "WATCHING / DISCORD RPC"
                : `${activityPlatform}${activity.application_id ? "DISCORD RPC / LIVE" : "DISCORD / LIVE"}`;
            elapsed.textContent = formatElapsed(currentStart);

            // ── Dual presence: show Spotify as a compact pill below the game ──
            if (hasDualPresence && spotifyPill && spotifyPillSong && spotifyPillArtist) {
                const sp = spotifyActivity;
                spotifyPill.hidden = false;
                const artUrl = data.spotify?.album_art_url || resolveActivityAsset(sp, "large_image");
                if (spotifyPillArt && artUrl) {
                    spotifyPillArt.src = artUrl;
                } else if (spotifyPillArt) {
                    spotifyPillArt.removeAttribute("src");
                }
                spotifyPillSong.textContent = sp.song || sp.details || "Unknown track";
                spotifyPillArtist.textContent = sp.artist || sp.state || "Unknown artist";
            } else if (spotifyPill) {
                spotifyPill.hidden = true;
            }
        }

        updated.textContent = `//_LAST SYNC ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    const sync = async () => {
        if (syncInFlight) return;
        syncInFlight = true;
        try {
            const response = await fetch(LANYARD_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            await render(await response.json());
        } catch (error) {
            console.warn("Live activity unavailable:", error);
            card.dataset.state = "error";
            setSignal("UNAVAILABLE", "error");
            if (spotifyPill) spotifyPill.hidden = true;
            status.textContent = "STATUS: NO LINK";
            presence.textContent = "DISCORD: --";
            kicker.textContent = "SIGNAL LOST";
            title.textContent = "Feed unavailable";
            details.textContent = "The live presence endpoint could not be reached.";
            platform.textContent = "LANYARD / RETRYING";
            elapsed.textContent = "";
            updated.textContent = "//_RETRYING NEXT SYNC";
        } finally {
            syncInFlight = false;
        }
    };

    sync();
    window.setInterval(sync, LIVE_REFRESH_MS);
    window.setInterval(() => {
        if (currentStart) elapsed.textContent = formatElapsed(currentStart);
    }, 30000);
}

function setupSecretTerminal() {
    const btn = document.getElementById("secretTerminalBtn");
    const overlay = document.getElementById("asciiOverlay");
    const closeBtn = document.getElementById("asciiOverlayClose");
    const artEl = document.getElementById("asciiArt");
    const body = document.getElementById("asciiOverlayBody");
    if (!btn || !overlay || !artEl || !body) return;

    const ASCII_URL = "C-ascii.txt";
    let artText = null;
    let hasTyped = false;

    const fetchArt = async () => {
        if (artText !== null) return artText;
        try {
            const response = await fetch(ASCII_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            artText = await response.text();
        } catch {
            artText = "//_FILE NOT FOUND";
        }
        return artText;
    };

    // Ultra-fast typewriter: 4 lines per frame (~0.5s for the whole piece).
    // The art is ~25KB / 130 lines, so anything slower feels like a crawl.
    // Trailing whitespace-only lines are trimmed so the blinking cursor ends
    // up on the art itself instead of a blank line below it.
    const typeArt = async () => {
        if (hasTyped) return;
        const text = await fetchArt();
        const lines = text.split("\n");
        while (lines.length && /^\s*$/.test(lines[lines.length - 1])) lines.pop();
        artEl.textContent = "";

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            artEl.textContent = lines.join("\n");
            body.scrollTop = body.scrollHeight;
            hasTyped = true;
            return;
        }

        let index = 0;
        const step = () => {
            index = Math.min(lines.length, index + 4);
            artEl.textContent = lines.slice(0, index).join("\n");
            body.scrollTop = body.scrollHeight;
            if (index < lines.length) requestAnimationFrame(step);
            else hasTyped = true;
        };
        requestAnimationFrame(step);
    };

    const open = () => {
        overlay.hidden = false;
        document.body.classList.add("no-scroll");
        requestAnimationFrame(() => {
            overlay.classList.add("open");
            if (closeBtn) closeBtn.focus();
        });
        typeArt();
    };

    const close = () => {
        overlay.classList.remove("open");
        document.body.classList.remove("no-scroll");
        setTimeout(() => { overlay.hidden = true; }, 180);
        if (btn) btn.focus();
    };

    btn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (overlay.hidden) return;
        if (e.key === "Escape") close();

        // Minimal focus trap: keep Tab cycling inside the dialog
        if (e.key === "Tab") {
            const focusables = overlay.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])");
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    buildGameMosaic();
    setupLiveActivity();
    setupSecretTerminal();

    // ── Cursor-reactive halftone dots ──
    if (window.matchMedia("(hover: hover)").matches) {
        const mosaic = document.querySelector(".bg-mosaic");
        if (mosaic) {
            const dots = document.createElement("div");
            dots.className = "halftone-dots";
            mosaic.appendChild(dots);

            let mx = -500;
            let my = -500;
            let targetX = -500;
            let targetY = -500;

            document.addEventListener("mousemove", (e) => {
                // Convert to local coords — parent has a 3D perspective transform
                const rect = dots.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
            }, { passive: true });

            (function updateDots() {
                mx += (targetX - mx) * 0.06;
                my += (targetY - my) * 0.06;
                dots.style.setProperty("--mx", mx + "px");
                dots.style.setProperty("--my", my + "px");
                requestAnimationFrame(updateDots);
            })();
        }
    }

    // Reveal items on load (fallback if anime.js CDN is blocked or slow)
    const revealItems = () => {
        document.querySelectorAll(".reveal-item").forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });
    };

    if (window.anime) {
        anime({
            targets: ".reveal-item",
            opacity: [0, 1],
            translateY: [15, 0],
            duration: 600,
            delay: anime.stagger(80),
            easing: "easeOutCubic"
        });
    } else {
        revealItems();
    }

    // Safety net: ensure content is visible even if the CDN never loads
    setTimeout(() => {
        if (!window.anime) revealItems();
    }, 2000);

    // Section scroll reveal
    const revealSections = document.querySelectorAll(".reveal-section");
    if (revealSections.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        revealSections.forEach((item) => observer.observe(item));
    }

    // The Spotify hint fades on hover/focus via CSS and reappears on every page load.
});
