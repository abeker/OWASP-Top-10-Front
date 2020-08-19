import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { Router } from '@angular/router';
import { CartService } from './../../services/cart.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('divState', [
      transition('* => *', [
        animate('0.8s', keyframes([
          style({
            transform: 'translateX(15px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateX(5px)',
            opacity: 0.5,
            offset: 0.3
          }),
          style({
            transform: 'translateX(-15px)',
            opacity: 1,
            offset: 0.8
          }),
          style({
            transform: 'translateX(-5px)',
            opacity: 1,
            offset: 1
          })
        ]))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  isCollapsed = false;
  private user: any;
  public isAdmin: boolean;
  public isAgent: boolean;
  public isSimpleUser: boolean;
  public isCartChanged: boolean;
  state = 'normal';

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.setupUser();
    this.setupUserRole();
    this.cartService.cartChanged.subscribe(isChanged => {
      this.state = this.state === 'normal' ? 'highlighted' : 'normal';
      this.isCartChanged = isChanged;
    });
  }

  private setupUser(): void {
    this.user = JSON.parse(localStorage.getItem('userData'));
  }

  private setupUserRole(): void {
    if(this.user.userRole === 'ADMIN'){
        this.isAdmin = true;
        this.isAgent = false;
        this.isSimpleUser = false;
    }else if(this.user.userRole === 'AGENT'){
      this.isAdmin = false;
      this.isAgent = true;
      this.isSimpleUser = false;
    }else if(this.user.userRole === 'SIMPLE_USER'){
      this.isAdmin = false;
      this.isAgent = false;
      this.isSimpleUser = true;
    }
  }

  agentRegister(): void {
    this.router.navigateByUrl('dashboard/agent-registration');
  }

  registrationRequests(): void {
    this.router.navigateByUrl('dashboard/registration-requests');
  }

  showAds(): void {
    this.router.navigateByUrl('dashboard/ads');
  }

  showCart(): void {
    this.router.navigateByUrl('dashboard/cart');
  }

  logout(): void {
    this.store.dispatch(new AuthActions.Logout());
  }
}
