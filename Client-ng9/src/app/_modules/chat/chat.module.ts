import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat/chat.component';
import {ChatModule as KendoChat} from '@progress/kendo-angular-conversational-ui';
import {IntlModule} from '@progress/kendo-angular-intl';

// Load all required data for the fr locale
import '@progress/kendo-angular-intl/locales/fr/all';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    KendoChat,
    IntlModule
  ],
  exports: [ChatComponent]
})
export class ChatModule {
}
