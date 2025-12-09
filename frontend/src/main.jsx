import '../src/assets/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// import { worker as browserWorker } from './mocks/browser'; // Comment out MSW

async function enableMocking() {
  // Disable MSW when using real backend
  // Only enable MSW if you need to mock API calls
  const USE_MOCKS = false; // Set to true if you want to use mocks
  
  if (USE_MOCKS && import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }
  
  return Promise.resolve();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});