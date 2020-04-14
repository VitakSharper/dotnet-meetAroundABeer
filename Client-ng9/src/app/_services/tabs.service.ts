import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  protected tabIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  protected editWarning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get getTabIndex() {
    return this.tabIndex;
  }

  public get getEditWarning() {
    return this.editWarning;
  }


  constructor() {
  }
}
