import '../src/assets/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from "./router/AppRouter.jsx";
import { worker as browserWorker } from './mocks/browser';

async function enableMocking() {
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return browserWorker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AppRouter />
    </StrictMode>
  );
})

