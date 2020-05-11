import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Message} from '../../_services/interfaces';
import {MessageService} from './message.service';
import {AlertifyService} from '../../_services/alertify.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private messagesService: MessageService,
    private router: Router,
    private alertify: AlertifyService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.messagesService.getMessages(this.pageNumber, this.pageSize, this.messageContainer)
      .pipe(
        catchError(err => {
          this.alertify.errorAlert('Problem resolve messages.');
          this.router.navigate(['/']);
          return of(null);
        })
      );
  }
}
