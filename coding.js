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
        'dockerfile': 'dockerfile',
        'Gemfile': 'ruby',
        'gemfile': 'ruby',
        'Rakefile': 'ruby',
        'rakefile': 'ruby',
        'Procfile': 'procfile',
        'procfile': 'procfile',
        'Vagrantfile': 'vagrant',
        'vagrantfile': 'vagrant',
        'Jenkinsfile': 'jenkins',
        'jenkinsfile': 'jenkins',
        'Gruntfile': 'javascript',
        'gruntfile': 'javascript',
        'gulpfile': 'javascript',
        'Gulpfile': 'javascript',
        'webpack.config': 'javascript',
        'rollup.config': 'javascript',
        'vite.config': 'javascript',
        'CHANGELOG': 'markdown',
        'changelog': 'markdown',
        'CONTRIBUTING': 'markdown',
        'contributing': 'markdown',
        'INSTALL': 'markdown',
        'install': 'markdown',
        'AUTHORS': 'txt',
        'authors': 'txt',
        'CONTRIBUTORS': 'txt',
        'contributors': 'txt',
        'COPYING': 'txt',
        'copying': 'txt',
        'NOTICE': 'txt',
        'notice': 'txt'
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
        'cmd': 'batch'
    };

    return extensionMap[extension] || 'other';
}

