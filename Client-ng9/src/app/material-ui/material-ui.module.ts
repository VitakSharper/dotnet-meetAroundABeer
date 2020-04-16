import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';

const materialComponents = [
  MatButtonModule, MatToolbarModule,
  MatIconModule, MatInputModule,
  MatFormFieldModule, MatTabsModule,
  MatCardModule, MatRadioModule,
  MatSelectModule, MatMenuModule,
  MatIconModule, MatChipsModule,
  MatDividerModule, MatGridListModule,
  MatListModule, MatGridListModule,
  MatButtonToggleModule, MatTooltipModule];

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})
export class MaterialUiModule {
}
