import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AlertifyService} from './alertify.service';

@Injectable({
  providedIn: 'root'
})

export class PhotosService {

  baseUrl = `${environment.apiUrl}/photos`;

  // headers = new HttpHeaders({
  //   'Content-Type': 'multipart/form-data',
  //   'Authorization': 'Bearer ' + localStorage.getItem('token')
  // });

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService) {
  }

  setMain(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/main`, {});
  }

  setStatus(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/status`, {});
  }

  deletePhoto(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  uploadSingle(file: any):Observable<any> {
    return this.http.post(`${this.baseUrl}/single`, file);
  }
  uploadMultiple(file: any) {
    this.http.post(`${this.baseUrl}/multiple`, file)
      .subscribe(data => {
      }, error => this.alertifyService.errorAlert(error));
  }

}
