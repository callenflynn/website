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

    // ── Pre-load all images to cache dimensions ──
    const imageMeta = [];
    {
        const loaded = await Promise.all(sources.map((src) => new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
            image.onerror = () => resolve(null);
            image.src = src;
        })));
        for (const data of loaded) {
            if (data) imageMeta.push(data);
        }
    }

    if (!imageMeta.length) return;

    // ── Helpers ──
    // Deck: draw images without replacement so duplicates are minimised.
    // Reshuffles automatically when the deck runs out.
    let deck = [];

    function shuffledDeck() {
        const d = [...imageMeta];
        for (let i = d.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [d[i], d[j]] = [d[j], d[i]];
        }
        return d;
    }

    function drawMeta() {
        if (deck.length === 0) deck = shuffledDeck();
        return deck.pop();
    }

    function makeTile(src, isColored) {
        const tile = document.createElement("div");
        tile.className = "game-mosaic-item";
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        if (isColored) img.classList.add("colored");
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

    function generateTileData(count) {
        return Array.from({ length: count }, () => {
            const meta = drawMeta();
            return { src: meta.src, width: meta.width, height: meta.height, isColored: Math.random() < 0.08 };
        });
    }

    function layoutGrid(grid, tileData) {
        const columns = window.innerWidth <= 700 ? 5 : 16;
        const gap = window.innerWidth <= 700 ? 5 : 8;
        const rowHeight = 10;
        const columnWidth = (grid.clientWidth - ((columns - 1) * gap) - (gap * 2)) / columns;
        const puzzleSpans = [2, 3, 4, 2, 3, 2, 5, 2, 3, 4, 2, 3, 2, 4, 3, 2];

        const tiles = [...grid.children];
        tiles.forEach((tile, i) => {
            const data = tileData[i];
            if (!data) return;
            const ratio = data.width / data.height;
            let columnSpan;
            if (ratio > 1.6) {
                columnSpan = Math.min(columns, Math.max(3, Math.round(ratio * (columns <= 5 ? 1.6 : 2.8))));
            } else if (ratio < 0.7) {
                columnSpan = Math.min(columns, Math.max(2, Math.round(ratio * (columns <= 5 ? 1.0 : 2.0))));
            } else {
                columnSpan = Math.min(columns, puzzleSpans[i % puzzleSpans.length]);
            }
            const tileHeight = (columnWidth * columnSpan) / ratio;
            const rowSpan = Math.max(5, Math.ceil((tileHeight + gap) / (rowHeight + gap)));
            tile.style.gridColumn = `span ${columnSpan}`;
            tile.style.gridRow = `span ${rowSpan}`;
        });
    }

    // ── Create two different grids ──
    const TILES_PER_GRID = 65;
    const GRID_GAP = 14;

    const grid1 = document.createElement("div");
    grid1.className = "bg-mosaic-grid";
    grid1.id = "gameMosaic";
    let tileData1 = generateTileData(TILES_PER_GRID);
    tileData1.forEach((d) => grid1.append(makeTile(d.src, d.isColored)));

    const grid2 = document.createElement("div");
    grid2.className = "bg-mosaic-grid";
    grid2.setAttribute("aria-hidden", "true");
    let tileData2 = generateTileData(TILES_PER_GRID);
    tileData2.forEach((d) => grid2.append(makeTile(d.src, d.isColored)));

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
            img.src = d.src;
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
    const activityIcon = document.getElementById("liveActivityIcon");
    const artTenor = document.getElementById("liveArtTenor");
    const artPlaceholder = document.getElementById("liveArtPlaceholder");
    const kicker = document.getElementById("liveActivityKicker");
    const title = document.getElementById("liveActivityTitle");
    const details = document.getElementById("liveActivityDetails");
    const platform = document.getElementById("liveActivityPlatform");
    const elapsed = document.getElementById("liveActivityElapsed");
    const customStatus = document.getElementById("liveCustomStatus");
    const updated = document.getElementById("liveUpdated");
    let currentStart = null;
    let syncInFlight = false;

    const setSignal = (text, state = "") => {
        signal.textContent = text;
        signal.dataset.state = state;
        const dot = document.createElement("i");
        signal.prepend(dot);
    };

    let artGeneration = 0;
    let tenorObserver = null;

    const stopTenorObserver = () => {
        if (tenorObserver) {
            tenorObserver.disconnect();
            tenorObserver = null;
        }
    };

    const setArt = (src, alt) => {
        stopTenorObserver();
        const generation = ++artGeneration;
        art.classList.remove("has-art");
        art.removeAttribute("src");
        art.alt = "";
        if (artTenor) artTenor.hidden = true;
        artPlaceholder.hidden = !src;
        if (!src) return;
        art.onload = () => {
            if (generation !== artGeneration) return;
            art.classList.add("has-art");
            if (artTenor) artTenor.hidden = true;
            artPlaceholder.hidden = true;
        };
        art.onerror = () => {
            if (generation !== artGeneration) return;
            art.classList.remove("has-art");
            artPlaceholder.hidden = false;
            if (artTenor) artTenor.hidden = true;
        };
        art.alt = alt || "Current activity artwork";
        art.src = src;
    };

    const showIdleArt = () => {
        const generation = ++artGeneration;
        stopTenorObserver();
        art.classList.remove("has-art");
        art.removeAttribute("src");
        art.alt = "";
        if (activityIcon) activityIcon.hidden = true;
        if (!artTenor) {
            artPlaceholder.hidden = false;
            return;
        }

        const syncTenorVisibility = () => {
            if (generation !== artGeneration) return;
            const embedLoaded = artTenor.querySelector("iframe, video, img");
            if (embedLoaded) {
                artPlaceholder.hidden = true;
                stopTenorObserver();
            }
        };

        artPlaceholder.hidden = true;
        artTenor.hidden = false;
        syncTenorVisibility();
        tenorObserver = new MutationObserver(syncTenorVisibility);
        tenorObserver.observe(artTenor, { childList: true, subtree: true });

        // Tenor loads asynchronously; retain the normal placeholder if its embed is blocked.
        window.setTimeout(() => {
            if (generation !== artGeneration) return;
            if (!artTenor.querySelector("iframe, video, img")) artPlaceholder.hidden = false;
        }, 4000);
    };

    const render = (payload) => {
        const data = payload?.data;
        if (!payload?.success || !data) throw new Error("Invalid Lanyard response");

        const user = data.discord_user || {};
        const activities = Array.isArray(data.activities) ? data.activities : [];
        const custom = activities.find((activity) => activity.type === 4);
        const spotify = data.spotify || activities.find((activity) => activity.type === 2);
        const activity = spotify || activities.find((item) => item.type !== 4) || null;
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

        currentStart = activity?.timestamps?.start || spotify?.timestamps?.start || null;
        if (!activity) {
            card.dataset.state = "idle";
            showIdleArt();
            kicker.textContent = discordStatus === "offline" ? "NO ACTIVE SIGNAL" : "NO RICH PRESENCE";
            title.textContent = discordStatus === "offline" ? "Currently offline" : "Just hanging out";
            details.textContent = custom?.state || "Nothing is being broadcast right now.";
            platform.textContent = "DISCORD / LIVE";
            elapsed.textContent = "";
        } else if (spotify) {
            card.dataset.state = "active";
            if (activityIcon) {
                activityIcon.hidden = true;
                activityIcon.style.backgroundImage = "";
            }
            const song = spotify.song || spotify.details || "Unknown track";
            const artist = spotify.artist || spotify.state || "Unknown artist";
            setArt(data.spotify?.album_art_url || resolveActivityAsset(spotify, "large_image"), `${song} album art`);
            kicker.textContent = "LISTENING TO";
            title.textContent = song;
            details.textContent = artist;
            platform.textContent = spotify.album ? `SPOTIFY / ${spotify.album}` : "SPOTIFY / LIVE";
            elapsed.textContent = formatElapsed(currentStart);
        } else {
            card.dataset.state = "active";
            const activityName = activity.name || "Activity";
            const watchingState = activity.type === 3 ? formatWatchingState(activity.state) : "";
            const activityDetails = activity.details || "";
            const detailsText = activity.type === 3 && watchingState && activityDetails
                ? `${watchingState} • ${activityDetails}`
                : activityDetails || watchingState || activity.state || "Active right now.";
            setArt(resolveActivityAsset(activity, "large_image"), `${activityName} artwork`);
            if (activityIcon) {
                const iconSource = resolveActivityAsset(activity, "small_image");
                activityIcon.hidden = activity.type !== 3;
                activityIcon.textContent = iconSource ? "" : "TV";
                activityIcon.style.backgroundImage = iconSource ? `url("${iconSource}")` : "";
            }
            kicker.textContent = formatActivityType(activity.type);
            title.textContent = activityName;
            details.textContent = detailsText;
            platform.textContent = activity.type === 3
                ? "WATCHING / DISCORD RPC"
                : activity.application_id ? "DISCORD RPC / LIVE" : "DISCORD / LIVE";
            elapsed.textContent = formatElapsed(currentStart);
        }

        updated.textContent = `//_LAST SYNC ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    const sync = async () => {
        if (syncInFlight) return;
        syncInFlight = true;
        try {
            const response = await fetch(LANYARD_URL, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            render(await response.json());
        } catch (error) {
            console.warn("Live activity unavailable:", error);
            card.dataset.state = "error";
            setSignal("UNAVAILABLE", "error");
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

document.addEventListener("DOMContentLoaded", () => {
    buildGameMosaic();
    setupLiveActivity();

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
