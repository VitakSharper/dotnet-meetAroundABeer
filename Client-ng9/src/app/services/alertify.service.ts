import {Injectable} from '@angular/core';

import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() {
    alertify.set('notifier', 'position', 'top-right');
  }

  confirmAlert(message: string, ok: () => void) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        ok();
      } else {
      }
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
