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

function show(img){
    preview.src = img;
    preview.style.opacity = "1";
    preview.style.transform = "translateY(0)";
}

function hide(){
    preview.style.opacity = "0";
    preview.style.transform = "translateY(10px)";
}

document.querySelectorAll(".socials a").forEach(link => {

    const href = (link.getAttribute("href") || "").toLowerCase();

    if (href.includes("github.com/callenflynn")){
        link.addEventListener("mouseenter", () => show(cards.github));
        link.addEventListener("mouseleave", hide);
    }

    if (href.includes("exophase")){
        link.addEventListener("mouseenter", () => show(cards.exophase));
        link.addEventListener("mouseleave", hide);
    }

    if (href.includes("xbox")){
        link.addEventListener("mouseenter", () => show(cards.xbox));
        link.addEventListener("mouseleave", hide);
    }

    if (href.includes("steamcommunity")){
        link.addEventListener("mouseenter", () => show(cards.steam));
        link.addEventListener("mouseleave", hide);
    }

    if (href.includes("spotify")){
        link.addEventListener("mouseenter", () => show(cards.spotify));
        link.addEventListener("mouseleave", hide);
    }

});