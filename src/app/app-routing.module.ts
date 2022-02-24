import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'tracking', loadChildren: './tracking/tracking.module#TrackingPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule' },
  { path: 'rating', loadChildren: './rating/rating.module#RatingPageModule' },
  { path: 'forget', loadChildren: './forget/forget.module#ForgetPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'rideinfo/:id', loadChildren: './rideinfo/rideinfo.module#RideinfoPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  {
    path: 'paypal',
    loadChildren: './paypal/paypal.module#PaypalPageModule'
  },
  {
    path: 'paypal-web',
    loadChildren: './paypal-web/paypal.module#PaypalPageModule'
  },
  { path: 'nthome', loadChildren: './nthome/nthome.module#NthomePageModule' },
  { path: 'credits', loadChildren: './credits/credits.module#CreditsPageModule' },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'login2',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register2',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home2',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'favourite',
    loadChildren: () => import('./pages/favourite/favourite.module').then(m => m.FavouritePageModule)
  },
  {
    path: 'history2',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'payments2',
    loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsPageModule)
  },
  {
    path: 'choose-address',
    loadChildren: () => import('./pages/choose-address/choose-address.module').then(m => m.ChooseAddressPageModule)
  },
  {
    path: 'add-new-address',
    loadChildren: () => import('./pages/add-new-address/add-new-address.module').then(m => m.AddNewAddressPageModule)
  },
  {
    path: 'coupons',
    loadChildren: () => import('./pages/coupons/coupons.module').then(m => m.CouponsPageModule)
  },
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryPageModule)
  },
  {
    path: 'history-detail',
    loadChildren: () => import('./pages/history-detail/history-detail.module').then(m => m.HistoryDetailPageModule)
  },
  {
    path: 'choose-restaurant',
    loadChildren: () => import('./pages/choose-restaurant/choose-restaurant.module').then(m => m.ChooseRestaurantPageModule)
  },
  {
    path: 'add-review',
    loadChildren: () => import('./pages/add-review/add-review.module').then(m => m.AddReviewPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'tracker',
    loadChildren: () => import('./pages/tracker/tracker.module').then(m => m.TrackerPageModule)
  },
  {
    path: 'stripe-payments',
    loadChildren: () => import('./pages/stripe-payments/stripe-payments.module').then(m => m.StripePaymentsPageModule)
  },
  {
    path: 'add-card',
    loadChildren: () => import('./pages/add-card/add-card.module').then(m => m.AddCardPageModule)
  },
  {
    path: 'select-drivers',
    loadChildren: () => import('./pages/select-drivers/select-drivers.module').then(m => m.SelectDriversPageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then(m => m.InboxPageModule)
  },
  {
    path: 'rate',
    loadChildren: () => import('./pages/rate/rate.module').then(m => m.RatePageModule)
  },
  {
    path: 'rest-details',
    loadChildren: () => import('./pages/rest-details/rest-details.module').then(m => m.RestDetailsPageModule)
  },
  {
    path: 'cities',
    loadChildren: () => import('./pages/cities/cities.module').then(m => m.CitiesPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then(m => m.ForgotPageModule)
  },
  {
    path: 'variation',
    loadChildren: () => import('./pages/variation/variation.module').then(m => m.VariationPageModule)
  },
  {
    path: 'variations',
    loadChildren: () => import('./pages/variations/variations.module').then( m => m.VariationsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
