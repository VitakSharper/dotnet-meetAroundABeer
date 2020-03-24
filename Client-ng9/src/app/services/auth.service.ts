import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = `http://localhost:5000/api/auth`;

  constructor(private http: HttpClient) {
  }

  login(model: any) {
    return this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((resp: any) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
          }
        })
      );
  }

}
