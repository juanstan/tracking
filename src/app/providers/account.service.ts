import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map, take} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {LoginResult} from '../model/auth/login-result';
import {StorageService} from '../core/services/storage.service';
import {Observable} from 'rxjs';
import {VesselService} from './vessel.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  public loginObj: LoginResult;
  public user: User;
  public token: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService,
    private vesselService: VesselService
  ) { }

  async init(): Promise<LoginResult> {
    return await this.storageService.get('login').then(
      login => this.loginObj = login
    );
  }

  public reset() {
    this.loginObj = null;
  }

  public get userValue(): User {
    return this.loginObj?.user;
  }

  public get tokenValue(): string {
    return this.loginObj?.access_token;
  }

  public login(username, password): Observable<User> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/auth/login`, { email: username, password })
      .pipe(
        map(login => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.storageService.set('login', login);
          this.loginObj = login;
          return login.user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe(() => {
      this.storageService.remove('login').then(
        () => {
          this.reset();
          return this.router.navigate(['/login']);
        }
      );
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
          this.loginObj.user = user;
          this.storageService.set('login', this.loginObj);
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

  loadAllData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/me/start`).pipe(
      take(1),
      map((data: any) => {
        this.vesselService.allVessels = data.data.vessels;
      })
    );
  }
}
