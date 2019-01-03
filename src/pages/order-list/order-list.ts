import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodayListPage } from '../today-list/today-list';
import { CommingListPage } from '../comming-list/comming-list';
import { OrderWorkPage } from '../order-work/order-work';

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  tab1 = TodayListPage;
  tab2 = CommingListPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.navCtrl.push(OrderWorkPage);
  }

}
