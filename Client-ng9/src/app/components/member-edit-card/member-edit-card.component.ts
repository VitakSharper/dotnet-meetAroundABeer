import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {User} from '../../_services/interfaces';
import {TabsService} from '../../_services/tabs.service';

@Component({
  selector: 'app-member-edit-card',
  templateUrl: './member-edit-card.component.html',
  styleUrls: ['./member-edit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MemberEditCardComponent implements OnInit {
  @Input() user: User;
  @Input() showBtnGrp = false;


  constructor(
    private tabService: TabsService
  ) {
  }

  ngOnInit(): void {
  }

  selectTab(number: number) {
    this.tabService.getTabIndex.next(number);
  }
}
