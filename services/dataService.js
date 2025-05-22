const fs = require('fs').promises;
const path = require('path');

class DataService {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.ensureDataDir();
    }

    async ensureDataDir() {
        try {
            await fs.access(this.dataDir);
        } catch {
            await fs.mkdir(this.dataDir, { recursive: true });
            console.log('Created data directory');
        }
    }

    async savePriceData(token, priceData) {
        const filename = `${token}_prices.json`;
        const filepath = path.join(this.dataDir, filename);
        
        try {
            let existingData = [];
            try {
                const content = await fs.readFile(filepath, 'utf8');
                existingData = JSON.parse(content);
            } catch {
                // File doesn't exist yet, start with empty array
            }
            
            existingData.push(priceData);
            
            // Keep only last 1000 entries to prevent file from growing too large
            if (existingData.length > 1000) {
                existingData = existingData.slice(-1000);
            }
            
            await fs.writeFile(filepath, JSON.stringify(existingData, null, 2));
        } catch (error) {
            console.error(`Error saving price data for ${token}:`, error.message);
        }
    }

    async loadPriceData(token) {
        const filename = `${token}_prices.json`;
        const filepath = path.join(this.dataDir, filename);
        
        try {
            const content = await fs.readFile(filepath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Error loading price data for ${token}:`, error.message);
            }
            return [];
        }
    }

    async getLastPrice(token) {
        const data = await this.loadPriceData(token);
        return data.length > 0 ? data[data.length - 1] : null;
    }

    async saveAlertData(alertData) {
        const filepath = path.join(this.dataDir, 'alerts.json');
        
        try {
            let alerts = [];
            try {
                const content = await fs.readFile(filepath, 'utf8');
                alerts = JSON.parse(content);
            } catch {
                // File doesn't exist yet
            }
            
            alerts.push(alertData);
            
            // Keep only last 500 alerts
            if (alerts.length > 500) {
                alerts = alerts.slice(-500);
            }
            
            await fs.writeFile(filepath, JSON.stringify(alerts, null, 2));
        } catch (error) {
            console.error('Error saving alert data:', error.message);
        }
    }
}

module.exports = DataService;