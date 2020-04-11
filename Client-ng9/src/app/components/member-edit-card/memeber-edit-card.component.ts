import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../services/interfaces';

@Component({
  selector: 'app-memeber-edit-card',
  templateUrl: './memeber-edit-card.component.html',
  styleUrls: ['./memeber-edit-card.component.scss']
})
export class MemeberEditCardComponent implements OnInit {

  @Input() user: User;

  constructor() {
  }

  ngOnInit(): void {
  }

}
