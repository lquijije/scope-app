import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, App, NavParams } from 'ionic-angular';
import { OrderWorkPage } from '../order-work/order-work';
import { HomePage } from '../home/home';
import { OrderService } from '../../services/order-service';
/**
 * Generated class for the TodayListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-today-list',
  templateUrl: 'today-list.html',
})
export class TodayListPage {
  @ViewChild(Nav) nav: Nav;

  lockFav: boolean;
  lista: Array<any> = [
    {
      title: 'Supermaxi | Centenario',
      subtitle: '10h00.',
      color: 'danger'
    },
    {
      title: 'Supermaxi | Policentro',
      subtitle: '12h00.',
      color: 'danger'
    },
    {
      title: 'Comisariato | Riocentro Sur',
      subtitle: '13h00',
      color: 'warning'
    },
    {
      title: 'Comisariato | Centro',
      subtitle: '15h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Via Daule',
      subtitle: '16h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Americas',
      subtitle: '17h00',
      color: 'normal'
    }
  ];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              public os: OrderService) {
  }

  ionViewDidLoad() {
    this.os.getOrders().subscribe(data => {
      console.log(data);
    });
  }

  itemSelected(item: any) {
    if (!this.lockFav){
      this.app.getRootNav().push(OrderWorkPage, { item: item });
    }else{
      this.lockFav = false;
    }
  }
  setFavourite(item: any) {
    this.lockFav = true;
    console.log('favorito');
  }

}
