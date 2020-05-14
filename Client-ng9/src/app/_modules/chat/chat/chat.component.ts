import {Component, Input, OnInit} from '@angular/core';
import {Message, User} from '../../../_services/interfaces';
import {from, merge, Observable, of, Subject} from 'rxjs';
import {Message as KendoMsg, SendMessageEvent, User as KendoUser} from '@progress/kendo-angular-conversational-ui';
import {MessageService} from '../../message/message.service';
import {map, mergeMap, scan, tap} from 'rxjs/operators';
import {UsersService} from '../../../_services/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() repoUser: User;

  feed: Observable<KendoMsg[]>;
  private local: Subject<KendoMsg>;

  user: Observable<KendoUser>;

  constructor(
    private messageService: MessageService,
    private usersService: UsersService) {
    this.local = new Subject<KendoMsg>();
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

    const messages = this.messageService.getMessageThread(this.repoUser.id)
      .pipe(
        mergeMap(value => of(...value))
      );

    this.feed = merge(
      messages.pipe(
        map(msg => ({
          author: {name: msg.senderDisplayName, id: msg.senderId, avatarUrl: msg.senderPhotoUrl},
          text: msg.content,
          timestamp: new Date(msg.messageSent)
        }))),
      this.local
    ).pipe(
      scan((acc: KendoMsg[], m: KendoMsg) => [...acc, m], []),
    );
  }

  sendMessage(e: SendMessageEvent) {
    this.user.subscribe(user => {
      this.local.next({author: user, typing: true});
      setTimeout(() => {
        this.local.next(e.message);
      }, 500);
    });
  }
}
