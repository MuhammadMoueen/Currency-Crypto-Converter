import { fiatCurrencyCodes, fiatCurrencies } from "./codes.js";
import { cryptoCurrencyCodes, getCryptoId, getCryptoLogoUrl, isCryptoCurrency } from "./crypto.js";
import { fetchFiatRate, fetchCryptoPrice } from "./api.js";
import {
    getDomElements,
    populateSelectOptions,
    setLoading,
    setLastUpdated,
    setModeActive,
    setSelectIcon,
    showResult,
    showToast,
    formatFiat,
    formatCrypto,
} from "./ui.js";

const modes = {
    currency: "currency",
    crypto: "crypto",
};

const state = {
    activeMode: modes.currency,
};

function buildOptionLists() {
    if (state.activeMode === modes.currency) {
        return {
            fromOptions: fiatCurrencyCodes,
            toOptions: fiatCurrencyCodes,
        };
    }

    return {
        fromOptions: [...cryptoCurrencyCodes, ...fiatCurrencyCodes],
        toOptions: [...cryptoCurrencyCodes, ...fiatCurrencyCodes],
    };
}

function getIconUrl(value) {
    if (!value) return "";
    if (isCryptoCurrency(value)) {
        // Use the cryptocurrency icon CDN for crypto values.
        return getCryptoLogoUrl(value);
    }
    // Use flagcdn for fiat currency flags.
    const countryCode = fiatCurrencies[value];
    return countryCode ? `https://flagcdn.com/32x24/${countryCode.toLowerCase()}.png` : "";
}

function getReadableLabel(value) {
    if (isCryptoCurrency(value)) {
        return `${value} logo`;
    }
    return `${value} flag`;
}

function initializeModeToggle(elements) {
    elements.modeCurrencyButton.addEventListener("click", () => switchMode(modes.currency));
    elements.modeCryptoButton.addEventListener("click", () => switchMode(modes.crypto));
}

function switchMode(mode) {
    if (state.activeMode === mode) return;
    state.activeMode = mode;
    renderMode();
}

function renderMode() {
    const elements = getDomElements();
    setModeActive(state.activeMode);

    const { fromOptions, toOptions } = buildOptionLists();
    populateSelectOptions(elements.fromCurrency, fromOptions);
    populateSelectOptions(elements.toCurrency, toOptions);

    elements.fromCurrency.value = "USD";
    elements.toCurrency.value = state.activeMode === modes.crypto ? "BTC" : "PKR";

    setSelectIcon(elements.fromIcon, getIconUrl(elements.fromCurrency.value), getReadableLabel(elements.fromCurrency.value));
    setSelectIcon(elements.toIcon, getIconUrl(elements.toCurrency.value), getReadableLabel(elements.toCurrency.value));
}

function refreshIcons(elements) {
    setSelectIcon(elements.fromIcon, getIconUrl(elements.fromCurrency.value), getReadableLabel(elements.fromCurrency.value));
    setSelectIcon(elements.toIcon, getIconUrl(elements.toCurrency.value), getReadableLabel(elements.toCurrency.value));
}

function setupSelectOpenDown(selectElement) {
    const maxSize = Math.min(10, selectElement.options.length || 8);

    function closeSelect() {
        selectElement.size = 1;
    }

    function openSelect() {
        selectElement.size = maxSize;
    }

    selectElement.addEventListener("mousedown", () => {
        openSelect();
    });

    selectElement.addEventListener("blur", closeSelect);
    selectElement.addEventListener("change", closeSelect);
    selectElement.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Tab") {
            closeSelect();
        }
    });
}

async function getConversionResult(from, to, amount) {
    const fromCrypto = isCryptoCurrency(from);
    const toCrypto = isCryptoCurrency(to);

    if (fromCrypto && toCrypto) {
        const fromUsd = await fetchCryptoPrice(getCryptoId(from), "usd");
        const toUsd = await fetchCryptoPrice(getCryptoId(to), "usd");
        return (amount * fromUsd) / toUsd;
    }

    if (fromCrypto && !toCrypto) {
        // Crypto -> fiat: get the crypto price in the chosen fiat currency.
        const price = await fetchCryptoPrice(getCryptoId(from), to);
        return amount * price;
    }

    if (!fromCrypto && toCrypto) {
        // Fiat -> crypto: get the target crypto price in the source fiat currency.
        const price = await fetchCryptoPrice(getCryptoId(to), from);
        return amount / price;
    }

    const rate = await fetchFiatRate(from, to);
    return amount * rate;
}

function formatConversionResult(amount, from, to, converted) {
    const fromFormatted = isCryptoCurrency(from) ? formatCrypto(amount) : formatFiat(amount);
    const toFormatted = isCryptoCurrency(to) ? formatCrypto(converted) : formatFiat(converted);
    return `${fromFormatted} ${from} = ${toFormatted} ${to}`;
}

async function handleConvert() {
    const elements = getDomElements();
    const amount = Number(elements.amountInput.value.trim());
    const from = elements.fromCurrency.value;
    const to = elements.toCurrency.value;

    if (!amount || amount <= 0) {
        showResult("Please enter a valid amount.");
        showToast("❌ Please enter a valid amount", "error");
        return;
    }

    if (from === to) {
        showResult(`${formatFiat(amount)} ${from} = ${formatFiat(amount)} ${to}`);
        showToast("✅ Conversion Successful", "success");
        setLastUpdated(new Date());
        return;
    }

    setLoading(elements.convertBtn, true);

    try {
        const converted = await getConversionResult(from, to, amount);
        showResult(formatConversionResult(amount, from, to, converted));
        showToast("✅ Conversion Successful", "success");
        setLastUpdated(new Date());
    } catch (error) {
        console.error(error);
        showResult("Unable to fetch latest rates. Please try again.");
        showToast("❌ Failed to fetch latest rates", "error");
    } finally {
        setLoading(elements.convertBtn, false);
    }
}

function attachSelectListeners(elements) {
    elements.fromCurrency.addEventListener("change", () => refreshIcons(elements));
    elements.toCurrency.addEventListener("change", () => refreshIcons(elements));
    setupSelectOpenDown(elements.fromCurrency);
    setupSelectOpenDown(elements.toCurrency);
}

function attachConvertListener(elements) {
    elements.convertBtn.addEventListener("click", handleConvert);
}

function initialize() {
    const elements = getDomElements();
    initializeModeToggle(elements);
    renderMode();
    attachSelectListeners(elements);
    attachConvertListener(elements);
    setLastUpdated(new Date());
}

initialize();