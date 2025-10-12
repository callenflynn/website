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

async function discoverAllFiles() {
    console.log('🔍 Starting comprehensive file discovery...');
    
    const discoveredFiles = [];
    
    // All possible directories to scan
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
        'dist/',
        'lib/',
        'vendor/',
        'node_modules/',
        'includes/',
        'partials/',
        'templates/',
        'views/',
        'assets/css/',
        'assets/js/',
        'assets/images/',
        'assets/fonts/',
        'coding/assets/',
        'BefJump/assets/'
    ];
    
    // All possible file extensions to look for
    const extensions = [
        'html', 'htm', 'css', 'scss', 'sass', 'less', 'js', 'jsx', 'mjs', 'ts', 'tsx',
        'py', 'php', 'java', 'cpp', 'c', 'cc', 'cxx', 'cs', 'go', 'rs', 'swift', 'kt',
        'rb', 'md', 'markdown', 'json', 'xml', 'svg', 'yml', 'yaml', 'txt', 'sh',
        'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd', 'bf', 'png', 'jpg', 'jpeg',
        'gif', 'ico', 'webp'
    ];
    
    // Common filenames to check
    const commonNames = [
        'index', 'main', 'app', 'style', 'styles', 'script', 'scripts', 'config',
        'settings', 'portfolio', 'home', 'about', 'contact', 'projects', 'coding',
        'game', 'source', 'logo', 'logo1', 'logo2', 'favicon', 'icon', 'C',
        'snake-gaem', 'yes-majesty', 'rj-logo', 'README', 'LICENSE', 'robots',
        'sitemap', 'manifest', 'sw', 'service-worker', '404', 'error'
    ];
    
    // Special files without extensions
    const specialFiles = [
        '.gitignore', 'robots.txt', 'CNAME', 'LICENSE', 'README', 'Makefile',
        'Dockerfile', '_config.yml', 'discord', 'callen', 'readme.json'
    ];
    
    console.log('🎯 Generating file paths to check...');
    
    const pathsToCheck = new Set();
    
    // Add special files
    specialFiles.forEach(file => {
        pathsToCheck.add(file);
        directories.forEach(dir => {
            if (dir) pathsToCheck.add(dir + file);
        });
    });
    
    // Add combinations of names + extensions
    commonNames.forEach(name => {
        extensions.forEach(ext => {
            const filename = `${name}.${ext}`;
            pathsToCheck.add(filename);
            
            directories.forEach(dir => {
                if (dir) pathsToCheck.add(dir + filename);
            });
        });
    });
    
    // Add numbered variations
    for (let i = 1; i <= 5; i++) {
        commonNames.forEach(name => {
            extensions.forEach(ext => {
                const filename = `${name}${i}.${ext}`;
                pathsToCheck.add(filename);
                
                directories.forEach(dir => {
                    if (dir) pathsToCheck.add(dir + filename);
                });
            });
        });
    }
    
    const allPaths = Array.from(pathsToCheck);
    console.log(`🎯 Generated ${allPaths.length} potential file paths to check`);
    
    // Check files in batches
    const batchSize = 15;
    let totalChecked = 0;
    
    for (let i = 0; i < allPaths.length; i += batchSize) {
        const batch = allPaths.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (filepath) => {
            try {
                const response = await fetch(filepath, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    const filename = filepath.split('/').pop();
                    return {
                        name: filename,
                        path: filepath,
                        type: getFileType(filename)
                    };
                }
            } catch (error) {
                // File doesn't exist
            }
            return null;
        });
        
        const batchResults = await Promise.all(batchPromises);
        const foundFiles = batchResults.filter(file => file !== null);
        
        if (foundFiles.length > 0) {
            discoveredFiles.push(...foundFiles);
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Found ${foundFiles.length} files`);
            foundFiles.forEach(file => console.log(`   📄 ${file.path} (${file.type})`));
        }
        
        totalChecked += batch.length;
        
        // Show progress
        if (totalChecked % 100 === 0) {
            console.log(`🔍 Progress: ${totalChecked}/${allPaths.length} paths checked, ${discoveredFiles.length} files found`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`🎉 File discovery complete! Found ${discoveredFiles.length} total files`);
    return discoveredFiles;
}

async function calculateLinesOfCode() {
    console.log('🚀 Starting comprehensive line count calculation...');
    
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
        element.textContent = 'Discovering files...';
        
        // Discover ALL files
        const allFiles = await discoverAllFiles();
        
        if (allFiles.length === 0) {
            console.log('⚠️ No files discovered, using fallback');
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
            return;
        }
        
        element.textContent = `Counting lines in ${allFiles.length} files...`;
        console.log(`📊 Counting lines in ${allFiles.length} discovered files...`);
        
        // Count lines in all discovered files
        for (const file of allFiles) {
            try {
                // Skip binary files (images)
                if (file.type === 'image') {
                    console.log(`⏭️ Skipping image: ${file.path}`);
                    continue;
                }
                
                console.log(`🔍 Counting lines in ${file.path}...`);
                
                const response = await fetch(file.path, { cache: 'no-cache' });
                if (response.ok) {
                    const content = await response.text();
                    const lines = content.split('\n').length;
                    
                    totalLines += lines;
                    languageLines[file.type] += lines;
                    
                    console.log(`✅ ${file.path}: ${lines} lines (${file.type})`);
                    
                    // Update counter in real-time
                    element.textContent = `${totalLines.toLocaleString()} lines`;
                } else {
                    console.log(`❌ Could not fetch content of ${file.path}: ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ Error processing ${file.path}:`, error.message);
            }
            
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`🎯 FINAL TOTAL: ${totalLines} lines across ${allFiles.length} files`);
        console.log(`📊 Language breakdown:`, languageLines);
        
        if (totalLines === 0) {
            console.log('⚠️ No lines counted, using fallback');
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
        } else {
            animateCounter('linesOfCode', totalLines, 800); 
            updateLanguageBreakdown(languageLines, totalLines);
        }
        
    } catch (error) {
        console.error('❌ Error in line count calculation:', error);
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
    console.log('🎨 Updating language breakdown visualization...');
    
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
    
    console.log('📊 Language percentages:', languagePercentages);
    
    // Update the visual bar
    Object.keys(languagePercentages).forEach(lang => {
        const segment = document.querySelector(`[data-language="${lang}"]`);
        if (segment) {
            const percentage = languagePercentages[lang];
            if (percentage > 0) {
                segment.style.width = `${percentage}%`;
                segment.style.backgroundColor = languageColors[lang];
                console.log(`🎨 Updated ${lang}: ${percentage.toFixed(1)}%`);
            } else {
                segment.style.width = '0%';
            }
        } else {
            console.log(`❌ No segment found for ${lang}`);
        }
    });
    
    // Update labels
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
        
        console.log('✅ Language labels updated');
    } else {
        console.log('❌ Language labels container not found');
    }
}

function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log(`❌ Element ${elementId} not found`);
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
    console.log('🚀 Page loaded, starting comprehensive calculations...');
    
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