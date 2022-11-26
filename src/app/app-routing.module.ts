import { NotificationsViewComponent } from './layout/notifications-view/notifications-view.component';
import { Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { SubscriptionComponent } from './layout/subscription/subscription.component';
import { PublicDetailedViewComponent } from './layout/public-detailed-view/public-detailed-view.component';
import { InvolvementComponent } from './layout/involvement/involvement.component';
import { MarkInvolvementGalleryComponent } from './layout/mark-involvement-gallery/mark-involvement-gallery.component';
import { UnfollowedProfileComponent } from './layout/unfollowed-profile/unfollowed-profile.component';
import { MyProfileComponent } from './layout/my-profile/my-profile.component';
import { MySettingsComponent } from './layout/my-settings/my-settings.component';
import { EditMyPostComponent } from './layout/edit-my-post/edit-my-post.component';
import { ChatComponent } from './layout/chat/chat.component';
import { AuthGuard } from './service/auth.guard.service';
import { EditProfileComponent } from './layout/edit-profile/edit-profile.component';
import { ChatInsightComponent } from './layout/chat-insight/chat-insight.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { SettingsComponent } from './layout/settings/settings.component';
import { NotificationsSettingComponent } from './layout/notifications-setting/notifications-setting.component';
import { LegalPolicyComponent } from './layout/legal-policy/legal-policy.component';
import { PrivacyPolicyComponent } from './layout/privacy-policy/privacy-policy.component';
import { FaqComponent } from './layout/faq/faq.component';
import { TermsConditionsComponent } from './layout/terms-conditions/terms-conditions.component';
import { AboutUsComponent } from './layout/about-us/about-us.component';
import { CreateProfileComponent } from './layout/create-profile/create-profile.component';
import { DisclaimerComponent } from './layout/disclaimer/disclaimer.component';


const routes: Routes = ([
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },

// For Notifications View 


  { path: 'subscription', component: SubscriptionComponent },
  { path: 'public-detailed-view/:post_id', component: PublicDetailedViewComponent },
  { path: 'involvement/:post_id', component: InvolvementComponent },
  { path: 'my-profile/involvement/:post_id', component: InvolvementComponent },
  { path: 'edit-post/:post_id', component: MarkInvolvementGalleryComponent },
  { path: 'users-profile/:name', component: UnfollowedProfileComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'create-profile', component: CreateProfileComponent},
  { path: 'my-settings', component: MySettingsComponent },
  { path: 'edit-my-post', component: EditMyPostComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications-setting', component: NotificationsSettingComponent },
  { path: 'legal-policy', component: LegalPolicyComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'terms-&-conditions', component: TermsConditionsComponent },
  { path: 'about-us', component: AboutUsComponent },  
  { path: 'chat-insight/:id', component: ChatInsightComponent },
  {path:'notificationView/:id',component:NotificationsViewComponent},
  {path:'disclaimer',component:DisclaimerComponent}
]);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
