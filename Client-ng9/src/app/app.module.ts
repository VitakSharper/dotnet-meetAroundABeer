import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialUiModule} from './_modules/material-ui/material-ui.module';
import {HeaderComponent} from './navigation/header/header.component';
import {HomeComponent} from './pages/home/home.component';
import {RegisterComponent} from './_forms/register/register.component';
import {LoginComponent} from './_forms/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from './_interceptors/error.interceptor';
import {JwtModule} from '@auth0/angular-jwt';
import {MemberListComponent} from './pages/member-list/member-list.component';
import {ListsComponent} from './pages/lists/lists.component';
import {MemberCardComponent} from './components/member-card/member-card.component';
import {MemberDetailComponent} from './components/member-detail/member-detail.component';
import {MemberDetailResolver} from './_resolvers/member-detail.resolver';
import {MemberListResolver} from './_resolvers/member-list.resolver';
import {NgxGalleryModule} from '@kolkov/ngx-gallery';
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
import {UploadLocalFilesComponent} from './components/upload-local-files/upload-local-files.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {SafeHtmlPipe} from './_pipes/safe-html.pipe';
import {HamburgerComponent} from './navigation/hamburger/hamburger.component';
import {TimeagoModule} from 'ngx-timeago';
import {LikeResolver} from './_resolvers/like.resolver';
import {ChatModule} from './_modules/chat/chat.module';

import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {MemberNavModule} from './_modules/member-nav/member-nav.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    MemberListComponent,
    ListsComponent,
    MemberCardComponent,
    MemberDetailComponent,
    ProfileComponent,
    MemberEditCardComponent,
    MemberEditTabsComponent,
    EditFormComponent,
    MemberDetailTabsComponent,
    MemberPhotoEditComponent,
    MemberPhotoUploadComponent,
    UploadLocalFilesComponent,
    SafeHtmlPipe,
    HamburgerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialUiModule,
    NgxGalleryModule,
    FileUploadModule,
    MaterialFileInputModule,
    ChatModule,
    MemberNavModule,
    TimeagoModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
  ],
  providers: [httpInterceptorProviders, MemberDetailResolver,
    MemberListResolver, ProfileResolver, LikeResolver,
    PreventUnsavedChangesGuard, {provide: LOCALE_ID, useValue: 'fr'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
