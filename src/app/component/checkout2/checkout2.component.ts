import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { ProductsService } from 'src/app/services/products.service';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AddressService } from 'src/app/services/address.service';
import { CartService } from 'src/app/services/cart.service';

interface RouteParams {
  state: {
    products: any[]; // Define the structure of 'products' array according to your data
  };
}
@Component({
  selector: 'app-checkout2',
  templateUrl: './checkout2.component.html',
  styleUrls: ['./checkout2.component.css']
})

export class Checkout2Component implements OnInit, OnDestroy {
  
  products: any[] = [];
  message: string = '';
  savedDetails: any[] = [];
  selectedAddress: any = {};
  selectedPaymentMethod: string = '';
  selectedProduct: any = {};
  successMessage: string = '';

  private paymentMethodSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;

  // @Output() productSelected = new EventEmitter<any>();
  // @Output() addressSelected = new EventEmitter<any>();

  constructor(
    private as: AngularFirestore,
    private route: ActivatedRoute,
    private cart: CartService,
    private router: Router,
    private addService: AddressService,
    private fauth: AngularFireAuth,
    private os: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.loadCartItems();

    // Retrieve initial payment method
    this.paymentMethodSubscription = this.paymentService.selectedPaymentMethod$.subscribe((updatedMethod: string) => {
      this.selectedPaymentMethod = updatedMethod;
    });

    this.paymentService.getSelectedPaymentMethod().then((initialMethod: string) => {
      this.selectedPaymentMethod = initialMethod;
    });

    // Retrieve shipping addresses
    this.fauth.currentUser.then((user) => {
      if (user) {
        const userId = user.uid;
        this.addService.getShippingAddresses(userId).subscribe((addresses) => {
          // console.log('Retrieved addresses:', addresses);
          this.savedDetails = addresses;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.paymentMethodSubscription) {
      this.paymentMethodSubscription.unsubscribe();
    }
  }

  // loadCartItems() {
  //   this.subscription = this.cart.getCart().subscribe((cs) => {
  //     this.products = cs.map((x) => {
  //       return {
  //         id: x.payload.doc.id,
  //         ...x.payload.doc.data() as {}
  //       };
  //     });
  //     console.log(this.products);
  //   });
  // }
  loadCartItems() {
    this.subscription = this.cart.getCart().subscribe((cs) => {
      // console.log('Cart items retrieved:', cs); // Log the data received
      this.products = cs.map((x) => {
        return {
          id: x.payload.doc.id,
          ...x.payload.doc.data() as {}
        };
      });
      // console.log('Products:', this.products); // Log the mapped products
    });
  }

  removeProduct(productToRemove: any) {
    this.cart.deletedocfromcart(productToRemove.id)
      .then(() => {
        this.message = 'Item deleted successfully';
        this.loadCartItems();
        setTimeout(() => {
          this.message = '';
        }, 3000);
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
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

  // selectProduct() {
  //   const product = {
  //     // Capture address details here
  //   };
  //   this.productSelected.emit(product);
  // }

  // selectAddress() {
  //   const address = {
  //     // Capture address details here
  //   };
  //   this.addressSelected.emit(address);
  // }

  useAddress(address: any): void {
    this.selectedAddress = address;
    this.savedDetails = [address];
    // console.log('Selected Address:', this.selectedAddress);
  }

  addAddress() {
    this.router.navigate(['/address']);
    // this.router.navigate(['/address'], { state: { detail } });
  }

  onAddressSelected(address: any) {
    this.selectedAddress = address;
    console.log('Selected Address:', this.selectedAddress);
  }

  // onProductSelected(product: any) {
  //   this.selectedProduct = product;
  //   console.log('Selected Product:', this.selectedProduct);
  // }
  // onProductSelected(product: any) {
  //   this.selectedProduct = product;
  //   console.log('Selected Product:', this.selectedProduct);
  //   // Additional logic or processing related to the product selection
  // }

  onProductSelected(product: any) {
    console.log('Product selected:', product); // Log the selected product here
    this.selectedProduct = product;
    console.log('Selected Product:', this.selectedProduct);
    // Additional logic or processing related to the product selection
  }
  onPaymentSelected(paymentMethod: string) {
    this.selectedPaymentMethod = paymentMethod;
    console.log('Selected Payment Method:', this.selectedPaymentMethod);
  }

  placeOrder() {
    // if (this.selectedAddress && this.products && this.selectedPaymentMethod) {
    //   this.fauth.authState.subscribe((user) => {
    //     if (user) {
    //       const userId = user.uid;
    //       this.os.placeOrder(
    //         userId,
    //         this.products,
    //         this.selectedAddress,
    //         this.selectedPaymentMethod
    //       ).subscribe(
    //         (response) => {
    //           console.log('Order placed successfully with selected data:', {
    //             userId,
    //             selectedProduct: this.products,
    //             selectedAddress: this.selectedAddress,
    //             selectedPaymentMethod: this.selectedPaymentMethod,
    //             response
    //           });
    //           // Handle success response
    //         },
    //         (error) => {
    //           console.error('Error placing order:', error);
    //           // Handle error response
    //         }
    //       );
    //     }
    //   });
    // } else {
    //   console.log('Required data missing');
    //   // Handle scenario where required data might be missing
    // }

    if (this.selectedAddress && this.products && this.selectedPaymentMethod) {
      this.fauth.authState.subscribe((user) => {
        if (user) {
          const userId = user.uid;

          const totalItems = this.calculateTotalItems();
          const totalAmount = this.calculateTotalAmount();

          const orderData = {
            selectedProduct: this.products,
            selectedAddress: this.selectedAddress,
            selectedPaymentMethod: this.selectedPaymentMethod,
            totalItems: totalItems, // Total items
            totalAmount: totalAmount // Total amount
          };

          // Reference to the user's document in 'users' collection
          const userDocRef = this.as.collection('users').doc(userId);

          // Add a new order document in the 'orders' subcollection within the user's document
          userDocRef.collection('orders').add(orderData)
            .then((docRef) => {
              this.successMessage = 'Order placed successfully!';
              console.log('Order placed successfully with selected data:', docRef.id);
              // Handle success, docRef.id contains the ID of the newly added order document
              setTimeout(() => {
                this.router.navigate(['/orders']);
              }, 3000); // Navigate after 3 seconds
            })
            
            .catch((error) => {
              console.error('Error placing order:', error);
              // Handle error response
            });
        }
      });
    } else {
      console.log('Required data missing');
      // Handle scenario where required data might be missing
    }
  }
  
}


// export class Checkout2Component implements OnInit, OnDestroy {
//   savedDetails: any[] = [];
//   selectedAddress: any = null;
//   selectedPaymentMethod: string = '';
//   selectedProduct: any = {};

//   private paymentMethodSubscription: Subscription | undefined;

//   constructor(
//     private os: OrderService,
//     private paymentService: PaymentService,
//     private fauth: AngularFireAuth,
//     private as: AngularFirestore,
//     private router: Router,
//     private addService: AddressService
//   ) {}

//   ngOnInit() {
//     this.paymentMethodSubscription = this.paymentService.selectedPaymentMethod$.subscribe((updatedMethod: string) => {
//       this.selectedPaymentMethod = updatedMethod;
//     });

//     this.paymentService.getSelectedPaymentMethod().then((initialMethod: string) => {
//       this.selectedPaymentMethod = initialMethod;
//     });

//     this.fauth.currentUser.then((user) => {
//       if (user) {
//         const userId = user.uid;
//         this.addService.getShippingAddresses(userId).subscribe((addresses) => {
//           console.log('Retrieved addresses:', addresses); // Log the retrieved addresses
//           this.savedDetails = addresses;
//         });
//       }
//     });
//   }

//   ngOnDestroy() {
//     if (this.paymentMethodSubscription) {
//       this.paymentMethodSubscription.unsubscribe();
//     }
//   }

//   addAddress() {
//     this.router.navigate(['/address']);
//     // this.router.navigate(['/address'], { state: { detail } });
//   }

//   useAddress(address: any): void {
//     this.selectedAddress = address;
//     this.savedDetails = [address];
//     console.log('Selected Address:', this.selectedAddress);
//   }

//   onProductSelected(product: any) {
//     this.selectedProduct = product;
//     console.log('Selected Product:', this.selectedProduct);
//     // Additional logic or processing related to the product selection
//   }

//   onPaymentSelected(paymentMethod: string) {
//     this.selectedPaymentMethod = paymentMethod;
//     console.log('Selected Payment Method:', this.selectedPaymentMethod);
//   }

//   placeOrder() {
//     console.log('placeOrder function triggered');
//     console.log('Selected Address:', this.selectedAddress);
//     console.log('Selected Product:', this.selectedProduct);
//     console.log('Selected Payment Method:', this.selectedPaymentMethod);

//     if (this.selectedAddress && this.selectedProduct && this.selectedPaymentMethod) {
//       this.fauth.authState.subscribe((user) => {
//         if (user) {
//           const userId = user.uid;
//           this.os.placeOrder(
//             userId,
//             this.selectedProduct,
//             this.selectedAddress,
//             this.selectedPaymentMethod
//           ).subscribe(
//             (response) => {
//               console.log('Order placed successfully with selected data:', {
//                 userId,
//                 selectedProduct: this.selectedProduct,
//                 selectedAddress: this.selectedAddress,
//                 selectedPaymentMethod: this.selectedPaymentMethod,
//                 response
//               });
//               // Handle success response
//             },
//             (error) => {
//               console.error('Error placing order:', error);
//               // Handle error response
//             }
//           );
//         }
//       });
//     } else {
//       console.log('Required data missing');
//       // Handle scenario where required data might be missing
//     }
//   }
// }





// export class Checkout2Component implements OnInit, OnDestroy{
  // private paymentMethodSubscription: Subscription | undefined;
  // constructor(private paymentService: PaymentService) {
  //   console.log(this.paymentService);
  // }

  // selectedAddress: any = {};
  // selectedPaymentMethod: string = '';
  // selectedProduct: any = {};

  // onAddressSelected(address: any) {
  //   this.selectedAddress = address;
  //   // Additional logic or processing related to the address selection
  // }

  // onProductSelected(product: any) {
  //   this.selectedProduct = product;
  //   // Additional logic or processing related to the address selection
  // }

  // onPaymentSelected(paymentMethod: string) {
  //   this.selectedPaymentMethod = paymentMethod;
  //   console.log('Selected Payment Method:', this.selectedPaymentMethod); // Check in console
  // }

  // ngOnInit() {
  //   this.selectedPaymentMethod = this.paymentService.getSelectedPaymentMethod();
  // }

  // ngOnDestroy() {
  //   // Unsubscribe from the subscription to avoid memory leaks
  //   if (this.paymentMethodSubscription) {
  //     this.paymentMethodSubscription.unsubscribe();
  //   }
  // }
  // private paymentMethodSubscription: Subscription | undefined;

  // selectedAddress: any = {};
  // selectedPaymentMethod: string = '';
  // selectedProduct: any = {};
  // // selectedAddress: any = null;
  // // selectedProduct: string = ''; // Initialized with an empty string
  // // selectedPaymentMethod: string = '';


  // constructor(
  //   private os: OrderService, private paymentService: PaymentService, private fauth: AngularFireAuth) {
  //   console.log(this.paymentService);
  // }

  // onAddressSelected(address: any) {
  //   this.selectedAddress = address;
  //   console.log('Selected Address:', this.selectedAddress);
  //   // Additional logic or processing related to the address selection
  // }

  // onProductSelected(product: any) {
  //   this.selectedProduct = product;
  //   console.log('Selected Product:', this.selectedProduct);
  //   // Additional logic or processing related to the address selection
  // }

  // onPaymentSelected(paymentMethod: string) {
  //   this.selectedPaymentMethod = paymentMethod;
  //   console.log('Selected Payment Method:', this.selectedPaymentMethod); // Check in console
  // }

  // ngOnInit() {
  //   // this.paymentMethodSubscription = this.paymentService.selectedPaymentMethod$.subscribe((updatedMethod: string) => {
  //   //   this.selectedPaymentMethod = updatedMethod;
  //   // });
  //   // this.paymentService.getSelectedPaymentMethod(); // Retrieve initial value
  //   this.paymentMethodSubscription = this.paymentService.selectedPaymentMethod$.subscribe((updatedMethod: string) => {
  //     this.selectedPaymentMethod = updatedMethod;
  //   });
  //   // Retrieve initial value of the payment method from the service
  //   this.paymentService.getSelectedPaymentMethod().then((initialMethod: string) => {
  //     this.selectedPaymentMethod = initialMethod;
  //   });
  // }

  // ngOnDestroy() {
  //   // Unsubscribe from the subscription to avoid memory leaks
  //   if (this.paymentMethodSubscription) {
  //     this.paymentMethodSubscription.unsubscribe();
  //   }
  // }
 
  // placeOrder() {
  //   console.log('placeOrder function triggered');
  //   console.log('selectedAddress:', this.selectedAddress);
  //   console.log('selectedProduct:', this.selectedProduct);
  //   console.log('selectedPaymentMethod:', this.selectedPaymentMethod);

  //   if (this.selectedAddress && this.selectedProduct && this.selectedPaymentMethod) {
  //     this.fauth.authState.subscribe((user) => {
  //       if (user) {
  //         const userId = user.uid; // Retrieve the user ID dynamically
  //         this.os.placeOrder(
  //           userId,
  //           this.selectedProduct,
  //           this.selectedAddress, // Use the selectedAddress directly here
  //           this.selectedPaymentMethod
  //         ).subscribe(
  //           (response) => {
  //             console.log('Order placed successfully with selected data:', {
  //               userId,
  //               selectedProduct: this.selectedProduct,
  //               selectedAddress: this.selectedAddress,
  //               selectedPaymentMethod: this.selectedPaymentMethod,
  //               response
  //             });
  //             // Handle success response
  //           },
  //           (error) => {
  //             console.error('Error placing order:', error);
  //             // Handle error response
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     console.log('Required data missing');
  //     // Handle scenario where required data might be missing
  //   }
  // }



//   private paymentMethodSubscription: Subscription | undefined;

//   selectedAddress: any = {};
//   selectedPaymentMethod: string = '';
//   selectedProduct: any = {};

//   constructor(
//     private os: OrderService,
//     private paymentService: PaymentService,
//     private fauth: AngularFireAuth
//   ) {}

//   onAddressSelected(address: any) {
//     this.selectedAddress = address;
//     console.log('Selected Address:', this.selectedAddress);
//     // Additional logic or processing related to the address selection
//   }

//   onProductSelected(product: any) {
//     this.selectedProduct = product;
//     console.log('Selected Product:', this.selectedProduct);
//     // Additional logic or processing related to the product selection
//   }

//   onPaymentSelected(paymentMethod: string) {
//     this.selectedPaymentMethod = paymentMethod;
//     console.log('Selected Payment Method:', this.selectedPaymentMethod);
//   }

//   ngOnInit() {
//     this.paymentMethodSubscription = this.paymentService.selectedPaymentMethod$.subscribe((updatedMethod: string) => {
//       this.selectedPaymentMethod = updatedMethod;
//     });

//     this.paymentService.getSelectedPaymentMethod().then((initialMethod: string) => {
//       this.selectedPaymentMethod = initialMethod;
//     });
//   }

//   ngOnDestroy() {
//     if (this.paymentMethodSubscription) {
//       this.paymentMethodSubscription.unsubscribe();
//     }
//   }

//   placeOrder() {
//     console.log('placeOrder function triggered');
//     console.log('Selected Address:', this.selectedAddress);
//     console.log('Selected Product:', this.selectedProduct);
//     console.log('selectedPaymentMethod:', this.selectedPaymentMethod);

//     if (this.selectedAddress && this.selectedProduct && this.selectedPaymentMethod) {
//       this.fauth.authState.subscribe((user) => {
//         if (user) {
//           const userId = user.uid;
//           this.os.placeOrder(
//             userId,
//             this.selectedProduct,
//             this.selectedAddress,
//             this.selectedPaymentMethod
//           ).subscribe(
//             (response) => {
//               console.log('Order placed successfully with selected data:', {
//                 userId,
//                 selectedProduct: this.selectedProduct,
//                 selectedAddress: this.selectedAddress,
//                 selectedPaymentMethod: this.selectedPaymentMethod,
//                 response
//               });
//               // Handle success response
//             },
//             (error) => {
//               console.error('Error placing order:', error);
//               // Handle error response
//             }
//           );
//         }
//       });
//     } else {
//       console.log('Required data missing');
//       // Handle scenario where required data might be missing
//     }
//   }
// }


// placeOrder() {
  //   console.log('placeOrder function triggered');
  //   console.log('placeOrder function triggered');
  // console.log('selectedAddress:', this.selectedAddress);
  // console.log('selectedProduct:', this.selectedProduct);
  // console.log('selectedPaymentMethod:', this.selectedPaymentMethod);
  
  //   // Ensure selectedAddress, selectedProduct, and selectedPaymentMethod are truthy and not empty strings
  //   if (
  //     this.selectedAddress !== null &&
  //     this.selectedAddress !== undefined &&
  //     this.selectedProduct !== null &&
  //     this.selectedProduct !== undefined &&
  //     this.selectedProduct.trim() !== '' && // Check for non-empty string
  //     this.selectedPaymentMethod !== null &&
  //     this.selectedPaymentMethod !== undefined &&
  //     this.selectedPaymentMethod.trim() !== '' // Check for non-empty string
  //   ) {
  //     this.fauth.authState.subscribe((user) => {
  //       if (user) {
  //         const userId = user.uid; // Retrieve the user ID dynamically
  //         this.os.placeOrder(
  //           userId,
  //           [this.selectedProduct],
  //           this.selectedAddress,
  //           this.selectedPaymentMethod
  //         ).subscribe(
  //           (response) => {
  //             console.log('Order placed successfully with selected data:', {
  //               userId,
  //               selectedProduct: this.selectedProduct,
  //               selectedAddress: this.selectedAddress,
  //               selectedPaymentMethod: this.selectedPaymentMethod,
  //               response
  //             });
  //             // Handle success response
  //           },
  //           (error) => {
  //             console.error('Error placing order:', error);
  //             // Handle error response
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     console.log('Required data missing');
  //     // Handle scenario where required data might be missing
  //   }
  // }
  
  
