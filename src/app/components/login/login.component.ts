import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';

  message = '';
  alertClass = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {
    this.message = '';

    if (!this.username || !this.password) {
      this.message = 'Please enter username and password.';
      this.alertClass = 'alert-warning';
      return;
    }

    const url = `${environment.apiBaseUrl}/users/login`;
    const params = {
      username: this.username,
      password: this.password
    };

    this.http.get(url, {
      params,
      observe: 'response'
    }).subscribe({
      next: response => {
        const token = response.headers.get('Authorization');

        if (!token) {
          this.message = 'Login failed: no token received.';
          this.alertClass = 'alert-danger';
          return;
        }

        this.authService.login(token);
        this.authService.storageUserName(params.username);


        this.message = 'Login successful!';
        this.alertClass = 'alert-success';

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: _err => {
        this.message = 'Login failed.';
        this.alertClass = 'alert-danger';
      }
    });
  }
}
