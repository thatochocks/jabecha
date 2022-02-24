import { TRIP_STATUS_WAITING } from 'src/environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { POSITION_INTERVAL, TRIP_STATUS_GOING, SOS, TRIP_STATUS_CANCELED, TRIP_STATUS_FINISHED, environment } from 'src/environments/environment.prod';
import { DriverService } from '../services/driver.service';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { TripService } from '../services/trip.service';
import { PlaceService } from '../services/place.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { RatingPage } from '../rating/rating.page';
import { CommonService } from '../services/common.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { HTTP} from '@angular/common/http/http';
import { HTTP} from '@ionic-native/http/ngx';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { from } from 'rxjs';



declare var google: any;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {



  driver: any;
  map: any;
  trip: any = {};
  driverTracking: any;
  marker: any;
  sos: any;
  alertCnt: any = 0;
  rate: any = 5;
  distanceText: any = "-";
  durationText: any = "-";
  ref: any;
  otpSent:boolean = false;
  arrived:boolean = false;
  arrivedDropoff:boolean = false;
  data: any;
  data1: any;

  constructor(
    private driverService: DriverService,
    private tripService: TripService,
    private placeService: PlaceService,
    private router: Router,
    private menuCtrl: MenuController,
    private afdb: AngularFireDatabase,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private common: CommonService,
    private iab: InAppBrowser,
    private http: HttpClient,
    private nativehttp: HTTP
  ) {
    this.sos = SOS;
  }

  ngOnInit() {
    
  }
  transfer(){
    this.tripService.setStatus('transfer');
    this.router.navigateByUrl('/home')
  }
  viewPhoto(path){
    let photoViewer = new PhotoViewer();
    photoViewer.show(path);
  }
  back(){
    this.router.navigateByUrl('/home');
  }
  ionViewDidEnter() {
    this.menuCtrl.enable(true);
    let tripId = this.tripService.getId();

    let ref = this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
      if (snapshot != null) {
        console.log(this.trip)
        this.trip = snapshot;

        console.log(this.trip);

        if (this.trip.status == TRIP_STATUS_CANCELED) {
          clearInterval(this.driverTracking);
          this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });
          // this.ref.unsubscribe()
          ref.unsubscribe();
        }
        if (this.trip.status == TRIP_STATUS_FINISHED) {
          this.modalCtrl.create({
            component: RatingPage,
            componentProps: {
              trip: this.trip,
              driver: this.driver
            }
          }).then(m => {
            m.present()
            ref.unsubscribe();
          });
        }

        this.driverService.getDriver(this.trip.driverId).valueChanges().pipe(take(1)).subscribe(snap => {
          console.log(snap);

          this.driver = snap;
          // init map
          this.loadMap();
        })
      }
    });
    
  }

  ionViewWillLeave() {
    clearInterval(this.driverTracking);
  }




  loadMap() {

    console.log("load Map calling");
    let latLng = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);


    let mapOptions: any = environment.mapOptions;
    mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
    mapOptions.center = latLng;

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: {
        url: 'assets/img/map-suv.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
        scaledSize: new google.maps.Size(32, 32)
      },
    });

    let directionsDisplay;
    let directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "black"
      }
    });
    directionsDisplay.setMap(this.map);

    let origin = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);
    let dest = new google.maps.LatLng(this.trip.destination.location.lat, this.trip.destination.location.lng);

    var request = {
      origin: origin,
      destination: dest,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(this.map);
      } else {
        console.log("error");
      }
    });

    this.trackDriver();
    this.platform.ready().then(() => {
      console.log('ready');
      if (this.platform.is("android") && this.trip.status == TRIP_STATUS_WAITING) {
        if(this.trip.payStatus == '0')
        {
          // this.orange();
        this.router.navigateByUrl('paypal-web');
        console.log('droid');
        }
        else
        {
          console.log('payed'+this.trip.payStatus);
        }
      }
      else
      {
      console.log('ready');
      if(this.trip.payStatus == '0' && this.trip.status == TRIP_STATUS_WAITING)
      {
        // this.orange();
        this.router.navigateByUrl('paypal-web');
      }

      }
    });
  }
  tripStatus(){
    return this.otpSent;
  }
  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }
  sendOtp(){
    this.otpSent = true;
    this.tripService.sendOtp();
  }
  trackDriver() {
    // this.showDriverOnMap();

    this.driverTracking = setInterval(() => {
      this.marker.setMap(null);
      this.showDriverOnMap();
    }, POSITION_INTERVAL);

    console.log(POSITION_INTERVAL);
  }

  cancelTrip() {
    this.alertCtrl.create({
      message: "Are you sure want to cancel the trip",
      buttons: [{
        text: "Yes",
        handler: () => {
          this.tripService.cancelTrip(this.trip.key).then(data => {
            console.log(data);
          })
        }
      }, {
        text: "No"
      }]
    }).then(res => res.present());

  }

  // show user on map
  showDriverOnMap() {
    // get user's position
    this.driverService.getDriverPosition(
      this.placeService.getLocality(),
      this.driver.type,
      this.driver.uid
    ).valueChanges().pipe(take(1)).subscribe((snapshot: any) => {
      // create or update
      console.log(snapshot);
      let latLng = new google.maps.LatLng(snapshot.lat, snapshot.lng);
      let distance = this.placeService.calcCrow(snapshot.lat, snapshot.lng, this.trip.origin.location.lat, this.trip.origin.location.lng);
      console.log(distance);
      if(distance < 1 && !this.arrived){
        this.common.showAlert("Driver Has Arrived At Pickup")
        this.arrived = true
      }
      if (this.trip.status == TRIP_STATUS_GOING) {
        let distance = this.placeService.calcCrow(snapshot.lat, snapshot.lng, this.trip.destination.location.lat, this.trip.destination.location.lng);
        if(distance < 1 && !this.arrivedDropoff){
          this.common.showAlert("Driver Has Arrived At Dropoff")
          this.arrivedDropoff = true
        }
        this.otpSent = true;
        this.map.setCenter(latLng);
      }
      // show vehicle to map
      this.marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: {
          url: 'assets/img/map-suv.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 16),
          scaledSize: new google.maps.Size(32, 32)
        },
      });


      let directionsService = new google.maps.DirectionsService();
      let request: any = {};

      if (this.trip.status == 'waiting') {
        this.otpSent = false;
        request = {
          origin: latLng,
          destination: new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng),
          travelMode: google.maps.TravelMode.DRIVING
        }
      }

      else {
        request = {
          origin: latLng,
          destination: new google.maps.LatLng(this.trip.destination.location.lat, this.trip.destination.location.lng),
          travelMode: google.maps.TravelMode.DRIVING
        }
      }

      directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log(response);
          this.distanceText = response.routes[0].legs[0].distance.text;
          this.durationText = response.routes[0].legs[0].duration.text;
        } else {
          console.log("error");
        }
      });



    });
    
  }
  orange(){
  //  const params= new HttpParams().set('grantc_type', 'clientc_credentials');
   const params= new HttpParams().set('grant_type', 'client_credentials');
   const headers = new HttpHeaders().set("Authorization", "Basic dmo1aG5qS1BXOUhMR1c0dFZLb21YZGVtRW5FU21pbnI6V0VRT01UQVdzOEFycE5icg==")
    .set('Content-Type', 'application/x-www-form-urlencoded');
        // let options = { headers: headers , params: params};
        console.log(params);
    console.log(headers);
    let apiTokenurl = 'https://api.orange.com/oauth/v2/token';
    let apipayurl = 'https://api.orange.com/orange-money-webpay/dev/v1/webpayment';
    // if (this.platform.is("android")||this.platform.is("ios")){
    //   apiTokenurl = '/apitoken';
    //     apipayurl = '/apipay';
    // }
    // const proxyurl = "https://us-central1-jabechaapp.cloudfunctions.net/proxy/";
    const proxyurl = "";
    console.log(location.origin);

    
    this.http.post("/apitoken",params, { headers: headers})
    // this.http.post("http://localhost:4200/apitoken",params, { headers: headers})
          
          // console.log('call '+nativecall);
          // from(nativecall)
          .subscribe((response) => {
              // console.log('ress '+response.status+' h'+response.headers+response.data);
              // this.data = JSON.parse(response.data);
              console.log(response['access_token']);
              console.log(response);
              
              console.log(location.origin);
              const headers1 = new HttpHeaders().set("Authorization", "Bearer "+response['access_token'])
              .set('Content-Type', 'application/json');
    console.log(headers1);
              const params1= new HttpParams().set('merchant_key', 'c1981eeb');
              let obj = {
                'merchant_key': 'c1981eeb',
                'currency': 'OUV',
                'order_id': 'MY_ORDER_ID_'+this.trip.key+Date.now(),
                'amount': ''+this.trip.fee,
                'return_url': 'http://www.jabecha.co.bw',
                'cancel_url': 'http://www.jabecha.co.bw',
                'notif_url': 'http://www.jabecha.co.bw',
                'lang': 'en',
                'reference': 'ref Merchant'
              };
    //           this.nativehttp.setDataSerializer('json');
    //           this.nativehttp.post(proxyurl+apipayurl,obj, { 'Authorization': 'Bearer '+this.data['access_token']}

    //       ).then(data => {
    //         console.log(data);
    //         console.log(data.status);
    // console.log(data.data); // data received by server
    // console.log(data.headers);
    //       }).catch(error => {
    //         console.log(error);
    //         console.log(error.status);
    //         console.log(error.error); // error message as string
    //         console.log(error.headers);
    //       });

    // this.http.post("http://localhost:4200/apipay/", obj, {headers:headers1, params: params1}).subscribe((response1) => {
    this.http.post(apipayurl, obj, {headers:headers1}).subscribe((response1) => {
        console.log(response1);
        console.log(response1["payment_url"]);
          // this.data1 = JSON.parse(response1);
          let options: InAppBrowserOptions = {
            location: 'yes',
            hidden: 'no',
            clearcache: 'yes',
            clearsessioncache: 'yes',
            zoom: 'yes',
            hardwareback: 'yes',
            mediaPlaybackRequiresUserAction: 'no',
            shouldPauseOnSuspend: 'no',
            closebuttoncaption: 'Close',
            disallowoverscroll: 'no',
            toolbar: 'yes',
            enableViewportScale: 'no',
            allowInlineMediaPlayback: 'no',
            presentationstyle: 'pagesheet',
            fullscreen: 'yes',
            footer: 'yes'
        };
        let options2={
          location: 'yes',
          hidden: 'no',
          clearcache: 'yes',
          clearsessioncache: 'yes',
          zoom: 'yes',
          hardwareback: 'yes',
          mediaPlaybackRequiresUserAction: 'no',
          shouldPauseOnSuspend: 'no',
          closebuttoncaption: 'Close',
          disallowoverscroll: 'no',
          toolbar: 'yes',
          enableViewportScale: 'no',
          allowInlineMediaPlayback: 'no',
          presentationstyle: 'pagesheet',
          fullscreen: 'yes',
          footer: 'yes'
      }
          if (this.platform.is("pwa"))
          {
            console.log('bropen web');
            window.open(response1['payment_url'], '_self',JSON.stringify(options2) )
          }
          else{
          // const browser = this.iab.create(this.data1['payment_url'],'_self',options);

          const browser = this.iab.create(response1['payment_url'],'_self',options);
          console.log('bropen');
          browser.on('loadstart').subscribe((event:InAppBrowserEvent)=>
          {
            console.log(event.url);
              if(event.url.includes('jabecha.co.bw'))
              {
                      browser.close();       //This will close InAppBrowser Automatically when closeUrl Started
              }
          });
        }
      }, (error)=>{
        console.log(error);
      });
    });
    let nativecall = this.nativehttp.post(proxyurl+apiTokenurl,{'grant_type':'client_credentials'}, { 'Authorization': 'Basic dmo1aG5qS1BXOUhMR1c0dFZLb21YZGVtRW5FU21pbnI6V0VRT01UQVdzOEFycE5icg==','Content-Type': 'application/x-www-form-urlencoded'}
          );
          console.log('call '+nativecall);
          from(nativecall).subscribe((response) => {
              console.log('ress '+response.status+' h'+response.headers+response.data);
              this.data = JSON.parse(response.data);
              console.log(this.data['access_token']);
              
              console.log(location.origin);
              const headers1 = new HttpHeaders().set("Authorization", "Bearer "+response['access_token'])
              .set('Content-Type', 'application/json');

              let obj = {
                'merchant_key': 'c1981eeb',
                'currency': 'OUV',
                'order_id': 'MY_ORDER_ID_'+this.trip.key+Date.now(),
                'amount': ''+this.trip.fee,
                'return_url': 'http://www.jabecha.co.bw/return',
                'cancel_url': 'http://www.jabecha.co.bw/cancel',
                'notif_url': 'http://www.jabecha.co.bw/notify',
                'lang': 'en',
                'reference': 'ref Merchant'
              };


              this.nativehttp.setDataSerializer('json');
              this.nativehttp.post(proxyurl+apipayurl,obj, { 'Authorization': 'Bearer '+this.data['access_token']}

          ).then(data => {
            console.log(data);
            console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);
    this.data1 = JSON.parse(data.data);

    let options: InAppBrowserOptions = {
      location: 'no',
      hidden: 'no',
      clearcache: 'yes',
      clearsessioncache: 'yes',
      zoom: 'no',
      hardwareback: 'no',
      mediaPlaybackRequiresUserAction: 'no',
      shouldPauseOnSuspend: 'no',
      closebuttoncaption: 'Close',
      disallowoverscroll: 'no',
      toolbar: 'yes',
      enableViewportScale: 'no',
      allowInlineMediaPlayback: 'no',
      presentationstyle: 'pagesheet',
      fullscreen: 'yes',
      footer: 'no'
  };
  let options2={
    location: 'yes',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'Close',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    presentationstyle: 'pagesheet',
    fullscreen: 'yes',
    footer: 'yes'
}
    if (this.platform.is("pwa"))
    {
      console.log('bropen web');
      window.open(this.data1['payment_url'], '_self',JSON.stringify(options2) )
    }
    else{
    // const browser = this.iab.create(this.data1['payment_url'],'_self',options);

    const browser = this.iab.create(this.data1['payment_url'],'_self',options);
    console.log('bropen');
    browser.on('loadstart').subscribe((event:InAppBrowserEvent)=>
    {
      console.log(event.url);
        if(event.url.includes('jabecha.co.bw/return'))
        {
                browser.close();       //This will close InAppBrowser Automatically when closeUrl Started
          this.tripService.setPay(1);
        }
        else if(event.type=="exit" || event.url.includes('jabecha.co.bw/cancel'))
        {
          browser.close();       //This will close InAppBrowser Automatically when closeUrl Started
          this.tripService.setPay(2);
        }
    });
  }

          }).catch(error => {
            console.log(error);
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });
        });
          // from(nativecall1).subscribe((response1) => {
          //   console.log(response1.status);
          //   console.log(response1.headers);
          //     this.data1 = JSON.parse(response1.data);
          //     let options: InAppBrowserOptions = {
          //       location: 'yes',
          //       hidden: 'no',
          //       clearcache: 'yes',
          //       clearsessioncache: 'yes',
          //       zoom: 'yes',
          //       hardwareback: 'yes',
          //       mediaPlaybackRequiresUserAction: 'no',
          //       shouldPauseOnSuspend: 'no',
          //       closebuttoncaption: 'Close',
          //       disallowoverscroll: 'no',
          //       toolbar: 'yes',
          //       enableViewportScale: 'no',
          //       allowInlineMediaPlayback: 'no',
          //       presentationstyle: 'pagesheet',
          //       fullscreen: 'yes',
          //       footer: 'yes'
          //   };
          //   let options2={
          //     location: 'yes',
          //     hidden: 'no',
          //     clearcache: 'yes',
          //     clearsessioncache: 'yes',
          //     zoom: 'yes',
          //     hardwareback: 'yes',
          //     mediaPlaybackRequiresUserAction: 'no',
          //     shouldPauseOnSuspend: 'no',
          //     closebuttoncaption: 'Close',
          //     disallowoverscroll: 'no',
          //     toolbar: 'yes',
          //     enableViewportScale: 'no',
          //     allowInlineMediaPlayback: 'no',
          //     presentationstyle: 'pagesheet',
          //     fullscreen: 'yes',
          //     footer: 'yes'
          // }
          //     if (this.platform.is("pwa"))
          //     {
          //       window.open(this.data1['payment_url'], '_self',JSON.stringify(options2) )
          //     }
          //     else{
          //     const browser = this.iab.create(this.data1['payment_url'],'_self',options);
          //     console.log('bropen');
          //     browser.on('loadstart').subscribe((event:InAppBrowserEvent)=>
          //     {
          //       console.log(event.url);
          //         if(event.url.includes('jabecha.co.bw'))
          //         {
          //                 browser.close();       //This will close InAppBrowser Automatically when closeUrl Started
          //         }
          //     });
          //   }
          // });
          // });
  }
}
