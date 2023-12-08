import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressService } from 'src/app/services/address.service';


@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit, OnDestroy{
  savedDetails: any[] = [];
  selectedAddress: any = null;
  useAddressSelected: boolean = false;
  savedAddress: any;
  shippingAddresses: any[] = [];

  private subscription: Subscription | undefined;

  @Output() addressSelected = new EventEmitter<any>();

  // Capture shipping address
  selectAddress() {
    const address = {
      // Capture address details here
    };
    this.addressSelected.emit(address);
  }

  constructor(private as: AngularFirestore, private router : Router, private addService : AddressService, private fauth : AngularFireAuth) {}

  ngOnInit() {
    this.fauth.currentUser.then((user) => {
      if (user) {
        const userId = user.uid;
        this.addService.getShippingAddresses(userId).subscribe((addresses) => {
          // console.log('Retrieved addresses:', addresses); // Log the retrieved addresses
          this.savedDetails = addresses;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }

  addAddress() {
    this.router.navigate(['/address']);
    // this.router.navigate(['/address'], { state: { detail } });
  }

  useAddress(address: any): void {
    this.selectedAddress = address;
    this.savedDetails = [address];
    this.useAddressSelected = true;
    // console.log('Selected Address:', this.selectedAddress);
  }
}



// export class AddressDetailsComponent implements OnInit, OnDestroy{
//   savedDetails: any[] = [];
//   private subscription: Subscription | undefined;

//   @Output() addressSelected = new EventEmitter<any>();

//   // Capture shipping address
//   selectAddress() {
//     const address = {
//       // Capture address details here
//     };
//     this.addressSelected.emit(address);
//   }

//   constructor(private as: AngularFirestore, private router : Router) {}

//   ngOnInit(): void {
//     this.as.collection('shippingDetails').valueChanges().subscribe((data: any[]) => {
//       this.savedDetails = data; // Fetch saved shipping details
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.subscription) {
//       this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
//     }
//   }

//   editDetails(detail: any) {
//     this.router.navigate(['/address'], { state: { detail } });
//   }
// }
