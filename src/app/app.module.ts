import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { RatingPageModule } from './rating/rating.module';
import { PayPal } from '@ionic-native/paypal/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { VariationsPageModule } from './pages/variations/variations.module';

import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ChooseAddressPageModule } from 'src/app/pages/choose-address/choose-address.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { SelectDriversPageModule } from './pages/select-drivers/select-drivers.module';
import { VariationPageModule } from './pages/variation/variation.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    RatingPageModule,
    ChooseAddressPageModule,
    SelectDriversPageModule,
    VariationPageModule,
    VariationsPageModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AndroidPermissions,
    Diagnostic,
    OneSignal,
    Camera,
    StatusBar,
    SplashScreen,
    Geolocation,
    FirebaseX,
    PayPal,
    PhotoViewer,
    InAppBrowser,
    HTTP,
    InAppPurchase2,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
