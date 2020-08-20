import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  htmlTagRegExp = '^(?!<.+?>).*$';    // stitim se od <script> tagova

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.Logout());
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.email, Validators.minLength(8)]],
      password: [null, [Validators.required, , Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)]]
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.store.dispatch(new AuthActions.LoginStart({
      username: this.validateForm.value.username,
      password: this.validateForm.value.password
    }));
  }

  onRegistration() {
    this.router.navigateByUrl('auth/registration');
  }

}
