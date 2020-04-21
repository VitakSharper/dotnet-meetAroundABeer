import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialUiModule} from './_material-ui/material-ui.module';
import {HeaderComponent} from './navigation/header/header.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './forms/register/register.component';
import {LoginComponent} from './forms/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from './interceptors/error.interceptor';
import {JwtModule} from '@auth0/angular-jwt';
import {NavMenuComponent} from './navigation/nav-menu/nav-menu.component';
import {MemberListComponent} from './pages/member-list/member-list.component';
import {ListsComponent} from './pages/lists/lists.component';
import {MessagesComponent} from './pages/messages/messages.component';
import {MemberCardComponent} from './components/member-card/member-card.component';
import {MemberDetailComponent} from './components/member-detail/member-detail.component';
import {MemberDetailResolver} from './_resolvers/member-detail.resolver';
import {MemberListResolver} from './_resolvers/member-list.resolver';
import {NgxGalleryModule} from '@kolkov/ngx-gallery';
import {InlineSVGModule} from 'ng-inline-svg';
import {ProfileComponent} from './pages/profile/profile.component';
import {ProfileResolver} from './_resolvers/profile.resolver';
import {MemberEditCardComponent} from './components/member-edit-card/member-edit-card.component';
import {MemberEditTabsComponent} from './components/member-edit-tabs/member-edit-tabs.component';
import {EditFormComponent} from './components/member-edit-card/edit-form/edit-form.component';
import {MemberDetailTabsComponent} from './components/member-detail/member-detail-tabs/member-detail-tabs.component';
import {PreventUnsavedChangesGuard} from './_guards/prevent-unsaved-changes.guard';
import {MemberPhotoEditComponent} from './components/member-photo-edit/member-photo-edit.component';
import {MemberPhotoUploadComponent} from './components/member-photo-upload/member-photo-upload.component';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    NavMenuComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    ProfileComponent,
    MemberEditCardComponent,
    MemberEditTabsComponent,
    EditFormComponent,
    MemberDetailTabsComponent,
    MemberPhotoEditComponent,
    MemberPhotoUploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialUiModule,
    NgxGalleryModule,
    FileUploadModule,
    InlineSVGModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    })
  ],
  providers: [httpInterceptorProviders, MemberDetailResolver, MemberListResolver, ProfileResolver, PreventUnsavedChangesGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
