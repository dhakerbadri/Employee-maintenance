import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../shared/auth.service';
import { EmployeeDetail } from '../shared/model-api.model';
import { EmployeeService } from '../shared/service-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  employees: EmployeeDetail[] = [];
  filteredEmployees: EmployeeDetail[] = [];
  searchFirstName: string = '';
  searchLastName: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  invalid: boolean;
  userForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public service: EmployeeService,
    public serviceUser: AuthService,
    private toast: NgToastService
  ) {
    this.userForm = this._fb.group({
      userName: '',
      password: '',
    });
    this.invalid = false;
  }
  ngOnInit(): void {}

  onLoginButtonClick() {
    if (this.userForm.valid) {
      this.serviceUser.login(this.userForm.value).subscribe({
        next: (res) => {
          this.userForm.reset();
          this.toast.success({
            detail: 'SUCCESS',
            summary: res.message,
            duration: 4000,
          });
          this.serviceUser.storeToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.invalid = true;
          this.toast.error({
            detail: 'ERROR',
            summary: 'Something went wrong!',
            duration: 5000,
          });
        },
      });
    }
  }
}
