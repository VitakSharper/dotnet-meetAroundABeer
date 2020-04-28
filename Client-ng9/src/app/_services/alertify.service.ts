import {Injectable} from '@angular/core';

import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() {
    alertify.set('notifier', 'position', 'top-right');
  }

  confirmAlert(title: string, message: string, ok: () => void, nok: () => void) {
    alertify.confirm(title, message, (e: any) => {
      ok();
    }, (e: any) => {
      nok();
    });
  }

  successAlert(message: string) {
    alertify.success(message);
  }

  errorAlert(message: string) {
    alertify.error(message);
  }

  warningAlert(message: string) {
    alertify.warning(message);
  }
}
