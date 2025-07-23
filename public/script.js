// Music control variables
let backgroundMusic;
let isMuted = false;
let musicReady = false;
let playPromise = null;
let hasInteracted = false;

// Initialize music
function initializeMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) {
        console.log('Audio element not found');
        return;
    }
    
    backgroundMusic.volume = 0.3; // Set to 30% volume (quiet)
    
    backgroundMusic.addEventListener('canplaythrough', () => {
        musicReady = true;
        console.log('Music ready to play');
        // Try to play immediately when ready
        if (!isMuted) {
            tryToPlayMusic();
        }
    });

    backgroundMusic.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        musicReady = false;
    });
    
    // Try to preload and start playing
    backgroundMusic.load();
    
    // Add event listeners for first interaction
    addInteractionListeners();
}

function addInteractionListeners() {
    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    
    function handleFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            console.log('First user interaction detected');
            
            if (!isMuted && musicReady && backgroundMusic) {
                tryToPlayMusic();
            }
            
            // Remove all listeners after first interaction
            events.forEach(event => {
                document.removeEventListener(event, handleFirstInteraction, true);
            });
        }
    }
    
    // Add listeners for all interaction types
    events.forEach(event => {
        document.addEventListener(event, handleFirstInteraction, true);
    });
}

function tryToPlayMusic() {
    if (musicReady && !isMuted && backgroundMusic) {
        console.log('Attempting to play music');
        
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Music started playing successfully');
            }).catch(error => {
                console.log('Autoplay prevented:', error.message);
                
                // Show a subtle play button overlay if autoplay fails
                showPlayPrompt();
            });
        }
    }
}

function showPlayPrompt() {
    // Create a subtle play button that appears briefly
    const playPrompt = document.createElement('div');
    playPrompt.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 1000;
            cursor: pointer;
            animation: fadeInOut 4s ease-in-out;
        ">
            🎵 Click anywhere to enable music
        </div>
    `;
    
    document.body.appendChild(playPrompt);
    
    // Remove after animation
    setTimeout(() => {
        if (playPrompt.parentNode) {
            playPrompt.parentNode.removeChild(playPrompt);
        }
    }, 4000);
    
    // Add click handler to prompt
    playPrompt.addEventListener('click', () => {
        if (!isMuted && musicReady && backgroundMusic) {
            tryToPlayMusic();
        }
        if (playPrompt.parentNode) {
            playPrompt.parentNode.removeChild(playPrompt);
        }
    });
}

// Add CSS for the fade animation
const musicStyle = document.createElement('style');
musicStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(musicStyle);

// Rest of your existing code...
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
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

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add parallax effect to project cards
function addParallaxEffect() {
    const cards = document.querySelectorAll('.project-card');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach((card, index) => {
            const intensity = (index + 1) * 0.5;
            const rotateX = (mouseY - 0.5) * intensity;
            const rotateY = (mouseX - 0.5) * intensity;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Add click ripple effect
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Easter eggs
let clickCount = 0;
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

function triggerFloatingAnimation(element) {
    element.classList.add('floating');
    setTimeout(() => {
        element.classList.remove('floating');
    }, 3000);
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    createStars();
    addParallaxEffect();
    addRippleEffect();
    initializeMusic(); // Initialize music with new system

    const nameTitle = document.getElementById('nameTitle');

    // Name hanging effect with click counter
    nameTitle.addEventListener('click', () => {
        clickCount++;
        nameTitle.classList.toggle('hanging');
        
        if (clickCount >= 5) {
            triggerFloatingAnimation(nameTitle);
            clickCount = 0;
        }
    });

    // Random floating effect for nameTitle
    setInterval(() => {
        const randomChance = Math.random(); 
        if (randomChance < 0.3) { 
            triggerFloatingAnimation(nameTitle);
        }
    }, 15000);

    // Mute toggle functionality
    const muteToggle = document.getElementById('muteToggle');
    muteToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        
        if (isMuted) {
            if (backgroundMusic) {
                backgroundMusic.pause();
            }
            muteToggle.innerHTML = '🔇 Music Off';
        } else {
            if (musicReady && backgroundMusic) {
                tryToPlayMusic();
                muteToggle.innerHTML = '🎵 Music On';
            } else {
                muteToggle.innerHTML = '🎵 Music On';
            }
        }
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    let isDark = true;

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        body.classList.toggle('light-theme');
        themeToggle.innerHTML = isDark ? '🌙 Dark' : '☀️ Light';
    });
});

// Clickable icons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('codeIcon').addEventListener('click', function() {
        this.classList.add('spin');
        setTimeout(() => this.classList.remove('spin'), 1000);
    });

    document.getElementById('mcIcon').addEventListener('click', function() {
        this.classList.add('shake');
        setTimeout(() => this.classList.remove('shake'), 500);
    });

    document.getElementById('socialsIcon').addEventListener('click', function() {
        this.classList.add('spin'); 
        setTimeout(() => this.classList.remove('spin'), 1000);
    });

    // Footer shake effect
    let footerClickCount = 0;
    document.getElementById('footerText').addEventListener('click', function() {
        footerClickCount++;
        
        if (footerClickCount % 3 === 0) {
            this.classList.remove('rainbow', 'shake');
            this.classList.add('big-shake');
            setTimeout(() => this.classList.remove('big-shake'), 800);
        } else {
            this.classList.remove('rainbow', 'big-shake');
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        }
    });
});

// Konami code
document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        document.body.classList.add('konami-mode');
        document.getElementById('secretMessage').classList.add('show');
        
        setTimeout(() => {
            document.body.classList.remove('konami-mode');
            document.getElementById('secretMessage').classList.remove('show');
        }, 3000);
        
        konamiCode = [];
    }
});

// Double click anywhere for surprise
let doubleClickTimeout;
document.addEventListener('click', function(e) {
    if (doubleClickTimeout) {
        const surprise = ['🎉', '✨', '🚀', '⭐', '💫', '🌟'];
        const emoji = surprise[Math.floor(Math.random() * surprise.length)];
        
        const sparkle = document.createElement('div');
        sparkle.textContent = emoji;
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: sparkleUp 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
        
        clearTimeout(doubleClickTimeout);
        doubleClickTimeout = null;
    } else {
        doubleClickTimeout = setTimeout(() => {
            doubleClickTimeout = null;
        }, 300);
    }
});

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent += `
    @keyframes sparkleUp {
        0% {
            transform: translateY(0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Add smooth entrance animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});
