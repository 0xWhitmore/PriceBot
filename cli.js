#!/usr/bin/env node

require('dotenv').config();
const PriceService = require('./services/priceService');
const DataService = require('./services/dataService');

const priceService = new PriceService();
const dataService = new DataService();

const SUPPORTED_TOKENS = ['bitcoin', 'ethereum', 'solana'];

async function showHelp() {
    console.log(`
PriceBot CLI - Cryptocurrency Price Tracker

Usage:
  node cli.js <command> [options]

Commands:
  price [token]     Get current price for a token (or all supported tokens)
  history <token>   Show price history for a token  
  alerts           Show recent price alerts
  help             Show this help message

Supported tokens: ${SUPPORTED_TOKENS.join(', ')}

Examples:
  node cli.js price bitcoin
  node cli.js price
  node cli.js history ethereum
  node cli.js alerts
`);
}

async function getCurrentPrice(token = null) {
    try {
        if (token) {
            if (!SUPPORTED_TOKENS.includes(token)) {
                console.log(`❌ Unsupported token: ${token}`);
                console.log(`Supported tokens: ${SUPPORTED_TOKENS.join(', ')}`);
                return;
            }
            
            console.log(`Fetching current price for ${token}...`);
            const priceData = await priceService.getPrice(token);
            console.log(`💰 ${priceData.token}: $${priceData.price}`);
        } else {
            console.log('Fetching current prices for all tokens...');
            const prices = await priceService.getPrices(SUPPORTED_TOKENS);
            
            prices.forEach(priceData => {
                if (priceData.error) {
                    console.log(`❌ ${priceData.token}: Error - ${priceData.error}`);
                } else {
                    console.log(`💰 ${priceData.token}: $${priceData.price}`);
                }
            });
        }
    } catch (error) {
        console.error('Error fetching price:', error.message);
    }
}

async function showHistory(token) {
    if (!token) {
        console.log('❌ Please specify a token for price history');
        console.log(`Supported tokens: ${SUPPORTED_TOKENS.join(', ')}`);
        return;
    }
    
    if (!SUPPORTED_TOKENS.includes(token)) {
        console.log(`❌ Unsupported token: ${token}`);
        console.log(`Supported tokens: ${SUPPORTED_TOKENS.join(', ')}`);
        return;
    }
    
    try {
        const history = await dataService.loadPriceData(token);
        
        if (history.length === 0) {
            console.log(`📊 No price history found for ${token}`);
            console.log('Run the main bot to start collecting price data');
            return;
        }
        
        console.log(`📊 Price history for ${token} (last ${Math.min(history.length, 10)} entries):`);
        const recentHistory = history.slice(-10);
        
        recentHistory.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleString();
            console.log(`   ${date}: $${entry.price}`);
        });
        
        console.log(`\nTotal entries: ${history.length}`);
        
    } catch (error) {
        console.error('Error loading price history:', error.message);
    }
}

async function showAlerts() {
    try {
        const fs = require('fs').promises;
        const path = require('path');
        const alertsPath = path.join(__dirname, 'data', 'alerts.json');
        
        try {
            const content = await fs.readFile(alertsPath, 'utf8');
            const alerts = JSON.parse(content);
            
            if (alerts.length === 0) {
                console.log('🔔 No alerts found');
                return;
            }
            
            console.log(`🔔 Recent alerts (last ${Math.min(alerts.length, 10)}):`);
            const recentAlerts = alerts.slice(-10);
            
            recentAlerts.forEach(alert => {
                const date = new Date(alert.timestamp).toLocaleString();
                const direction = alert.changePercent > 0 ? '📈' : '📉';
                console.log(`   ${date}: ${direction} ${alert.token} ${alert.changePercent.toFixed(2)}% ($${alert.previousPrice} → $${alert.currentPrice})`);
            });
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('🔔 No alerts found');
                console.log('Run the main bot to start monitoring for price alerts');
            } else {
                throw error;
            }
        }
        
    } catch (error) {
        console.error('Error loading alerts:', error.message);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command || command === 'help') {
        await showHelp();
        return;
    }
    
    switch (command) {
        case 'price':
            await getCurrentPrice(args[1]);
            break;
        case 'history':
            await showHistory(args[1]);
            break;
        case 'alerts':
            await showAlerts();
            break;
        default:
            console.log(`❌ Unknown command: ${command}`);
            console.log('Use "node cli.js help" for available commands');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, getCurrentPrice, showHistory, showAlerts };