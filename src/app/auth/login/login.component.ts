import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../auth/store/auth.actions';

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
              private authService: AuthService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
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

    console.log(this.validateForm.value.username + ' : ' + this.validateForm.value.password);
    this.store.dispatch(new AuthActions.LoginStart({
      username: this.validateForm.value.username,
      password: this.validateForm.value.password
    }));

    // this.authService.login({
    //   username: this.validateForm.value.username,
    //   password: this.validateForm.value.password
    // }).subscribe(user => {
    //    alert('ok')
    // }, error => {
    //   console.log(error);
    //   this.message.error(error.error);
    // })
  }

  onRegistration() {
    this.router.navigateByUrl('auth/registration');
  }

}
