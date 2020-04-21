import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  baseUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) {
  }

  setMain(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/main`, {});
  }

  setStatus(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/status`, {});
  }
}
