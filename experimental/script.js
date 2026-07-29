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

    let sources = fallbackSources;
    try {
        const response = await fetch("assets/sections/manifest.json");
        if (response.ok) {
            const manifestSources = await response.json();
            if (Array.isArray(manifestSources) && manifestSources.length) sources = manifestSources;
        }
    } catch {
        // File previews cannot fetch JSON. The checked-in fallback still builds the wall.
    }

    // Shuffle so every page load feels fresh
    for (let i = sources.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sources[i], sources[j]] = [sources[j], sources[i]];
    }

    const loadedImages = await Promise.all(sources.map((src) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => resolve(null);
        image.src = src;
    })));

    const tileData = loadedImages.filter(Boolean);

    const makeTile = ({ src }) => {
        const tile = document.createElement("div");
        const image = document.createElement("img");
        image.src = src;
        image.alt = "";
        tile.className = "game-mosaic-item";
        tile.append(image);
        return tile;
    };

    const grid1 = document.createElement("div");
    grid1.className = "bg-mosaic-grid";
    grid1.id = "gameMosaic";

    const grid2 = document.createElement("div");
    grid2.className = "bg-mosaic-grid";
    grid2.setAttribute("aria-hidden", "true");

    // Render tile nodes into an array and map them back to data for layout
    const tiles1 = tileData.map((data) => {
        const tile = makeTile(data);
        grid1.append(tile);
        return { tile, width: data.width, height: data.height };
    });

    const tiles2 = tileData.map((data) => {
        const tile = makeTile(data);
        grid2.append(tile);
        return { tile, width: data.width, height: data.height };
    });

    mosaic.replaceWith(grid1);
    track.appendChild(grid2);

    const layoutGrid = (grid, tiles) => {
        const columns = window.innerWidth <= 700 ? 5 : 16;
        const gap = window.innerWidth <= 700 ? 5 : 8;
        const rowHeight = 10;
        const columnWidth = (grid.clientWidth - ((columns - 1) * gap) - (gap * 2)) / columns;
        const puzzleSpans = [2, 3, 4, 2, 3, 2, 5, 2, 3, 4, 2, 3, 2, 4, 3, 2];

        tiles.forEach(({ tile, width, height }, i) => {
            const ratio = width / height;
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
    };

    const layoutTiles = () => {
        layoutGrid(grid1, tiles1);
        layoutGrid(grid2, tiles2);
    };

    layoutTiles();
    window.addEventListener("resize", layoutTiles, { passive: true });
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
});
