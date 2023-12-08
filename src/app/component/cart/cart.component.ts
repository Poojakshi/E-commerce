// import { CssSelector } from '@angular/compiler';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  Shoppingcart!: Array<any>;
  message: string = '';
  private authSubscription: Subscription | undefined;

  constructor(private cart : CartService, private router: Router, private as : AngularFirestore,
    private fauth : AngularFireAuth, private us : UserService){}

  // ngOnInit(){
  //   this.cart.getCart().subscribe( cs =>
  //    {
  //     this.Shoppingcart = cs.map( x =>
  //       {
  //         return{
  //           id : x.payload.doc.id,
  //           ...x.payload.doc.data() as {}
  //         }
  //       })
  //       console.log(this.Shoppingcart);
  //    } )

  //    this.fauth.authState.subscribe(user => {
  //     if (user) {
  //       console.log('User is authenticated:', user);
  //       // Redirect to payment page or perform necessary actions
  //       this.router.navigate(['/pay']);
  //     } else {
  //       console.log('No user is logged in.');
  //       // Redirect to address page or perform necessary actions
  //       this.router.navigate(['/address']);
  //     }
  //   });
  // }

  ngOnInit() {
    // Check user authentication
    this.cart.getCart().subscribe(cs => {
      this.Shoppingcart = cs.map(x => {
        return {
          id: x.payload.doc.id,
          ...x.payload.doc.data() as {}
        };
      });
      // console.log(this.Shoppingcart);
    });
  }
  
  // fetchCartItems() {
  //   // Fetch cart items
  //   this.cart.getCart().subscribe(cs => {
  //     this.Shoppingcart = cs.map(x => {
  //       return {
  //         id: x.payload.doc.id,
  //         ...x.payload.doc.data() as {}
  //       };
  //     });
  //     console.log(this.Shoppingcart);
  //   });
  // }
  

  deleteCart(index:any){
    this.cart.deletedocfromcart(this.Shoppingcart[index].id);
    this.message = 'Item deleted successfully';
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  updateCart(index : any){
    this.cart.updatedocfromcart(this.Shoppingcart[index].id, this.Shoppingcart[index].amount);
    this.message = 'Item updated successfully!';
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  calculateTotalItems(): number {
    let totalItems = 0;
    if (this.Shoppingcart) {
        this.Shoppingcart.forEach((product) => {
            totalItems += product.amount || 0;
        });
    }
    return totalItems;
}

calculateTotalAmount(): number {
    let totalAmount = 0;
    if (this.Shoppingcart) {
        this.Shoppingcart.forEach((product) => {
            totalAmount += (product.price * product.amount) || 0;
        });
    }
    return totalAmount;
}

// async onContinueClick() {
//   this.fauth.authState.subscribe(async (user) => {
//     if (user) {
//       try {
//         const userId = user.uid;
//         const userProfile = await this.getUserProfile(userId) as any; // Explicitly cast userProfile as 'any'

//         if (userProfile.exists) {
//           const userData = userProfile.data(); // Access all user data

//           if (userData) {
//             const shippingAddresses = userData.shippingAddresses || [];

//             if (shippingAddresses.length > 0) {
//               console.log('User has shipping addresses:', shippingAddresses);
//               // User has shipping addresses, navigate to payment page
//               this.router.navigate(['/pay']);
//             } else {
//               console.log('No shipping address found.');
//               // No shipping address found, navigate to address page
//               this.router.navigate(['/address']);
//             }
//           } else {
//             console.log('User data not found.');
//             // Handle if user data is empty or not available
//           }
//         } else {
//           console.log('User profile not found.');
//           // Handle if user profile document not found
//         }
//       } catch (error) {
//         console.error('Error checking shipping address:', error);
//         // Handle error checking shipping address
//       }
//     } else {
//       console.log('No user is logged in.');
//       // Handle if user is not authenticated
//     }
//   });
// }

// async getUserProfile(userId: string) {
//   return this.as.collection('users').doc(userId).get().toPromise();
// }


// async onContinueClick() {
//   this.fauth.authState.subscribe(async (user) => {
//     if (user) {
//       const userId = user.uid;
//       console.log('Current User ID:', userId);

//       try {
//         const userProfile = await this.getUserProfile(userId) as any; // Explicitly cast userProfile as 'any'
//         if (userProfile.exists) {
//           const userData = userProfile.data(); // Access all user data

//           if (userData) {
//             const shippingAddresses = userData.shippingAddresses || [];

//             if (shippingAddresses.length > 0) {
//               console.log('User has shipping addresses:', shippingAddresses);
//               // User has shipping addresses, navigate to payment page
//               this.router.navigate(['/pay']);
//             } else {
//               console.log('No shipping address found.');
//               // No shipping address found, navigate to address page
//               this.router.navigate(['/address']);
//             }
//           } else {
//             console.log('User data not found.');
//             // Handle if user data is empty or not available
//           }
//         } else {
//           console.log('User profile not found.');
//           // Handle if user profile document not found
//         }
//       } catch (error) {
//         console.error('Error checking shipping address:', error);
//         // Handle error checking shipping address
//       }
//     } else {
//       console.log('No user is logged in.');
//       // Handle if user is not authenticated
//     }
//   });
// }


async onContinueClick() {
  this.fauth.authState.subscribe(async (user) => {
    if (user) {
      try {
        const userId = user.uid;
        await this.checkShippingAddressExistence(userId);
      } catch (error) {
        console.error('Error checking shipping address existence:', error);
        // Handle error checking shipping address existence
      }
    } else {
      console.log('No user is logged in.');
      // Handle if user is not authenticated
    }
  });
}

async checkShippingAddressExistence(userId: string) {
  try {
    const snapshot = await this.as.collection(`users/${userId}/shippingAddress`).get().toPromise();

    if (snapshot && snapshot.size > 0) {
      // console.log(`Shipping addresses found for user ID: ${userId}`);

      // Display shipping address details in the console log
      snapshot.forEach(doc => {
        // console.log('Shipping Address:', doc.data());
      });

      // User has shipping addresses, navigate to payment page
      // Replace the following line with your navigation logic
      this.router.navigate(['/pay']);
    } else {
      console.log(`No shipping addresses found for user ID: ${userId}`);
      // No shipping address found, navigate to address page
      // Replace the following line with your navigation logic
      this.router.navigate(['/address']);
    }
  } catch (error) {
    console.error('Error checking shipping address existence:', error);
    // Handle error checking shipping address existence
    throw error;
  }
}

// async checkShippingAddressExistence(userId: string) {
//   try {
//     const snapshot = await this.as.collection(`users/${userId}/shippingAddress`).get().toPromise();

//     if (snapshot && snapshot.size > 0) {
//       console.log(`Shipping addresses found for user ID: ${userId}`);
//       // User has shipping addresses, navigate to payment page
//       // Replace the following line with your navigation logic
//       this.router.navigate(['/pay']);
//     } else {
//       console.log(`No shipping addresses found for user ID: ${userId}`);
//       // No shipping address found, navigate to address page
//       // Replace the following line with your navigation logic
//       this.router.navigate(['/address']);
//     }
//   } catch (error) {
//     console.error('Error checking shipping address existence:', error);
//     // Handle error checking shipping address existence
//     throw error;
//   }
// }


async getUserProfile(userId: string) {
  return this.as.collection('users').doc(userId).get().toPromise();
}

}
