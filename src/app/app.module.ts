import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { LightboxModule } from "ngx-lightbox";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./common/header/header.component";
import { FooterComponent } from "./common/footer/footer.component";
import { HomeComponent } from "./layout/home/home.component";
import { SubscriptionComponent } from "./layout/subscription/subscription.component";
import { PublicDetailedViewComponent } from "./layout/public-detailed-view/public-detailed-view.component";
import { InvolvementComponent } from "./layout/involvement/involvement.component";
import { MarkInvolvementGalleryComponent } from "./layout/mark-involvement-gallery/mark-involvement-gallery.component";
import { UnfollowedProfileComponent } from "./layout/unfollowed-profile/unfollowed-profile.component";
import { MyProfileComponent } from "./layout/my-profile/my-profile.component";
import { MySettingsComponent } from "./layout/my-settings/my-settings.component";
import { EditMyPostComponent } from "./layout/edit-my-post/edit-my-post.component";
import { ChatComponent } from "./layout/chat/chat.component";
import { ChatInsightComponent } from "./layout/chat-insight/chat-insight.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule, MatListModule } from "@angular/material";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  MatNativeDateModule,
  MatInputModule,
  MatCheckboxModule,
  MatIconModule,
  MatMenuModule,
} from "@angular/material";
import { PostDetailComponent } from "./layout/post-detail/post-detail.component";
import { Ng2TelInputModule } from "ng2-tel-input";
import { NgxStripeModule } from "ngx-stripe";
import { EditProfileComponent } from "./layout/edit-profile/edit-profile.component";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { MessagingService } from "./service/messaging.service";
import { NotificationsComponent } from "./layout/notifications/notifications.component";
import { SettingsComponent } from "./layout/settings/settings.component";
import { FaqComponent } from "./layout/faq/faq.component";
import { NotificationsSettingComponent } from "./layout/notifications-setting/notifications-setting.component";
import { LegalPolicyComponent } from "./layout/legal-policy/legal-policy.component";
import { PrivacyPolicyComponent } from "./layout/privacy-policy/privacy-policy.component";
import { TermsConditionsComponent } from "./layout/terms-conditions/terms-conditions.component";
import { AboutUsComponent } from "./layout/about-us/about-us.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";
import { SocialLoginModule, AuthServiceConfig } from "angular-6-social-login";
import { CreateProfileComponent } from "./layout/create-profile/create-profile.component";
import { NotificationsViewComponent } from "./layout/notifications-view/notifications-view.component";
import { DisclaimerComponent } from "./layout/disclaimer/disclaimer.component";

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("483602063110307"),
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "763270833053-757ul2ps7a0kd5upn8f8dtldlv4vjo9i.apps.googleusercontent.com"
      ),
    },
  ]);
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SubscriptionComponent,
    PublicDetailedViewComponent,
    InvolvementComponent,
    MarkInvolvementGalleryComponent,
    UnfollowedProfileComponent,
    MyProfileComponent,
    MySettingsComponent,
    EditMyPostComponent,
    ChatComponent,
    ChatInsightComponent,
    PostDetailComponent,
    EditProfileComponent,
    NotificationsComponent,
    SettingsComponent,
    FaqComponent,
    NotificationsSettingComponent,
    LegalPolicyComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    AboutUsComponent,
    CreateProfileComponent,
    NotificationsViewComponent,
    DisclaimerComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireMessagingModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    PickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMenuModule,
    AngularFireAuthModule,
    LightboxModule,
    MatChipsModule,
    MatListModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    Ng2TelInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    CommonModule,

    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    NgxStripeModule.forRoot("pk_test_AY7BoqlbrA4ys7EjUpYuhkDd00oyvOEvqy"),
    GooglePlaceModule,
    SocialLoginModule,
  ],
  providers: [ 
    MatDatepickerModule,
    MessagingService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}