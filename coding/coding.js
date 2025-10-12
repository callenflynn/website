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
    
    // Handle files with no extension first (by exact filename)
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
        'CREDITS': 'txt',
        'AUTHORS': 'txt',
        'CONTRIBUTORS': 'txt',
        'SECURITY': 'txt',
        'CHANGELOG': 'markdown',
        'INSTALL': 'markdown',
        'TODO': 'txt',
        'VERSION': 'txt',
        'MANIFEST': 'txt',
        'COPYING': 'txt',
        'NOTICE': 'txt'
    };
    
    // Check if it's a special file without extension
    if (noExtensionFiles[filename]) {
        return noExtensionFiles[filename];
    }
    
    // Handle files that are truly "other" (unknown file types)
    const pathParts = filename.split('/');
    const justFilename = pathParts[pathParts.length - 1];
    
    // If file has no extension and isn't in our known list, it's "other"
    if (!justFilename.includes('.') && !noExtensionFiles[justFilename]) {
        return 'other';
    }
    
    // Regular extension mapping
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
        'sh': 'shell',
        'bash': 'shell',
        'zsh': 'shell',
        'fish': 'shell',
        'ps1': 'powershell',
        'bat': 'batch',
        'cmd': 'batch',
        'bf': 'befunge',
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'gif': 'image',
        'ico': 'image',
        'webp': 'image'
    };

    return extensionMap[extension] || 'other';
}

