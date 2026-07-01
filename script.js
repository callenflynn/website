document.querySelector("footer span").textContent =
`© ${new Date().getFullYear()} Callen`;
// too lazy to manually update year

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
