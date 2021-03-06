import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { Place } from "./place";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private id: any;
  private trips: any;
  private currency: string;
  private origin: any;
  private destination: any;
  private distance: number;
  private fee: number;
  private note: string;
  private paymentMethod: any = 'cash';
  private vehicle: any;
  private promocode: any;
  private discount = 0;
  private fee_taxed: any;
  private tax: any;
  private type: any;
  private rawfee: number;
  // vehicle's icon
  private icon: any;
  private commission_type;
  private commission_value;
  private commission;
  private availableDrivers: Array<any> = [];
  private nthome: any = [];
  private pay: boolean = false;
  private status = '';

  constructor(private db: AngularFireDatabase, private authService: AuthService) {

  }
  nthomeTransfer(driverId){
    return this.db.object('trips/'+this.getId()).set({nthomeTransfer : driverId} );
  }
  getNthome(){
    return this.nthome;
  }
  setNthome(nthome, totalPrice, offer){
    this.setFee(totalPrice+offer);
    this.setFeeTaxed(totalPrice+offer);
    this.setCommissionValue(offer);
    this.setCommission(offer);
    return this.nthome = nthome;
  }
  
  getAll() {
    return this.trips;
  }

  setId(id) {
    return this.id = id;
  }

  getId() {
    return this.id;
  }
  setPay(pay) {
    return this.db.object('trips/'+this.getId()+'/payStatus').set(pay);
  }
  sendOtp(){
    return this.db.object('trips/'+this.getId()+'/status').set('going');
  }
  getStatus(){
    return this.status;
  }
  setStatus(status){
    this.status = status;
    return this.db.object('trips/'+this.getId()+'/status').set(status);
  }
  getPay() {
    return this.db.object('trips/'+this.getId()+'/payStatus')
  }
  setCurrency(currency) {
    return this.currency = currency;
  }

  getCurrency() {
    return this.currency;
  }

  setOrigin(vicinity, lat, lng) {
    let place = new Place(vicinity, lat, lng);
    return this.origin = place.getFormatted();
  }

  getOrigin() {
    return this.origin;
  }

  setDestination(vicinity, lat, lng) {
    let place = new Place(vicinity, lat, lng);
    return this.destination = place.getFormatted();
  }

  getDestination() {
    return this.destination
  }

  setDistance(distance) {
    return this.distance = distance;
  }

  getDistance() {
    return this.distance;
  }

  setFee(fee) {
    return this.fee = fee;
  }

  getFee() {
    return this.fee;
  }

  setRawFee(fee) {
    return this.rawfee = fee;
  }

  getRawFee() {
    return this.rawfee;
  }

  setTax(tax) {
    return this.tax = tax;
  }

  getTax() {
    return this.tax;
  }

  setType(type) {
    return this.type = type;
  }

  getType() {
    return this.type;
  }

  setFeeTaxed(fee_taxed) {
    return this.fee_taxed = fee_taxed;
  }

  getFeeTaxed() {
    return this.fee_taxed;
  }

  setCommissionType(commission_type) {
    return this.commission_type = commission_type;
  }

  getCommissionType() {
    return this.commission_type;
  }

  setCommission(commission) {
    return this.commission = commission;
  }

  getCommission() {
    return this.commission;
  }

  setCommissionValue(commission_value) {
    return this.commission_value = commission_value;
  }

  getCommissionValue() {
    return this.commission_value;
  }

  setNote(note) {
    return this.note = note;
  }

  getNote() {
    return this.note;
  }

  setPromo(promocode) {
    return this.promocode = promocode;
  }
  getPromo() {
    return this.promocode;
  }

  setDiscount(discount) {
    return this.discount = discount;
  }
  getDiscount() {
    return this.discount;
  }

  setPaymentMethod(method) {
    return this.paymentMethod = method;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  setVehicle(vehicle) {
    return this.vehicle = vehicle;
  }

  getVehicle() {
    return this.vehicle;
  }

  setIcon(icon) {
    return this.icon = icon;
  }

  getIcon() {
    return this.icon;
  }

  setAvailableDrivers(vehicles) {
    console.log(vehicles);
    this.availableDrivers = vehicles;
  }

  getAvailableDrivers() {
    return this.availableDrivers;
  }

  getTrip(id) {
    return this.db.object('trips/' + id);
  }

  getTrips() {
    let user = this.authService.getUserData();
    console.log(user);
    return this.db.list('trips', res => res.orderByChild('passengerId').equalTo(user.uid));
  }

  cancelTrip(id) {
    return this.db.object('trips/' + id).update({ status: 'canceled' })
  }

  finishTrip(id) {
    return this.db.object('trips/' + id).update({ status: 'finished' })
  }

  rateTrip(tripId, stars, feedback) {
    return this.db.object('trips/' + tripId).update({
      rating: parseInt(stars),
      feedback: feedback
    });
  }
}
