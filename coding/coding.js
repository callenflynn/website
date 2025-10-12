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
    
    animateCounter('daysSinceCoding', daysDiff, 1500);
}

function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const noExtensionFiles = {
        '.gitignore': 'gitignore',
        'gitignore': 'gitignore',
        'robots.txt': 'txt',
        '_config.yml': 'yml',
        'LICENSE': 'txt',
        'README': 'markdown',
        'Makefile': 'makefile',
        'makefile': 'makefile',
        'Dockerfile': 'dockerfile',
        'CNAME': 'txt',
        'discord': 'other',
        'callen': 'other'
    };
    
    if (noExtensionFiles[filename]) {
        return noExtensionFiles[filename];
    }
    
    const pathParts = filename.split('/');
    const justFilename = pathParts[pathParts.length - 1];
    
    if (!justFilename.includes('.') && !noExtensionFiles[justFilename]) {
        return 'other';
    }
    
    const extensionMap = {
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'scss': 'css',
        'sass': 'sass',
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
        'sh': 'shell',
        'bash': 'shell',
        'zsh': 'shell',
        'fish': 'shell',
        'ps1': 'powershell',
        'bat': 'batch',
        'cmd': 'batch',
        'bf': 'befunge'
    };

    return extensionMap[extension] || 'other';
}

const KNOWN_FILES = [
    { path: '../index.html', type: 'html' },
    { path: '../styles.css', type: 'css' },
    { path: '../script.js', type: 'javascript' },
    { path: '../ta-xbox.js', type: 'javascript' },
    { path: '../404.html', type: 'html' },
    { path: '../404.css', type: 'css' },
    { path: '../robots.txt', type: 'txt' },
    { path: '../sitemap.xml', type: 'xml' },
    { path: '../CNAME', type: 'txt' },
    { path: '../_config.yml', type: 'yml' },
    { path: '../google526c7f9cda034c56.html', type: 'html' },
    { path: '../README.md', type: 'markdown' },
    { path: '../CREDITS', type: 'txt' },
    { path: '../Callen', type: 'other' },
    { path: 'index.html', type: 'html' },
    { path: 'portfolio.css', type: 'css' },
    { path: 'coding.js', type: 'javascript' },
    { path: '../BefJump/index.html', type: 'html' },
    { path: '../BefJump/game.bf', type: 'befunge' },
    { path: '../BefJump/source.html', type: 'html' },
    { path: '../assets/404.js', type: 'javascript' },
    { path: '../.well-known/discord', type: 'other' },
    { path: '../easter egg json/readme.json', type: 'json' }
];

