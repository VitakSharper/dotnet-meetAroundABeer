import {Component, OnInit} from '@angular/core';
import {Message} from '../../../_services/interfaces';
import {Pagination} from '../../../_pagination/paginationModel';
import {MessageService} from '../message.service';
import {AuthService} from '../../../_services/auth.service';
import {AlertifyService} from '../../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {PaginationResult} from '../../../_pagination/paginationResult';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-messages-component',
  templateUrl: './messages-component.component.html',
  styleUrls: ['./messages-component.component.scss']
})
export class MessagesComponentComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  step = 0;
  pageSizeOptions = [5, 10, 15, 20];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.messageService.getMessages(this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginationResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => this.alertifyService.errorAlert(error));
  }

  mdPageChanged($event: PageEvent) {
    this.pagination.currentPage = $event.pageIndex + 1;
    if (!!$event.pageSize) {
      this.pagination.itemsPerPage = $event.pageSize;
    }
    this.loadMessages();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  loadMessagesBy(type: string) {
    this.messageContainer = type;
    this.loadMessages();
  }

  getLabel(index: number) {
    return index === this.pagination.itemsPerPage || index === this.pagination.totalItems ? 'End' : 'Next';
  }
}
