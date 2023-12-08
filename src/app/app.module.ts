import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { HttpTransferCacheOptions } from '@angular/common/http';

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { LogoutComponent } from './component/logout/logout.component';
import { CartComponent } from './component/cart/cart.component';
import { AccountComponent } from './component/account/account.component';
import { OrdersComponent } from './component/orders/orders.component';
import { ProductsComponent } from './component/products/products.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProfileComponent } from './profile/profile.component';
// import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { AddressComponent } from './component/address/address.component';
import { Checkout2Component } from './component/checkout2/checkout2.component';
import { PaymentComponent } from './component/payment/payment.component';
import { AddressDetailsComponent } from './component/address-details/address-details.component';
import { PaymentService } from './services/payment.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    CartComponent,
    AccountComponent,
    OrdersComponent,
    ProductsComponent,
    NavbarComponent,
    ContactusComponent,
    ProfileComponent,
    ChangePasswordComponent,
    CheckoutComponent,
    AddressComponent,
    Checkout2Component,
    PaymentComponent,
    AddressDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    NgbModule,
    HttpClientModule,
    // HttpTransferCacheOptions,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(
    {
    apiKey: "AIzaSyDeSqHB8KfSZua3U-EC3ma2hqRTrLxJ_C8",
    authDomain: "e-commerce-c8d98.firebaseapp.com",
    projectId: "e-commerce-c8d98",
    storageBucket: "e-commerce-c8d98.appspot.com",
    messagingSenderId: "730499232938",
    appId: "1:730499232938:web:2994107ff571ddae904cd3",
    measurementId: "G-HLL6R1QT84"
    }),

    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [AngularFirestore, PaymentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
