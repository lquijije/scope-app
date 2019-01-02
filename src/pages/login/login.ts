import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  
  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private afAuth: AngularFireAuth
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
       const response = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
       if(response){
        this.navCtrl.setRoot(HomePage);
       }else{
         console.log('no response');
       }
    }catch(e){
       console.log(e);
    }
  }
}
