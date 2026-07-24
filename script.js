document.querySelector("footer span").textContent =
`\u00a9 ${new Date().getFullYear()} Callen`;

async function buildGameMosaic() {
    const mosaic = document.getElementById("gameMosaic");
    if (!mosaic) return;

    const fallbackSources = [
        "assets/sections/battlefield6/bg.jpg",
        "assets/sections/battlefield6/IMG_0676.webp",
        "assets/sections/battlefield6/IMG_0677.webp",
        "assets/sections/battlefield6/IMG_0678.webp",
        "assets/sections/cod/Ghost wallpaper.jpg",
        "assets/sections/forza/IMG_0679.webp",
        "assets/sections/forza/IMG_0682.webp",
        "assets/sections/forza/IMG_0684.webp",
        "assets/sections/nomansky/IMG_0916.webp",
        "assets/sections/nomansky/IMG_0925.webp",
        "assets/sections/nomansky/IMG_0926.webp",
        "assets/sections/readyornot/IMG_0924.webp",
        "assets/sections/readyornot/IMG_0927.webp",
        "assets/sections/readyornot/IMG_0930.webp",
        "assets/sections/readyornot/IMG_0931.webp",
        "assets/sections/readyornot/Ready or Not.jpg"
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

    const loadedImages = await Promise.all(sources.map((src) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => resolve(null);
        image.src = src;
    })));

    const tiles = loadedImages.filter(Boolean).map(({ src, width, height }) => {
        const tile = document.createElement("div");
        const image = document.createElement("img");
        image.src = src;
        image.alt = "";
        tile.className = "game-mosaic-item";
        tile.append(image);
        mosaic.append(tile);
        return { tile, width, height };
    });

    const layoutTiles = () => {
        const columns = window.innerWidth <= 700 ? 5 : 16;
        const gap = window.innerWidth <= 700 ? 5 : 8;
        const rowHeight = 10;
        const columnWidth = (mosaic.clientWidth - ((columns - 1) * gap) - (gap * 2)) / columns;

        tiles.forEach(({ tile, width, height }) => {
            const ratio = width / height;
            const columnSpan = Math.min(columns, Math.max(2, Math.round(ratio * (columns <= 5 ? 1.4 : 2.6))));
            const tileHeight = (columnWidth * columnSpan) / ratio;
            const rowSpan = Math.max(6, Math.ceil((tileHeight + gap) / (rowHeight + gap)));
            tile.style.gridColumn = `span ${columnSpan}`;
            tile.style.gridRow = `span ${rowSpan}`;
        });
    };

    layoutTiles();
    window.addEventListener("resize", layoutTiles, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
    buildGameMosaic();
    // Reveal items on load
    if (window.anime) {
        anime({
            targets: ".reveal-item",
            opacity: [0, 1],
            translateY: [15, 0],
            duration: 600,
            delay: anime.stagger(80),
            easing: "easeOutCubic"
        });
    }

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

    // Canvas dot grid
    const canvas = document.querySelector(".bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let rafId;
    const spacing = 34;
    const dotSize = 1;
    const drift = 8;
    let t = 0;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.floor(window.innerWidth);
        const height = Math.floor(window.innerHeight);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        t += 0.006;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(36, 36, 36, 0.08)";

        const autoX = Math.sin(t) * 2.5;
        const autoY = Math.cos(t * 0.9) * 2.5;
        const ox = pointer.x * drift + autoX;
        const oy = pointer.y * drift + autoY;

        for (let y = -spacing; y <= h + spacing; y += spacing) {
            for (let x = -spacing; x <= w + spacing; x += spacing) {
                ctx.beginPath();
                ctx.arc(x + ox, y + oy, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        rafId = requestAnimationFrame(draw);
    }

    function onPointerMove(event) {
        pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    window.addEventListener("pagehide", () => {
        cancelAnimationFrame(rafId);
    });
});
