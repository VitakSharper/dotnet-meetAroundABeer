import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MessagesComponentComponent} from './messages-component/messages-component.component';
import {MessagesResolver} from './messages.resolver';


const routes: Routes = [
  {path: '', component: MessagesComponentComponent, resolve: {messages: MessagesResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule {
}
