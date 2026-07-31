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

document.addEventListener("DOMContentLoaded", () => {
    buildGameMosaic();

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
