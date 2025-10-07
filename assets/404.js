/* filepath: 404.js */


function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

function playEasterEgg() {
    const gif = document.getElementById('easterEggGif');
    gif.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        gif.style.transform = 'scale(1)';
    }, 300);
}

function initializeRedirectTimer() {
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html';
        }
    }, 1000);

    let userInteracted = false;
    
    function cancelRedirect() {
        if (!userInteracted) {
            userInteracted = true;
            clearInterval(timer);
            document.querySelector('.redirect-timer').style.opacity = '0.3';
            document.querySelector('.redirect-timer').textContent = 'Auto-redirect cancelled due to user interaction';
        }
    }

    document.addEventListener('click', cancelRedirect);
    document.addEventListener('keydown', cancelRedirect);
}

document.addEventListener('DOMContentLoaded', function() {
    createStars();
    initializeRedirectTimer();
});