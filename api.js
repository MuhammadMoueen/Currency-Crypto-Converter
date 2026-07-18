// Frankfurter is used for fiat-to-fiat exchange rate lookups.
const FRANKFURTER_BASE = "https://api.frankfurter.app";
// CoinGecko is used to fetch crypto prices in fiat or other crypto currencies.
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

const fallbackFiatRates = {
    USD: 1,
    PKR: 283,
    INR: 83,
    EUR: 0.92,
    GBP: 0.80,
    AED: 3.67,
    CAD: 1.36,
    AUD: 1.52,
    CNY: 7.30,
    JPY: 150,
    CHF: 0.93,
    NZD: 1.65,
    SGD: 1.35,
    HKD: 7.80,
};

function buildUrl(url, params) {
    const search = new URLSearchParams(params);
    return `${url}?${search.toString()}`;
}

export async function fetchFiatRate(from, to) {
    if (from === to) return 1;

    try {
        const url = buildUrl(`${FRANKFURTER_BASE}/latest`, {
            from,
            to,
        });
        // Fetch the latest fiat conversion rate from Frankfurter.

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Frankfurter returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.rates || typeof data.rates[to] !== "number") {
            throw new Error("Unexpected Frankfurter response");
        }

        return data.rates[to];
    } catch (error) {
        console.warn("Frankfurter API failed, using fallback fiat rates:", error.message);
        if (fallbackFiatRates[from] && fallbackFiatRates[to]) {
            return fallbackFiatRates[to] / fallbackFiatRates[from];
        }
        throw error;
    }
}

export async function fetchCryptoPrices(ids, vsCurrencies) {
    try {
        const url = buildUrl(`${COINGECKO_BASE}/simple/price`, {
            ids: ids.join(","),
            vs_currencies: vsCurrencies.join(",").toLowerCase(),
        });
        // Use CoinGecko's simple price endpoint to get crypto prices in the
        // requested fiat or crypto currencies.

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`CoinGecko returned ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("CoinGecko API failed:", error.message);
        throw error;
    }
}

export async function fetchCryptoPrice(cryptoId, fiatCurrency) {
    // Fetch a single crypto price for the selected crypto and fiat currency.
    const prices = await fetchCryptoPrices([cryptoId], [fiatCurrency]);
    const data = prices[cryptoId];
    if (!data || typeof data[fiatCurrency.toLowerCase()] !== "number") {
        throw new Error("Unexpected CoinGecko response");
    }
    return data[fiatCurrency.toLowerCase()];
}
