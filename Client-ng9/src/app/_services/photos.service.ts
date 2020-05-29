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

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService) {
  }

  setMain(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/main`, {});
  }

  updatePhoto(id: string, path: string, value: boolean) {
    const itemToUpdate = [
      {
        op: 'replace',
        path,
        value
      }
    ];
    this.http.patch(`${this.baseUrl}/${id}/status`, itemToUpdate)
      .subscribe(() => {
        }, error => this.alertifyService.errorAlert('Problem updating.')
        , () => this.alertifyService.successAlert('Updated successfully.')
      );
  }

  deletePhoto(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  uploadSingle(file: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/single`, file);
  }

  uploadMultiple(file: any) {
    this.http.post(`${this.baseUrl}/multiple`, file)
      .subscribe(data => {
      }, error => this.alertifyService.errorAlert(error));
  }
}
