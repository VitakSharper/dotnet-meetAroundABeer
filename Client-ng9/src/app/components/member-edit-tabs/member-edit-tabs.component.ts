import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_services/interfaces';
import {MatTabGroup} from '@angular/material/tabs';
import {Subscription} from 'rxjs';
import {TabsService} from '../../_services/tabs.service';

@Component({
  selector: 'app-member-edit-tabs',
  templateUrl: './member-edit-tabs.component.html',
  styleUrls: ['./member-edit-tabs.component.scss']
})
export class MemberEditTabsComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs', {static: true}) memberTabs: MatTabGroup;

  unsubscribeTab: Subscription;
  @Input() user: User;

  constructor(private tabsService: TabsService) {
  }

  ngOnInit(): void {
    this.unsubscribeTab = this.tabsService.getTabIndex
      .subscribe(index => {
        this.memberTabs.selectedIndex = index;
      });

  }

  ngOnDestroy(): void {
    if (this.unsubscribeTab) {
      this.unsubscribeTab.unsubscribe();
    }
  }

}
