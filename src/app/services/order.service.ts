import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private as: AngularFirestore) { }

  getUserOrders(userId: string): Observable<any[]> {
    return this.as
      .collection(`users/${userId}/orders`)
      .valueChanges();
  }
  sendProductData(productData: any): Promise<any> {
    return this.as.collection('products').add(productData);
  }

  // Method to send address data to Firestore
  sendAddressData(addressData: any): Promise<any> {
    return this.as.collection('addresses').add(addressData);
  }

  // Method to create an order combining product and address data in Firestore
  createOrder(orderData: any): Promise<any> {
    return this.as.collection('orders').add(orderData);
  }

  placeOrder(userId: string, cartProducts: any[], selectedAddress: any, selectedPayment: string): Observable<any> {
    const orderData = {
      userId: userId,
      cartProducts: cartProducts,
      selectedAddress: selectedAddress,
      selectedPayment: selectedPayment,
      timestamp: new Date() // Optionally, include a timestamp for the order
    };

    // Use Firestore to add the order to your 'orders' collection
    return new Observable<any>((observer) => {
      this.as.collection('orders').add(orderData)
        .then((docRef) => {
          observer.next({ success: true, orderId: docRef.id });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  
}

