import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessageRoutingModule} from './message-routing.module';
import {MessagesComponentComponent} from './messages-component/messages-component.component';
import {MessagesResolver} from './messages.resolver';
import {MaterialUiModule} from '../material-ui/material-ui.module';


@NgModule({
  declarations: [MessagesComponentComponent],
  imports: [
    CommonModule,
    MessageRoutingModule,
    MaterialUiModule
  ],
  exports: [MessagesComponentComponent],
  providers: [MessagesResolver]
})
export class MessageModule {
}
