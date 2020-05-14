import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MemberNavComponent} from './member-nav.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [MemberNavComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MemberNavComponent]
})
export class MemberNavModule {
}
