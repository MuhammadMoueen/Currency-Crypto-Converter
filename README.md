# Currency & Crypto Converter 

A polished currency and cryptocurrency converter built with plain HTML, CSS, and JavaScript.

## Project Overview

This app converts between fiat currencies and cryptocurrencies in a sleek UI. It uses live rate APIs and fallback logic so it still works when network requests fail.

## Key Features

- Toggle between fiat currency mode and cryptocurrency mode
- Convert between fiat currencies like USD, PKR, EUR, GBP, INR, JPY, and more
- Convert between cryptocurrencies and fiat currencies
- Convert crypto-to-crypto values by comparing prices through USD
- Dynamic flag icons for fiat currencies and logo icons for crypto
- Live API integration with fallback rates for reliability
- User-friendly conversion results with last updated timestamp

## How It Works

- api.js
  - Fetches fiat exchange rates from the Frankfurter API
  - Fetches crypto prices from the CoinGecko API
  - Falls back to built-in fiat rates when the API is unavailable

- crypto.js
  - Maps crypto symbols to CoinGecko IDs
  - Loads crypto icons from a public CDN

- script.js
  - Manages app state and mode switching
  - Populates currency and crypto dropdowns
  - Handles conversion logic and result formatting

- ui.js
  - Updates DOM elements
  - Shows loading states and toast notifications
  - Formats numbers for fiat and crypto output

## Project Files

- index.html — main app structure
- style.css — application styling and layout
- script.js — converter logic and UI orchestration
- api.js — external API calls and fallback logic
- crypto.js — crypto metadata and icon helper
- codes.js — fiat currency code and flag mappings
- ui.js — DOM helper utilities and formatting

## How to Use

1. Open index.html in your browser.
2. Enter the amount to convert.
3. Choose the source currency or crypto.
4. Choose the target currency or crypto.
5. Click Convert.

## Why This Project is Useful

This repository demonstrates vanilla JavaScript architecture, API integration, error handling, and a polished UI without frameworks.
