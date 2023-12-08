import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { BehaviorSubject,tap, Observable, catchError, of } from 'rxjs';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private shippingAddressSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private as : AngularFirestore){}
  
  // setShippingAddress(addresses: any[]) {
  //   this.shippingAddressSubject.next(addresses);
  // }

  getShippingAddresses(userId: string): Observable<any[]> {
    return this.as.collection(`users/${userId}/shippingAddress`).valueChanges();
  }
}
