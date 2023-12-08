import { Component, OnInit } from '@angular/core';
import { Product } from './../../interface/products.interface';
import { ProductsService } from 'src/app/services/products.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  selectedProduct: any;
  add : number = -1
  successMessage: string = '';

  Products : Array<any> = [
    
  ];

  constructor(private ps : ProductsService, private cart : CartService, private as : AuthService, private router:Router){}

  ngOnInit(){
    this.ps.getAllProducts().subscribe(
      data => this.Products = data
      
    )
    
    // this.ps.getAllProducts().subscribe(
    //   data => {
    //     this.ps.updateSelectedProducts(data); // Update selected products in ProductService
    //   }
    // );
  }

  addToCart(index: number){
    if(this.as.userId)
    this.add = +index
    else
    this.router.navigate(['/login']);
    // console.log('Added', this.Products[index]);
  }

  buy(amount:any){
    let selectedProduct = this.Products[this.add]

    let data = {
      name : selectedProduct.Name,
      price : selectedProduct.Price,
      amount : +amount

    }
    // console.log(data)
    // this.cart.addToCart(data)
    // .then(() => this.add= -1)
    this.cart.addToCart(data)
      .then(() => {
        this.add = -1;
        this.successMessage = 'Product added to cart successfully!';
        setTimeout(() => {
          this.successMessage = ''; // Clear the success message after a few seconds
        }, 3000); // 3000 milliseconds (adjust as needed)
      })
    .catch( err => console.log())
  }  
  
  // buyNow(product:any) {
  //   // this.selectedProduct = product;
  //   // this.router.navigate(['/check'], { state: { productDetails: this.selectedProduct } });
  //   this.router.navigate(['/check'], { state: { productDetails: product } });
  // }
}
