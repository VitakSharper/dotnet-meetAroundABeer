import {Component, Input, OnInit} from '@angular/core';
import {Message, User} from '../../../_services/interfaces';
import {Observable, Subject} from 'rxjs';
import {Message as KendoMsg, SendMessageEvent, User as KendoUser} from '@progress/kendo-angular-conversational-ui';
import {MessageService} from '../../message/message.service';
import {map, scan, tap} from 'rxjs/operators';
import {UsersService} from '../../../_services/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() repoUser: User;

  feed: Observable<KendoMsg[]>;
  private local: Subject<Message>;

  user: Observable<KendoUser>;

  constructor(
    private messageService: MessageService,
    private usersService: UsersService) {
    this.local = new Subject<Message>();
    this.user = new Observable<KendoUser>();
  }

  ngOnInit(): void {
    this.user = this.usersService.getCurrentUserSub
      .pipe(
        map((user) => ({
          id: user.id,
          avatarUrl: user.photoUrl,
          name: user.displayName
        })));


    this.feed = this.messageService.getMessageThread(this.repoUser.id)
      .pipe(
        map((response) => {
            return response.map(m => ({
              author: {name: m.senderDisplayName, id: m.senderId, avatarUrl: m.senderPhotoUrl},
              text: m.content,
              timestamp: new Date(m.messageSent)
            }));
          },
          scan((acc: KendoMsg[], m: KendoMsg) => [...acc, m], [])
        ),
        tap(resp => console.log('Kendo message array: ', resp))
      );
  }

  sendMessage(e: SendMessageEvent) {
    console.log('new message: ', e);
    console.log('user: ', this.user);
  }
}
