import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseUser } from 'src/app/interface/firebase-user';
import { OrderService } from 'src/app/services/order.service';
// import { User } from 'firebase/compat/auth';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private as: AngularFirestore, private fauth: AngularFireAuth) {}

  // ngOnInit() {
  //   this.fauth.authState.subscribe((user) => {
  //     if (user) {
  //       const userId = user.uid;

  //       const userOrdersRef = this.as.collection('users').doc(userId).collection('orders');

  //       userOrdersRef.get().subscribe((querySnapshot) => {
  //         this.orders = [];
  //         querySnapshot.forEach((doc) => {
  //           this.orders.push({ id: doc.id, ...doc.data() });
  //           const orderData = doc.data();
  //           const order = {
  //             id: doc.id,
  //             totalItems: orderData['totalItems'],
  //             totalAmount: orderData['totalAmount'],
  //             // other order details...
  //           };
  //           this.orders.push(order);
  //         });
  //       });
  //     }
  //   });
  // }
  ngOnInit() {
    this.fauth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;

        const userOrdersRef = this.as.collection('users').doc(userId).collection('orders');

        userOrdersRef.get().subscribe((querySnapshot) => {
          this.orders = [];
          querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            const order = {
              id: doc.id,
              totalItems: orderData['totalItems'],
              totalAmount: orderData['totalAmount'],
              selectedAddress: orderData['selectedAddress'],
              selectedPaymentMethod: orderData['selectedPaymentMethod'],
              selectedProduct: orderData['selectedProduct'],
              // Include other order details as needed
              // ...
            };
            this.orders.push(order);
          });
        });
      }
    });
  }
}


// export class OrdersComponent implements OnInit {
//   orders: any[] = [];

//   constructor(private as: AngularFirestore, private fauth: AngularFireAuth) {}

//   ngOnInit() {
//     this.fauth.authState.subscribe((user) => {
//       if (user) {
//         const userId = user.uid;

//         // Reference to the user's document in 'users' collection and the 'orders' subcollection
//         const userOrdersRef = this.as.collection('users').doc(userId).collection('orders');

//         // Fetch orders for the logged-in user
//         userOrdersRef.get().subscribe((querySnapshot) => {
//           this.orders = [];
//           querySnapshot.forEach((doc) => {
//             this.orders.push({ id: doc.id, ...doc.data() });
//           });
//         });
//       }
//     });
//   }
// }

