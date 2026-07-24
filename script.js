document.querySelector("footer span").textContent =
`\u00a9 ${new Date().getFullYear()} Callen`;

const preview = document.getElementById("previewImage");

const cards = {
    github: "https://streak-stats.demolab.com?user=callenflynn&theme=github-light&hide_border=true",
    exophase: "https://card.exophase.com/2/0/290206.png?1782584284",
    xbox: "https://www.trueachievements.com/gamercards/TinnyImp7960770.png",
    steam: "https://steeeam.vercel.app/api/76561199166083823",
    spotify: "https://spotify-recently-played-readme.vercel.app/api?user=8mhqni5h0nxmjouk24zlf2x6u"
};

const preloadedCards = new Map();
Object.values(cards).forEach((url) => {
    const img = new Image();
    img.src = url;
    preloadedCards.set(url, img);
});

const CARD_SWAP_MS = 170;
const CARD_HIDE_DELAY_MS = 90;
let activeCard = "";
let hideTimer;
let swapTimer;

function clearPreviewTimers() {
    clearTimeout(hideTimer);
    clearTimeout(swapTimer);
}

function showFrame() {
    preview.style.opacity = "1";
    preview.style.transform = "translateY(0) scale(1)";
}

function hideFrame() {
    preview.style.opacity = "0";
    preview.style.transform = "translateY(10px) scale(0.99)";
}

function hideImmediate() {
    if (!preview) return;
    clearPreviewTimers();
    hideFrame();
    activeCard = "";
}

function show(img){
    if (!preview) return;

    clearPreviewTimers();

    if (!activeCard) {
        preview.src = img;
        activeCard = img;
        requestAnimationFrame(showFrame);
        return;
    }

    if (img === activeCard) {
        requestAnimationFrame(showFrame);
        return;
    }

    hideFrame();
    swapTimer = setTimeout(() => {
        preview.src = img;
        activeCard = img;
        requestAnimationFrame(showFrame);
    }, CARD_SWAP_MS);
}

function hide(){
    if (!preview) return;
    clearPreviewTimers();
    hideTimer = setTimeout(() => {
        hideFrame();
        activeCard = "";
    }, CARD_HIDE_DELAY_MS);
}

function getCardForLinkHref(href) {
    if (href.includes("github.com/callenflynn")) return cards.github;
    if (href.includes("exophase")) return cards.exophase;
    if (href.includes("xbox")) return cards.xbox;
    if (href.includes("steamcommunity")) return cards.steam;
    if (href.includes("spotify")) return cards.spotify;
    return "";
}

const socialLinks = document.querySelectorAll(".socials a");
socialLinks.forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const card = getCardForLinkHref(href);

    link.addEventListener("mouseenter", () => {
        if (card) {
            show(card);
        } else {
            hide();
        }
    });

    link.addEventListener("mouseleave", hide);

    link.addEventListener("focus", () => {
        if (card) {
            show(card);
        }
    });

    link.addEventListener("blur", hide);
});

const socials = document.querySelector(".socials");
if (socials) {
    socials.addEventListener("mouseleave", hide);
}

window.addEventListener("blur", hideImmediate);
window.addEventListener("pagehide", hideImmediate);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        hideImmediate();
    }
});
document.addEventListener("touchstart", hideImmediate, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
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

    // Timeline scroll reveal
    const timelineItems = document.querySelectorAll(".reveal-timeline");
    if (timelineItems.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

        timelineItems.forEach((item) => observer.observe(item));
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
