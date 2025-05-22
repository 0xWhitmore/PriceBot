require('dotenv').config();
const PriceService = require('./services/priceService');
const AlertService = require('./services/alertService');
const DataService = require('./services/dataService');

console.log('Starting PriceBot...');

const SUPPORTED_TOKENS = ['bitcoin', 'ethereum', 'solana'];
const priceService = new PriceService();
const dataService = new DataService();
const alertService = new AlertService(dataService);

async function fetchAndDisplayPrices() {
    try {
        console.log('Fetching current prices...');
        const prices = await priceService.getPrices(SUPPORTED_TOKENS);
        
        prices.forEach(async priceData => {
            if (priceData.error) {
                console.log(`❌ ${priceData.token}: Error - ${priceData.error}`);
            } else {
                console.log(`💰 ${priceData.token}: $${priceData.price}`);
                alertService.addPriceData(priceData.token, priceData.price);
                
                // Save price data to file
                await dataService.savePriceData(priceData.token, {
                    price: priceData.price,
                    timestamp: priceData.timestamp
                });
            }
        });
        
        console.log('---');
    } catch (error) {
        console.error('Error fetching prices:', error.message);
    }
}

async function main() {
    console.log('PriceBot initialized');
    console.log('Supported tokens:', SUPPORTED_TOKENS.join(', '));
    console.log('Alert threshold:', alertService.alertThreshold + '%');
    
    // Fetch prices once
    await fetchAndDisplayPrices();
    
    // Set up periodic price checking
    const interval = process.env.PRICE_CHECK_INTERVAL || 60000;
    console.log(`Setting up price monitoring every ${interval/1000} seconds`);
    
    setInterval(fetchAndDisplayPrices, interval);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main, fetchAndDisplayPrices };