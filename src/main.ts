import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.isSecureContext
    ) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
          // Falha silenciosa em ambientes sem suporte a Service Worker
        });
      };
      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register, { once: true });
      }
    }
  })
  .catch((err) => console.error(err));
