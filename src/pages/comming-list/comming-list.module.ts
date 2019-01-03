import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommingListPage } from './comming-list';

@NgModule({
  declarations: [
    CommingListPage,
  ],
  imports: [
    IonicPageModule.forChild(CommingListPage),
  ],
})
export class CommingListPageModule {}
