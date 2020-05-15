import {Component, Input, OnInit} from '@angular/core';
import {MessageToSend, User} from '../../../_services/interfaces';
import {merge, Observable, of, Subject} from 'rxjs';
import {Message as KendoMsg, SendMessageEvent, User as KendoUser} from '@progress/kendo-angular-conversational-ui';
import {MessageService} from '../../message/message.service';
import {map, mergeMap, scan} from 'rxjs/operators';
import {UsersService} from '../../../_services/users.service';
import {AlertifyService} from '../../../_services/alertify.service';

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
    private usersService: UsersService,
    private alertifyService: AlertifyService) {
    this.local = new Subject<KendoMsg>();
    this.user = new Observable<KendoUser>();
  }

  ngOnInit(): void {
    this.getCurrentUserForChat();
    this.feed = this.sendMergedMessagesToChat();
  }

  private getCurrentUserForChat() {
    this.user = this.usersService.getCurrentUserSub
      .pipe(
        map((user) => ({
          id: user.id,
          avatarUrl: user.photoUrl,
          name: user.displayName
        })));
  }

  private sendMergedMessagesToChat() {
    return merge(
      this.getAllMessagesAndMerge().pipe(
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

  private getAllMessagesAndMerge() {
    return this.messageService.getMessageThread(this.repoUser.id)
      .pipe(
        mergeMap(value => of(...value))
      );
  }

  sendMessage(e: SendMessageEvent) {
    this.user.subscribe(user => {
      this.local.next({author: user, typing: true});
      setTimeout(() => {
        this.local.next(e.message);
      }, 500);
    });
    const messageToSend: MessageToSend = {
      recipientId: this.repoUser.id,
      content: e.message.text
    };
    this.messageService.sendMessage(messageToSend)
      .subscribe(() => {
        }, error => this.alertifyService.errorAlert('Problem sending message.'),
        () => this.alertifyService.successAlert(`Sent to ${this.repoUser.displayName.toUpperCase()}`));
  }
}
