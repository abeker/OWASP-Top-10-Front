import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Owasp-Top-10';

  constructor(private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId) {}

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }
}
