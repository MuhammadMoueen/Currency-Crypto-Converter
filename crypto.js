export const cryptoCurrencies = [
    { symbol: "BTC", id: "bitcoin", name: "Bitcoin" },
    { symbol: "ETH", id: "ethereum", name: "Ethereum" },
    { symbol: "BNB", id: "binancecoin", name: "BNB" },
    { symbol: "USDT", id: "tether", name: "Tether" },
    { symbol: "USDC", id: "usd-coin", name: "USDC" },
    { symbol: "SOL", id: "solana", name: "Solana" },
    { symbol: "XRP", id: "ripple", name: "XRP" },
    { symbol: "DOGE", id: "dogecoin", name: "Dogecoin" },
    { symbol: "TRX", id: "tron", name: "TRON" },
    { symbol: "TON", id: "toncoin", name: "TON" },
    { symbol: "ADA", id: "cardano", name: "Cardano" },
    { symbol: "AVAX", id: "avalanche-2", name: "Avalanche" },
    { symbol: "DOT", id: "polkadot", name: "Polkadot" },
    { symbol: "LINK", id: "chainlink", name: "Chainlink" },
    { symbol: "LTC", id: "litecoin", name: "Litecoin" },
    { symbol: "BCH", id: "bitcoin-cash", name: "Bitcoin Cash" },
    { symbol: "ARB", id: "arbitrum", name: "Arbitrum" },
    { symbol: "OP", id: "optimism", name: "Optimism" },
    { symbol: "ATOM", id: "cosmos", name: "Cosmos" },
    { symbol: "SUI", id: "sui", name: "Sui" },
    { symbol: "PEPE", id: "pepe", name: "Pepe" },
    { symbol: "SHIB", id: "shiba-inu", name: "Shiba Inu" },
];

export const cryptoCurrencyCodes = cryptoCurrencies.map((crypto) => crypto.symbol);
export const cryptoMap = Object.fromEntries(cryptoCurrencies.map((crypto) => [crypto.symbol, crypto]));

export function isCryptoCurrency(code) {
    return !!cryptoMap[code];
}

export function getCryptoId(symbol) {
    return cryptoMap[symbol]?.id || null;
}

export function getCryptoLogoUrl(symbol) {
    // Use a public CDN for cryptocurrency icons because CoinCap's direct
    // image endpoint can return 403 Forbidden when loaded from the browser.
    return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`;
}
