/**
 * University Rules RAG Chatbot - Frontend JavaScript
 * Handles chat functionality, API communication, and UI interactions
 */

class UniversityChatbot {
    constructor() {
        // Use relative URLs to work with both localhost and ngrok
        this.apiBaseUrl = window.location.origin;
        this.isLoading = false;
        this.messageHistory = [];
        
        this.initializeElements();
        this.bindEvents();
        this.checkServerStatus();
        this.focusInput();
    }

    initializeElements() {
        // DOM elements
        this.chatForm = document.getElementById('chatForm');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.welcomeCard = document.getElementById('welcomeCard');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusText = document.getElementById('statusText');
    }

    bindEvents() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Input events
        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
        });

        // Enter key handling
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize chat messages
        window.addEventListener('resize', () => {
            this.scrollToBottom();
        });
    }

    async checkServerStatus() {
        try {
            this.updateConnectionStatus('connecting', 'در حال اتصال...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/health`);
            
            if (response.ok) {
                this.updateConnectionStatus('connected', 'آماده');
            } else {
                throw new Error('Server health check failed');
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.updateConnectionStatus('error', 'خطا در اتصال');
            this.showErrorMessage('خطا در اتصال به سرور. لطفاً صفحه را بازخوانی کنید.');
        }
    }

    updateConnectionStatus(status, text) {
        this.connectionStatus.className = `status-dot ${status}`;
        this.statusText.textContent = text;
    }

    focusInput() {
        setTimeout(() => {
            this.messageInput.focus();
        }, 500);
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isLoading) {
            return;
        }

        // Hide welcome card on first message
        if (this.welcomeCard) {
            this.welcomeCard.style.display = 'none';
        }

        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input and show loading
        this.messageInput.value = '';
        this.updateSendButton();
        this.showLoading();

        try {
            // Send request to API
            const response = await this.sendApiRequest(message);
            
            // Hide loading and add bot response
            this.hideLoading();
            this.addBotMessage(response);
            
        } catch (error) {
            console.error('API Error:', error);
            this.hideLoading();
            this.addErrorMessage('متأسفانه خطایی در پردازش پاسخ رخ داد. لطفاً دوباره تلاش کنید.');
        }

        // Focus back to input
        this.messageInput.focus();
    }

    async sendApiRequest(message) {
        const requestData = {
            message: message,
            max_sources: 5
        };

        const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.messageHistory.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
    }

    addBotMessage(response) {
        const messageElement = this.createBotMessageElement(response);
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store in history
        this.messageHistory.push({
            type: 'bot',
            content: response,
            timestamp: new Date()
        });
    }

    addErrorMessage(errorText) {
        const messageElement = this.createMessageElement(errorText, 'error');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (type === 'user') {
            contentDiv.innerHTML = `
                <div class="message-header">
                    <div class="left-side">
                        <i class="fas fa-user message-icon"></i>
                        <span>شما</span>
                    </div>
                    <button class="copy-btn" title="کپی کردن پیام" data-copy-text="${this.escapeForAttribute(content)}" data-copy-type="user">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="message-text">${this.escapeHtml(content)}</div>
            `;
            
            // Add event listener for copy button
            const copyBtn = contentDiv.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const textToCopy = copyBtn.getAttribute('data-copy-text');
                    const copyType = copyBtn.getAttribute('data-copy-type');
                    this.copyToClipboard(textToCopy, copyType);
                });
            }
        } else if (type === 'error') {
            contentDiv.innerHTML = `
                <div class="message-header">
                    <div class="left-side">
                        <i class="fas fa-exclamation-triangle message-icon"></i>
                        <span>خطا</span>
                    </div>
                    <button class="copy-btn" title="کپی کردن پیام خطا" data-copy-text="${this.escapeForAttribute(content)}" data-copy-type="error">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <div class="message-text">${this.escapeHtml(content)}</div>
            `;
            contentDiv.style.backgroundColor = '#fee2e2';
            contentDiv.style.borderColor = '#fca5a5';
            contentDiv.style.color = '#dc2626';
            
            // Add event listener for copy button
            const copyBtn = contentDiv.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const textToCopy = copyBtn.getAttribute('data-copy-text');
                    const copyType = copyBtn.getAttribute('data-copy-type');
                    this.copyToClipboard(textToCopy, copyType);
                });
            }
        }

        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }

    createBotMessageElement(response) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message-bot';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Format the answer with proper line breaks
        const formattedAnswer = this.formatAnswer(response.answer);
        
        // Prefer server-provided plain text for copying; fallback to markdown/HTML conversion
        const copyAnswer = response.answer_plain_text || this.convertToMarkdown(response.answer);

        // Create sources text for copying
        const sourcesText = this.createSourcesTextForCopy(response.sources);
        const fullTextToCopy = copyAnswer + sourcesText;

        contentDiv.innerHTML = `
            <div class="message-header">
                <div class="left-side">
                    <i class="fas fa-robot message-icon"></i>
                    <span>دستیار هوشمند</span>
                    <span class="category-badge">
                        <i class="fas fa-tag"></i>
                        ${this.escapeHtml(response.category)}
                    </span>
                </div>
                <button class="copy-btn" title="کپی کردن پاسخ" data-copy-text="${this.escapeForAttribute(fullTextToCopy)}" data-copy-type="bot">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div class="message-text">${formattedAnswer}</div>
            ${this.createSourcesSection(response.sources)}
        `;

        messageDiv.appendChild(contentDiv);
        
        // Add event listener for copy button
        const copyBtn = contentDiv.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const textToCopy = copyBtn.getAttribute('data-copy-text');
                const copyType = copyBtn.getAttribute('data-copy-type');
                this.copyToClipboard(textToCopy, copyType);
            });
        }
        return messageDiv;
    }

    createSourcesTextForCopy(sources) {
        if (!sources || sources.length === 0) {
            return '';
        }

        // Deduplicate sources by document name and PDF URL
        const uniqueSources = [];
        const seenSources = new Set();
        
        sources.forEach(source => {
            if (source.pdf_url) {
                const sourceKey = `${source.document}|${source.pdf_url}`;
                if (!seenSources.has(sourceKey)) {
                    seenSources.add(sourceKey);
                    uniqueSources.push(source);
                }
            }
        });

        if (uniqueSources.length === 0) {
            return '';
        }

        const sourcesList = uniqueSources
            .map((source, index) => `${index + 1}. ${source.document}\n   لینک: ${source.pdf_url}`)
            .join('\n');

        return `\n\n--- منابع مراجعه شده ---\n${sourcesList}`;
    }

    createSourcesSection(sources) {
        if (!sources || sources.length === 0) {
            return '';
        }

        // Deduplicate sources by document name and PDF URL
        const uniqueSources = [];
        const seenSources = new Set();
        
        sources.forEach(source => {
            if (source.pdf_url) {
                const sourceKey = `${source.document}|${source.pdf_url}`;
                if (!seenSources.has(sourceKey)) {
                    seenSources.add(sourceKey);
                    uniqueSources.push(source);
                }
            }
        });

        if (uniqueSources.length === 0) {
            return '';
        }

        const sourceItems = uniqueSources
            .map(source => {
                const documentName = this.escapeHtml(source.document);
                const pdfUrl = this.escapeHtml(source.pdf_url);
                
                return `
                    <div class="source-item">
                        <a href="${pdfUrl}" target="_blank" class="source-link">
                            <i class="fas fa-file-pdf"></i>
                            ${documentName}
                        </a>
                    </div>
                `;
            })
            .join('');

        return `
            <div class="sources-section">
                <div class="sources-title">
                    <i class="fas fa-book-open me-2"></i>
                    منابع مراجعه شده:
                </div>
                ${sourceItems}
            </div>
        `;
    }

    formatAnswer(answer) {
        // The answer already contains HTML links and markdown formatting
        // We need to render it properly instead of escaping it
        let formatted = answer;

        // Handle bold text **text** 
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text *text* (but avoid breaking existing HTML)
        formatted = formatted.replace(/(?<!<[^>]*)\*([^*\n]+?)\*(?![^<]*>)/g, '<em>$1</em>');
        
        // Convert markdown links to HTML with special handling for PDF links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, linkText, url) {
            // Special handling for PDF links
            if (linkText.includes('مشاهده PDF') || linkText.includes('PDF')) {
                return `<a href="${url}" target="_blank" class="pdf-link" title="مشاهده PDF"><i class="fas fa-file-pdf"></i> ${linkText}</a>`;
            }
            // General links
            return `<a href="${url}" target="_blank" class="source-link">${linkText}</a>`;
        });
        
        // Handle numbered lists - convert "1. item" to proper list items
        formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
        
        // Wrap consecutive list items in ordered list
        formatted = formatted.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, function(match) {
            return '<ol>' + match + '</ol>';
        });

        // Handle bullet points - convert "* item" to list items
        formatted = formatted.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
        
        // Convert paragraphs (double newlines) to proper paragraph tags
        const paragraphs = formatted.split(/\n\s*\n/);
        formatted = paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            if (trimmed && !trimmed.startsWith('<ol>') && !trimmed.startsWith('<ul>') && !trimmed.startsWith('<li>')) {
                return `<p>${trimmed}</p>`;
            }
            return trimmed;
        }).join('\n');

        // Handle remaining single line breaks
        formatted = formatted.replace(/\n(?!<\/?(p|ol|ul|li))/g, '<br>');
        
        // Clean up any double breaks
        formatted = formatted.replace(/<br>\s*<br>/g, '<br>');
        
        // Remove duplicate source sections that might appear at the end
        formatted = this.removeDuplicateSources(formatted);
        
        return formatted;
    }

    removeDuplicateSources(text) {
        // Look for duplicate "منابع مراجعه شده:" sections
        const sourcePattern = /منابع مراجعه شده:\s*\n(.*?)(?=\n\n|$)/gs;
        const matches = [...text.matchAll(sourcePattern)];
        
        if (matches.length > 1) {
            // Keep only the first occurrence and remove the rest
            let cleaned = text;
            for (let i = 1; i < matches.length; i++) {
                cleaned = cleaned.replace(matches[i][0], '');
            }
            return cleaned;
        }
        
        return text;
    }

    escapeHtml(text, preserveFormatting = false) {
        if (preserveFormatting) {
            // For formatted content, we want to preserve HTML tags
            // Only escape specific dangerous characters
            return text
                .replace(/&(?!(?:amp|lt|gt|quot|#39|#x27|#x2F|nbsp);)/g, '&amp;')
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ''); // Remove iframe tags
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        this.isLoading = true;
        this.loadingIndicator.classList.remove('d-none');
        this.updateSendButton();
        this.scrollToBottom();
    }

    hideLoading() {
        this.isLoading = false;
        this.loadingIndicator.classList.add('d-none');
        this.updateSendButton();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTo({
                top: this.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    showErrorMessage(message) {
        // Show error in a toast or alert
        console.error('Application Error:', message);
        
        // You could add a toast notification here
        alert(message);
    }

    // Copy functionality
    copyToClipboard(text, messageType = 'text') {
        // Remove escape characters and clean up text
        const cleanText = text
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
        
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            navigator.clipboard.writeText(cleanText).then(() => {
                this.showCopySuccess(messageType);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                this.fallbackCopyToClipboard(cleanText, messageType);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(cleanText, messageType);
        }
    }

    fallbackCopyToClipboard(text, messageType) {
        // Create a temporary textarea element
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showCopySuccess(messageType);
            } else {
                this.showCopyError();
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            this.showCopyError();
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess(messageType) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification success';
        
        let message = '';
        switch(messageType) {
            case 'user':
                message = '✅ پیام شما کپی شد';
                break;
            case 'bot':
                message = '✅ پاسخ دستیار کپی شد';
                break;
            case 'error':
                message = '✅ پیام خطا کپی شد';
                break;
            default:
                message = '✅ متن کپی شد';
        }
        
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-family: 'Vazir', 'Tahoma', sans-serif;
            font-size: 14px;
            direction: rtl;
            animation: slideInFade 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutFade 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showCopyError() {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification error';
        notification.textContent = '❌ خطا در کپی کردن';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-family: 'Vazir', 'Tahoma', sans-serif;
            font-size: 14px;
            direction: rtl;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // Helper function to escape text for HTML attributes
    escapeForAttribute(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }

    // Helper function to convert response to markdown format for copying
    convertToMarkdown(responseText) {
        // The response.answer should already be in a format that can be converted to markdown
        // We need to preserve the original markdown formatting instead of stripping it
        let markdown = responseText;
        
        // Handle line breaks - convert \n to actual line breaks
        markdown = markdown.replace(/\\n/g, '\n');
        
        // Ensure proper spacing for lists and paragraphs
        markdown = markdown.replace(/\n\n+/g, '\n\n'); // Normalize multiple line breaks
        
        return markdown;
    }

    // Helper function to strip HTML tags for plain text copying
    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    // Utility method to get chat history
    getChatHistory() {
        return this.messageHistory;
    }

    // Utility method to clear chat
    clearChat() {
        this.chatMessages.innerHTML = '';
        this.messageHistory = [];
        if (this.welcomeCard) {
            this.welcomeCard.style.display = 'block';
        }
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.universityChatbot = new UniversityChatbot();
    
    // Add some useful keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+L or Cmd+L to clear chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (confirm('آیا می‌خواهید گفتگو را پاک کنید؟')) {
                window.universityChatbot.clearChat();
            }
        }
        
        // Escape to focus input
        if (e.key === 'Escape') {
            window.universityChatbot.messageInput.focus();
        }
    });
});

// Service Worker registration (optional for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for offline functionality if needed
        // navigator.serviceWorker.register('/sw.js');
    });
}