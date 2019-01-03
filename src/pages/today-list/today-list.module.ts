import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodayListPage } from './today-list';

@NgModule({
  declarations: [
    TodayListPage,
  ],
  imports: [
    IonicPageModule.forChild(TodayListPage),
  ],
})
export class TodayListPageModule {}
