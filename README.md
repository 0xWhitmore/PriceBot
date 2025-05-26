# PriceBot

A cryptocurrency price tracking bot that monitors token prices, sends alerts, and stores historical data.

## Features

- 🚀 Real-time price monitoring for Bitcoin, Ethereum, and Solana
- 📈 Configurable price change alerts 
- 💾 Persistent price history storage
- 📊 CLI interface for data analysis
- 🔧 Environment-based configuration

## Installation

```bash
npm install
```

## Usage

### Run the Bot
Start continuous price monitoring:
```bash
npm start
```

### CLI Commands
Get current prices:
```bash
npm run price [token]      # Get price for specific token
npm run price              # Get all prices
```

View price history:
```bash
npm run history <token>    # Show recent price history
```

Check recent alerts:
```bash
npm run alerts             # Show recent price alerts
```

Direct CLI usage:
```bash
node cli.js help           # Show all commands
node cli.js price bitcoin  # Get Bitcoin price
node cli.js history ethereum
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
# API Configuration  
COINGECKO_API_KEY=your_api_key_here

# Monitoring Settings
PRICE_CHECK_INTERVAL=30000    # Check interval in milliseconds (default: 60000)
ALERT_THRESHOLD=5             # Price change % to trigger alerts (default: 5)
```

## Supported Cryptocurrencies

- Bitcoin (bitcoin)
- Ethereum (ethereum) 
- Solana (solana)

## Data Storage

- Price history: `data/[token]_prices.json`
- Alerts: `data/alerts.json`
- Data files are automatically created and excluded from git