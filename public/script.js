// Music control variables
let backgroundMusic;
let isMuted = true; // Changed from false to true - start muted
let musicReady = false;
let playPromise = null;
let hasInteracted = false;

function initializeMusic() {
    if (window.location.pathname.includes('coding.html')) {
        return;
    }
    
    backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) {
        console.log('Audio element not found');
        return;
    }
    
    backgroundMusic.volume = 0.3; 
    
    backgroundMusic.addEventListener('canplaythrough', () => {
        musicReady = true;
        console.log('Music ready to play');
        // Removed auto-play since we start muted
    });

    backgroundMusic.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        musicReady = false;
    });
    
    backgroundMusic.load();
    
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
            
            events.forEach(event => {
                document.removeEventListener(event, handleFirstInteraction, true);
            });
        }
    }
    
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
                
                showPlayPrompt();
            });
        }
    }
}

function showPlayPrompt() {
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
    
    setTimeout(() => {
        if (playPrompt.parentNode) {
            playPrompt.parentNode.removeChild(playPrompt);
        }
    }, 4000);
    
    playPrompt.addEventListener('click', () => {
        if (!isMuted && musicReady && backgroundMusic) {
            tryToPlayMusic();
        }
        if (playPrompt.parentNode) {
            playPrompt.parentNode.removeChild(playPrompt);
        }
    });
}

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

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

let clickCount = 0;
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

function triggerFloatingAnimation(element) {
    element.classList.add('floating');
    setTimeout(() => {
        element.classList.remove('floating');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    createStars();
    addParallaxEffect();
    addRippleEffect();
    initializeMusic();

    const nameTitle = document.getElementById('nameTitle');
    if (nameTitle) {
        nameTitle.addEventListener('click', () => {
            clickCount++;
            nameTitle.classList.toggle('hanging');
            
            if (clickCount >= 5) {
                triggerFloatingAnimation(nameTitle);
                clickCount = 0;
            }
        });

        setInterval(() => {
            const randomChance = Math.random(); 
            if (randomChance < 0.3) { 
                triggerFloatingAnimation(nameTitle);
            }
        }, 15000);
    }

    const muteToggle = document.getElementById('muteToggle');
    if (muteToggle) {
        muteToggle.innerHTML = '🔇';
        
        muteToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            
            if (isMuted) {
                if (backgroundMusic) {
                    backgroundMusic.pause();
                }
                muteToggle.innerHTML = '🔇';
            } else {
                if (musicReady && backgroundMusic) {
                    tryToPlayMusic();
                    muteToggle.innerHTML = '🔊';
                } else {
                    muteToggle.innerHTML = '🔊';
                }
            }
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const body = document.body;
        let isDark = true;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            body.classList.toggle('light-theme');
            themeToggle.innerHTML = isDark ? '🌙 Dark' : '☀️ Light';
        });
    }

    const codeIcon = document.getElementById('codeIcon');
    if (codeIcon) {
        codeIcon.addEventListener('click', function() {
            this.classList.add('spin');
            setTimeout(() => this.classList.remove('spin'), 1000);
        });
    }

    const mcIcon = document.getElementById('mcIcon');
    if (mcIcon) {
        mcIcon.addEventListener('click', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    }

    const socialsIcon = document.getElementById('socialsIcon');
    if (socialsIcon) {
        socialsIcon.addEventListener('click', function() {
            this.classList.add('spin'); 
            setTimeout(() => this.classList.remove('spin'), 1000);
        });
    }

    const codingIcon = document.getElementById('codingIcon');
    if (codingIcon) {
        codingIcon.addEventListener('click', function() {
            this.classList.add('spin');
            setTimeout(() => {
                this.classList.remove('spin');
            }, 1000);
        });
    }

    const footerText = document.getElementById('footerText');
    if (footerText) {
        let footerClickCount = 0;
        footerText.addEventListener('click', function() {
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
    }

    const hardwareIcon = document.getElementById('hardwareIcon');
    if (hardwareIcon) {
        hardwareIcon.addEventListener('click', () => {
            hardwareIcon.classList.add('spin');
            setTimeout(() => {
                hardwareIcon.classList.remove('spin');
            }, 1000);
        });
    }

    if (window.location.pathname.includes('coding.html')) {
        const snakeIcon = document.getElementById('snakeIcon');
        if (snakeIcon) {
            snakeIcon.addEventListener('click', function() {
                this.style.transform = 'scale(1.3) rotate(10deg)';
                setTimeout(() => {
                    this.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            });
        }

        const majestyIcon = document.getElementById('majestyIcon');
        if (majestyIcon) {
            majestyIcon.addEventListener('click', function() {
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
            });
        }

        const rageIcon = document.getElementById('rageIcon');
        if (rageIcon) {
            rageIcon.addEventListener('click', function() {
                this.classList.add('rage-shake');
                setTimeout(() => {
                    this.classList.remove('rage-shake');
                }, 800);
            });
        }
    }

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        document.body.classList.add('konami-mode');
        const secretMessage = document.getElementById('secretMessage');
        if (secretMessage) {
            secretMessage.classList.add('show');
        }
        
        setTimeout(() => {
            document.body.classList.remove('konami-mode');
            if (secretMessage) {
                secretMessage.classList.remove('show');
            }
        }, 3000);
        
        konamiCode = [];
    }
});

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting Discord initialization...');
    
    const discordBanner = document.getElementById('discordBanner');
    if (!discordBanner) {
        console.log('Discord banner not found on this page');
        return;
    }
    
    discordBanner.innerHTML = '<div class="discord-banner-content">🔄 Loading Discord status...</div>';
    
    setTimeout(() => {
        console.log('Fetching initial Discord status...');
        fetchDiscordStatus();
        
        const discordRefreshInterval = setInterval(() => {
            fetchDiscordStatus();
            console.log('Discord status refreshed at:', new Date().toLocaleTimeString());
        }, 5000);
        
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                fetchDiscordStatus();
                console.log('Tab became visible, refreshing Discord status');
            }
        });
        
        let lastRefreshTime = 0;
        document.addEventListener('mousemove', () => {
            const now = Date.now();
            if (now - lastRefreshTime > 3000) {
                fetchDiscordStatus();
                lastRefreshTime = now;
            }
        });
        
    }, 2000);
});

