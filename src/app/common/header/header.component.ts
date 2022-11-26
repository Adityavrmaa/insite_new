import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { DataService } from "src/app/service/data.service";
import { Subscription } from "rxjs";

// declare var $:any;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  hide = true;

  @ViewChild("placesRef", { static: true }) placesRef: GooglePlaceDirective;

  options: any;
  isLogined = false;
  isProfileCreated = false;
  username;
  userId: any;
  userData: any;
  FullUserData: any;
  guestUser = false;
  constructor(
    private ApiService: ApiService,
    private toast: ToastrService,
    private router: Router,
    private af: AngularFireDatabase,
    private dataSource: DataService
  ) {}
  profile_type;
  captured;
  subscription: Subscription;
  message;
  ngOnInit() {
    if (this.ApiService.checkIsLogin()) {
      this.isLogined = true;

      this.FullUserData = this.ApiService.getUserData();
      this.username = this.FullUserData.username;

      // if (this.FullUserData.profile_type == "2") {
      // } else {
      //   this.username = this.FullUserData.name;
      // }
      this.isProfileCreated = this.FullUserData.is_profile_created;
    }
    this.captured = localStorage.getItem("captured");

    this.profile_type = this.FullUserData ? this.FullUserData.profile_type : "";

    this.subscription = this.dataSource.currentData.subscribe(
      (message) => (this.message = message)
    );
  }

  // load_guest_number(){
  //   this.guestUser = true;
  //   alert("True code");
  // }

  searchList;
  searchPost() {
    let ss;
    this.ApiService.searchPost(ss).subscribe((res) => {
      this.searchList = res["data"];
    });
  }

  ifSubscribe() {
    this.router.navigate(["/home"]);
    if (this.captured == "true") {
      this.router.navigate(["/home"]);
    } else {
      // this.router.navigate(['/subscription'])
    }
  }

  logout() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = this.userData.id;

    this.ApiService.getlogout().subscribe(
      (res) => {
        this.ApiService.logout();
        this.isLogined = false;
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        localStorage.removeItem("Ntoken");
        localStorage.removeItem("captured");
        localStorage.removeItem("Notification");
        this.toast.success("Logout Successfully");

        let timestamp = new Date().getTime().toString();

        let dataTosaveRecent = {
          id: this.userId,
          name: this.userData.company_detail["name"],
          profile_image: this.userData.company_detail["picture"],
          onlineState: "0",
          timeStamp: timestamp,
        };
        this.af.database
          .ref("/userState/" + this.userId.toString())
          .set(dataTosaveRecent);

        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 200);
      },
      (err) => {
        this.isLogined = false;
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userData");
        this.toast.success("Logout Successfully");

        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 200);
      }
    );
  }

  goToProfile() {
    if (this.isProfileCreated == false) {
      this.toast.error("Create your Profile");
      this.router.navigate["/home"];
    } else {
      this.router.navigate(["/my-profile"]);
    }
  }
  searching = false;
  search() {
    return (this.searching = true);
  }

  lat;
  lng;
  public handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    console.log(`latitude = ${this.lat}, longitude = ${this.lng}`);
    let data = { lat: this.lat, lng: this.lng, searched: true };
    this.dataSource.changeData(data);
    this.router
      .navigateByUrl("/home", { skipLocationChange: true })
      .then(() => this.router.navigate(["/"]));
  }
}
