import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {MessagesComponent} from './pages/messages/messages.component';
import {ListsComponent} from './pages/lists/lists.component';
import {MemberListComponent} from './pages/member-list/member-list.component';
import {AuthGuard} from './_guards/auth.guard';
import {MemberDetailComponent} from './components/member-detail/member-detail.component';
import {MemberDetailResolver} from './_resolvers/member-detail.resolver';
import {MemberListResolver} from './_resolvers/member-list.resolver';
import {ProfileComponent} from './pages/profile/profile.component';
import {ProfileResolver} from './_resolvers/profile.resolver';
import {PreventUnsavedChangesGuard} from './_guards/prevent-unsaved-changes.guard';
import {LikeResolver} from './_resolvers/like.resolver';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
      {path: 'member/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
      {path: 'profile', component: ProfileComponent, resolve: {user: ProfileResolver}, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'messages', component: MessagesComponent},
      {path: 'lists', component: ListsComponent, resolve: {users: LikeResolver}},
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
