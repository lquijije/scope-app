import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from 'angularfire2/auth';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../login/login';
import { OrderListPage } from '../order-list/order-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = OrderListPage;
  pages: Array<{title: string, component: any, icon: string}>;
  userAuth: string;
  constructor(public navCtrl: NavController,
              public toast: ToastController,
              private afAuth: AngularFireAuth,
              public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen
              ) {
                this.pages = [
                  { title: 'Bandeja', component: HomePage, icon: 'ios-list-box-outline'},
                  { title: 'Salir', component: null, icon:'ios-exit-outline' }
                ];
                this.afAuth.authState.take(1).subscribe(data => {
                  this.userAuth = afAuth.auth.currentUser.displayName;
                });
  }

  ionViewDidLoad(){
    this.initializeApp();
    this.afAuth.authState.take(1).subscribe(data => {
      if(data  && data.email && data.uid){  
        this.toast.create({
          message: `Bienvenido ${data.displayName}`,
          duration: 3000
        }).present();
        
      }else{
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async logout(): Promise<any>{
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  openPage(page) {
    if(page.title!='Salir'){
      this.nav.setRoot(page.component);
    }else{
      this.logout();
    }
  }
}
