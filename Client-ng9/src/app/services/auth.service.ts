import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

interface RegUser {
  gender: string,
  username: string,
  email: string,
  displayName: string,
  //dateOfBirth: [null,Validators.required],
  city: string,
  country: string,
  password: string,
}

interface LogUser {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = `http://localhost:5000/api/auth`;

  constructor(private http: HttpClient) {
  }

  login(model: LogUser) {
    return this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((resp: any) => {
          if (resp) {
            localStorage.setItem('token', resp.token);
          }
        })
      );
  }

  register(user: RegUser) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

}
