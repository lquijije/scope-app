import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, App, NavParams } from 'ionic-angular';
import { OrderWorkPage } from '../order-work/order-work';
import { OrderService } from '../../services/order-service';
import { IWorkOrder } from '../../models/order-work';
import { IUser } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../services/user-service';
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
  lista: IWorkOrder [] = [];
  userEmail: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              public os: OrderService,
              public us: UserService,
    private afAuth: AngularFireAuth) {
    
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if (this.afAuth.auth.currentUser) {
        this.userEmail = this. afAuth.auth.currentUser.email;
        this.us.getUserByEmail(this.userEmail).subscribe((user) => {
          this.os.getOrdersByUserId({
              id: user[0].id,
              nombre: user[0].nombre
            }).subscribe(data => {
            const d = new Date();
            const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            const hoy = datestring.substr(0, 10);
            console.log(hoy);
            this.lista = data;
            this.lista = this.lista.filter((item: IWorkOrder) => {
              return item.visita.toString().substr(0, 10) == hoy;
            });
            this.lista = this.lista.sort((a, b) => {
              return (new Date(a.visita) > new Date(b.visita)) ? 1 : -1;
            });
            this.lista.forEach(i => {
              const now = new Date().getTime();
              const vis = new Date(i.visita).getTime();
              if (now > vis){
                i['color'] = 'danger';
              }else{
                i['color'] = 'white';
              }
            });
          });
        });
      }
    });
  }

  itemSelected(item: IWorkOrder) {
    if (!this.lockFav){
      this.app.getRootNav().push(OrderWorkPage, { item: item });      
    }else{
      this.lockFav = false;
    }
  }
  setFavourite(item: IWorkOrder) {
    this.lockFav = true;
    console.log('favorito');
  }
}
