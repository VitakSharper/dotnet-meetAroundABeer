import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../_services/interfaces';

@Component({
  selector: 'app-member-edit-tabs',
  templateUrl: './member-edit-tabs.component.html',
  styleUrls: ['./member-edit-tabs.component.scss']
})
export class MemberEditTabsComponent implements OnInit {

  @Input() user: User;

  constructor() {
  }

  ngOnInit(): void {
  }

}
