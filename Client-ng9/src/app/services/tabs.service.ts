import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  protected tabIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public get getTabIndex() {
    return this.tabIndex;
  }

  constructor() {
  }


}
