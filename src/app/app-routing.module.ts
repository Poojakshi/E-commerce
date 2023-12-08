import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AccountComponent } from './component/account/account.component';
import { CartComponent } from './component/cart/cart.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { LoginComponent } from './component/login/login.component';
import { LogoutComponent } from './component/logout/logout.component';
import { OrdersComponent } from './component/orders/orders.component';
import { ProductsComponent } from './component/products/products.component';
import { SignupComponent } from './component/signup/signup.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { GuardService } from './services/guard.service';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { AddressComponent } from './component/address/address.component';
import { Checkout2Component } from './component/checkout2/checkout2.component';
import { PaymentComponent } from './component/payment/payment.component';
import { AddressDetailsComponent } from './component/address-details/address-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'account', component: AccountComponent, canActivate:[GuardService]},
  { path: 'cart', component: CartComponent, canActivate:[GuardService]},
  { path: 'contact', component: ContactusComponent},
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent, canActivate:[GuardService]},
  { path: 'orders', component: OrdersComponent},
  { path: 'products', component: ProductsComponent},
  { path: 'change', component: ChangePasswordComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'address', component: AddressComponent},
  { path: 'check', component: Checkout2Component},
  { path: 'pay', component: PaymentComponent},
  { path: 'adetails', component: AddressDetailsComponent},
  { path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
