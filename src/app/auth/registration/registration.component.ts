import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  validateForm: FormGroup;
  isUsernameExist: boolean = false;
  isPasswordCorrect: boolean = false;
  htmlTagRegExp = '^(?!<.+?>).*$';    // stitim se od <script> tagova

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private store: Store<fromApp.AppState>) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required, Validators.minLength(8), Validators.pattern(this.htmlTagRegExp)], [this.userNameAsyncValidator]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)], [this.passwordAsyncValidator]],
      confirm: ['', [Validators.required, this.confirmValidator, Validators.pattern(this.htmlTagRegExp)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.pattern(this.htmlTagRegExp)]],
      ssn: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.htmlTagRegExp)]],
      securityQuestion: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]]
    });
  }

  ngOnInit(): void {
  }


  submitForm(value: { email: string; password: string; confirm: string; firstName: string; lastName: string; address: string; ssn: string; securityQuestion: string }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.store.dispatch(new AuthActions.SignupStart({
      username: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName,
      address: value.address,
      ssn: value.ssn,
      securityQuestion: value.securityQuestion
    }));

    this.resetForm(new MouseEvent('click'));
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userService.getUser(control.value).subscribe(response => {
        this.isUsernameExist = true;
      }, error => {
        this.isUsernameExist = false;
      });

      setTimeout(() => {
        if (this.isUsernameExist) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  passwordAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userService.checkPassword(control.value).subscribe(isCorrect => {
        if(isCorrect) {
          this.isPasswordCorrect = true;
        } else {
          this.isPasswordCorrect = false;
        }
      }, error => {
        console.log('error');
      });

    setTimeout(() => {
      if (this.isPasswordCorrect) {
        observer.next({ error: true, duplicated: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 1000);
  });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  onLogin(): void {
    this.router.navigateByUrl('auth/login');
  }

}
