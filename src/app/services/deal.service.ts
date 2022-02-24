import { Injectable } from '@angular/core';
import { DEAL_STATUS_PENDING } from 'src/environments/environment.prod';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
// import { type } from 'os';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
  }

  // sort driver by rating & distance
  sortDriversList(drivers: Array<any>) {
    return drivers.sort((a, b) => {
      return (a.rating - a.distance / 5) - (b.rating - b.distance / 5);
    })
  }

  // make deal to driver
  makeDeal(driverId, origin, destination, distance, fee, currency, note, paymentMethod, promocode, discount, tax, type, fee_taxed, rawfee, commission_type, commission_value, commission, nthome) {
    let user = this.authService.getUserData();
    return this.db.object('deals/' + driverId).set({
      passengerId: user.uid,
      currency: currency,
      origin: origin,
      destination: destination,
      distance: distance,
      fee: fee,
      note: note,
      paymentMethod: paymentMethod,
      status: DEAL_STATUS_PENDING,
      createdAt: Date.now(),
      promocode: promocode,
      discount: discount,
      tax: tax,
      type: type,
      fee_taxed: fee_taxed,
      rawfee: rawfee,
      commission_type: commission_type,
      commission_value: commission_value,
      commission: commission,
      payStatus: 0,
      nthome: nthome
    });
  }

  // get deal by driverId
  getDriverDeal(driverId) {
    return this.db.object('deals/' + driverId);
  }

  // remove deal
  removeDeal(driverId) {
    return this.db.object('deals/' + driverId).remove();
  }
}
