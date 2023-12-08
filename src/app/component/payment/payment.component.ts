import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  selectedPaymentMethod: string = ''; 
  errorMessage: string = '';
 
  constructor(private paymentService: PaymentService, private fauth : AngularFireAuth, private router : Router){
    console.log(this.paymentService);
  }
  
    selectPayment(method: string) {
      // console.log('Selected payment method:', method);
      this.selectedPaymentMethod = method;
      this.paymentService.setSelectedPaymentMethod(method);
      this.errorMessage = '';
    }

    getCurrentUserId() {
      return this.fauth.authState.pipe(
        map((user) => {
          if (user) {
            return user.uid; // Return the user's UID
          } else {
            return null; // Or handle accordingly if no user is logged in
          }
        })
      );
    }

    onClickContinue(){
      // this.router.navigate(['/check']);
      if (this.selectedPaymentMethod) { // Check if a payment method is selected
        this.router.navigate(['/check']);
      } else {
        this.errorMessage = 'Please select a payment method before continuing.';
      }
    }
}

// selectedPaymentMethodSubject = new BehaviorSubject<string>('initialValue');
// selectedPaymentMethod$ = this.selectedPaymentMethodSubject.asObservable();

// selectPayment(method: string) {
//   this.selectedPaymentMethodSubject.next(method); // Notify subscribers about changes
// }

