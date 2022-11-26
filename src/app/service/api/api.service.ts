import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

declare var H: any;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  getfollowfollow() {
    throw new Error("Method not implemented.");
  }
  public platform: any;
  public geocoder: any;
  tokenn =
    localStorage.getItem("userData") != undefined
      ? JSON.parse(localStorage.getItem("userData")).token
      : "";
  baseurl = environment.baseUrl;

  constructor(public http: HttpClient) {
    this.platform = new H.service.Platform({
      app_id: "joUTCcnEdkz4ySuGgu07",
      app_code: "AeupDUrzMb1hO_ORVeeL8w",
    });
    this.geocoder = this.platform.getGeocodingService();
  }

  tokenHeader = new HttpHeaders({
    Authorization: this.tokenn,
  });

  // For TOken Header2

  tokenHeader2 = new HttpHeaders().set(
    "Authorization",
    localStorage.getItem("token")
  );

  login(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/login`, data);
  }
  getAddressNew(data): Observable<any> {
    return this.http.post(
      `https://api.insite.city/api/v1/extra/get_address`,
      data
    );
  }

  auto_detect_country_code(): Observable<any> {
    return this.http.get("https://ip-api.com/json");
  }
  get_country_code(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/users/country_code_list`);
  }
  guest_login(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/login_as_guest`, data);
  }
  guest_signup(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/registration`, data);
  }

  guest_resetPassword(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/password_reset`, data);
  }

  otp_verify(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/verify_otp`, data);
  }
  get_bussiness_area(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/users/bussiness_area_list`);
  }

  // for getting lat and lon from address
  get_latlng(address): Observable<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBMKjOfr-vsOYRI5MhiFsaw0bb026Gorok`
    );
  }

  get_profession(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/users/profession_list`);
  }
  public getAddress(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode(
        { searchText: query },
        (result) => {
          if (result.Response.View.length > 0) {
            if (result.Response.View[0].Result.length > 0) {
              resolve(result.Response.View[0].Result);
            } else {
              reject({ message: "no results found" });
            }
          } else {
            reject({ message: "no results found" });
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public getAddressFromLatLng(query: string) {
    return new Promise((resolve, reject) => {
      this.geocoder.reverseGeocode(
        { prox: query, mode: "retrieveAddress" },
        (result) => {
          console.log("===========", result);
          if (result.Response.View.length > 0) {
            if (result.Response.View[0].Result.length > 0) {
              resolve(result.Response.View[0].Result);
            } else {
              reject({ message: "no results found" });
            }
          } else {
            reject({ message: "no results found" });
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getaddress(lat, lng) {
    return this.http.post(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat,
      lng + "&key=AIzaSyC1uhhqUelWl23KlXJ2c3PRA6pcfagQO6M"
    );
  }

  postCreateProfile(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/users/registration`, data);
  }

  create_quest(data): Observable<any> {
    return this.http.post(`${this.baseurl}api/v1/questions/create`, data);
  }

  getProjectType() {
    return this.http.get(this.baseurl + "api/v1/posts/project_type_list");
    // return this.http.get(this.baseurl +'api/v1/posts/project_type_list')
  }

  getProjectCategory() {
    return this.http.get(this.baseurl + "api/v1/posts/project_category_list");
  }

  getTagsList(name) {
    return this.http.get(
      this.baseurl + "api/v1/posts/get_tag_list?tag_name=" + name
    );
  }

  getUserTagList(name) {
    return this.http.get(
      this.baseurl + "api/v1/posts/get_users_list_for_tag?name=" + name
    );
  }

  postsCreate(data) {
    return this.http.post(this.baseurl + "api/v1/posts/create", data, {
      headers: this.tokenHeader,
    });
  }

  getHomePageData(data) {
    return this.http.post(
      this.baseurl + "api/v1/posts/get_home_page_data",
      data,
      { headers: this.tokenHeader }
    );
  }
  getHomePageDataa(data) {
    return this.http.post(
      this.baseurl + "api/v1/posts/get_home_page_data",
      data
    );
  }

  getFilterListData() {
    return this.http.get(this.baseurl + "api/v1/posts/filter_list_data");
  }

  getColleaguesProfiles() {
    return this.http.get(
      this.baseurl + "api/v1/users/view_colleagues_profile",
      { headers: this.tokenHeader }
    );
  }

  createColleaguesProfiles(data) {
    return this.http.post(
      this.baseurl + "api/v1/users/create_colleague_profile",
      data,
      { headers: this.tokenHeader }
    );
  }

  deleteColleaguesProfiles(id) {
    return this.http.post(
      this.baseurl + "api/v1/users/delete_colleague_profile",
      id,
      { headers: this.tokenHeader }
    );
  }

  get_subscription_plan() {
    return this.http.get(
      this.baseurl + "api/v1/subscriptions/payment_detail_page",
      { headers: this.tokenHeader2 }
    );
  }

  make_payment(data) {
    return this.http.post(this.baseurl + "api/v1/payment/make_payment", data, {
      headers: this.tokenHeader,
    });
  }

  // like comment mark involvment api
  getProjectPostDetails(id) {
    return this.http.get(
      this.baseurl + "api/v1/posts/project_post_detail/" + id,
      { headers: this.tokenHeader }
    );
  }

  likePost(data) {
    return this.http.post(this.baseurl + "api/v1/posts/like_a_post", data, {
      headers: this.tokenHeader,
    });
  }

  commentPost(data) {
    return this.http.post(this.baseurl + "api/v1/posts/comment_on_post", data, {
      headers: this.tokenHeader,
    });
  }
  likeComment(data) {
    return this.http.post(this.baseurl + "api/v1/posts/like_a_comment", data, {
      headers: this.tokenHeader,
    });
  }
  reportPost(data) {
    return this.http.post(this.baseurl + "api/v1/posts/report_a_post", data, {
      headers: this.tokenHeader,
    });
  }
  questionDetails(id) {
    return this.http.get(
      this.baseurl + "api/v1/questions/question_detail/" + id,
      { headers: this.tokenHeader }
    );
  }

  likeQuestionPost(data) {
    return this.http.post(
      this.baseurl + "api/v1/questions/like_a_question_post",
      data,
      { headers: this.tokenHeader }
    );
  }
  commentOnQuestionPost(data) {
    return this.http.post(
      this.baseurl + "api/v1/questions/comment_on_question_post",
      data,
      { headers: this.tokenHeader }
    );
  }
  likeQuestionComment(data) {
    return this.http.post(
      this.baseurl + "api/v1/questions/like_a_question_comment",
      data,
      { headers: this.tokenHeader }
    );
  }
  reportQuestionPost(data) {
    return this.http.post(
      this.baseurl + "api/v1/questions/report_a_question_post",
      data,
      { headers: this.tokenHeader }
    );
  }
  
  markInvolvment(data) {
    return this.http.post(
      this.baseurl + "api/v1/posts/mark_involvement",
      data,
      { headers: this.tokenHeader }
    );
  }

  getlogout() {
    return this.http.post(this.baseurl + "api/v1/users/logout", "", {
      headers: this.tokenHeader,
    });
  }

  delete_account() {
    return this.http.delete(this.baseurl + "api/v1/users/delete_account", {
      headers: this.tokenHeader,
    });
  }

  // custom services

  checkIsLogin() {
    if (localStorage.getItem("userData")) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.setItem("userData", "");
  }

  setUserData(data) {
    localStorage.setItem("token", data["token"]);
    localStorage.setItem("userData", JSON.stringify(data));
  }

  getUserData() {
    if (localStorage.getItem("userData")) {
      return JSON.parse(localStorage.getItem("userData"));
    } else {
      return null;
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          resolve(true);
        },
        (error) => {
          reject(false);
        }
      );
    });
  }

  // M10 ADMIN/USER EDIT PROFILE

  getProfileData(data) {
    return this.http.get(this.baseurl + "api/v1/users/user_detail/" + data, {
      headers: this.tokenHeader,
    });
  }
  getProjectData(data) {
    return this.http.get(this.baseurl + "api/v1/posts/my_projects/" + data, {
      headers: this.tokenHeader,
    });
  }
  getfollowunfollow(data) {
    return this.http.get(
      this.baseurl + "api/v1/users/follow_unfollow/" + data,
      { headers: this.tokenHeader }
    );
  }

  getauthuser(name) {
    return this.http.get(
      this.baseurl + "api/v1/users/get_authorized_user?name=" + name,
      { headers: this.tokenHeader }
    );
  }
  getAllauthuser() {
    return this.http.get(
      this.baseurl + "api/v1/users/get_authorized_user?name=",
      { headers: this.tokenHeader }
    );
  }
  inviteuser(data) {
    return this.http.post(this.baseurl + "api/v1/users/invite", data, {
      headers: this.tokenHeader,
    });
  }

  followunfollowUser(data) {
    return this.http.post(this.baseurl + "api/v1/users/follow_unfollow", data, {
      headers: this.tokenHeader,
    });
  }

  likedislike(data) {
    return this.http.post(
      this.baseurl + "api/v1/users/like_other_profile",
      data,
      { headers: this.tokenHeader }
    );
  }

  getProjectDetails(data) {
    return this.http.get(
      this.baseurl + "api/v1/posts/project_post_detail/" + data,
      { headers: this.tokenHeader }
    );
  }

  editpost(data, userId) {
    return this.http.post(
      this.baseurl + "api/v1/posts/15/edit_post/" + userId,
      data,
      { headers: this.tokenHeader }
    );
  }

  addPost(data, userId) {
    return this.http.post(
      this.baseurl + "api/v1/posts/15/add_image/" + userId,
      data,
      { headers: this.tokenHeader }
    );
  }

  removepost(data) {
    return this.http.post(this.baseurl + "api/v1/posts/remove_post", data, {
      headers: this.tokenHeader,
    });
  }

  // deletePostImage page deelte api

  deletePostImage(data) {
    return this.http.post(this.baseurl + "api/v1/posts/delete_image", data, {
      headers: this.tokenHeader,
    });
  }

  editprofile(data) {
    return this.http.post(this.baseurl + "api/v1/users/edit_profile", data, {
      headers: this.tokenHeader,
    });
  }

  getChatUsers() {
    return this.http.get(this.baseurl + "api/v1/chat/get_users_list", {
      headers: this.tokenHeader,
    });
  }
  
  sendImageInChat(data) {
    return this.http.post(this.baseurl + "api/v1/chat/upload_get_file", data, {
      headers: this.tokenHeader,
    });
  }
  getNotifcations(data) {
    return this.http.post(
      this.baseurl + "api/v1/notification/get_notification_list_for_user",
      data,
      { headers: this.tokenHeader }
    );
  }
  changePassword(data) {
    return this.http.post(this.baseurl + "api/v1/users/change_password", data, {
      headers: this.tokenHeader,
    });
  }
  sendUserFeedback(data) {
    return this.http.post(this.baseurl + "api/v1/users/user_feedback", data, {
      headers: this.tokenHeader,
    });
  }
  searchPost(data) {
    return this.http.post(
      this.baseurl + "/api/v1/posts/search_post?q=" + data,
      { headers: this.tokenHeader }
    );
  }

  create_post_invite_user(data) {
    return this.http.post(
      this.baseurl + "api/v1/posts/create_post_invite",
      data,
      { headers: this.tokenHeader }
    );
  }

  


  getInvolvement() {
    return this.http.get(
      this.baseurl + "api/v1/posts/getinvolvement",
      { headers: this.tokenHeader }
    );
  }

  

  // For About-Us Data

  t(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/extra/t&c`);
  }

  // For faq Data

  faq(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/extra/faq`);
  }

  // For privacy_policy Data

  p(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/extra/privacy_policy`);
  }

  // For privacy_policy Data

  a(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/extra/about_us`);
  }

  // For disclaimer Data

  disclaimer(): Observable<any> {
    return this.http.get(`${this.baseurl}api/v1/extra/disclaimer`);
  }


}
