import { Routes } from '@angular/router';
import { RequestsComponent } from './app/requests/requests/requests.component';
import { DocumentVerificationComponent } from './app/documents/document-verification/document-verification.component';
import { LoginComponent } from './app/auth/login/login.component';
import { AuthGuard } from './app/guards/authguard/authguard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/layout/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  { path: 'requests', component: RequestsComponent },

  { path: 'document-verification', component: DocumentVerificationComponent },
];
