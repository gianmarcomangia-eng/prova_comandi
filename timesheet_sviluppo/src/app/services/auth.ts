import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:8000';
  isLoggedIn = false;
  user!: User;

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  createUser(username: string, token: string): void {
    this.user = new User(username, token);
    this.isLoggedIn = true;
  }

  restoreSession(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.isLoggedIn = false;
      return;
    }

    const user = JSON.parse(storedUser);
    this.createUser(user.username, user._token);
  }

  signIn(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<{ access_token: string }>(`${this.apiUrl}/token`, formData);
  }

  signUp(username: string, password: string) {
    
    const body = { username: username, password: password };
    
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  logout(): void {
    this.user = undefined as unknown as User;
    this.isLoggedIn = false;
    localStorage.removeItem('user');
  }
}
