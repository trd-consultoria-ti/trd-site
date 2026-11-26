import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.component').then((m) => m.HomeComponent),
    title: 'TRD Consultoria | Sistemas corporativos sob medida e sustentação crítica',
  },
  {
    path: 'privacidade',
    loadComponent: () =>
      import('./pages/privacy.component').then((m) => m.PrivacyComponent),
    title: 'Política de Privacidade e Governança LGPD | TRD Consultoria',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
