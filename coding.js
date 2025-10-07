function isAppleDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) || 
           (/Macintosh/.test(userAgent) && 'ontouchend' in document) ||
           /Mac/.test(userAgent);
}

if (!isAppleDevice()) {
    document.addEventListener('DOMContentLoaded', function() {
        twemoji.parse(document.body, {
            folder: 'svg',
            ext: '.svg'
        });
    });
}

function calculateDaysSinceFirstCode() {
    const firstCodeDate = new Date('2024-05-21');
    const today = new Date();
    const timeDiff = today.getTime() - firstCodeDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Animate the counter with smooth counting
    animateCounter('daysSinceCoding', daysDiff, 1500);
}

async function calculateLinesOfCode() {
    const files = [
        { name: 'index.html', type: 'html' },
        { name: 'coding.html', type: 'html' },
        { name: '404.html', type: 'html' },
        { name: 'styles.css', type: 'css' },
        { name: 'portfolio.css', type: 'css' },
        { name: '404.css', type: 'css' },
        { name: 'script.js', type: 'javascript' },
        { name: 'coding.js', type: 'javascript' },
        { name: '404.js', type: 'javascript' },
        { name: 'sitemap.xml', type: 'xml' },
        { name: 'robots.txt', type: 'txt' },
        { name: '_config.yml', type: 'yml' },
        { name: 'README.md', type: 'markdown' },
        { name: 'package.json', type: 'json' },
        { name: '.gitignore', type: 'gitignore' }
    ];
    
    let totalLines = 0;
    let languageLines = {
        html: 0,
        css: 0,
        javascript: 0,
        xml: 0,
        txt: 0,
        yml: 0,
        markdown: 0,
        json: 0,
        gitignore: 0,
        typescript: 0,
        python: 0,
        php: 0,
        java: 0,
        cpp: 0,
        csharp: 0,
        go: 0,
        rust: 0,
        swift: 0,
        kotlin: 0,
        ruby: 0
    };
    
    const element = document.getElementById('linesOfCode');
    
    try {
        element.textContent = '0';
        
        for (const file of files) {
            try {
                const response = await fetch(file.name);
                if (response.ok) {
                    const content = await response.text();
                    const lines = content.split('\n').length;
                    totalLines += lines;
                    languageLines[file.type] += lines;
                }
            } catch (error) {
                console.log(`Could not fetch ${file.name}:`, error);
            }
        }
        
        // Add Discord verification file (1 line)
        totalLines += 1;
        languageLines.txt += 1;
        
        animateCounter('linesOfCode', totalLines, 1200);
        
        updateLanguageBreakdown(languageLines, totalLines);
        
    } catch (error) {
        console.error('Error calculating lines of code:', error);
        element.textContent = '1,200+';
    }
}

function updateLanguageBreakdown(languageLines, totalLines) {
    const languageColors = {
        html: '#e34c26',
        css: '#1572B6', 
        javascript: '#f1e05a',
        xml: '#0060ac',
        txt: '#89e051',
        yml: '#cb171e',
        markdown: '#083fa1',
        json: '#292929',
        gitignore: '#f1f2f3',
        typescript: '#3178c6',
        python: '#3572A5',
        php: '#4F5D95',
        java: '#b07219',
        cpp: '#f34b7d',
        csharp: '#239120',
        go: '#00ADD8',
        rust: '#dea584',
        swift: '#ffac45',
        kotlin: '#A97BFF',
        ruby: '#701516'
    };
    
    const languageNames = {
        html: 'HTML',
        css: 'CSS',
        javascript: 'JavaScript',
        xml: 'XML',
        txt: 'Text',
        yml: 'YAML',
        markdown: 'Markdown',
        json: 'JSON',
        gitignore: 'Gitignore',
        typescript: 'TypeScript',
        python: 'Python',
        php: 'PHP',
        java: 'Java',
        cpp: 'C++',
        csharp: 'C#',
        go: 'Go',
        rust: 'Rust',
        swift: 'Swift',
        kotlin: 'Kotlin',
        ruby: 'Ruby'
    };
    
    const languagePercentages = {};
    Object.keys(languageLines).forEach(lang => {
        languagePercentages[lang] = totalLines > 0 ? (languageLines[lang] / totalLines) * 100 : 0;
    });
    
    setTimeout(() => {
        Object.keys(languagePercentages).forEach(lang => {
            const segment = document.querySelector(`[data-language="${lang}"]`);
            if (segment && languagePercentages[lang] > 0) {
                segment.style.width = `${languagePercentages[lang]}%`;
            }
        });
    }, 500);
    
    const labelsContainer = document.getElementById('languageLabels');
    labelsContainer.innerHTML = '';
    
    Object.keys(languagePercentages)
        .filter(lang => languagePercentages[lang] > 0)
        .sort((a, b) => languagePercentages[b] - languagePercentages[a])
        .forEach(lang => {
            const label = document.createElement('div');
            label.className = 'language-label';
            label.innerHTML = `
                <div class="language-dot" style="background-color: ${languageColors[lang]};"></div>
                <span>${languageNames[lang]} ${languagePercentages[lang].toFixed(1)}%</span>
            `;
            labelsContainer.appendChild(label);
        });
}

function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * targetValue);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

class Typewriter {
    constructor(element, commands, options = {}) {
        this.element = element;
        this.cursor = element.querySelector('.cursor');
        this.commands = commands;
        this.currentCommandIndex = 0;
        this.currentText = '';
        this.typeSpeed = options.typeSpeed || 80;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.deletePauseTime = options.deletePauseTime || 1000;
        this.isTyping = false;
        this.isDeleting = false;
    }

    async type(text) {
        this.isTyping = true;
        for (let i = 0; i <= text.length; i++) {
            this.currentText = text.slice(0, i);
            this.element.innerHTML = this.currentText + '<span class="cursor">|</span>';
            await this.wait(this.typeSpeed + Math.random() * 40);
        }
        this.isTyping = false;
    }

    async delete() {
        this.isDeleting = true;
        const textLength = this.currentText.length;
        for (let i = textLength; i >= 0; i--) {
            this.currentText = this.currentText.slice(0, i);
            this.element.innerHTML = this.currentText + '<span class="cursor">|</span>';
            await this.wait(this.deleteSpeed + Math.random() * 30);
        }
        this.isDeleting = false;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        while (true) {
            const currentCommand = this.commands[this.currentCommandIndex];
            
            await this.type(currentCommand);
            await this.wait(this.pauseTime);
            await this.delete();
            await this.wait(this.deletePauseTime);
            
            this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    calculateDaysSinceFirstCode();
    calculateLinesOfCode();
    
    const typewriterElement = document.getElementById('typewriter');
    
    const commands = [
        'npm run showcase',
        'ls projects/',
        'cat projects.json',
        'npm run portfolio',
        'git log --oneline',
        'open snake-game.html',
        'ls *.js',
        'cd portfolio/',
        'wc -l *.html *.css *.js'
    ];

    if (typewriterElement) {
        const typewriter = new Typewriter(typewriterElement, commands, {
            typeSpeed: 100,
            deleteSpeed: 60,
            pauseTime: 2500,
            deletePauseTime: 800
        });
        
        setTimeout(() => {
            typewriter.start();
        }, 1000);
    }
});