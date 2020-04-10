import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  currentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/current`);
  }
}
