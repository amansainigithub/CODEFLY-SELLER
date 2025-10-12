import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
     // Password regex: at least 6 chars, 1 letter, 1 number, 1 special char
  passwordPattern: string = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[\\u0040$!%*?&])[A-Za-z\\d\\u0040$!%*?&]{6,}$';

  form: any = {
    username: null,
    password: null,
    userrole:'ROLE_SELLER'
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, 
    private tokenStorage: TokenStorageService,
     private router: Router, 
     private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      window.location.href = '/seller/dashboard';
    }
  }

  onSubmit(): void {

    this.spinner.show();


    const { username, password, userrole } = this.form;

    this.authService.login(username, password, userrole).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
       // this.reloadPage();
       
       window.location.href = '/seller/dashboard/home';
       this.spinner.hide();
      },
      err => {
        this.errorMessage = "invalid username or password";
        this.isLoginFailed = true;
        this.spinner.hide();
      }
    );
    this.spinner.hide();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
