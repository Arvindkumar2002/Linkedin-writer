// DOM Elements
const form = document.getElementById('contentForm');
const apiKeyInput = document.getElementById('apiKey');
const topicInput = document.getElementById('topic');
const linkedinUrlInput = document.getElementById('linkedinUrl');
const industryKeywordInput = document.getElementById('industryKeyword');
const generateImageCheckbox = document.getElementById('generateImage');
const generateBtn = document.getElementById('generateBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const generatedContent = document.getElementById('generatedContent');
const postContent = document.getElementById('postContent');
const copyContentBtn = document.getElementById('copyContentBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const editBtn = document.getElementById('editBtn');
const retryBtn = document.getElementById('retryBtn');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
const editPostContent = document.getElementById('editPostContent');
const tooltip = document.getElementById('tooltip');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Error elements
const apiKeyError = document.getElementById('apiKeyError');
const topicError = document.getElementById('topicError');
const urlError = document.getElementById('urlError');
const industryError = document.getElementById('industryError');
const errorMessage = document.getElementById('errorMessage');

// Summary elements
const summaryApiKey = document.getElementById('summaryApiKey');
const summaryTopic = document.getElementById('summaryTopic');
const summaryUrl = document.getElementById('summaryUrl');
const summaryIndustry = document.getElementById('summaryIndustry');

// Character count
const charCount = document.getElementById('charCount');

// Event Listeners
form.addEventListener('submit', handleFormSubmit);
apiKeyInput.addEventListener('input', validateApiKey);
apiKeyInput.addEventListener('blur', validateApiKey);
topicInput.addEventListener('input', validateTopic);
topicInput.addEventListener('blur', validateTopic);
linkedinUrlInput.addEventListener('input', validateLinkedInUrl);
linkedinUrlInput.addEventListener('blur', validateLinkedInUrl);
industryKeywordInput.addEventListener('input', validateIndustryKeyword);
industryKeywordInput.addEventListener('blur', validateIndustryKeyword);

regenerateBtn.addEventListener('click', handleRegenerate);
editBtn.addEventListener('click', openEditModal);
retryBtn.addEventListener('click', handleRetry);
copyContentBtn.addEventListener('click', copyContent);
closeModal.addEventListener('click', closeEditModal);
cancelEdit.addEventListener('click', closeEditModal);
saveEdit.addEventListener('click', saveEditChanges);

// Theme toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Keyboard navigation
document.addEventListener('keydown', handleKeyboardNavigation);

// Initialize app
initializeApp();

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const apiKey = apiKeyInput.value.trim();
    const topic = topicInput.value.trim();
    const linkedinUrl = linkedinUrlInput.value.trim();
    const industryKeyword = industryKeywordInput.value.trim();
    const generateImage = generateImageCheckbox.checked;
    
    showLoading();
    hideError();
    hideResults();
    
    try {
        const content = await generatePersonalizedLinkedInContent(apiKey, topic, linkedinUrl, industryKeyword, generateImage);
        displayResults(content, apiKey, topic, linkedinUrl, industryKeyword, generateImage);
        showSuccessMessage('Content generated successfully!');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Validation functions
function validateForm() {
    let isValid = true;
    
    if (!validateApiKey()) isValid = false;
    if (!validateTopic()) isValid = false;
    if (!validateLinkedInUrl()) isValid = false;
    if (!validateIndustryKeyword()) isValid = false;
    
    return isValid;
}

function validateApiKey() {
    const value = apiKeyInput.value.trim();
    if (!value) {
        showFieldError(apiKeyInput, apiKeyError, 'API key is required');
        return false;
    }
    if (!value.startsWith('sk-') || value.length < 20) {
        showFieldError(apiKeyInput, apiKeyError, 'Please enter a valid OpenAI API key');
        return false;
    }
    clearFieldError(apiKeyInput, apiKeyError);
    return true;
}

function validateTopic() {
    const value = topicInput.value.trim();
    if (!value) {
        showFieldError(topicInput, topicError, 'Topic description is required');
        return false;
    }
    if (value.length > 500) {
        showFieldError(topicInput, topicError, 'Topic description must be under 500 characters');
        return false;
    }
    clearFieldError(topicInput, topicError);
    return true;
}

function validateLinkedInUrl() {
    const value = linkedinUrlInput.value.trim();
    if (!value) {
        showFieldError(linkedinUrlInput, urlError, 'LinkedIn URL is required');
        return false;
    }
    if (!value.includes('linkedin.com')) {
        showFieldError(linkedinUrlInput, urlError, 'Please enter a valid LinkedIn URL');
        return false;
    }
    clearFieldError(linkedinUrlInput, urlError);
    return true;
}

function validateIndustryKeyword() {
    const value = industryKeywordInput.value.trim();
    if (!value) {
        showFieldError(industryKeywordInput, industryError, 'Industry keyword is required');
        return false;
    }
    if (value.length > 50) {
        showFieldError(industryKeywordInput, industryError, 'Industry keyword must be under 50 characters');
        return false;
    }
    clearFieldError(industryKeywordInput, industryError);
    return true;
}

// Floating label functionality with enhanced animations
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    const label = input.nextElementSibling;
    if (label && label.classList.contains('form-label')) {
        // Check initial state
        if (input.value.trim() !== '') {
            label.classList.add('floating');
        }
        
        // Enhanced focus and blur events with micro-animations
        input.addEventListener('focus', () => {
            label.classList.add('floating');
            input.style.transform = 'translateY(-2px)';
            input.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.3)';
        });
        
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                label.classList.remove('floating');
            }
            input.style.transform = 'translateY(0)';
            input.style.boxShadow = '';
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                label.classList.add('floating');
            } else {
                label.classList.remove('floating');
            }
        });
        
        // Add ripple effect on click
        input.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(99, 102, 241, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = e.clientX - input.offsetLeft + 'px';
            ripple.style.top = e.clientY - input.offsetTop + 'px';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            
            input.style.position = 'relative';
            input.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
});

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced button interactions
const generateButton = document.querySelector('.btn-primary');
if (generateButton) {
    generateButton.addEventListener('mouseenter', () => {
        generateButton.style.transform = 'translateY(-3px) scale(1.02)';
        generateButton.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
    });
    
    generateButton.addEventListener('mouseleave', () => {
        generateButton.style.transform = 'translateY(0) scale(1)';
        generateButton.style.boxShadow = '';
    });
    
    generateButton.addEventListener('click', () => {
        // Add click animation
        generateButton.style.transform = 'translateY(-1px) scale(0.98)';
        setTimeout(() => {
            generateButton.style.transform = 'translateY(-3px) scale(1.02)';
        }, 150);
    });
}

