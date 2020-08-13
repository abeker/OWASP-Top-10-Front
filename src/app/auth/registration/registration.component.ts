import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  validateForm: FormGroup;
  isUsernameExist: boolean = false;
  htmlTagRegExp = '^(?!<.+?>).*$';    // izbegavanje <script> tagova

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required, Validators.minLength(8), Validators.pattern(this.htmlTagRegExp)], [this.userNameAsyncValidator]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)]],
      confirm: ['', [Validators.required, this.confirmValidator, Validators.pattern(this.htmlTagRegExp)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.pattern(this.htmlTagRegExp)]],
      ssn: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.htmlTagRegExp)]],
    });
  }

  ngOnInit(): void {
  }


  submitForm(value: { userName: string; email: string; password: string; confirm: string; }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
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