async function discoverAdditionalFiles() {
    console.log('Scanning for additional files in background...');
    
    const additionalFiles = [];
    
    const additionalPaths = [
        '../manifest.json',
        '../sw.js',
        '../.gitignore',
        '../LICENSE',
        '../package.json',
        'script.js', 
        'main.js',
        'app.js',
        'styles.css', 
        '../BefJump/style.css',
        '../BefJump/main.js',
        '../BefJump/config.json',
        '../.github/workflows/deploy.yml',
        '../.github/workflows/pages.yml'
    ];
    
    console.log(`Checking ${additionalPaths.length} additional paths...`);
    
    for (const filepath of additionalPaths) {
        try {
            const response = await fetch(filepath, { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const filename = filepath.split('/').pop();
                const fileType = getFileType(filename);
                
                if (fileType === 'image') {
                    console.log(`Skipping image file: ${filepath}`);
                    continue;
                }
                
                const file = {
                    name: filename,
                    path: filepath,
                    type: fileType
                };
                additionalFiles.push(file);
                console.log(`Found additional file: ${filepath} (${file.type})`);
            }
        } catch (error) {
            
        }
        
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`Background scan complete! Found ${additionalFiles.length} additional files`);
    return additionalFiles;
}

async function calculateLinesOfCode() {
    console.log('Starting line count calculation...');
    
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
        shell: 0,
        powershell: 0,
        batch: 0,
        befunge: 0,
        other: 0
    };
    
    const element = document.getElementById('linesOfCode');
    
    try {
        element.textContent = 'Counting lines...';
        
        console.log(`Counting lines in ${KNOWN_FILES.length} known files...`);
        
        for (const file of KNOWN_FILES) {
            try {
                console.log(`Counting lines in ${file.path}...`);
                
                const response = await fetch(file.path, { cache: 'no-cache' });
                if (response.ok) {
                    const content = await response.text();
                    const lines = content.split('\n').length;
                    
                    totalLines += lines;
                    languageLines[file.type] += lines;
                    
                    console.log(`${file.path}: ${lines} lines (${file.type})`);
                    
                    element.textContent = `${totalLines.toLocaleString()}`;
                } else {
                    console.log(`Could not fetch ${file.path}: ${response.status}`);
                }
            } catch (error) {
                console.log(`Error processing ${file.path}:`, error.message);
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        console.log(`Known files total: ${totalLines} lines`);
        animateCounter('linesOfCode', totalLines, 800);
        updateLanguageBreakdown(languageLines, totalLines);
        
        const additionalFiles = await discoverAdditionalFiles();
        
        if (additionalFiles.length > 0) {
            console.log(`Counting lines in ${additionalFiles.length} additional files...`);
            
            for (const file of additionalFiles) {
                try {
                    console.log(`Counting lines in additional file ${file.path}...`);
                    
                    const response = await fetch(file.path, { cache: 'no-cache' });
                    if (response.ok) {
                        const content = await response.text();
                        const lines = content.split('\n').length;
                        
                        totalLines += lines;
                        languageLines[file.type] += lines;
                        
                        console.log(`${file.path}: ${lines} lines (${file.type})`);
                        
                        element.textContent = `${totalLines.toLocaleString()}`;
                    }
                } catch (error) {
                    console.log(`Error processing additional file ${file.path}:`, error.message);
                }
                
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            console.log(`FINAL TOTAL: ${totalLines} lines across ${KNOWN_FILES.length + additionalFiles.length} files`);
            animateCounter('linesOfCode', totalLines, 500);
            updateLanguageBreakdown(languageLines, totalLines);
        }
        
        console.log(`Final language breakdown:`, languageLines);
        
        if (totalLines === 0) {
            console.log('No lines counted, using fallback');
            element.textContent = '2,500+';
            const fallbackLanguageLines = {
                html: 800,
                css: 700,
                javascript: 600,
                befunge: 200,
                json: 100,
                txt: 100
            };
            updateLanguageBreakdown(fallbackLanguageLines, 2500);
        }
        
    } catch (error) {
        console.error('Error in line count calculation:', error);
        element.textContent = '2,500+';
        
        const fallbackLanguageLines = {
            html: 800,
            css: 700,
            javascript: 600,
            befunge: 200,
            json: 100,
            txt: 100
        };
        updateLanguageBreakdown(fallbackLanguageLines, 2500);
    }
}

function updateLanguageBreakdown(languageLines, totalLines) {
    console.log('Updating language breakdown visualization...');
    
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
        shell: '#89e051',
        powershell: '#012456',
        batch: '#C1F12E',
        befunge: '#ff6b6b',
        other: '#8B8B8B'
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
        shell: 'Shell',
        powershell: 'PowerShell',
        batch: 'Batch',
        befunge: 'Befunge',
        other: 'Other'
    };
    
    const languagePercentages = {};
    Object.keys(languageLines).forEach(lang => {
        languagePercentages[lang] = totalLines > 0 ? (languageLines[lang] / totalLines) * 100 : 0;
    });
    
    console.log('Language percentages:', languagePercentages);
    
    Object.keys(languagePercentages).forEach(lang => {
        const segment = document.querySelector(`[data-language="${lang}"]`);
        if (segment) {
            const percentage = languagePercentages[lang];
            if (percentage > 0) {
                segment.style.width = `${percentage}%`;
                segment.style.backgroundColor = languageColors[lang];
                console.log(`Updated ${lang}: ${percentage.toFixed(1)}%`);
            } else {
                segment.style.width = '0%';
            }
        } else {
            console.log(`No segment found for ${lang}`);
        }
    });
    
    const labelsContainer = document.getElementById('languageLabels');
    if (labelsContainer) {
        labelsContainer.innerHTML = '';
        
        Object.keys(languagePercentages)
            .filter(lang => languagePercentages[lang] > 0)
            .sort((a, b) => languagePercentages[b] - languagePercentages[a])
            .forEach(lang => {
                const label = document.createElement('div');
                label.className = 'language-label';
                
                const percentage = languagePercentages[lang];
                const formattedPercentage = percentage >= 0.1 ? percentage.toFixed(1) : percentage.toFixed(2);
                
                label.innerHTML = `
                    <div class="language-dot" style="background-color: ${languageColors[lang]};"></div>
                    <span>${languageNames[lang]} ${formattedPercentage}%</span>
                `;
                labelsContainer.appendChild(label);
            });
        
        console.log('Language labels updated');
    } else {
        console.log('Language labels container not found');
    }
}

function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`Element ${elementId} not found`);
        return;
    }
    
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
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
    console.log('Page loaded, starting calculations...');
    
    calculateDaysSinceFirstCode();
    calculateLinesOfCode();
    
    const typewriterElement = document.getElementById('typewriter');
    
    const commands = [
        'find . -name "*.js" -o -name "*.html" -o -name "*.css" | wc -l',
        'tree -a',
        'ls -la */',
        'find . -type f | wc -l',
        'grep -r "function" --include="*.js" .',
        'du -sh *',
        'find . -name "*.bf"',
        'ls -la assets/ BefJump/ coding/',
        'wc -l **/*.{html,css,js,bf}'
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