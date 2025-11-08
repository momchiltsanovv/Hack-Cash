// Tab switching
const navTabs = document.querySelectorAll('.nav-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Update nav tabs
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab panels
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'analysis') {
        updateAnalysisTab();
    } else if (tabName === 'planning') {
        updatePlanningTab();
    }
}

let spendingChart = null;

// ===== DASHBOARD TAB =====
async function updateDashboardTab() {
    try {
        const [summaryRes, transactionsRes] = await Promise.all([
            fetch('/api/summary'),
            fetch('/api/transactions')
        ]);
        
        const summaryData = await summaryRes.json();
        const transactionsData = await transactionsRes.json();
        
        if (summaryData.success && transactionsData.success) {
            const summary = summaryData.summary;
            const transactions = transactionsData.transactions;
            
            // Calculate financial health score (0-100)
            const healthScore = calculateHealthScore(summary);
            document.getElementById('healthScore').textContent = healthScore;
            
            // Calculate money runway (days until broke)
            const runway = calculateMoneyRunway(summary, transactions);
            document.getElementById('runwayDays').textContent = runway;
            
            // Week spending
            const weekSpending = calculateWeekSpending(transactions);
            document.getElementById('weekSpending').textContent = `$${weekSpending.toFixed(2)}`;
            
            // Budget status
            const budgetStatus = calculateBudgetStatus(summary);
            document.getElementById('budgetStatus').textContent = budgetStatus;
            
            // Generate alerts
            generateAlerts(summary, transactions, runway);
        }
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showErrorState('dashboard');
    }
}

function calculateHealthScore(summary) {
    let score = 50; // Base score
    
    // Positive balance
    if (summary.totalBalance > 0) score += 10;
    if (summary.totalBalance > 500) score += 10;
    if (summary.totalBalance > 1000) score += 10;
    
    // Positive net income
    if (summary.netIncome > 0) score += 15;
    if (summary.netIncome > 200) score += 5;
    
    // Has goals
    if (summary.goals && summary.goals.length > 0) score += 5;
    
    return Math.min(100, Math.max(0, score));
}

function calculateMoneyRunway(summary, transactions) {
    const balance = summary.totalBalance;
    const dailyExpenses = summary.monthlyExpenses / 30;
    
    if (dailyExpenses === 0) return '∞';
    if (balance <= 0) return 0;
    
    return Math.floor(balance / dailyExpenses);
}

function calculateWeekSpending(transactions) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= weekAgo)
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
}

function calculateBudgetStatus(summary) {
    const netIncome = summary.netIncome;
    
    if (netIncome > 100) return 'Excellent 🎉';
    if (netIncome > 0) return 'Good ✅';
    if (netIncome > -100) return 'Careful ⚠️';
    return 'Danger 🚨';
}

function generateAlerts(summary, transactions, runway) {
    const alertsList = document.getElementById('alertsList');
    const alerts = [];
    
    // Low balance alert
    if (summary.totalBalance < 50) {
        alerts.push({ type: 'danger', message: '🚨 Low balance! You have less than $50 remaining.' });
    }
    
    // Money runway alert
    if (runway !== '∞' && runway < 7) {
        alerts.push({ type: 'warning', message: `⚠️ Only ${runway} days of money left at current spending rate!` });
    }
    
    // Negative net income
    if (summary.netIncome < 0) {
        alerts.push({ type: 'danger', message: `🚨 You're spending $${Math.abs(summary.netIncome).toFixed(2)} more than you earn monthly!` });
    }
    
    // High spending week
    const weekSpending = calculateWeekSpending(transactions);
    const avgWeeklyBudget = (summary.monthlyExpenses / 4);
    if (weekSpending > avgWeeklyBudget * 1.5) {
        alerts.push({ type: 'warning', message: `⚠️ You spent $${weekSpending.toFixed(2)} this week - 50% over average!` });
    }
    
    // Good news
    if (alerts.length === 0 && summary.totalBalance > 200) {
        alerts.push({ type: 'success', message: '🎉 Great job! Your finances look healthy.' });
    }
    
    if (alerts.length === 0) {
        alertsList.innerHTML = '<p class="no-alerts">All good! No alerts.</p>';
    } else {
        alertsList.innerHTML = alerts.map(alert => 
            `<div class="alert-item ${alert.type === 'success' ? 'success' : alert.type === 'warning' ? 'warning' : ''}">${alert.message}</div>`
        ).join('');
    }
}

