import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {MessagesComponent} from './pages/messages/messages.component';
import {ListsComponent} from './pages/lists/lists.component';
import {MemberListComponent} from './pages/member-list/member-list.component';
import {AuthGuard} from './guards/auth.guard';
import {MemberDetailComponent} from './components/member-detail/member-detail.component';
import {MemberDetailResolver} from './resolvers/member-detail.resolver';
import {MemberListResolver} from './resolvers/member-list.resolver';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
      {path: 'member/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
      {path: 'messages', component: MessagesComponent},
      {path: 'lists', component: ListsComponent},
    ]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
