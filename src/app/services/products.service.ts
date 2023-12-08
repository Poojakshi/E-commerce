import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private selectedProducts: any[] = [];

  constructor( private fs : AngularFirestore, private storage : AngularFireStorage) { }

  getAllProducts(){
    return this.fs.collection('Products').valueChanges();
  }

  addProduct(Name : string, Price : number, image : File){
    let ref = this.storage.ref('Productsimages/' + image.name)
     ref.put(image).then ( () =>
     {
      ref.getDownloadURL().subscribe(ProductPath =>
        {
          this.fs.collection('Products').add(
            {
              Name,
              Price,
              ProductPath
            }
          )
        })
     }
    );
    
  }

  getProducts(){
    return this.fs.collection('Products').snapshotChanges();
  }
  
  updateProducts(id:any, Price:any){
    return this.fs.doc(`Products/${id}`).update({Price})
  }

  delelteProducts(id:any){
     return this.fs.doc(`Products/${id}`).delete()
  }

  updateSelectedProducts(products: any[]) {
    this.selectedProducts = products;
  }

  getSelectedProducts() {
    return this.selectedProducts;
  }
}
