// Global state
let sessionId = 'default-' + Date.now();
let chatSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];
let currentSessionIndex = -1;

// DOM elements
const chatMessages = document.getElementById('messages');
const chatInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const historyDrawer = document.getElementById('historyDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const menuBtn = document.getElementById('menuBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const newChatBtn = document.getElementById('newChatBtn');
const historyList = document.getElementById('historyList');

// Event listeners
if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}
if (clearBtn) clearBtn.addEventListener('click', clearHistory);

// History drawer event listeners
if (menuBtn) menuBtn.addEventListener('click', openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);

// Drawer functions
function openDrawer() {
    historyDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
    renderHistory();
}

function closeDrawer() {
    historyDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
}

function startNewChat() {
    saveCurrentSession();
    sessionId = 'session-' + Date.now();
    currentSessionIndex = -1;
    if (chatMessages) {
        chatMessages.innerHTML = '<div class="welcome-message"><h2>Hi! I\'m Kate, your financial assistant 👋</h2><p>I can help you track expenses, manage your budget, set savings goals, and give you personalized financial advice.</p></div>';
    }
    closeDrawer();
}

function saveCurrentSession() {
    if (!chatMessages) return;
    const messages = Array.from(chatMessages.children).filter(msg => msg.classList.contains('message')).map(msg => {
        const isUser = msg.classList.contains('user');
        const content = msg.querySelector('.message-text')?.textContent || '';
        return { role: isUser ? 'user' : 'assistant', content };
    });
    
    if (messages.length > 1) { // Only save if there are user messages
        const firstUserMessage = messages.find(m => m.role === 'user');
        const title = firstUserMessage ? firstUserMessage.content.substring(0, 50) : 'New Chat';
        
        if (currentSessionIndex >= 0) {
            chatSessions[currentSessionIndex] = {
                id: sessionId,
                title,
                messages,
                timestamp: Date.now()
            };
        } else {
            chatSessions.unshift({
                id: sessionId,
                title,
                messages,
                timestamp: Date.now()
            });
            currentSessionIndex = 0;
        }
        
        // Keep only last 20 sessions
        if (chatSessions.length > 20) {
            chatSessions = chatSessions.slice(0, 20);
        }
        
        localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    chatSessions.forEach((session, index) => {
        const item = document.createElement('button');
        item.className = 'history-item';
        if (index === currentSessionIndex) {
            item.classList.add('active');
        }
        item.textContent = session.title;
        item.addEventListener('click', () => loadSession(index));
        historyList.appendChild(item);
    });
}

function loadSession(index) {
    saveCurrentSession();
    const session = chatSessions[index];
    sessionId = session.id;
    currentSessionIndex = index;
    
    if (chatMessages) {
        chatMessages.innerHTML = '';
        session.messages.forEach(msg => {
            addMessage(msg.role, msg.content);
        });
    }
    
    closeDrawer();
}

// Save session before page unload
window.addEventListener('beforeunload', () => {
    saveCurrentSession();
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // No initial message needed - welcome message is in HTML
});

// Functions
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatInput.value = '';

    // Show loading indicator
    const loadingId = addMessage('assistant', '<span class="loading"></span>', true);

    // Disable input while processing
    chatInput.disabled = true;
    sendBtn.disabled = true;

    try {
        // Handle special commands
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage === 'help') {
            removeMessage(loadingId);
            addMessage('assistant', getHelpMessage());
            return;
        }

        // Regular chat
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId
            })
        });

        const data = await response.json();
        removeMessage(loadingId);

        if (data.success) {
            addMessage('assistant', data.response);
        } else {
            // User-friendly error messages
            let errorMsg = 'Sorry, something went wrong. Please try again.';
            if (data.error.includes('too many')) {
                errorMsg = '⚠️ You\'re sending messages too quickly. Please wait a moment and try again.';
            } else if (data.error.includes('configured')) {
                errorMsg = '⚠️ AI is not configured yet. Please contact support.';
            } else if (data.error) {
                errorMsg = `⚠️ ${data.error}`;
            }
            addMessage('assistant', errorMsg, false, true);
        }
    } catch (error) {
        removeMessage(loadingId);
        let errorMsg = '⚠️ Connection error. Please check your internet and try again.';
        if (error.message.includes('fetch')) {
            errorMsg = '⚠️ Unable to reach the server. Please refresh the page and try again.';
        }
        addMessage('assistant', errorMsg, false, true);
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

function addMessage(type, content, isLoading = false, isError = false) {
    if (!chatMessages) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (type === 'user') {
        avatar.textContent = 'Y';
    } else {
        const avatarImg = document.createElement('img');
        avatarImg.src = '/images/kate-avatar.png?' + Date.now(); // Add cache busting
        avatarImg.alt = 'Kate';
        avatarImg.style.width = '100%';
        avatarImg.style.height = '100%';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.borderRadius = '50%';
        avatarImg.onerror = function() {
            // Fallback if image fails to load
            this.style.display = 'none';
            avatar.textContent = 'K';
            avatar.style.background = 'var(--brand-primary)';
            avatar.style.color = 'white';
        };
        avatar.appendChild(avatarImg);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    if (isLoading) {
        messageText.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        messageDiv.id = 'loading-message';
    } else {
        messageText.innerHTML = formatMessage(content);
    }
    
    messageBubble.appendChild(messageText);
    
    // Add copy button for assistant messages only
    if (type === 'assistant' && !isLoading) {
        const messageActions = document.createElement('div');
        messageActions.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy';
        copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
        `;
        copyBtn.onclick = () => copyMessageContent(copyBtn, content);
        messageActions.appendChild(copyBtn);
        messageBubble.appendChild(messageActions);
    }
    
    messageContent.appendChild(messageBubble);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom smoothly
    setTimeout(() => {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
    
    return messageDiv.id || null;
}

function copyMessageContent(button, content) {
    // Remove HTML tags and formatting for plain text copy
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formatMessage(content);
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    navigator.clipboard.writeText(plainText).then(() => {
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function removeMessage(messageId) {
    if (messageId) {
        const element = document.getElementById(messageId);
        if (element) {
            element.remove();
        }
    } else {
        // Remove loading message
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }
}

function formatMessage(text) {
    // Simple markdown-like formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    
    // Handle code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    return text;
}

function getHelpMessage() {
    return `I'm Kate, your AI assistant! I can help you with:
• Answering questions on any topic
• Having conversations
• Providing information and explanations
• Helping with problem-solving
• And much more!

Just type your question or message, and I'll do my best to help you. Type "clear" to reset our conversation history.`;
}


async function clearHistory() {
    if (!chatMessages) return;
    
    try {
        await fetch('/api/clear-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: sessionId })
        });
        
        // Clear local session storage
        chatSessions = [];
        currentSessionIndex = -1;
        sessionId = 'session-' + Date.now();
        localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
        
        chatMessages.innerHTML = '<div class="welcome-message"><h2>Hi! I\'m Kate, your financial assistant 👋</h2><p>I can help you track expenses, manage your budget, set savings goals, and give you personalized financial advice.</p></div>';
    } catch (error) {
        console.error('Error clearing history:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Finance Management Functions

async function loadFinancialSummary() {
    try {
        const response = await fetch('/api/summary');
        const data = await response.json();
        
        if (data.success) {
            const summary = data.summary;
            financialSummary.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Total Balance:</span>
                    <span class="summary-value ${summary.totalBalance >= 0 ? 'positive' : 'negative'}">
                        $${summary.totalBalance.toFixed(2)}
                    </span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Monthly Income:</span>
                    <span class="summary-value positive">$${summary.monthlyIncome.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Monthly Expenses:</span>
                    <span class="summary-value negative">$${summary.monthlyExpenses.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Net Income:</span>
                    <span class="summary-value ${summary.netIncome >= 0 ? 'positive' : 'negative'}">
                        $${summary.netIncome.toFixed(2)}
                    </span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Accounts:</span>
                    <span class="summary-value">${summary.accounts.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Goals:</span>
                    <span class="summary-value">${summary.goals.length}</span>
                </div>
            `;
        }
    } catch (error) {
        financialSummary.innerHTML = '<p style="color: red;">Error loading summary</p>';
    }
}

async function loadAccounts() {
    try {
        const response = await fetch('/api/accounts');
        const data = await response.json();
        
        if (data.success) {
            if (data.accounts.length === 0) {
                accountsList.innerHTML = '<p style="color: #666; font-size: 12px;">No accounts yet. Add one to get started!</p>';
            } else {
                accountsList.innerHTML = data.accounts.map(acc => `
                    <div class="account-item">
                        <h4>${acc.name || acc.type || 'Account'}</h4>
                        <p>Balance: $${parseFloat(acc.balance || 0).toFixed(2)}</p>
                        ${acc.type ? `<p style="color: #999;">Type: ${acc.type}</p>` : ''}
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        accountsList.innerHTML = '<p style="color: red;">Error loading accounts</p>';
    }
}

async function loadGoals() {
    try {
        const response = await fetch('/api/goals');
        const data = await response.json();
        
        if (data.success) {
            if (data.goals.length === 0) {
                goalsList.innerHTML = '<p style="color: #666; font-size: 12px;">No goals yet. Add one to get started!</p>';
            } else {
                goalsList.innerHTML = data.goals.map(goal => {
                    const progress = goal.progress || 0;
                    const target = parseFloat(goal.targetAmount || 0);
                    const progressPercent = target > 0 ? (progress / target * 100).toFixed(1) : 0;
                    return `
                        <div class="goal-item">
                            <h4>${goal.name}</h4>
                            <p>Target: $${target.toFixed(2)} by ${goal.targetDate || 'N/A'}</p>
                            <p>Progress: ${progressPercent}%</p>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        goalsList.innerHTML = '<p style="color: red;">Error loading goals</p>';
    }
}

function showAccountForm() {
    formBody.innerHTML = `
        <h2>Add Account</h2>
        <form id="accountForm">
            <div class="form-group">
                <label>Account Name *</label>
                <input type="text" name="name" required placeholder="e.g., Checking Account">
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type">
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Initial Balance *</label>
                <input type="number" name="balance" step="0.01" required placeholder="0.00">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Add Account</button>
        </form>
    `;
    formModal.style.display = 'block';
    
    document.getElementById('accountForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const account = {
            name: formData.get('name'),
            type: formData.get('type'),
            balance: parseFloat(formData.get('balance'))
        };
        
        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(account)
            });
            const data = await response.json();
            if (data.success) {
                formModal.style.display = 'none';
                loadAccounts();
                loadFinancialSummary();
                addMessage('assistant', `Account "${account.name}" added successfully!`);
            }
        } catch (error) {
            alert('Error adding account: ' + error.message);
        }
    });
}

function showTransactionForm() {
    fetch('/api/accounts').then(r => r.json()).then(data => {
        const accounts = data.success ? data.accounts : [];
        const accountOptions = accounts.map(acc => 
            `<option value="${acc.id}">${acc.name || acc.type || acc.id}</option>`
        ).join('');
        
        formBody.innerHTML = `
            <h2>Add Transaction</h2>
            <form id="transactionForm">
                <div class="form-group">
                    <label>Account *</label>
                    <select name="accountId" required>
                        ${accountOptions || '<option value="">No accounts available</option>'}
                    </select>
                </div>
                <div class="form-group">
                    <label>Type *</label>
                    <select name="type" required>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Amount *</label>
                    <input type="number" name="amount" step="0.01" required placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" name="description" placeholder="e.g., Groceries, Salary">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" name="category" placeholder="e.g., Food, Utilities">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Add Transaction</button>
            </form>
        `;
        formModal.style.display = 'block';
        
        document.getElementById('transactionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const transaction = {
                accountId: formData.get('accountId'),
                type: formData.get('type'),
                amount: parseFloat(formData.get('amount')),
                description: formData.get('description'),
                category: formData.get('category'),
                date: formData.get('date')
            };
            
            try {
                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transaction)
                });
                const data = await response.json();
                if (data.success) {
                    formModal.style.display = 'none';
                    loadFinancialSummary();
                    addMessage('assistant', `Transaction added successfully!`);
                }
            } catch (error) {
                alert('Error adding transaction: ' + error.message);
            }
        });
    });
}

function showGoalForm() {
    formBody.innerHTML = `
        <h2>Add Goal</h2>
        <form id="goalForm">
            <div class="form-group">
                <label>Goal Name *</label>
                <input type="text" name="name" required placeholder="e.g., Emergency Fund">
            </div>
            <div class="form-group">
                <label>Target Amount *</label>
                <input type="number" name="targetAmount" step="0.01" required placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Target Date</label>
                <input type="date" name="targetDate">
            </div>
            <div class="form-group">
                <label>Priority</label>
                <select name="priority">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="form-group">
                <label>Current Progress ($)</label>
                <input type="number" name="progress" step="0.01" value="0" placeholder="0.00">
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Add Goal</button>
        </form>
    `;
    formModal.style.display = 'block';
    
    document.getElementById('goalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const goal = {
            name: formData.get('name'),
            targetAmount: parseFloat(formData.get('targetAmount')),
            targetDate: formData.get('targetDate'),
            priority: formData.get('priority'),
            progress: parseFloat(formData.get('progress') || 0)
        };
        
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goal)
            });
            const data = await response.json();
            if (data.success) {
                formModal.style.display = 'none';
                loadGoals();
                loadFinancialSummary();
                addMessage('assistant', `Goal "${goal.name}" added successfully!`);
            }
        } catch (error) {
            alert('Error adding goal: ' + error.message);
        }
    });
}

async function generateFinancialPlan() {
    const loadingId = addMessage('assistant', 'Generating your beautiful financial plan...', true);
    
    try {
        const response = await fetch('/api/generate-plan', { method: 'POST' });
        const data = await response.json();
        removeMessage(loadingId);
        
        if (data.success) {
            displayFinancialPlan(data.plan);
            modal.style.display = 'block';
            addMessage('assistant', `✨ Your financial plan is ready! The plan is now displayed in the popup window with download and print options.`);
        } else {
            addMessage('assistant', `Error: ${data.error}`, false, true);
        }
    } catch (error) {
        removeMessage(loadingId);
        addMessage('assistant', `Error: ${error.message}`, false, true);
    }
}

function displayFinancialPlan(planText) {
    const formattedPlan = formatPlanForDisplay(planText);
    
    modalBody.innerHTML = `
        <div class="plan-header">
            <h2>📊 Your Financial Plan</h2>
            <div class="plan-actions">
                <button onclick="copyPlanToClipboard()" class="btn-secondary" style="margin-right: 10px;">
                    📋 Copy Text
                </button>
                <button onclick="downloadPlanAsPDF()" class="btn-primary" style="margin-right: 10px;">
                    📥 Download PDF
                </button>
                <button onclick="printPlan()" class="btn-secondary">
                    🖨️ Print
                </button>
            </div>
        </div>
        <div id="planContent" class="plan-content">
            ${formattedPlan}
        </div>
        <div id="planTextHidden" style="display: none;">${escapeHtml(planText)}</div>
    `;
}

function copyPlanToClipboard() {
    const planText = document.getElementById('planTextHidden').textContent;
    
    navigator.clipboard.writeText(planText).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
        
        addMessage('assistant', '✅ Financial plan copied to clipboard!');
    }).catch(err => {
        addMessage('assistant', '⚠️ Could not copy to clipboard. Please select and copy the text manually.', false, true);
    });
}

function formatPlanForDisplay(text) {
    let html = text;
    
    html = html.replace(/^# (.*$)/gim, '<h1 class="plan-h1">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="plan-h2">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="plan-h3">$1</h3>');
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    html = html.replace(/<p><h/g, '<h');
    html = html.replace(/<\/h1><\/p>/g, '</h1>');
    html = html.replace(/<\/h2><\/p>/g, '</h2>');
    html = html.replace(/<\/h3><\/p>/g, '</h3>');
    html = html.replace(/<p><ul>/g, '<ul>');
    html = html.replace(/<\/ul><\/p>/g, '</ul>');
    
    return html;
}

function downloadPlanAsPDF() {
    const content = document.getElementById('planContent');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Financial Plan</title>
            <style>
                @page { margin: 2cm; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .plan-h1 {
                    color: #5b7fff;
                    border-bottom: 3px solid #5b7fff;
                    padding-bottom: 10px;
                    margin-top: 30px;
                    font-size: 28px;
                }
                .plan-h2 {
                    color: #4a5568;
                    margin-top: 25px;
                    font-size: 22px;
                    border-left: 4px solid #5b7fff;
                    padding-left: 15px;
                }
                .plan-h3 {
                    color: #2d3748;
                    margin-top: 20px;
                    font-size: 18px;
                }
                p {
                    margin: 12px 0;
                    text-align: justify;
                }
                ul, ol {
                    margin: 15px 0;
                    padding-left: 30px;
                }
                li {
                    margin: 8px 0;
                }
                strong {
                    color: #2d3748;
                    font-weight: 600;
                }
                code {
                    background: #f7fafc;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                }
                .header h1 {
                    color: #5b7fff;
                    margin: 0;
                    font-size: 32px;
                }
                .header p {
                    color: #718096;
                    margin: 10px 0 0 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Personal Financial Plan</h1>
                <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
            </div>
            ${content.innerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function printPlan() {
    downloadPlanAsPDF();
}

async function generateFinancialDiagram() {
    const loadingId = addMessage('assistant', 'Generating financial diagram...', true);
    
    try {
        const response = await fetch('/api/generate-diagram', { method: 'POST' });
        const data = await response.json();
        removeMessage(loadingId);
        
        if (data.success) {
            modalBody.innerHTML = `<h2>Financial Diagram (Graphviz DOT)</h2><pre>${escapeHtml(data.diagram)}</pre>`;
            modal.style.display = 'block';
            addMessage('assistant', `Diagram generated! Saved to ${data.filePath}`);
        } else {
            addMessage('assistant', `Error: ${data.error}`, false, true);
        }
    } catch (error) {
        removeMessage(loadingId);
        addMessage('assistant', `Error: ${error.message}`, false, true);
    }
}

