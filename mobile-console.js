// Mobile Debug Console
// Add this script to any page to see errors on mobile

(function() {
    // Create console overlay
    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'mobile-console';
    consoleDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 40vh;
        background: rgba(0, 0, 0, 0.95);
        color: #00ff00;
        font-family: monospace;
        font-size: 11px;
        padding: 10px;
        overflow-y: auto;
        z-index: 999999;
        border-top: 2px solid #00ff00;
        display: none;
    `;
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '🐛';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ff0000;
        color: white;
        border: none;
        font-size: 24px;
        z-index: 9999999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    
    toggleBtn.onclick = () => {
        consoleDiv.style.display = consoleDiv.style.display === 'none' ? 'block' : 'none';
    };
    
    document.body.appendChild(consoleDiv);
    document.body.appendChild(toggleBtn);
    
    // Log function
    function addLog(type, args) {
        const time = new Date().toLocaleTimeString();
        const color = {
            log: '#00ff00',
            error: '#ff0000',
            warn: '#ffaa00',
            info: '#00aaff'
        }[type] || '#00ff00';
        
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            border-bottom: 1px solid #333;
            color: ${color};
        `;
        
        const message = Array.from(args).map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch(e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        
        logEntry.textContent = `[${time}] ${type.toUpperCase()}: ${message}`;
        consoleDiv.appendChild(logEntry);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }
    
    // Override console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };
    
    console.log = function() {
        originalConsole.log.apply(console, arguments);
        addLog('log', arguments);
    };
    
    console.error = function() {
        originalConsole.error.apply(console, arguments);
        addLog('error', arguments);
    };
    
    console.warn = function() {
        originalConsole.warn.apply(console, arguments);
        addLog('warn', arguments);
    };
    
    console.info = function() {
        originalConsole.info.apply(console, arguments);
        addLog('info', arguments);
    };
    
    // Catch global errors
    window.addEventListener('error', (e) => {
        addLog('error', [`${e.message} at ${e.filename}:${e.lineno}`]);
    });
    
    // Catch promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        addLog('error', [`Unhandled Promise: ${e.reason}`]);
    });
    
    // Initial message
    addLog('info', ['Mobile Debug Console Active - Tap 🐛 to toggle']);
})();
