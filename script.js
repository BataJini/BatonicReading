// Theme Toggle Logic
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Initialize theme from localStorage or default to light mode
let isDark = localStorage.getItem('theme') === 'dark';

// Apply theme on page load
function applyTheme() {
    if (isDark) {
        html.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        html.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Apply theme immediately
applyTheme();

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme();
});

// Settings Panel Logic
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettings = document.getElementById('close-settings');

function openSettings() {
    settingsPanel.classList.remove('hidden-panel');
    settingsOverlay.classList.remove('hidden');
}

function closeSettingsPanel() {
    settingsPanel.classList.add('hidden-panel');
    settingsOverlay.classList.add('hidden');
}

settingsBtn.addEventListener('click', openSettings);
closeSettings.addEventListener('click', closeSettingsPanel);
settingsOverlay.addEventListener('click', closeSettingsPanel);

// Settings - Bold Percentage Slider
const boldPercentageSlider = document.getElementById('bold-percentage');
const percentageValue = document.getElementById('percentage-value');
let boldPercentage = 40;

boldPercentageSlider.addEventListener('input', (e) => {
    boldPercentage = parseInt(e.target.value);
    percentageValue.textContent = boldPercentage + '%';
});

// Settings - Font Size
const fontSizeSelect = document.getElementById('font-size');
const outputText = document.getElementById('output-text');

fontSizeSelect.addEventListener('change', (e) => {
    // Remove existing font size classes
    outputText.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    outputText.classList.add(e.target.value);
});

// Settings - Line Height
const lineHeightSelect = document.getElementById('line-height');

lineHeightSelect.addEventListener('change', (e) => {
    // Remove existing line height classes
    outputText.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
    outputText.classList.add(e.target.value);
});

// Bionic Reading Core Logic
// Processes text and bolds first ~40% of letters in each word
function convertToBionic(text, percentage = 40) {
    if (!text.trim()) return '<p class="text-gray-400 dark:text-gray-600 italic">Your bionic reading text will appear here...</p>';
    
    // Split text into paragraphs
    const paragraphs = text.split(/\n+/);
    
    return paragraphs.map(paragraph => {
        if (!paragraph.trim()) return '';
        
        // Split paragraph into words while preserving spaces
        const words = paragraph.split(/(\s+)/);
        
        const bionicWords = words.map(word => {
            // Preserve whitespace as-is
            if (/^\s+$/.test(word)) return word;
            
            // Skip empty strings
            if (!word) return '';
            
            // Calculate how many letters to bold (minimum 1, based on percentage)
            const boldLength = Math.max(1, Math.ceil(word.length * (percentage / 100)));
            
            // Split word into bold and regular parts
            const boldPart = word.slice(0, boldLength);
            const regularPart = word.slice(boldLength);
            
            // Return word with bold wrapper
            return `<span class="bionic-word"><span class="bionic-bold">${boldPart}</span>${regularPart}</span>`;
        }).join('');
        
        return `<p class="mb-4">${bionicWords}</p>`;
    }).join('');
}

// Convert Button Logic
const convertBtn = document.getElementById('convert-btn');
const inputText = document.getElementById('input-text');

convertBtn.addEventListener('click', () => {
    const text = inputText.value;
    const bionicHTML = convertToBionic(text, boldPercentage);
    outputText.innerHTML = bionicHTML;
});

// Copy Button Logic
const copyBtn = document.getElementById('copy-btn');

copyBtn.addEventListener('click', () => {
    const textContent = outputText.innerText;
    navigator.clipboard.writeText(textContent).then(() => {
        // Visual feedback
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
});

// Auto-convert on Enter key (Ctrl/Cmd + Enter)
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        convertBtn.click();
    }
});

