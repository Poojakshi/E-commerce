import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

interface PaymentData {
  selectedPaymentMethod?: string;
  // Include other fields if present in the payment document
}
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private userId: string | null = null;
  private selectedPaymentMethod: string = '';
  // private userId: string | null = null;
  private selectedPaymentMethodSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedPaymentMethod$ = this.selectedPaymentMethodSubject.asObservable();

  constructor(private fs: AngularFirestore, private fauth: AngularFireAuth) {
    this.fauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.retrieveSelectedPaymentMethod();
      } else {
        this.userId = null;
        this.selectedPaymentMethod = ''; // Reset payment method when user logs out
      }
    });
  }

  private retrieveSelectedPaymentMethod() {
    if (this.userId) {
      this.fs.collection(`users/${this.userId}/payment`).doc('selectedPayment').get()
        .toPromise()
        .then((doc) => {
          if (doc && doc.exists) {
            const data = doc.data() as PaymentData; // Type assertion to PaymentData
            if (data && data.selectedPaymentMethod) {
              this.selectedPaymentMethod = data.selectedPaymentMethod;
            }
          }
        })
        .catch((error) => {
          console.error('Error retrieving selected payment method:', error);
        });
    }
  }

  setSelectedPaymentMethod(method: string) {
    if (this.userId) {
      this.fs.collection(`users/${this.userId}/payment`).doc('selectedPayment').set({
        selectedPaymentMethod: method
      })
      .then(() => {
        // console.log('Selected payment method stored in Firestore');
        this.selectedPaymentMethod = method; // Update local value after setting in Firestore
      })
      .catch((error) => {
        console.error('Error storing selected payment method:', error);
      });
    } else {
      console.error('User ID not available');
    }
  }

  getSelectedPaymentMethod(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.userId) {
        this.fs.collection(`users/${this.userId}/payment`).doc('selectedPayment').get()
          .toPromise()
          .then((doc) => {
            if (doc && doc.exists) {
              const data = doc.data() as PaymentData;
              const selectedPaymentMethod = data?.selectedPaymentMethod || '';
              resolve(selectedPaymentMethod);
            } else {
              resolve(''); // Resolve with default value if document doesn't exist
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject('User ID not available');
      }
    });
  }
}