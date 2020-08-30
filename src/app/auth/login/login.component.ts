import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromApp from '../../store/app.reducer';
import 'clientjs';
import { UserService } from 'src/app/services/user.service';
import { BrowserFingerprint } from './../../interfaces/browserFingerprint.model';
declare let ClientJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  htmlTagRegExp = '^(?!<.+?>).*$';    // stitim se od <script> tagova
  isSQLIAttackEnabled = false;
  loadingSQLI = false;
  isVisible = false;
  isConfirmLoading = false;
  securityQuestionVisible = false;
  securityQuestion?: string;
  username: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private message: NzMessageService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.Logout());
    let browserFingerprint = this.getBrowserFingerprint();
    this.userService.checkAttempts(browserFingerprint).subscribe(canLogin => {
      if(!canLogin) {
        this.message.warning('You have 5 login failed logins');
        this.router.navigate(['/auth/limit-redirect']);
      }
    });

    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.email, Validators.minLength(8)]],
      password: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)]]
    });
  }

  getBrowserFingerprint(): BrowserFingerprint {
    var client = new ClientJS();    // browser fingerprint
    return  {
      cpu: client.getCPU(),
      os: client.getOS(),
      osVersion: client.getOSVersion(),
      browserName: client.getBrowser(),
      browserVersion: client.getBrowserVersion(),
      fingerprint: client.getFingerprint(),
      language: client.getLanguage(),
      plugins: client.getPlugins(),
      screenPrint: client.getScreenPrint(),
      timeZone: client.getTimeZone()
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.store.dispatch(new AuthActions.LoginStart({
      username: this.validateForm.value.username,
      password: this.validateForm.value.password,
      isSQLI: this.isSQLIAttackEnabled,
      browserFingerprint: this.getBrowserFingerprint()
    }));
  }

  onRegistration() {
    this.router.navigateByUrl('auth/registration');
  }

  clickSwitch(): void {
    if (!this.loadingSQLI) {
      this.loadingSQLI = true;
      setTimeout(() => {
        this.isSQLIAttackEnabled = !this.isSQLIAttackEnabled;
        this.loadingSQLI = false;
        this.checkSQLI();
      }, 500);
    }
  }

  checkSQLI(): void {
    if(this.isSQLIAttackEnabled) {
      this.message.info('SQL Injection Attack is enabled.');
      this.validateForm = this.fb.group({
        username: [null, [Validators.required]],
        password: [null, [Validators.required]]
      });
    } else {
      this.message.info('SQL Injection Attack is disabled.');
      this.validateForm = this.fb.group({
        username: [null, [Validators.required, Validators.email, Validators.minLength(8)]],
        password: [null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)]]
      });
    }
  }

  forgotPassword(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.userService.changePassword({
        username: this.username,
        securityQuestion : this.securityQuestion
      }).subscribe(isChanged => {
        if(isChanged) {
          this.message.success('New Password sent to your mail account (' + this.username + ')');
        } else {
          this.message.warning('Input data is not valid.');
        }
      })
    }, 500);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