// ===== ANALYSIS TAB =====
async function updateAnalysisTab() {
    try {
        const summaryRes = await fetch('/api/summary');
        const transactionsRes = await fetch('/api/transactions');
        
        const summaryData = await summaryRes.json();
        const transactionsData = await transactionsRes.json();
        
        if (summaryData.success && transactionsData.success) {
            const spendingByCategory = summaryData.summary.spendingByCategory;
            const transactions = transactionsData.transactions;
            
            // Update chart
            updateSpendingChart(spendingByCategory);
            
            // Update top expenses
            updateTopExpenses(transactions);
        }
    } catch (error) {
        console.error('Error updating analysis:', error);
        showErrorState('analysis');
    }
}

function updateSpendingChart(spendingByCategory) {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    if (spendingChart) {
        spendingChart.destroy();
    }
    
    const categories = Object.keys(spendingByCategory);
    const amounts = Object.values(spendingByCategory);
    
    if (categories.length === 0) {
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.fillText('No spending data yet', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    spendingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    '#10a37f',
                    '#ef4444',
                    '#f59e0b',
                    '#3b82f6',
                    '#8b5cf6',
                    '#ec4899',
                    '#14b8a6',
                    '#f97316'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        font: {
                            size: 13
                        }
                    }
                }
            }
        }
    });
}

function updateTopExpenses(transactions) {
    const topExpensesDiv = document.getElementById('topExpenses');
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, 5);
    
    if (expenses.length === 0) {
        topExpensesDiv.innerHTML = '<p class="no-data">No transactions yet</p>';
        return;
    }
    
    topExpensesDiv.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-item-info">
                <div class="expense-category">${expense.category || expense.description || 'Uncategorized'}</div>
                <div class="expense-count">${new Date(expense.date).toLocaleDateString()}</div>
            </div>
            <div class="expense-amount">$${parseFloat(expense.amount).toFixed(2)}</div>
        </div>
    `).join('');
}

// ===== PLANNING TAB =====
async function updatePlanningTab() {
    try {
        const [goalsRes, transactionsRes, summaryRes] = await Promise.all([
            fetch('/api/goals'),
            fetch('/api/transactions'),
            fetch('/api/summary')
        ]);
        
        const goalsData = await goalsRes.json();
        const transactionsData = await transactionsRes.json();
        const summaryData = await summaryRes.json();
        
        if (goalsData.success) {
            updateGoalsDisplay(goalsData.goals);
        }
        
        if (transactionsData.success) {
            // Extract loans from transactions
            const loans = transactionsData.transactions.filter(t => 
                t.isLoan || (t.category === 'education' && t.type === 'expense' && t.amount > 500)
            );
            updateLoansDisplay(loans);
        }
        
        // Load wishlist if endpoint exists
        try {
            const wishlistRes = await fetch('/api/wishlist');
            if (wishlistRes.ok) {
                const wishlistData = await wishlistRes.json();
                if (wishlistData.success) {
                    updateWishlistDisplay(wishlistData.wishlist);
                }
            } else {
                // Fallback if no wishlist endpoint
                document.getElementById('wishlistSection').innerHTML = '<p class="no-data">No wishlist items yet. Tell Kate what you want to buy!</p>';
            }
        } catch (error) {
            document.getElementById('wishlistSection').innerHTML = '<p class="no-data">No wishlist items yet. Tell Kate what you want to buy!</p>';
        }
    } catch (error) {
        console.error('Error updating planning:', error);
    }
}

function updateWishlistDisplay(wishlist) {
    const wishlistSection = document.getElementById('wishlistSection');
    
    if (!wishlist || wishlist.length === 0) {
        wishlistSection.innerHTML = '<p class="no-data">No wishlist items yet. Tell Kate what you want to buy!</p>';
        return;
    }
    
    wishlistSection.innerHTML = wishlist.map(item => {
        const priority = item.priority || 'medium';
        const priorityColors = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#6b7280'
        };
        const priorityIcons = {
            high: '🔥',
            medium: '⭐',
            low: '💡'
        };
        
        const targetDate = item.targetDate ? new Date(item.targetDate).toLocaleDateString() : 'No deadline';
        const hasPrice = item.estimatedPrice && item.estimatedPrice > 0;
        const priceDisplay = hasPrice ? `${item.currency || 'USD'} ${item.estimatedPrice}` : 'Price not set';
        
        // Check if we have progress tracking
        const current = parseFloat(item.currentAmount || 0);
        const target = parseFloat(item.estimatedPrice || 0);
        const hasProgress = current > 0 && target > 0;
        const percentage = hasProgress ? (current / target * 100) : 0;
        const remaining = hasProgress ? target - current : 0;
        const isCompleted = item.completed || (hasProgress && percentage >= 100);
        
        // Build progress section if applicable
        let progressSection = '';
        if (hasProgress) {
            progressSection = `
                <p style="font-size: 13px; color: #6b7280; margin-top: 8px;">
                    ${item.currency || 'USD'} ${current.toFixed(2)} / ${target.toFixed(2)} 
                    <span style="color: ${isCompleted ? '#10b981' : '#10a37f'}; font-weight: 500;">
                        ${isCompleted ? '• Ready to buy! 🎉' : `• ${remaining.toFixed(2)} to go`}
                    </span>
                </p>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${Math.min(100, percentage)}%; background: ${isCompleted ? '#10b981' : '#10a37f'}"></div>
                </div>
                <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">
                    ${percentage.toFixed(1)}% saved
                </p>
            `;
        }
        
        return `
            <div class="wishlist-item">
                <div class="wishlist-header">
                    <h4>${item.item} ${isCompleted ? '✅' : ''}</h4>
                    <span class="priority-badge" style="background: ${priorityColors[priority]}20; color: ${priorityColors[priority]}">
                        ${priorityIcons[priority]} ${priority.toUpperCase()}
                    </span>
                </div>
                <p class="wishlist-description">${item.description || ''}</p>
                ${progressSection}
                <div class="wishlist-details" style="margin-top: ${hasProgress ? '8px' : '0'}">
                    ${!hasProgress ? `<span class="wishlist-price">💰 ${priceDisplay}</span>` : ''}
                    <span class="wishlist-date">📅 ${targetDate}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateGoalsDisplay(goals) {
    const goalsSection = document.getElementById('goalsSection');
    
    if (goals.length === 0) {
        goalsSection.innerHTML = '<p class="no-data">No goals set yet. Ask Kate to help you set financial goals!</p>';
        return;
    }
    
    goalsSection.innerHTML = goals.map(goal => {
        const current = parseFloat(goal.currentAmount || 0);
        const target = parseFloat(goal.targetAmount || 0);
        const percentage = target > 0 ? (current / target * 100) : 0;
        const remaining = target - current;
        
        return `
            <div class="goal-item">
                <h4>${goal.name}</h4>
                <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">
                    ${goal.currency || 'USD'} ${current.toFixed(2)} / ${target.toFixed(2)} 
                    <span style="color: #10a37f; font-weight: 500;">• ${remaining.toFixed(2)} to go</span>
                </p>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${Math.min(100, percentage)}%"></div>
                </div>
                <p style="font-size: 12px; color: #6b7280; margin-top: 6px;">
                    ${percentage.toFixed(1)}% complete • Target: ${goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No deadline'}
                </p>
            </div>
        `;
    }).join('');
}

