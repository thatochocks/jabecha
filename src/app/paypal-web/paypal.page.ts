import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { TripService } from '../services/trip.service';
import { Router } from '@angular/router';


// interface Window {
//   window?: any;
// }
// declare var window: Window;

@Component({
  selector: 'app-paypal',
  templateUrl: 'paypal.page.html',
  styleUrls: ['paypal.page.scss'],
})
export class PaypalPage implements OnInit{
  paymentAmount: string = '3.33';
  currency: string = 'BWP';
  currencyIcon: string = 'P';
  trip: any = {};
  constructor(private payPal: PayPal, private tripService: TripService, private router: Router) {
    let _this = this;
    let tripId = this.tripService.getId();
    console.log(tripId);
    let ref = this.tripService.getTrip(tripId).valueChanges().subscribe((snapshot: any) => {
      if (snapshot != null) {
        this.trip = snapshot;
        this.paymentAmount = ''+(this.trip.fee_taxed/11.65).toFixed(2);
        console.log(snapshot);
        console.log(this.trip)
        console.log(this.paymentAmount)

        setTimeout(() => {
          // Render the PayPal button into #paypal-button-container
          <any>window['paypal'].Buttons({
    
            // Set up the transaction
            createOrder: function (data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: _this.paymentAmount
                  }
                }]
              });
            },
    
            // Finalize the transaction
            onApprove: function (data, actions) {
              return actions.order.capture()
                .then(function (details) {
                  console.log(details);
                  // Show a success message to the buyer
                  alert('Transaction completed by ' + details.payer.name.given_name + '!');
                  _this.tripService.setPay(1);
                  _this.router.navigateByUrl('tracking');
                })
                .catch(err => {
                  console.log(err);
                  _this.tripService.setPay(2);
                  _this.router.navigateByUrl('tracking');
                })
            }
          }).render('#paypal-button-container');
        }, 500)
      }
    });
    console.log(this.trip);
    

  }
  back(){
    this.tripService.setPay(2);
    this.router.navigateByUrl('/home');
  }
  ngOnInit() {
  }

}
