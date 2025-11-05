# Real-Time Order Book Visualizer

LIVE LINK: https://real-time-orderbook.vercel.app/

A professional, responsive web application that streams and visualizes real-time cryptocurrency order book and trade data from the Binance public WebSocket API.  
Built with Next.js, React, and Tailwind CSS.

---

## Features

- **Live order book**: Continuously updates bids, asks, spread, and cumulative totals from Binance.
- **Recent trades**: Shows the latest 50 trades, color-coded (green for buys, red for sells) with animated highlighting for new trades.
- **Responsive design**: Fully works on desktop, tablets, and mobile browsers.
- **Professional UI**: Clean, card-based layout; scrollable tables; visually grouped sections.
- **Horizontal and vertical scroll**: Ensures all columns are accessible regardless of screen size.

---

## Installation

Clone the repository and install dependencies:
```

git clone https://github.com/navnihalsatpute/real-time-orderbook.git
cd real-time-orderbook
npm install

```

To run the development server:
```

npm run dev

```

## Deployment

The project is designed for **instant deploy on Vercel** 

- Any push to the GitHub repository will trigger an auto deploy if connected.
- Public site link and preview deployments available after every commit.

---

## Design Decisions & Trade-offs

- **WebSocket/State**: I used a custom React hook for WebSocket handling and state aggregation. Rather than Zustand or Redux, I used local state because only this hook requires live state, and React’s built-in hooks offer simpler and more efficient updates for this use-case.
- **UI Library**: Instead of heavy UI libraries, Tailwind CSS was chosen for speed, customizability, and cleaner CSS logic for responsive layouts.
- **Responsiveness**: I used `flex-col md:flex-row` containers and individual `overflow-x-auto` for each table to handle overflow and ensure no data is ever hidden on any device.
- **Performance**: The order book tables and recent trades are limited to the 20 and 50 latest entries respectively to minimize DOM update cost, while still capturing the full liveliness of the market.
- **Accessibility/Style**: Fonts, contrast, and card spacing closely follow modern financial dashboard norms for readability and quick data comparison.

---
