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

const materialComponents = [
  MatButtonModule, MatToolbarModule,
  MatIconModule, MatInputModule,
  MatFormFieldModule, MatTabsModule,
  MatCardModule, MatRadioModule,
  MatSelectModule];

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})
export class MaterialUiModule {
}
