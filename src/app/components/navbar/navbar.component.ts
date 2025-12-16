import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(
      logged => this.isLoggedIn = logged
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
