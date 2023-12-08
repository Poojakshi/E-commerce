import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/services/user.service';
import { AddressService } from 'src/app/services/address.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{
  addressForm!: FormGroup; // Define the form group for address
  userId: string | null = null;
  shippingDetails: any = {
    address: {
      area: '',
      pincode: '',
      city: '',
      state: '',
      name: '',
      number: ''
    } 
  };

  @Output() addressSelected = new EventEmitter<any>();
  selectAddress() {
    const address = {
    };
    this.addressSelected.emit(address);
  }

  indianStates: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh', 'Delhi', 'Lakshadweep', 'Puducherry'
    // Add more states as needed
  ];
  detailsSaved: boolean = false;

  constructor(private as: AngularFirestore, private router : Router, private route : ActivatedRoute,
     private formBuilder: FormBuilder, private fauth: AngularFireAuth, private us : UserService, 
     private addService : AddressService){ }  
  
  //   saveDetails() {
  //   if (this.addressForm.valid) {
  //     this.fauth.authState.subscribe((user) => {
  //       if (user) {
  //         const userId = user.uid; // Get the user's ID
  //         const { area, city, pincode, state, name, number } = this.shippingDetails.address;
  //         const newData = {
  //           address: { area, city, pincode, state, name, number } // Include name and number in the address object
  //         };

  //         this.as.collection('users').doc(userId).collection('shippingDetails').add(newData)
  //           .then(() => {
  //             this.detailsSaved = true;
  //             console.log('Shipping Details saved for user:', userId);
  //           })
  //           .catch((error) => {
  //             console.error('Error saving details:', error);
  //           });
  //       } else {
  //         console.log('No user is logged in.');
  //         // Handle if user is not authenticated
  //       }
  //     });
  //   }
  // }
  // saveDetails() {
  //   if (this.addressForm.valid && this.userId) {
  //     const addressData = this.addressForm.value;
  
  //     this.us.addShippingAddress(this.userId, addressData)
  //       .then(() => {
  //         this.detailsSaved = true;
  //         // console.log('Shipping address saved for user:', this.userId);
  //       })
  //       .catch((error) => {
  //         console.error('Error saving shipping address:', error);
  //       });
  //   }
  // }
  saveDetails() {
    if (this.addressForm.valid && this.userId) {
      const addressData = this.addressForm.value;

      this.us.addShippingAddress(this.userId, addressData)
        .then(() => {
          this.detailsSaved = true;
          this.router.navigate(['/pay']);
          // this.addService.setSavedAddress(addressData); // Share saved address
        })
        .catch((error) => {
          console.error('Error saving shipping address:', error);
        });
    }
  }

  ngOnInit(): void {
    this.fauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Get the user's ID
      } else {
        // Handle if user is not authenticated
      }
    });
    // this.shippingDetails.address = {
    //   area: '',
    //   pincode: '',
    //   city: '',
    //   state: '',
    //   name: '',
    //   number: ''
    // };
    this.addressForm = this.formBuilder.group({
      // Define your form controls here based on your requirements
      area: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[0-9]*')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      state: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      number: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
    });
   }  
}



  // saveDetails() {
  //   if (this.addressForm.valid) {
  //     // Form is valid, proceed to save the details
  //     this.as.collection('shippingDetails').add(this.shippingDetails)
  //       .then(() => {
  //         this.detailsSaved = true; // Show success message or perform other actions
  //       })
  //       .catch((error) => {
  //         console.error('Error saving details:', error);
  //       });
  //   } else {
  //     // Form is invalid, do not save the details
  //     // You can also display an error message or handle it as per your requirement
  //     console.log('Form is invalid. Cannot save empty form.');
  //   }
  // }

  // saveDetails() {
  //   if (this.addressForm.valid) {
  //     // Form is valid, proceed to save the details
  //     this.as.collection('shippingDetails').add(this.shippingDetails)
  //       .then(() => {
  //         this.detailsSaved = true; // Show success message or perform other actions
  //       })
  //       .catch((error) => {
  //         console.error('Error saving details:', error);
  //       });
  //   } else {
  //     // Form is invalid, do not save the details
  //     // You can also display an error message or handle it as per your requirement
  //     console.log('Form is invalid. Cannot save empty form.');
  //   }
  // }
  

// ngOnInit(): void {
//   this.addressForm = this.formBuilder.group({
//     area: ['', Validators.required],
//     pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[0-9]*')]],
//     city: ['', Validators.pattern('[a-zA-Z]+')],
//     state: ['', Validators.required]
//   });

//   contact : this.formBuilder.group({
//     name: ['', Validators.required],
//     number: ['']
//   });

//   this.route.queryParams.subscribe((params) => {
//     const detail = history.state.detail;
//     if (detail) {
//       // Populate the form fields with the received detail for editing
//       this.populateForm(detail);
//     }
//   });
// }

// populateForm(detail: any) {
//   this.addressForm.patchValue({
//     area: detail.address.area || '',
//     pincode: detail.address.pincode || '',
//     city: detail.address.city || '',
//     state: detail.address.state || '',
//     name: detail.contact?.name || '',
//     number: detail.contact?.number || ''
//   });
// }