async function discoverProjectFiles() {
    // Prioritize files we know exist first
    const priorityFiles = [
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
        'callen',
        'easter egg json/readme.json'
    ];
    
    // Less likely files to check
    const additionalFiles = [
        '_config.yml',
        'README.md',
        'package.json',
        'package-lock.json',
        '.gitignore',
        'LICENSE',
        'CNAME',
        'CREDITS',
        'AUTHORS',
        'CONTRIBUTORS',
        'MAINTAINERS',
        'SECURITY',
        'CODE_OF_CONDUCT',
        'FUNDING',
        'SUPPORT',
        'ISSUE_TEMPLATE',
        'PULL_REQUEST_TEMPLATE',
        'CHANGELOG',
        'HISTORY',
        'NEWS',
        'INSTALL',
        'UPGRADE',
        'TODO',
        'ROADMAP',
        'VERSION',
        'MANIFEST',
        'COPYING',
        'NOTICE',
        'ACKNOWLEDGMENTS',
        'THANKS',
        'editorconfig',
        'gitattributes',
        'dockerignore',
        'eslintignore',
        'prettierignore',
        'nvmrc',
        'node-version',
        'ruby-version',
        'python-version',
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
        '.github/workflows/deploy.yml',
        '.github/workflows/pages.yml',
        '.vscode/settings.json',
        '.vscode/extensions.json',
        'webpack.config.js',
        'vite.config.js',
        'tsconfig.json',
        'babel.config.js',
        '.eslintrc.js',
        '.prettierrc',
        'favicon.ico',
        'manifest.json',
        'sw.js'
    ];

    const discoveredFiles = [];
    console.log('🔍 Quick scan for known files...');

    const priorityPromises = priorityFiles.map(async (filepath) => {
        try {
            const response = await fetch(filepath, { method: 'HEAD' });
            if (response.ok) {
                return {
                    name: filepath,
                    type: getFileType(filepath.split('/').pop()),
                    path: filepath
                };
            }
        } catch (error) {
        }
        return null;
    });

    const priorityResults = await Promise.all(priorityPromises);
    const foundPriorityFiles = priorityResults.filter(file => file !== null);
    discoveredFiles.push(...foundPriorityFiles);

    console.log(`✅ Found ${foundPriorityFiles.length} priority files`);

    const batchSize = 10;
    for (let i = 0; i < additionalFiles.length; i += batchSize) {
        const batch = additionalFiles.slice(i, i + batchSize);
        const batchPromises = batch.map(async (filepath) => {
            try {
                const response = await fetch(filepath, { method: 'HEAD' });
                if (response.ok) {
                    return {
                        name: filepath,
                        type: getFileType(filepath.split('/').pop()),
                        path: filepath
                    };
                }
            } catch (error) {
                // File doesn't exist
            }
            return null;
        });

        const batchResults = await Promise.all(batchPromises);
        const foundBatchFiles = batchResults.filter(file => file !== null);
        discoveredFiles.push(...foundBatchFiles);
    }

    discoveredFiles.push({
        name: '.well-known/discord',
        type: 'txt',
        lines: 1,
        path: '.well-known/discord'
    });

    console.log(`📊 Total files found: ${discoveredFiles.length}`);
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
        makefile: 0,
        dockerfile: 0,
        procfile: 0,
        vagrant: 0,
        jenkins: 0,
        shell: 0,
        powershell: 0,
        batch: 0,
        other: 0 
    };
    
    const element = document.getElementById('linesOfCode');
    
    try {
        element.textContent = '0';
        
        const files = await discoverProjectFiles();
        
        console.log('📁 Counting lines in parallel...');
        
        const filePromises = files.map(async (file) => {
            if (file.lines) {
                return { file, lines: file.lines };
            } else {
                try {
                    const response = await fetch(file.path);
                    if (response.ok) {
                        const content = await response.text();
                        const lines = content.split('\n').length;
                        return { file, lines };
                    }
                } catch (error) {
                    console.log(`❌ Could not fetch ${file.path}`);
                }
                return { file, lines: 0 };
            }
        });

        const results = await Promise.all(filePromises);
        
        results.forEach(({ file, lines }) => {
            if (lines > 0) {
                totalLines += lines;
                languageLines[file.type] += lines;
                console.log(`📄 ${file.path}: ${lines} lines (${file.type})`);
            }
        });
        
        console.log(`🎯 Total lines calculated: ${totalLines}`);
        
        animateCounter('linesOfCode', totalLines, 800); /
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
        makefile: '#427819',
        dockerfile: '#384d54',
        procfile: '#3B2F63',
        vagrant: '#1563FF',
        jenkins: '#D33833',
        shell: '#89e051',
        powershell: '#012456',
        batch: '#C1F12E',
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
        makefile: 'Makefile',
        dockerfile: 'Dockerfile',
        procfile: 'Procfile',
        vagrant: 'Vagrantfile',
        jenkins: 'Jenkinsfile',
        shell: 'Shell',
        powershell: 'PowerShell',
        batch: 'Batch',
        other: 'Other'
    };
    
    const languagePercentages = {};
    Object.keys(languageLines).forEach(lang => {
        languagePercentages[lang] = totalLines > 0 ? (languageLines[lang] / totalLines) * 100 : 0;
    });
    
    console.log('📊 Language breakdown:', languagePercentages);
    
    // Start bar animation immediately (no delay)
    Object.keys(languagePercentages).forEach(lang => {
        const segment = document.querySelector(`[data-language="${lang}"]`);
        if (segment && languagePercentages[lang] > 0) {
            segment.style.width = `${languagePercentages[lang]}%`;
        }
    });
    
    const labelsContainer = document.getElementById('languageLabels');
    labelsContainer.innerHTML = '';
    
    Object.keys(languagePercentages)
        .filter(lang => languagePercentages[lang] > 0)
        .sort((a, b) => languagePercentages[b] - languagePercentages[a])
        .forEach(lang => {
            const label = document.createElement('div');
            label.className = 'language-label';
            
            const percentage = languagePercentages[lang];
            let formattedPercentage;
            
            if (percentage >= 0.1) {
                formattedPercentage = percentage.toFixed(1);
            } else {
                formattedPercentage = percentage.toFixed(2);
            }
            
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
        'npm run showcase',
        'find . -name "*.js" | wc -l',
        'tree src/',
        'npm run portfolio',
        'git log --oneline --all',
        'wc -l *.html *.css *.js',
        'ls -la components/',
        'cd scripts && ls',
        'find . -name "*.json" -type f'
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