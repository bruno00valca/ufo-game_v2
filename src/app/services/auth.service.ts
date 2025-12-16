import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_NAME = 'username';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  storageUserName(username: string): void {
    console.log('user:',username);
    localStorage.setItem(this.USER_NAME,username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_NAME);
  }

  getToken():string | null{
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
