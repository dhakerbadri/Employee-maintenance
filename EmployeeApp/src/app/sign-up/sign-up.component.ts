import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../shared/auth.service';
enum role {
  User = 'User',
  Guest = 'Guest',
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signupForm: FormGroup;
  roles = role;

  constructor(
    private _fb: FormBuilder,
    public serviceUser: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.signupForm = this._fb.group({
      userName: [''],
      password: [''],
      email: [''],
    });
  }
  onSignupButtonClick() {
    console.log('Button clicked');

    if (this.signupForm.valid) {
      this.serviceUser.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: res.message,
            duration: 4000,
          });

          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: 'Something went wrong :' + err,
            duration: 5000,
          });
        },
      });
    }
  }
}
