import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginationResult} from '../../_pagination/paginationResult';
import {Message} from '../../_services/interfaces';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  paginatedResult: PaginationResult<Message[]>;
  baseUrl = `${environment.apiUrl}/users/messages`;

  constructor(private http: HttpClient) {
    this.paginatedResult = new PaginationResult<Message[]>();
  }

  getMessages(page?, itemsPerPage?, messageContainer?) {
    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<Message[]>(`${this.baseUrl}`, {observe: 'response', params})
      .pipe(
        map(response => {
          this.paginatedResult.result = response.body;
          if (!!response.headers.get('Pagination')) {
            this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return this.paginatedResult;
        })
      );
  }

}
