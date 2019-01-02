import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public toast: ToastController,
              private afAuth: AngularFireAuth
              ) {

  }

  ionViewDidLoad(){
    this.afAuth.authState.subscribe(data => {
      if(data){  
        this.toast.create({
          message: `Bienvenido ${data.displayName}`,
          duration: 3000
        }).present();
      }else{
        
      }
    });
  }
}
