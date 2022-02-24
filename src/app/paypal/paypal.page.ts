import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { TripService } from '../services/trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paypal',
  templateUrl: 'paypal.page.html',
  styleUrls: ['paypal.page.scss'],
})
export class PaypalPage implements OnInit{
    
    constructor(private payPal: PayPal, private tripService: TripService, private router: Router) { }
  
  paymentAmount: string = "3.33";
  currency: string = 'USD';
  currencyIcon: string = 'P';
  trip: any = {};
  ngOnInit() {
    
  }
  back(){
    this.tripService.setPay(2);
    this.router.navigateByUrl('/home');
  }
  payWithPaypal() {
    let tripId = this.tripService.getId();
    console.log(tripId);
    let ref = this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
      if (snapshot != null) {
        this.trip = snapshot;
        this.paymentAmount = (this.trip.fee_taxed/11.65).toFixed(2);
        console.log(snapshot);
        console.log(this.trip)
        console.log(this.paymentAmount)
      }
    });
    console.log("Pay ????");
    this.payPal.init({
      PayPalEnvironmentProduction: 'ATRzktc2MACHsOzIqduUTXqMvXGiGgpa23y5UFcafyUnhU3IjGewXgFP44q35X-ckp6YzGVVNW-0Ypjg',
      PayPalEnvironmentSandbox: 'AeKW5Z_2iANsohtYA2R9oqfnMEXLBVLWKaY-2wpZYuIWdCcSL7KStgWYaeVcVJzJb4eCu4kF09osgp1W'
    }).then(() => {
    console.log(this.paymentAmount);
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(''+this.paymentAmount, this.currency, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          this.tripService.setPay(1);
        this.router.navigateByUrl('tracking');
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          this.tripService.setPay(2);
        this.router.navigateByUrl('tracking');
        // Error or render dialog closed without being successful
        });
      }, () => {
        this.tripService.setPay(2);
        this.router.navigateByUrl('tracking');
        // Error in configuration
      });
    }, () => {
      this.tripService.setPay(2);
        this.router.navigateByUrl('tracking');
        // Error in initialization, maybe PayPal isn't supported or something else
    });
  }
}
