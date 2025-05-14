require('dotenv').config();

console.log('Starting PriceBot...');

// Basic setup - will expand later
const SUPPORTED_TOKENS = ['bitcoin', 'ethereum', 'solana'];

async function main() {
    console.log('PriceBot initialized');
    console.log('Supported tokens:', SUPPORTED_TOKENS.join(', '));
    
    // TODO: Implement price fetching
    console.log('Ready to track prices!');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };