import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor( private as : AngularFirestore, private fauth : AngularFireAuth) { }

  addNewUser(id: string, name: string, address: string, email: string): Promise<void> {
    return this.as.collection('users').doc(id).set({ name, address, email });
  }

  async checkUserProfile(userId: string): Promise<boolean> {
    try {
      const docSnapshot = await this.as.collection('users').doc(userId).get().toPromise();
      return docSnapshot?.exists ?? false; // Use optional chaining and nullish coalescing operator
    } catch (error) {
      console.error('Error checking user profile:', error);
      return false; // Default to false in case of error
    }
  }

  // addShippingAddress(addressData: any) {
  //   this.fauth.authState.subscribe((user) => {
  //     if (user) {
  //       const userId = user.uid; // Get the user's ID dynamically
  //       this.as.collection('users').doc(userId)
  //         .collection('shippingAddress').add(addressData)
  //         .then(() => {
  //           console.log('Shipping address added successfully for user:', userId);
  //         })
  //         .catch((error) => {
  //           console.error('Error adding shipping address:', error);
  //         });
  //     } else {
  //       console.log('No user is logged in.');
  //       // Handle if user is not authenticated
  //     }
  //   });
  // }



//  async addShippingAddress(userId: string, addressData: any): Promise<void> {
//     return this.as.collection(`users/${userId}/shippingAddress`).add(addressData)
//       .then(() => {
//         console.log('Shipping address added successfully for user:', userId);
//       })
//       .catch((error) => {
//         console.error('Error adding shipping address:', error);
//         throw error; // Re-throw the error for the caller to handle
//       });
//   }

// async getUserProfile(userId: string) {
//   return this.as.collection('users').doc(userId).get().toPromise();
// }
  async addShippingAddress(userId: string, addressData: any): Promise<void> {
  try {
    const addedDocRef = await this.as.collection(`users/${userId}/shippingAddress`).add(addressData);
    console.log('Shipping address added successfully for user:', userId);

    // Retrieve the added shipping details
    const addedDoc = await addedDocRef.get();
    if (addedDoc.exists) {
      const addedAddress = addedDoc.data();
      console.log('Added Shipping Details:', addedAddress);
      return Promise.resolve(); // Or return the addedAddress or any other relevant data
    } else {
      console.log('Shipping details not found.');
      return Promise.reject(new Error('Shipping details not found.'));
    }
  } catch (error) {
    console.error('Error adding shipping address:', error);
    throw error;
  }
}
}

  