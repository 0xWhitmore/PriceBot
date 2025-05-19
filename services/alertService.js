class AlertService {
    constructor() {
        this.alerts = new Map();
        this.priceHistory = new Map();
        this.alertThreshold = parseFloat(process.env.ALERT_THRESHOLD) || 5.0;
    }

    addPriceData(token, price) {
        if (!this.priceHistory.has(token)) {
            this.priceHistory.set(token, []);
        }
        
        const history = this.priceHistory.get(token);
        history.push({
            price: price,
            timestamp: Date.now()
        });
        
        // Keep only last 10 prices for comparison
        if (history.length > 10) {
            history.shift();
        }
        
        this.checkForAlert(token, price);
    }

    checkForAlert(token, currentPrice) {
        const history = this.priceHistory.get(token);
        if (history.length < 2) return;
        
        const previousPrice = history[history.length - 2].price;
        const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
        
        if (Math.abs(changePercent) >= this.alertThreshold) {
            this.triggerAlert(token, currentPrice, previousPrice, changePercent);
        }
    }

    triggerAlert(token, currentPrice, previousPrice, changePercent) {
        const direction = changePercent > 0 ? '📈' : '📉';
        const alertMsg = `${direction} PRICE ALERT: ${token.toUpperCase()} moved ${changePercent.toFixed(2)}%`;
        const priceMsg = `Previous: $${previousPrice} → Current: $${currentPrice}`;
        
        console.log('🚨 ' + alertMsg);
        console.log('   ' + priceMsg);
        
        // Store alert for potential future use
        const alertKey = `${token}_${Date.now()}`;
        this.alerts.set(alertKey, {
            token,
            currentPrice,
            previousPrice,
            changePercent,
            timestamp: new Date().toISOString()
        });
    }

    getRecentAlerts(token = null) {
        if (token) {
            return Array.from(this.alerts.entries())
                .filter(([key, alert]) => alert.token === token)
                .map(([key, alert]) => alert);
        }
        return Array.from(this.alerts.values());
    }

    setAlertThreshold(threshold) {
        this.alertThreshold = threshold;
        console.log(`Alert threshold updated to ${threshold}%`);
    }
}

module.exports = AlertService;