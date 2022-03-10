import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {StorageService} from '../core/services/storage.service';
import {Observable} from 'rxjs';
import {Vessel} from '../model/vessel';

@Injectable({ providedIn: 'root' })
export class VesselService {
  public vessels: Vessel[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {


  }

  public get allVessels(): Vessel[] {
    return this.vessels;
  }

  public set allVessels(vessels) {
    this.vessels = vessels;
  }

  public getVessel(id): Vessel {
    return this.vessels?.find(vessel => vessel.id === id);
  }

  public requestMyVessels(): Observable<Vessel[]> {
    return this.http.get<Vessel[]>(`${environment.apiUrl}/vessels`).pipe(
      map(vessels => vessels)
    );
  }

  /*getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }*/

  /*updateVessel(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.vessels.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          this.loginObj.user = user;
          this.storageService.set('login', this.loginObj);
        }
        return x;
      }));
  }

  deleteVessel(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }*/

}
