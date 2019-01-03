import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams } from 'ionic-angular';
import { OrderWorkPage } from '../order-work/order-work';
/**
 * Generated class for the CommingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comming-list',
  templateUrl: 'comming-list.html',
})
export class CommingListPage {
  lockFav: boolean;
  lista: Array<any> = [
    {
      title: 'Comisariato | Riocentro Norte',
      subtitle: 'Dom. 6 enero 2019 - 10h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Mini Portete',
      subtitle: 'Dom. 6 enero 2019 - 11h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Riocentro Norte',
      subtitle: 'Dom. 6 enero 2019 - 15h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Centro',
      subtitle: 'Dom. 6 enero 2019 - 17h00',
      color: 'normal'
    },
    {
      title: 'Comisariato | Dorado',
      subtitle: 'Lun. 7 enero 2019 - 09h00',
      color: 'normal'
    },
    {
      title: 'Coral | Carlos Julio A.',
      subtitle: 'Lun. 6 enero 2019 - 10h00',
      color: 'normal'
    }
  ];
  constructor(public navCtrl: NavController,
               public navParams: NavParams,
               public app: App) {
  }

  ionViewDidLoad() {
    
  }

  itemSelected(item: any) {
    if (!this.lockFav) {
      this.app.getRootNav().push(OrderWorkPage, { item: item });
    } else {
      this.lockFav = false;
    }
  }
  setFavourite(item: any) {
    this.lockFav = true;
    console.log('favorito');
  }

}
