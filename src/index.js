import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from "@vercel/analytics/react"
import './index.css';
import "@fontsource/poppins/100.css"; // Thin
import "@fontsource/poppins/200.css"; // ExtraLight
import "@fontsource/poppins/300.css"; // Light
import "@fontsource/poppins/400.css"; // Regular
// import "@fontsource/poppins/500.css"; // Medium
// import "@fontsource/poppins/600.css"; // SemiBold
// import "@fontsource/poppins/700.css"; // Bold
// import "@fontsource/poppins/800.css"; // ExtraBold
// import "@fontsource/poppins/900.css"; // Black

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
