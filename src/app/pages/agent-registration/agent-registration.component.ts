import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngrx/store';
import { Observable, Observer } from 'rxjs';
import { AgentService } from './../../services/agent.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['./agent-registration.component.css']
})
export class AgentRegistrationComponent implements OnInit {

  validateForm: FormGroup;
  isUsernameExist: boolean = false;
  isPasswordCorrect: boolean = false;
  htmlTagRegExp = '^(?!<.+?>).*$';    // stitim se od <script> tagova

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private agentService: AgentService,
              private message: NzMessageService) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required, Validators.minLength(8), Validators.pattern(this.htmlTagRegExp)], [this.userNameAsyncValidator]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{9,}'), Validators.pattern(this.htmlTagRegExp)], [this.passwordAsyncValidator]],
      confirm: ['', [Validators.required, this.confirmValidator, Validators.pattern(this.htmlTagRegExp)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.htmlTagRegExp)]],
      address: ['', [Validators.required, Validators.minLength(4), Validators.pattern(this.htmlTagRegExp)]]
    });
  }

  ngOnInit(): void {
  }

  submitForm(value: { email: string; password: string; confirm: string; firstName: string; lastName: string; address: string; }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    this.agentService.createAgent({
      username: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      password: value.password,
      rePassword: value.confirm,
      address: value.address
    }).subscribe(agentResponse => {
      this.message.success('Agent is successfully created!');
    }, error => {
      this.message.error(error.error);
    });

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
      this.userService.checkPassword(control.value).subscribe(() => {
        this.isPasswordCorrect = true;
      }, () => {
        this.isPasswordCorrect = false;
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

}