async function fetchDiscordStatus() {
    const userId = '1409705687159668736'; 
    const bannerContainer = document.getElementById('discordBanner');
    
    if (!bannerContainer) {
        console.log('Discord banner container not found');
        return;
    }
    
    try {
        console.log('Fetching Discord status for user:', userId);
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}?t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Discord API response:', data);
        
        if (data.success && data.data) {
            updateDiscordBanner(data.data);
        } else {
            bannerContainer.innerHTML = '<div class="discord-banner-content">❌ Discord data unavailable</div>';
        }
    } catch (error) {
        console.error('Discord status fetch error:', error);
        bannerContainer.innerHTML = '<div class="discord-banner-content">⚠️ Connecting to Discord...</div>';
    }
}

function updateDiscordBanner(userData) {
    const bannerContainer = document.getElementById('discordBanner');
    if (!bannerContainer) {
        console.log('Banner container not found during update');
        return;
    }
    
    console.log('Updating Discord banner with data:', userData);
    
    let statusClass = userData.discord_status;
    let statusText = '';
    let iconHTML = '';
    
    const statusEmojis = {
        online: '🟢',
        idle: '🟡', 
        dnd: '🔴',
        offline: '⚫'
    };
    
    if (userData.spotify && userData.spotify.track_id) {
        statusText = `${statusEmojis[userData.discord_status]} Now listening to: ${userData.spotify.song} by ${userData.spotify.artist}`;
        iconHTML = `<img class="discord-banner-icon" src="${userData.spotify.album_art_url}" alt="Album Art" onerror="this.style.display='none'">`;
        statusClass = 'spotify';
    }
    else if (userData.activities && userData.activities.length > 0) {
        const activity = userData.activities[0];
        
        if (activity.type === 0) {
            statusText = `${statusEmojis[userData.discord_status]} Now playing: ${activity.name}`;
            if (activity.details) {
                statusText += ` • ${activity.details}`;
            }
            if (activity.state && activity.state !== activity.details) {
                statusText += ` • ${activity.state}`;
            }
            
            if (activity.assets && activity.assets.large_image) {
                let imageUrl = '';
                if (activity.assets.large_image.startsWith('mp:')) {
                    imageUrl = `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
                } else if (activity.assets.large_image.startsWith('spotify:')) {
                    imageUrl = `https://i.scdn.co/image/${activity.assets.large_image.replace('spotify:', '')}`;
                } else {
                    imageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                }
                iconHTML = `<img class="discord-banner-icon" src="${imageUrl}" alt="Game Icon" onerror="this.style.display='none'">`;
            }
            statusClass = 'gaming';
        }
        else if (activity.type === 1) {
            statusText = `${statusEmojis[userData.discord_status]} 🔴 Streaming: ${activity.name}`;
            if (activity.details) statusText += ` • ${activity.details}`;
            statusClass = 'streaming';
        }
        else if (activity.type === 2) {
            statusText = `${statusEmojis[userData.discord_status]} Now listening to: ${activity.name}`;
            if (activity.details) statusText += ` • ${activity.details}`;
            statusClass = 'listening';
        }
        else if (activity.type === 3) {
            statusText = `${statusEmojis[userData.discord_status]} Now watching: ${activity.name}`;
            if (activity.details) {
                statusText += ` • ${activity.details}`;
            }
            if (activity.state && activity.state !== activity.details) {
                statusText += ` • ${activity.state}`;
            }
            
            if (activity.assets && activity.assets.large_image) {
                let imageUrl = '';
                if (activity.assets.large_image.startsWith('mp:')) {
                    imageUrl = `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
                } else if (activity.assets.large_image.startsWith('https://')) {
                    imageUrl = activity.assets.large_image;
                } else {
                    imageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                }
                iconHTML = `<img class="discord-banner-icon" src="${imageUrl}" alt="Show Cover" onerror="this.style.display='none'">`;
            }
            statusClass = 'watching';
        }
        else if (activity.type === 5) {
            statusText = `${statusEmojis[userData.discord_status]} Competing in: ${activity.name}`;
            if (activity.details) statusText += ` • ${activity.details}`;
            statusClass = 'competing';
        }
        else {
            statusText = `${statusEmojis[userData.discord_status]} ${activity.name}`;
            if (activity.state) statusText += ` • ${activity.state}`;
            statusClass = 'custom';
        }
    }
    else if (userData.discord_user && userData.discord_user.custom_status) {
        const customStatus = userData.discord_user.custom_status;
        statusText = `${statusEmojis[userData.discord_status]}`;
        if (customStatus.emoji) statusText += ` ${customStatus.emoji.name}`;
        if (customStatus.text) statusText += ` ${customStatus.text}`;
        statusClass = 'custom';
    }
    else {
        const statusNames = {
            online: 'Online',
            idle: 'Away', 
            dnd: 'Do Not Disturb',
            offline: 'Offline'
        };
        statusText = `${statusEmojis[userData.discord_status]} ${statusNames[userData.discord_status]}`;
    }
    
    const bannerHTML = `
        <div class="discord-banner-content ${statusClass}">
            ${iconHTML}
            <span class="discord-banner-text">${statusText}</span>
        </div>
    `;
    
    bannerContainer.innerHTML = bannerHTML;
    console.log('Discord banner updated successfully');
}
