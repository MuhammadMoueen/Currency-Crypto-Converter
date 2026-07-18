export function getDomElements() {
    return {
        modeCurrencyButton: document.querySelector("[data-mode='currency']"),
        modeCryptoButton: document.querySelector("[data-mode='crypto']"),
        amountInput: document.querySelector("#amount"),
        fromCurrency: document.querySelector("#fromCurrency"),
        toCurrency: document.querySelector("#toCurrency"),
        fromIcon: document.querySelector("#fromFlag"),
        toIcon: document.querySelector("#toFlag"),
        convertBtn: document.querySelector("#convertBtn"),
        resultText: document.querySelector("#resultText"),
        lastUpdatedText: document.querySelector("#lastUpdated"),
    };
}

export function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

export function clearSelect(selectElement) {
    selectElement.innerHTML = "";
}

export function populateSelectOptions(selectElement, values) {
    clearSelect(selectElement);
    values.forEach((value) => {
        selectElement.appendChild(createOption(value, value));
    });
}

export function setModeActive(mode) {
    const currencyButton = document.querySelector("[data-mode='currency']");
    const cryptoButton = document.querySelector("[data-mode='crypto']");

    currencyButton.classList.toggle("active", mode === "currency");
    cryptoButton.classList.toggle("active", mode === "crypto");
}

export function setSelectIcon(iconElement, iconUrl, label) {
    if (!iconUrl) {
        iconElement.style.display = "none";
        iconElement.alt = "";
        iconElement.title = "";
        return;
    }

    iconElement.alt = label;
    iconElement.title = label;
    iconElement.style.display = "none";
    iconElement.src = iconUrl;
    iconElement.onload = () => {
        iconElement.style.display = "inline-block";
    };
    iconElement.onerror = () => {
        iconElement.style.display = "none";
    };
}

export function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add("is-loading");
        button.innerHTML = '<span class="spinner"></span><span>Converting…</span>';
    } else {
        button.classList.remove("is-loading");
        button.innerHTML = "Convert";
    }
}

export function showToast(message, type = "success") {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = `toast ${type}`;
        document.body.appendChild(toast);
    } else {
        toast.className = `toast ${type}`;
    }

    toast.textContent = message;
    toast.style.display = "inline-block";
    requestAnimationFrame(() => toast.classList.add("show"));

    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.classList.remove("show");
        requestAnimationFrame(() => {
            toast.style.display = "none";
        });
    }, type === "error" ? 2200 : 2000);
}

export function showResult(text) {
    const resultText = document.querySelector("#resultText");
    resultText.textContent = text;
    const resultBox = document.querySelector(".result");
    resultBox.classList.remove("is-pop");
    void resultBox.offsetWidth;
    resultBox.classList.add("is-pop");
}

export function setLastUpdated(date) {
    const lastUpdatedText = document.querySelector("#lastUpdated");
    const timeOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const formatted = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
    lastUpdatedText.textContent = `Last Updated: ${formatted}`;
}

export function formatFiat(value) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(value);
}

export function formatCrypto(value) {
    if (value === 0) return "0.000000";
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
    }).format(value);
}
