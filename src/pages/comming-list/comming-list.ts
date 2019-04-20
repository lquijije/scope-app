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
          this.os.getOrdersByUserId({
            id: user[0].id,
            nombre: user[0].nombre
          }).subscribe(data => {
            this.loading.dismiss();
            const hoy = new Date(new Date().toISOString().substr(0, 10)).getTime();
            this.lista = data;
            this.lista = this.lista.filter((item: any) => {
              return new Date(item.visita.toString().substr(0, 10)).getTime() > hoy;
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
