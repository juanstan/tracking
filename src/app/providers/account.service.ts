import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {LoginResult} from '../model/auth/login-result';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  private tokenSubject: BehaviorSubject<string>;
  public $user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('login'))?.user);
    this.tokenSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('login'))?.access_token);
    this.$user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public get tokenValue(): string {
    return this.tokenSubject.value;
  }

  login(username, password) {
    return this.http.post<LoginResult>(`${environment.apiUrl}/auth/login`, { email: username, password })
      .pipe(map(login => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('login', JSON.stringify(login));
        this.userSubject.next(login.user);
        this.tokenSubject.next(login.access_token);
        return login.user;
      }));
  }

  async logout() {
    // remove user from local storage and set current user to null
    return await this.http.post(`${environment.apiUrl}/auth/logout`, {}).toPromise().then(async () => {
      localStorage.removeItem('login');
      await this.router.navigate(['/login']);
    });
  }

  register(user) {
    const obj = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      password_conformation: user.password_conformation
    };
    return this.http.post(`${environment.apiUrl}/auth/register`, obj);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }

  isLoggedIn(): boolean {
    return !!this.tokenValue;
  }

  loadAllData() {
    return this.http.get(`${environment.apiUrl}/me/start`);
  }
}