// Enhanced loading animation with better step progression
function animateLoadingSteps() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    const interval = setInterval(() => {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
                step.style.animation = 'stepPulse 0.5s ease-out';
            } else {
                step.classList.remove('active');
                step.style.animation = '';
            }
        });
        
        currentStep++;
        if (currentStep >= steps.length) {
            clearInterval(interval);
        }
    }, 1200); // Slightly faster for better UX
}

// Add step pulse animation
const stepPulseStyle = document.createElement('style');
stepPulseStyle.textContent = `
    @keyframes stepPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); }
        100% { transform: scale(1.3); }
    }
`;
document.head.appendChild(stepPulseStyle);

// Enhanced success notification with better animation
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: var(--text-primary);
        padding: var(--spacing-lg) var(--spacing-xl);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-weight: var(--font-weight-semibold);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Add hover effect
    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'translateX(-5px) scale(1.02)';
        notification.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
    });
    
    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'translateX(0) scale(1)';
        notification.style.boxShadow = 'var(--shadow-xl)';
    });
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slide out animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Enhanced copy button with better feedback
function copyContent() {
    const content = postContent.textContent;
    
    navigator.clipboard.writeText(content).then(() => {
        // Enhanced success feedback
        const originalText = copyContentBtn.innerHTML;
        copyContentBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyContentBtn.style.background = 'var(--success)';
        copyContentBtn.style.transform = 'scale(1.05)';
        copyContentBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
        
        // Add success animation
        copyContentBtn.style.animation = 'copySuccess 0.6s ease-out';
        
        setTimeout(() => {
            copyContentBtn.innerHTML = originalText;
            copyContentBtn.style.background = '';
            copyContentBtn.style.transform = '';
            copyContentBtn.style.boxShadow = '';
            copyContentBtn.style.animation = '';
        }, 2000);
    }).catch(err => {
        showError('Failed to copy content: ' + err.message);
    });
}

// Add copy success animation
const copySuccessStyle = document.createElement('style');
copySuccessStyle.textContent = `
    @keyframes copySuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1.05); }
    }
`;
document.head.appendChild(copySuccessStyle);

