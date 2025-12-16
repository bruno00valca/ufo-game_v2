import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  constructor(
    private router: Router
  ){}

  username = '';
  email = '';
  password = '';
  password2 = '';

  message = '';
  alertClass = '';

  async initRegister() {
    this.message = '';
    this.alertClass = '';

    if (!this.username || !this.email || !this.password || !this.password2) {
      this.message = 'Please fill in all fields.';
      this.alertClass = 'alert alert-warning mt-3';
      return;
    }

    if (this.password !== this.password2) {
      this.message = 'Passwords do not match.';
      this.alertClass = 'alert alert-danger mt-3';
      return;
    }

    const body = { username: this.username, email: this.email, password: this.password };

    try {
      const response = await fetch("http://wd.etsisi.upm.es:10000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      if (response.status === 201) {
        this.message = 'User registered successfully!';
        this.alertClass = 'alert alert-success mt-3';
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.message = `Registration failed. ${error.message}`;
      this.alertClass = 'alert alert-danger mt-3';
    }
  }
}
