import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AgentRegistrationComponent } from './pages/agent-registration/agent-registration.component';
import { RegistrationRequestsComponent } from './pages/registration-requests/registration-requests.component';
import { AdCardsComponent } from './pages/ad-cards/ad-cards.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/registration', component: RegistrationComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'agent-registration', component: AgentRegistrationComponent },
      { path: 'registration-requests', component: RegistrationRequestsComponent },
      { path: 'ads', component: AdCardsComponent },
      { path: 'cart', component: CartComponent },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
