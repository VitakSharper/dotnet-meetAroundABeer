import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected currentUser: BehaviorSubject<User> = new BehaviorSubject<any>({});

  public get getCurrentUserSub() {
    return this.currentUser;
  }

  baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/current`);
  }
}
