import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  clearCart() {
    throw new Error('Method not implemented.');
  }

  constructor(private fs : AngularFirestore, private as : AuthService) { }

  addToCart(Product : any){
    return this.fs.collection(`users/${this.as.userId}/cart`).add(Product);
  }

  getCart(){
    return this.fs.collection(`users/${this.as.userId}/cart`).snapshotChanges();
  }

  deletedocfromcart(id : any){
    return this.fs.doc(`users/${this.as.userId}/cart/${id}`).delete();
  }

  updatedocfromcart(id : any, amount : any){
    return this.fs.doc(`users/${this.as.userId}/cart/${id}`).update({amount});
  }
}
