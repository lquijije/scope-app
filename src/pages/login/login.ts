import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  loading: any;
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private afAuth: AngularFireAuth
    , private alert: AlertController
    , private loadCrtl: LoadingController
    ) {
  }

  ionViewDidLoad() {
    this.loading = this.loadCrtl.create({
      content: 'Autenticando...'
    });
  }

  async login(user: User){
    return  new Promise((resolve, reject) => {
      this.loading.present();
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then( userData => resolve(userData),
      err => reject (err));
    }).then((res) => {
      this.loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }).catch((err) => {
      this.loading.dismiss();
      this.navCtrl.setRoot(LoginPage);
      let alert = this.alerta('Scope App',err.message);
      alert.present();
      return;
    });
  }

  alerta(title: string, msg: string){
    return this.alert.create({
      title: title,
      message: msg,
      buttons:[{
        text: 'Ok'
      }]
    });
  }
}
