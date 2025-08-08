# BullDash

BullDash is a personal portfolio manager that tracks your stock and cryptocurrency holdings. It provides a quick overview of the losses or gains in your portfolio, current and historical prices of your holdings, as well as the trending stocks, coins and news.

![portfolio view in the app](./readme/bulldash-portfolio1)
![portfolio view in the app](./readme/bulldash-portfolio2)
![trending coins and stocks view in the app](./readme/bulldash-trends)
![top stock and crypto news view in the app](./readme/bulldash-news)

## Running the app

The following free APIs are sourced to provide the crypto and stock quotes, historical data, trending and news. You will need to obtain their free API keys using the links below to run the app.

1. [CoinGecko](https://www.coingecko.com/en/api)
2. [FinnHub](https://finnhub.io)
3. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

## Planning Process

### Tech Stack

- React
- Other libraries/frameworks: Tailwind CSS, ShadCN, Tanstack Query

### Features

- Portfolio Tracking for Cryptocurrency and Stocks
  - At-a-glance view of portfolio value and gains
  - Historical charting of your holdings
- Market Trends
  - Top trending Cryptocurrency in the last 24h
  - Top gainers, losers and most actively traded stocks (daily)
- News
  - Cryptocurrency-related news
  - Top news affecting the stock market

### Future Updates (maybe)

- Watchlist to track stocks and cryptocurrency of interest
- Dashboard of current market indices
- Integration with AI agent as a helper to understand the market

### Attributions

- ShadCN resources
  - Watchlist component: https://v0.dev/t/T2SokMgzjjj
  - Loading spinner:https://www.shadcn.io/components/interactive/spinner

## Design and Implementation

For the user interface, I decided to use a minimalistic design concept and had therefore tapped on the ShadCN UI, which is a free component library that fits in nicely with the look and feel.

Since this app will interface with several APIs to pull the relevant market data for both cryptocurrency and stock, I separated the React components to handle the stocks and crypto data and display accordingly. This will avoid excessive manipulation of the data from the API in order to fit into the components, and allow me to customise where needed. TanStack Query is used to facilitate the data fetching with multiple APIs and overall state management.

![React component tree for this app](./readme/component_tree.jpg)

Airtable is used as a simplistic and hassle-free database for the app to track holdings (although alternatives will need to be considered in future update in view of security and confidentiality). The tables and fields are tabulated as follows:

1. CoinsPortfolioDB

- idTicker (string)
- symbol (string)
- name (string)
- quantity (name)
- purchase_price (number)

2. StocksPortfolioDB

- idTicker (string)
- symbol (string)
- name (string)
- quantity (name)
- purchase_price (number)
