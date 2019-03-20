import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from  'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrderListPage } from '../pages/order-list/order-list';
import { TodayListPage } from '../pages/today-list/today-list';
import { CommingListPage } from '../pages/comming-list/comming-list';
import { OrderWorkPage } from '../pages/order-work/order-work';

import { firebase_config } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { OrderService } from '../services/order-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    OrderListPage,
    TodayListPage,
    CommingListPage,
    OrderWorkPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase_config),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    OrderListPage,
    TodayListPage,
    CommingListPage,
    OrderWorkPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OrderService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
