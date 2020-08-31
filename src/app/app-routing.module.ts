import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdCardsComponent } from './pages/ad-cards/ad-cards.component';
import { AgentAdsComponent } from './pages/agent-ads/agent-ads.component';
import { AgentRegistrationComponent } from './pages/agent-registration/agent-registration.component';
import { AgentRequestsComponent } from './pages/agent-requests/agent-requests.component';
import { CartComponent } from './pages/cart/cart.component';
import { CreateAdComponent } from './pages/create-ad/create-ad.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminInfoComponent } from './pages/info/admin-info/admin-info.component';
import { AgentInfoComponent } from './pages/info/agent-info/agent-info.component';
import { UserInfoComponent } from './pages/info/user-info/user-info.component';
import { LimitRedirectComponent } from './pages/limit-redirect/limit-redirect.component';
import { RegistrationRequestsComponent } from './pages/registration-requests/registration-requests.component';
import { UserRequestsComponent } from './pages/user-requests/user-requests.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/registration', component: RegistrationComponent },
  { path: 'auth/limit-redirect', component: LimitRedirectComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: 'agent-registration', component: AgentRegistrationComponent },
      { path: 'registration-requests', component: RegistrationRequestsComponent },
      { path: 'ads', component: AdCardsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'create-ad', component: CreateAdComponent },
      { path: 'agent-ads', component: AgentAdsComponent },
      { path: 'agent-requests/:requestStatus', component: AgentRequestsComponent },
      { path: 'user-requests/:requestStatus', component: UserRequestsComponent },
      { path: 'admin-info', component: AdminInfoComponent },
      { path: 'agent-info', component: AgentInfoComponent },
      { path: 'user-info', component: UserInfoComponent }
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