// Enhanced form validation with better visual feedback
function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    
    // Add shake animation
    input.style.animation = 'shake 0.6s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 600);
    
    // Add glow effect
    input.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1), 0 0 15px rgba(239, 68, 68, 0.3)';
}

function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    
    // Add success glow
    input.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1), 0 0 15px rgba(16, 185, 129, 0.3)';
    
    setTimeout(() => {
        input.style.boxShadow = '';
    }, 2000);
}

// Enhanced character count with color transitions
function updateCharCount() {
    const currentLength = topicInput.value.length;
    const maxLength = 500;
    const percentage = currentLength / maxLength;
    
    charCount.textContent = `${currentLength}/${maxLength}`;
    
    if (percentage > 0.9) {
        charCount.style.color = 'var(--error)';
        charCount.style.fontWeight = 'var(--font-weight-bold)';
    } else if (percentage > 0.7) {
        charCount.style.color = 'var(--warning)';
        charCount.style.fontWeight = 'var(--font-weight-semibold)';
    } else {
        charCount.style.color = 'var(--text-muted)';
        charCount.style.fontWeight = 'var(--font-weight-medium)';
    }
    
    // Add pulse animation when approaching limit
    if (percentage > 0.8) {
        charCount.style.animation = 'pulse 1s infinite';
    } else {
        charCount.style.animation = '';
    }
}

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(pulseStyle);

