import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../_services/interfaces';
import {UsersService} from '../../_services/users.service';
import {AlertifyService} from '../../_services/alertify.service';
import {Router} from '@angular/router';
import {TabsService} from '../../_services/tabs.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() onUserIdDel: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private usersService: UsersService,
    private alertifyService: AlertifyService,
    private router: Router,
    private tabsService: TabsService) {
  }

  ngOnInit(): void {
  }

  likeMember(id: string) {
    this.usersService.sendLike(id).subscribe(() => {
      }, error =>
        this.alertifyService.errorAlert(`${error[0][0]} ${this.user.displayName.toUpperCase()}`),
      () =>
        this.alertifyService.successAlert(`You liked ${this.user.displayName.toUpperCase()}`));
  }

  removeLike(id: string) {
    this.onUserIdDel.emit(id);
  }

  sendMsg() {
    this.router.navigate(['/member/', this.user.id]);
    this.tabsService.getTabIndex.next(3);
  }
}
