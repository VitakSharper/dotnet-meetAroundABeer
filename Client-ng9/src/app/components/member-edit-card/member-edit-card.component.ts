import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../_services/interfaces';
import {TabsService} from '../../_services/tabs.service';
import {UsersService} from '../../_services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-member-edit-card',
  templateUrl: './member-edit-card.component.html',
  styleUrls: ['./member-edit-card.component.scss']
})
export class MemberEditCardComponent implements OnInit, OnDestroy {
  unsubscribeUser: Subscription;
  user: User;
  @Input() showBtnGrp = false;

  constructor(
    private tabService: TabsService,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.unsubscribeUser = this.usersService.getCurrentUserSub
      .subscribe(user => this.user = user);
  }

  selectTab(number: number) {
    this.tabService.getTabIndex.next(number);
  }

  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
  }
}
