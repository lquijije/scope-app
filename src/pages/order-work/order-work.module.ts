import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderWorkPage } from './order-work';

@NgModule({
  declarations: [
    OrderWorkPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderWorkPage),
  ],
})
export class OrderWorkPageModule {}