async function scanDirectory(path = '') {
    const files = [];
    
    // Common directory patterns to try
    const directories = [
        '',
        'assets/',
        'coding/',
        'BefJump/',
        'befjump/',
        'scripts/',
        'styles/',
        'css/',
        'js/',
        'images/',
        'img/',
        'docs/',
        'config/',
        '.github/',
        '.github/workflows/',
        '.well-known/',
        'easter egg json/',
        'components/',
        'data/',
        'api/',
        'src/',
        'public/',
        'static/',
        'build/',
        'dist/'
    ];
    
    const filePatterns = [
        'index.html',
        'robots.txt',
        'sitemap.xml',
        'manifest.json',
        'sw.js',
        'favicon.ico',
        '.gitignore',
        'README.md',
        'LICENSE',
        'CNAME',
        'package.json',
        '_config.yml',
        
        'styles.css',
        'style.css',
        'main.css',
        'app.css',
        'global.css',
        'portfolio.css',
        'home.css',
        '404.css',
        'responsive.css',
        'components.css',
        'variables.css',
        'normalize.css',
        'reset.css',
        
        'script.js',
        'scripts.js',
        'main.js',
        'app.js',
        'index.js',
        'coding.js',
        '404.js',
        'utils.js',
        'config.js',
        'api.js',
        'animations.js',
        'typewriter.js',
        
        // HTML files
        'coding.html',
        '404.html',
        'about.html',
        'contact.html',
        'portfolio.html',
        'projects.html',
        'home.html',
        
        // Config files
        'tsconfig.json',
        'package-lock.json',
        'yarn.lock',
        'webpack.config.js',
        'vite.config.js',
        'rollup.config.js',
        '.eslintrc.js',
        '.eslintrc.json',
        '.prettierrc',
        'babel.config.js',
        
        // Asset files
        'logo.png',
        'logo1.png',
        'logo2.png',
        'icon.png',
        'C.png',
        'snake-gaem.png',
        'yes-majesty.png',
        'rj-logo.png',
        'favicon.png',
        'avatar.jpg',
        'background.jpg',
        'hero.jpg',
        
        // Special files
        'discord',
        'callen',
        'readme.json',
        'secrets.json',
        'data.json',
        'config.json',
        'settings.json',
        
        // Game files
        'game.bf',
        'source.html',
        
        // GitHub files
        'deploy.yml',
        'pages.yml',
        'ci.yml',
        'build.yml',
        'test.yml'
    ];
    
    console.log('🔍 Scanning all directories and files...');
    
    // Try each directory + file combination
    const allPossiblePaths = [];
    
    // Add root files
    filePatterns.forEach(file => {
        allPossiblePaths.push(file);
    });
    
    // Add directory + file combinations
    directories.forEach(dir => {
        filePatterns.forEach(file => {
            if (dir) {
                allPossiblePaths.push(dir + file);
            }
        });
    });
    
    // Also try some common nested patterns
    const nestedPatterns = [
        'coding/styles.css',
        'coding/script.js',
        'coding/portfolio.css',
        'coding/coding.js',
        'BefJump/index.html',
        'BefJump/game.bf',
        'BefJump/logo1.png',
        'BefJump/source.html',
        'assets/C.png',
        'assets/snake-gaem.png',
        'assets/yes-majesty.png',
        'assets/rj-logo.png',
        '.well-known/discord',
        'easter egg json/readme.json',
        '.github/workflows/deploy.yml',
        '.github/workflows/pages.yml'
    ];
    
    allPossiblePaths.push(...nestedPatterns);
    
    // Remove duplicates
    const uniquePaths = [...new Set(allPossiblePaths)];
    
    console.log(`🎯 Checking ${uniquePaths.length} possible file paths...`);
    
    // Check files in batches to avoid overwhelming the server
    const batchSize = 20;
    for (let i = 0; i < uniquePaths.length; i += batchSize) {
        const batch = uniquePaths.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (filepath) => {
            try {
                const response = await fetch(filepath, { method: 'HEAD' });
                if (response.ok) {
                    const filename = filepath.split('/').pop();
                    return {
                        name: filename,
                        path: filepath,
                        type: getFileType(filename)
                    };
                }
            } catch (error) {
                // File doesn't exist, ignore
            }
            return null;
        });
        
        const batchResults = await Promise.all(batchPromises);
        const foundFiles = batchResults.filter(file => file !== null);
        files.push(...foundFiles);
        
        // Show progress
        if (foundFiles.length > 0) {
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Found ${foundFiles.length} files`);
        }
    }
    
    console.log(`📁 Total files discovered: ${files.length}`);
    files.forEach(file => console.log(`   📄 ${file.path} (${file.type})`));
    
    return files;
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
        shell: 0,
        powershell: 0,
        batch: 0,
        befunge: 0,
        image: 0,
        other: 0
    };
    
    const element = document.getElementById('linesOfCode');
    
    try {
        element.textContent = '0';
        
        const files = await scanDirectory();
        
        if (files.length === 0) {
            console.log('⚠️ No files found, using fallback count');
            element.textContent = '2,000+';
            return;
        }
        
        console.log('📊 Counting lines in all discovered files...');
        
        const filePromises = files.map(async (file) => {
            try {
                // Skip binary files (images)
                if (file.type === 'image') {
                    return { file, lines: 0 };
                }
                
                const response = await fetch(file.path);
                if (response.ok) {
                    const content = await response.text();
                    const lines = content.split('\n').length;
                    return { file, lines };
                } else {
                    console.log(`❌ Could not fetch ${file.path}: ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ Error fetching ${file.path}:`, error.message);
            }
            return { file, lines: 0 };
        });

        const results = await Promise.all(filePromises);
        
        results.forEach(({ file, lines }) => {
            if (lines > 0) {
                totalLines += lines;
                if (languageLines[file.type] !== undefined) {
                    languageLines[file.type] += lines;
                } else {
                    languageLines.other += lines;
                }
                console.log(`📄 ${file.path}: ${lines} lines (${file.type})`);
            }
        });
        
        console.log(`🎯 Total lines calculated: ${totalLines}`);
        console.log(`📊 Language breakdown:`, languageLines);
        
        animateCounter('linesOfCode', totalLines, 800); 
        updateLanguageBreakdown(languageLines, totalLines);
        
    } catch (error) {
        console.error('❌ Error calculating lines of code:', error);
        element.textContent = '2,000+';
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
        shell: '#89e051',
        powershell: '#012456',
        batch: '#C1F12E',
        befunge: '#ff6b6b',
        image: '#8B8B8B',
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
        image: 'Images',
        other: 'Other'
    };
    
    const languagePercentages = {};
    Object.keys(languageLines).forEach(lang => {
        languagePercentages[lang] = totalLines > 0 ? (languageLines[lang] / totalLines) * 100 : 0;
    });
    
    // Update the visual bar
    Object.keys(languagePercentages).forEach(lang => {
        const segment = document.querySelector(`[data-language="${lang}"]`);
        if (segment && languagePercentages[lang] > 0) {
            segment.style.width = `${languagePercentages[lang]}%`;
        }
    });
    
    // Update labels
    const labelsContainer = document.getElementById('languageLabels');
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
    // Start both calculations immediately
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