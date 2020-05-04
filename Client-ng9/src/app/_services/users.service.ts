import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {RequestQueryUserParams, User} from './interfaces';
import {PaginationResult} from '../_pagination/paginationResult';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected currentUser: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public get getCurrentUserSub() {
    return this.currentUser;
  }

  baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
  }

  pushUser(user: User) {
    user
      ? this.currentUser.next(this.getUserWithPhoto(user))
      : this.currentUser.next({});
  }

  getUserWithPhoto(user: User): User {
    return user.photoUrl
      ? user
      : {...user, photoUrl: '/assets/original.png'};
  }

  getUsers(userParams: RequestQueryUserParams): Observable<PaginationResult<User[]>> {
    const paginatedResult: PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();

    if (userParams.page && userParams.itemsPerPage) {
      params = params.append('pageNumber', userParams.page.toString());
      params = params.append('pageSize', userParams.itemsPerPage.toString());
    }
    if (userParams.maxAge && userParams.maxAge && userParams.gender) {
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender.toString());
    }

    return this.http.get<User[]>(`${this.baseUrl}`, {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (!!response.headers.get('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/current`);
  }

  updateUser(updated: User): Observable<any> {
    return this.http.put<User>(`${this.baseUrl}/updateMe`, updated);
  }
}
