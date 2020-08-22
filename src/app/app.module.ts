import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularSplitModule } from 'angular-split';
import { NgZorroAntdModule, NzFormModule, NzIconModule } from 'ng-zorro-antd';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { environment } from './../environments/environment';
import { AdEffects } from './ad-store/ad.effects';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AuthEffects } from './auth/store/auth.effects';
import { CartEffects } from './cart-store/cart.effects';
import { AdCardsComponent } from './pages/ad-cards/ad-cards.component';
import { AgentAdsComponent } from './pages/agent-ads/agent-ads.component';
import { AgentRegistrationComponent } from './pages/agent-registration/agent-registration.component';
import { AgentRequestsComponent } from './pages/agent-requests/agent-requests.component';
import { CartComponent } from './pages/cart/cart.component';
import { CreateAdComponent } from './pages/create-ad/create-ad.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistrationRequestsComponent } from './pages/registration-requests/registration-requests.component';
import { UserRequestsComponent } from './pages/user-requests/user-requests.component';
import * as fromApp from './store/app.reducer';

registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    AgentRegistrationComponent,
    RegistrationRequestsComponent,
    AdCardsComponent,
    CartComponent,
    CreateAdComponent,
    AgentRequestsComponent,
    UserRequestsComponent,
    AgentAdsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NzFormModule,
    AppRoutingModule,
    NzIconModule,
    AngularSplitModule.forRoot(),
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([ AuthEffects, CartEffects, AdEffects ])
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