// API functions
async function generatePersonalizedLinkedInContent(apiKey, topic, linkedinUrl, industryKeyword, generateImage = false) {
    const imageInstruction = generateImage ? `
4. If image generation is requested, create a LinkedIn-optimized image prompt that:
   - Is visually engaging, professional, and closely aligned with the topic and post content
   - Uses imagery suited for LinkedIn (simple, vibrant, relevant to professional context)
   - Output a clear, concise description for image generation (DALL-E or similar)
   - Ensure image fits recommended LinkedIn post aspect ratio (1200x627px)
   - Include this as a separate section: "**LinkedIn-Optimized Image Prompt:**"` : '';

    const prompt = `You are an AI content assistant specialized in crafting personalized LinkedIn posts.

Inputs:
- Topic overview provided by the user: "${topic}"
- User's LinkedIn profile URL: "${linkedinUrl}"
- Industry keyword: "${industryKeyword}"
- User's region or cultural context: India
- Generate image: ${generateImage ? 'Yes' : 'No'}

Tasks:
1. Analyze the publicly available information on the LinkedIn profile at "${linkedinUrl}", focusing on the user's recent posts.
2. Extract and summarize the user's typical writing tone (e.g., professional, conversational, motivational), style (e.g., storytelling, data-driven, concise), and frequent themes or topics.
3. Research current LinkedIn engagement trends relevant to Indian professionals and the topic "${topic}", identifying effective post formats, hooks, and language nuances.
4. Generate a fresh LinkedIn post that:
   - Reflects the user's unique voice and writing style as deduced from their recent content.
   - Aligns closely with the user-provided topic "${topic}".
   - Incorporates culturally relevant references or examples tailored to the Indian audience.
   - Is engaging, concise (ideally 100-250 words), and encourages meaningful interaction.
   - Uses compelling hooks, relevant industry insights, and clear calls to action.
   - Applies formatting such as short paragraphs, bullets, or bold text for scan-ability.${imageInstruction}
5. Present the output as a polished, ready-to-post LinkedIn update.
6. Ensure that no private or sensitive data is included or referenced.
7. Assume the API key is managed securely on the frontend (for test purposes only); do not include it in the generated content or responses.

Output format:
1. **User Style Summary**: 2-3 sentences capturing tone and style.
2. **Regional Trends Insight**: 2-3 bullets outlining engagement trends for "${topic}" in India.
3. **Generated LinkedIn Post**: Formatted, ready-for-LinkedIn content (under 250 words if possible).
${generateImage ? `4. **LinkedIn-Optimized Image Prompt**: A short, descriptive prompt suitable for GPT/DALL-E image generation, relevant and appropriate for LinkedIn.` : ''}

Make sure the text and ${generateImage ? '(if included) the image prompt are ' : 'content is '}tailored for professional appeal and high engagement on LinkedIn.

Note: Since I cannot actually access the LinkedIn profile at ${linkedinUrl}, I will create content based on general best practices and trending strategies for LinkedIn content in India, tailored to the topic and industry keyword provided. For a real implementation, you would need to integrate with LinkedIn's API or use web scraping tools to analyze the actual profile.`;

    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert LinkedIn content strategist and social media analyst specializing in the Indian market. You excel at creating personalized, culturally relevant content that matches individual user styles while incorporating current trending strategies. You have deep knowledge of LinkedIn engagement patterns, Indian professional culture, and regional content preferences.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Display functions
function displayResults(content, apiKey, topic, linkedinUrl, industryKeyword, generateImage = false) {
    // Format the content with proper HTML structure
    const formattedContent = formatContentWithSections(content, generateImage);
    generatedContent.innerHTML = formattedContent;
    
    // Extract and display just the LinkedIn post for copying
    const postSection = extractPostContent(content);
    postContent.textContent = postSection;
    
    summaryApiKey.textContent = apiKey ? '••••••••••••••••' : '';
    summaryTopic.textContent = topic;
    summaryUrl.textContent = linkedinUrl;
    summaryIndustry.textContent = industryKeyword;
    
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function formatContentWithSections(content, generateImage = false) {
    // Split content into sections and format them
    const sections = content.split(/(?=User Style Summary:|Regional Trends Insight:|Generated LinkedIn Post:|LinkedIn-Optimized Image Prompt:)/);
    
    let formattedHTML = '';
    
    sections.forEach(section => {
        if (section.trim()) {
            if (section.includes('User Style Summary:')) {
                formattedHTML += `<div class="section-header">🎯 User Style Summary</div>`;
                formattedHTML += `<div class="section-content">${section.replace('User Style Summary:', '').trim()}</div>`;
            } else if (section.includes('Regional Trends Insight:')) {
                formattedHTML += `<div class="section-header">📈 Regional Trends Insight</div>`;
                formattedHTML += `<div class="section-content">${section.replace('Regional Trends Insight:', '').trim()}</div>`;
            } else if (section.includes('Generated LinkedIn Post:')) {
                formattedHTML += `<div class="section-header">✍️ Generated LinkedIn Post</div>`;
                formattedHTML += `<div class="section-content post-content">${section.replace('Generated LinkedIn Post:', '').trim()}</div>`;
            } else if (generateImage && section.includes('LinkedIn-Optimized Image Prompt:')) {
                formattedHTML += `<div class="section-header">🖼️ LinkedIn-Optimized Image Prompt</div>`;
                formattedHTML += `<div class="section-content image-prompt">${section.replace('LinkedIn-Optimized Image Prompt:', '').trim()}</div>`;
            }
        }
    });
    
    return formattedHTML;
}

function extractPostContent(content) {
    const postMatch = content.match(/Generated LinkedIn Post:(.*?)(?=User Style Summary:|Regional Trends Insight:|$)/s);
    return postMatch ? postMatch[1].trim() : content;
}

// Action functions
function handleRegenerate() {
    form.dispatchEvent(new Event('submit'));
}

function handleRetry() {
    hideError();
    form.dispatchEvent(new Event('submit'));
}

// Modal functions
function openEditModal() {
    const currentPost = postContent.textContent;
    editPostContent.value = currentPost;
    editModal.classList.remove('hidden');
    editPostContent.focus();
}

function closeEditModal() {
    editModal.classList.add('hidden');
}

function saveEditChanges() {
    const editedContent = editPostContent.value.trim();
    if (editedContent) {
        postContent.textContent = editedContent;
        closeEditModal();
        
        // Show success message
        showSuccessMessage('Post updated successfully!');
    }
}

// Tooltip functions
function showTooltip(e) {
    const tooltipText = e.target.dataset.tooltip;
    if (tooltipText) {
        tooltip.textContent = tooltipText;
        tooltip.classList.remove('hidden');
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }
}

function showTooltipForElement(element, message) {
    tooltip.textContent = message;
    tooltip.classList.remove('hidden');
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    tooltip.classList.add('hidden');
}

// Utility functions
function showLoading() {
    loadingSection.classList.remove('hidden');
    animateLoadingSteps();
}

function hideLoading() {
    loadingSection.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    hideResults();
}

function hideError() {
    errorSection.classList.add('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

// Theme functions
function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Initialize app
function initializeApp() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
    
    // Initialize character count
    updateCharCount();
    
    // Add character count listener
    topicInput.addEventListener('input', updateCharCount);
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
        if (!editModal.classList.contains('hidden')) {
            closeEditModal();
        }
    }
    
    // Enter key in modal saves changes
    if (e.key === 'Enter' && e.ctrlKey) {
        if (!editModal.classList.contains('hidden')) {
            saveEditChanges();
        }
    }
} 