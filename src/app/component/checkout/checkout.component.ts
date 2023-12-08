import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

interface RouteParams {
  state: {
    products: any[]; // Define the structure of 'products' array according to your data
  };
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit{
  products: any[] = [];
  message:string='';
  savedDetails: any[] = [];
  
   constructor(private as: AngularFirestore, private route: ActivatedRoute, private cart : CartService) {}

   @Output() productSelected = new EventEmitter<any>();

   selectProduct() {
    const product = {
      // Capture address details here
    };
    this.productSelected.emit(product);
  }

  ngOnInit() {
    
    this.loadCartItems();
  }

  loadCartItems() {
    
    this.cart.getCart().subscribe( cs =>
      {
       this.products = cs.map( x =>
         {
           return{
             id : x.payload.doc.id,
             ...x.payload.doc.data() as {}
           }
         })
         console.log(this.products);
      } )
  }
  removeProduct(productToRemove: any) {
    
    this.cart.deletedocfromcart(productToRemove.id)
    .then(() => {
      this.message = 'Item deleted successfully';
      // Reload cart items after removal
      this.loadCartItems();
      setTimeout(() => {
        this.message = '';
      }, 3000);
    })
    .catch((error) => {
      console.error('Error deleting product:', error);
      // Handle error or display appropriate message
    });
  }

  calculateTotalItems(): number {
    let totalItems = 0;
    if (this.products) {
        this.products.forEach((product) => {
            totalItems += product.amount || 0;
        });
    }
    
    return totalItems;
}

calculateTotalAmount(): number {
    let totalAmount = 0;
    if (this.products) {
        this.products.forEach((product) => {
            totalAmount += (product.price * product.amount) || 0;
        });
    }
    return totalAmount;
}
  
}
  