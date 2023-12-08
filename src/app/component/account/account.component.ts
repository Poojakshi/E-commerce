import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';

interface Product {
  id: string;
  Name: string; // or name: string;
  Price: number;
  ProductPath: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {

  @ViewChild('image') image!: ElementRef;
  ProductsArr!: Array<any>;
  message: string = '';

constructor(private products : ProductsService){}

  ngOnInit() {
    this.products.getProducts().subscribe( cs =>
      {
        this.ProductsArr = cs.map( x=>
          {
            return{
              id: x.payload.doc.id,
              ...x.payload.doc.data() as {}
            }
          })
          // console.log(this.ProductsArr)
      })
  }
  
  
addNewProduct(f: NgForm, image:any) {
  let name = f.value.name,
      price = f.value.price

  if (this.image && this.image.nativeElement instanceof HTMLInputElement) {
    const fileInput = this.image.nativeElement as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const image = fileInput.files[0];
      this.products.addProduct(name, price, image);
    }
  }
}

updateProductPrice(index:any){
  this.products.updateProducts(this.ProductsArr[index].id, this.ProductsArr[index].Price);
  this.message = 'Item updated successfully';
    setTimeout(() => {
      this.message = '';
    }, 3000);
}

deleteProduct(index:any){
  this.products.delelteProducts(this.ProductsArr[index].id);
  this.message = 'Item deleted successfully!';
    setTimeout(() => {
      this.message = '';
    }, 3000);
}
}





















  // let name = f.value.name,
  //     price = f.value.price,
  //     image = console.log(this.image.nativeElement as HTMLInputElement).files[0]


  // this.products.addNewProduct(name, price, image)


// let name = f.value.name,
  //     price = f.value.price,
  //     image = (this.image.nativeElement as HTMLInputElement).files[0]

  // console.log(f.value);
  // console.log((this.image.nativeElement as HTMLInputElement).files[0])
  // if (this.image && this.image.nativeElement) {
  //   const fileInput = this.image.nativeElement as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const selectedFile = fileInput.files[0];
  //     console.log(selectedFile);
  //   } else {
  //     console.log('No file selected.');
  //   }
  // } else {
  //   console.log('Image element not found.');
  // }

  // addNewProduct(f:NgForm,image:any){
  //   console.log(f.value);
  //   console.log((this.image.nativeElement as HTMLInputElement).files[0])
    // console.log(f.value);
    // if (this.image && this.image.nativeElement instanceof HTMLInputElement) {
    //   const selectedFile = this.image.nativeElement.files[0];
    //   console.log(selectedFile);
    // }
//   }
// }