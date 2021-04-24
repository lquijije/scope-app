import { Component } from '@angular/core';
import { IonicPage, NavController, Nav, App, NavParams, LoadingController } from 'ionic-angular';
import { OrderService } from '../../services/order-service';
import { UserService } from '../../services/user-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { IWorkOrder } from '../../models/order-work';
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
  lista: IWorkOrder [] = [];
  userEmail: string = '';
  loading: any;
  constructor(public navCtrl: NavController,
               public navParams: NavParams,
               public app: App,
               public os: OrderService,
               public us: UserService,
    private afAuth: AngularFireAuth,
    private loadCrtl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loading = this.loadCrtl.create({
      content: 'Cargando...'
    });
    this.loading.present();
    this.afAuth.authState.subscribe(data => {
      if (this.afAuth.auth.currentUser) {
        this.userEmail = this.afAuth.auth.currentUser.email;
        this.us.getUserByEmail(this.userEmail).subscribe((user) => {
          this.loading.dismiss();
          const d0 = new Date();
            const datestring0 = d0.getFullYear() + "-" + ("0"+(d0.getMonth()+1)).slice(-2) + "-" +
            ("0" + d0.getDate()).slice(-2) + " " + ("0" + d0.getHours()).slice(-2) + ":" + ("0" + d0.getMinutes()).slice(-2);
            const hoy0 = datestring0.substr(0, 10);
            
          this.os.getOrdersByUserId({
            id: user[0].id,
            nombre: user[0].nombre
          }, hoy0, false).subscribe(data => {
            this.loading.dismiss();
            const d = new Date();
            const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
            const hoy = datestring.substr(0, 10);
            this.lista = data;
            this.lista = this.lista.filter((item: any) => {
              return new Date(item.visita.toString().substr(0, 10)).getTime() > new Date(hoy).getTime();
            });
            this.lista = this.lista.sort((a, b) => {
              return (new Date(a.visita) > new Date(b.visita)) ? 1 : -1;
            });
          });
        });
      }
    });
  }

  itemSelected(item: any) {
    // if (!this.lockFav) {
    //   this.app.getRootNav().push(OrderWorkPage, { item: item });
    // } else {
    //   this.lockFav = false;
    // }
  }
  setFavourite(item: any) {
    this.lockFav = true;
  }

}