function updateLoansDisplay(loans) {
    const loansSection = document.getElementById('loansSection');
    
    if (loans.length === 0) {
        loansSection.innerHTML = '<p class="no-data">No student loans tracked yet. Tell Kate about your loans!</p>';
        return;
    }
    
    loansSection.innerHTML = loans.map(loan => {
        return `
            <div class="loan-item">
                <div class="loan-header">
                    <h4>${loan.description || 'Student Loan'}</h4>
                    <span class="loan-amount">${loan.currency || 'USD'} ${parseFloat(loan.amount).toFixed(2)}</span>
                </div>
                <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">
                    📅 Taken: ${new Date(loan.date).toLocaleDateString()}
                </p>
            </div>
        `;
    }).join('');
}

// Error handling helper
function showErrorState(tab) {
    const errorMessage = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
            <h3 style="margin-bottom: 12px; color: #ef4444;">Unable to load data</h3>
            <p style="color: #6b7280; margin-bottom: 20px;">
                There was a problem fetching your financial data. Please check your connection and try again.
            </p>
            <button onclick="location.reload()" style="
                background: #10a37f;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
            ">Reload Page</button>
        </div>
    `;
    
    if (tab === 'dashboard') {
        document.getElementById('alertsList').innerHTML = errorMessage;
    } else if (tab === 'analysis') {
        document.querySelector('#analysisTab').innerHTML = errorMessage;
    } else if (tab === 'planning') {
        document.querySelector('#planningTab').innerHTML = errorMessage;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardTab();
});
