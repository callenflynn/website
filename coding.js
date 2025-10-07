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

function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const extensionMap = {
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'scss': 'css',
        'sass': 'css',
        'less': 'css',
        'js': 'javascript',
        'jsx': 'javascript',
        'mjs': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'php': 'php',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'cpp',
        'cc': 'cpp',
        'cxx': 'cpp',
        'cs': 'csharp',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'rb': 'ruby',
        'md': 'markdown',
        'markdown': 'markdown',
        'json': 'json',
        'xml': 'xml',
        'svg': 'xml',
        'yml': 'yml',
        'yaml': 'yml',
        'txt': 'txt',
        'gitignore': 'gitignore',

    };

    if (filename === '.gitignore' || filename === 'gitignore') return 'gitignore';
    if (filename === 'robots.txt') return 'txt';
    if (filename === '_config.yml') return 'yml';
    if (filename === 'LICENSE') return 'txt';
    if (filename === 'README') return 'markdown';
    
    return extensionMap[extension] || 'txt';
}

async function discoverProjectFiles() {
    const allPossibleFiles = [
        'index.html',
        'coding.html', 
        '404.html',
        'styles.css',
        'portfolio.css',
        '404.css',
        'script.js',
        'coding.js',
        '404.js',
        'sitemap.xml',
        'robots.txt',
        '_config.yml',
        'README.md',
        'package.json',
        'package-lock.json',
        '.gitignore',
        'LICENSE',
        'CNAME',
        

        
        'scripts/main.js',
        'scripts/utils.js',
        'scripts/animations.js',
        'scripts/config.js',
        
        'styles/main.css',
        'styles/components.css',
        'styles/variables.css',
        'styles/responsive.css',
        
        'components/header.html',
        'components/footer.html',
        'components/nav.html',
        
        'data/projects.json',
        'data/config.json',
        'data/secrets.json',
        
        'docs/README.md',
        'docs/CHANGELOG.md',
        'docs/CONTRIBUTING.md',
        
        'config/site.yml',
        'config/build.js',
        
        '.well-known/discord',
        '.github/workflows/deploy.yml',
        '.vscode/settings.json',
        
        'favicon.ico',
        'apple-touch-icon.png',
        'manifest.json',
        'sw.js'
    ];

    const discoveredFiles = [];
    let checkedCount = 0;
    
    console.log('🔍 Scanning for project files...');

    for (const filepath of allPossibleFiles) {
        try {
            const response = await fetch(filepath, { method: 'HEAD' });
            if (response.ok) {
                discoveredFiles.push({
                    name: filepath,
                    type: getFileType(filepath.split('/').pop()),
                    path: filepath
                });
                console.log(`✅ Found: ${filepath}`);
            }
            checkedCount++;
        } catch (error) {
            // File doesn't exist, continue silently
            checkedCount++;
        }
    }

    // Add Discord verification file manually (can't be fetched)
    discoveredFiles.push({
        name: '.well-known/discord',
        type: 'txt',
        lines: 1,
        path: '.well-known/discord'
    });

    console.log(`📊 Scan complete: Found ${discoveredFiles.length} files out of ${checkedCount} checked`);
    return discoveredFiles;
}

async function calculateLinesOfCode() {
    let totalLines = 0;
    let languageLines = {
        html: 0,
        css: 0,
        javascript: 0,
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
        ruby: 0,
        markdown: 0,
        json: 0,
        xml: 0,
        yml: 0,
        txt: 0,
        gitignore: 0,
        image: 0
    };
    
    const element = document.getElementById('linesOfCode');
    
    try {
        element.textContent = '0';
        
        // Auto-discover ALL files including subfolders
        const files = await discoverProjectFiles();
        
        console.log('📁 Processing files for line counts...');
        
        for (const file of files) {
            if (file.lines) {
                // Pre-set line count (like Discord verification)
                totalLines += file.lines;
                languageLines[file.type] += file.lines;
                console.log(`📄 ${file.path}: ${file.lines} lines (${file.type})`);
            } else if (file.type !== 'image') {
                // Don't count lines for images
                try {
                    const response = await fetch(file.path);
                    if (response.ok) {
                        const content = await response.text();
                        const lines = content.split('\n').length;
                        totalLines += lines;
                        languageLines[file.type] += lines;
                        console.log(`📄 ${file.path}: ${lines} lines (${file.type})`);
                    }
                } catch (error) {
                    console.log(`❌ Could not fetch ${file.path}:`, error);
                }
            } else {
                // Count images as 1 "line" each
                totalLines += 1;
                languageLines[file.type] += 1;
                console.log(`🖼️ ${file.path}: 1 file (${file.type})`);
            }
        }
        
        console.log(`🎯 Total lines calculated: ${totalLines}`);
        
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
        ruby: '#701516',
        markdown: '#083fa1',
        json: '#292929',
        xml: '#0060ac',
        yml: '#cb171e',
        txt: '#89e051',
        gitignore: '#f1f2f3',
        image: '#ff6b9d'
    };
    
    const languageNames = {
        html: 'HTML',
        css: 'CSS',
        javascript: 'JavaScript',
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
        ruby: 'Ruby',
        markdown: 'Markdown',
        json: 'JSON',
        xml: 'XML',
        yml: 'YAML',
        txt: 'Text',
        gitignore: 'Gitignore',
        image: 'Images'
    };
    
    const languagePercentages = {};
    Object.keys(languageLines).forEach(lang => {
        languagePercentages[lang] = totalLines > 0 ? (languageLines[lang] / totalLines) * 100 : 0;
    });
    
    // Log the breakdown for debugging
    console.log('📊 Language breakdown:', languagePercentages);
    
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
        'find . -name "*.js" | wc -l',
        'tree assets/',
        'npm run portfolio',
        'git log --oneline --all',
        'du -sh *',
        'ls -la assets/',
        'cd scripts && ls',
        'find . -type f | head -20'
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