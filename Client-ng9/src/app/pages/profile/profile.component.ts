import {Component, HostListener, OnDestroy, OnInit, Output} from '@angular/core';
import {UsersService} from '../../_services/users.service';
import {User} from '../../_services/interfaces';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TabsService} from '../../_services/tabs.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @Output() user: User;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.showWarning) {
      $event.returnValue = true;
    }
  }

  unsubscribeUser: Subscription;

  unsubscribeWarning: Subscription;
  showWarning = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private tabsService: TabsService
  ) {
  }

  ngOnInit(): void {
    this.tabsService.getEditWarning.next(false);

    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.usersService.getCurrentUserSub.next(this.user);
    });

    this.unsubscribeUser = this.usersService.getCurrentUserSub.subscribe(user => {
      this.user = this.usersService.getUserWithPhoto(user);
    });

    this.unsubscribeWarning = this.tabsService.getEditWarning
      .subscribe(data => this.showWarning = data);
  }

  ngOnDestroy(): void {
    this.unsubscribeWarning.unsubscribe();
    if (this.unsubscribeUser) {
      this.unsubscribeUser.unsubscribe();
    }
  }
}
