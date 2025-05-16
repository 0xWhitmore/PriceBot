const axios = require('axios');

class PriceService {
    constructor() {
        this.apiKey = process.env.COINGECKO_API_KEY;
        this.baseUrl = 'https://api.coingecko.com/api/v3';
    }

    async getPrice(tokenId) {
        try {
            const url = `${this.baseUrl}/simple/price?ids=${tokenId}&vs_currencies=usd`;
            const headers = this.apiKey ? { 'x-cg-demo-api-key': this.apiKey } : {};
            
            console.log(`Fetching price for ${tokenId}...`);
            const response = await axios.get(url, { headers });
            
            if (response.data[tokenId]) {
                return {
                    token: tokenId,
                    price: response.data[tokenId].usd,
                    timestamp: new Date().toISOString()
                };
            }
            
            throw new Error(`No price data found for ${tokenId}`);
        } catch (error) {
            console.error(`Error fetching price for ${tokenId}:`, error.message);
            throw error;
        }
    }

    async getPrices(tokenIds) {
        const promises = tokenIds.map(tokenId => this.getPrice(tokenId));
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return {
                    token: tokenIds[index],
                    error: result.reason.message,
                    timestamp: new Date().toISOString()
                };
            }
        });
    }
}

module.exports = PriceService;