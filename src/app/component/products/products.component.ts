import { Component, OnInit } from '@angular/core';
import { Product } from './../../interface/products.interface';
import { ProductsService } from 'src/app/services/products.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  // add : number = -1

  // Products : Array<any> = [
  // ];

  // constructor(private ps : ProductsService, private cart : CartService){}

  // ngOnInit(){
  //   this.ps.getAllProducts().subscribe(
  //     data => this.Products = data
  //   )
  // }

  // addToCart(index: number){
  //   this.add = +index
  // }

  // buy(amount:any){
  //   let selectedProduct = this.Products[this.add]

  //   let data = {
  //     name : selectedProduct.Name,
  //     price : selectedProduct.Price,
  //     amount : +amount

  //   }
  //   this.cart.addToCart(data)
  //   .then(() => this.add= -1)
  //   .catch( err => console.log())
  // }  

  // featuredProducts: any[] = [];
  // fruitCategories: string[] = [];
  // promotion: any = {};
  // testimonials: any[] = [];
}
