import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
declare var $: any;
import { MatChipInputEvent } from "@angular/material/chips";
import { ApiService } from "../../service/api/api.service";
import { ToastrService } from "ngx-toastr";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

export interface Taggs {
  name: string;
}
declare var $: any;
declare var google;
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  colleagues = [];
  profiledata: any;
  projectdata = [];
  followdata: any;
  colleague_id;
  errormessage;
  colleagueForm;
  submitted: boolean = false;
  userTag = new FormControl("");
  message;
  tagsList = [];
  d;
  userTagsList = [];
  taggedUsers: [];
  userTaggs: any = [];
  userName;
  postForm: FormGroup;
  latitude;
  longitude;
  address;
  fullAddress;
  city;
  country;
  checkToshow = false;
  project_categoryData: any = [];
  map1: any;
  checkMenufacturer = true;
  colleagueHideIndividual = true;
  constructor(
    private api: ApiService,
    private Toast: ToastrService,
    protected fb: FormBuilder
  ) {}
  ngOnInit() {
    this.userName =
      localStorage.getItem("C") != undefined
        ? JSON.parse(localStorage.getItem("userData")).username
        : "";
    this.errormessage = "";
    this.submitted = false;
    this.colleagueForm = new FormGroup({
      username: new FormControl(""),
      // mobile_number: new FormControl(''),
      email: new FormControl(""),
      password: new FormControl(""),
    });
    this.api_get_project_type();
    this.api_get_project_category();

    this.postForm = this.fb.group({
      name: "",
      project_type: "Select Project Type",
      project_category: "Select Project Category",
      year: "",
      t_type_start_date: "",
      t_type_end_date: "",
      tags: "",
      about_post: "",
      images: null,
    });

    setTimeout(() => {
      $(".colleague-profile> ul> li")
        .on("click", function () {
          $(this).find(".colleague-details").slideToggle("slow");
          $(this)
            .find("span>i")
            .toggleClass("fa fa-caret-down")
            .toggleClass("fa fa-caret-up");
        })
        .on("dblclick", function () {
          $(this).find(".back-dark").toggleClass("add-gray");
          $(this).find(".com").toggleClass("hide-me").toggleClass("show-me");
          $(this)
            .find(".btn-delete")
            .toggleClass("hide-me")
            .toggleClass("show-me");
        });
    }, 500);
    this.getProject();
    this.getColleagues();
    this.getProfileData();
    this.postFollow();

    this.userTag.valueChanges.subscribe((val) => {
      this.taggedUsers = val;

      this.userTagsList = [];
      this.api.getauthuser(this.taggedUsers).subscribe((x) => {
        if (val != "") {
          var data = x["data"];
          for (var i = 0; i < data.length; i++) {
            this.userTagsList.push(data[i]);
          }
        } else {
          this.userTagsList = [];
        }
      });
    });

    this.profilettype = JSON.parse(
      localStorage.getItem("userData")
    ).profile_type;
    console.log(this.profilettype, "yellow modal popup");
    if (this.profilettype === "1") {
      this.checkToshow = true;
    } else {
      this.checkToshow = true;
    }

    // validation for manufacturer accound not show discription
    let userData = JSON.parse(localStorage.getItem("userData"));
    // For map Modal
    if (userData.business_type == "4" || userData.business_type == "1") {
      this.checkMenufacturer = false;
      this.colleagueHideIndividual = false;
    } else {
      this.checkMenufacturer = true;
      this.colleagueHideIndividual = true;
    }
  }

  zoomView: number;
  cur_lat: any;
  cur_lng: any;
  current_lat;
  current_long;
  map: any;
  infowindow;
  createPostMap;
  post_marker;
  create_company_profile;
  post_marker2;
  stylez;
  profilettype;

  loc = { lat: 28.60986453001585, lng: 77.3846419721832 };

  loc2 = { lat: 28.854161458374126, lng: 77.33640512525938 };

  initMap(searchzoomView) {
    //
    this.zoomView = 16;
    if (searchzoomView != "") {
      this.zoomView = searchzoomView;
    }
    // console.log(this.current_lat);
    // console.log(this.current_long);

    // console.log(this.current_postion)
    var that = this;
    var options = {
      // center: { lat: 28.6056448, lng: 70.38982399999999 },
      center: { lat: this.current_lat, lng: this.current_long },
      zoom: this.zoomView,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, "tehgrayz"],
      },
      gestureHandling: "greedy",
    };
    var options1 = {
      // center: { lat: 28.6056448, lng: 70.38982399999999 },
      center: { lat: this.cur_lat, lng: this.cur_lng },
      zoom: this.zoomView,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      gestureHandling: "greedy",
    };
    var options2 = {
      // center: { lat: 28.6056448, lng: 70.38982399999999 },
      center: { lat: this.cur_lat, lng: this.cur_lng },
      zoom: this.zoomView,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      gestureHandling: "greedy",
    };

    this.map = new google.maps.Map(document.getElementById("map"), options);

    this.map1.addListener("click", (mapsMouseEvent) => {
      var lat = mapsMouseEvent.latLng.toJSON().lat;
      var lng = mapsMouseEvent.latLng.toJSON().lng;

      $("#map-lat").val(lat);
      $("#map-lon").val(lng);

      var latlng = mapsMouseEvent.latLng;
      marker1.setPosition(latlng);

      localStorage.setItem("newCompanyMapLat", lat);
      localStorage.setItem("newCompanyMapLng", lng);
      this.map1.marker.infowindow.close();
    });

    // var marker = new google.maps.Marker({
    //   position: { lat: this.cur_lat, lng: this.cur_lng },
    //   map: this.map,
    //   draggable: true,
    // });

    var marker1 = new google.maps.Marker({
      position: { lat: this.cur_lat, lng: this.cur_lng },
      map: this.map1,
      draggable: false,
    });

    this.createPostMap = new google.maps.Map(
      document.getElementById("create_post_map"),
      options
    );

    this.create_company_profile = new google.maps.Map(
      document.getElementById("create_company_profile"),
      options2
    );

    // this.locate_marker_on_map(this.loc , this.createPostMap)

    // this.setMapToCurrentLocation(this.map)

    this.locate_marker_on_map(this.loc, this.map);

    // console.log(current_lat,current_long)

    this.locate_marker_on_map2(this.loc, this.create_company_profile);

    // by default lo lon for address

    $("#map-lat").val(this.loc.lat);
    $("#map-lon").val(this.loc.lng);

    google.maps.event.addListener(this.post_marker2, "dragend", function () {
      // console.log(this.getPosition().lat(), this.getPosition().lng())
      var lat = this.post_marker2.getPosition().lat();
      var lng = this.post_marker2.getPosition().lng();
      alert(lat);
      $("#map-lat").val(lat);
      $("#map-lon").val(lng);
      this.fav = 0;
    });

    var that = this;
    google.maps.event.addListener(this.map, "click", function (event) {
      that.infowindow.close();
    });

    // click on map event listner

    google.maps.event.addListener(this.map, "dblclick", function (event) {
      if (that.api.checkIsLogin()) {
        // console.log(that.ApiService.getUserData().is_profile_created)
        if (!that.api.getUserData().is_profile_created) {
          that.Toast.error("Please create profile first");
          $("#create-profile").modal("show");
          return false;
        }
      } else {
        that.Toast.error("Please login");
        $("#login").modal("show");
        return false;
      }

      this.clicked_location_lat = event.latLng.lat();
      this.clicked_location_lng = event.latLng.lng();

      $("#involvement").modal("show");

      // set clicked location with marker on model
      that.createPostMap.setCenter({
        lat: this.clicked_location_lat,
        lng: this.clicked_location_lng,
      });

      // clear previous marker
      // that.post_marker.setPosition({ lat: this.clicked_location_lat, lng: this.clicked_location_lng });

      $("#map-lat").val(event.latLng.lat());
      $("#map-lon").val(event.latLng.lng());
    });
    var mapType = new google.maps.StyledMapType(this.stylez, {
      name: "Grayscale",
    });
    this.map.mapTypes.set("tehgrayz", mapType);
    this.map.setMapTypeId("tehgrayz");
    this.createPostMap.mapTypes.set("tehgrayz", mapType);
    this.createPostMap.setMapTypeId("tehgrayz");
    this.create_company_profile.mapTypes.set("tehgrayz", mapType);
    this.create_company_profile.setMapTypeId("tehgrayz");
  }

  locate_marker_on_map(location, map) {
    this.post_marker = new google.maps.Marker({
      // position: location,
      // map: map,
      animation: google.maps.Animation.DROP,
      title: "Post location",
    });
  }

  locate_marker_on_map2(location, map) {
    this.post_marker2 = new google.maps.Marker({
      position: { lat: this.cur_lat, lng: this.cur_lng },
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: "Post location",
    });
  }

  getColleagues() {
    this.api.getColleaguesProfiles().subscribe((x) => {
      console.log(x["data"].colleague_accounts, "get colleagues data form");
      this.colleagues = x["data"].colleague_accounts;
    });
  }

  country_code;
  mobile_number;

  getNumber(obj) {
    var numb = this.colleagueForm.value.mobile_number.length;
    this.country_code = obj.slice(0, -numb);
  }

  telInputObject(obj) {
    console.log(obj);
    obj.setCountry("in");
  }

  hasError(obj) {
    console.log(obj);
  }
  onCountryChange(obj) {
    console.log(obj);
  }

  validateForm() {
    var username = this.colleagueForm.value.username;
    // var mobile_number = this.colleagueForm.value.mobile_number
    var email = this.colleagueForm.value.email;
    var password = this.colleagueForm.value.password;
    // var country_code = this.country_code
    console.log(this.colleagueForm.value.username);
    console.log(this.colleagueForm.value.email);
    console.log(this.colleagueForm.value.password);

    if (username == "") {
      this.errormessage = "Please Enter Username";
      return false;
    }

    if (email == "") {
      this.errormessage = "Please Enter Email";
      return false;
    }

    // if(mobile_number == '' ){
    //   this.errormessage = "Please Enter Mobile number"
    //   return false;
    // }
    // if (mobile_number.length != 10) {
    //   this.errormessage = 'Mobile number must be of 10 characters';
    //   return false;
    // }

    if (password == "") {
      this.errormessage = "Please Enter Password";
      return false;
    }
    // if(country_code == ''){
    //   this.errormessage = "Please Enter Country code"
    //   return false;
    // }
    return true;
  }

  createColleague(colleagueData) {
    this.submitted = true;
    if (this.validateForm() == true) {
      this.api.createColleaguesProfiles(colleagueData).subscribe(
        (x) => {
          this.Toast.success("success", x["message"]);
          console.log(x["message"]);
          $("#add-colleague").modal("hide");
          setTimeout(() => {
            window.location.reload();
            this.getColleagues();
          }, 500);
        },
        (err) => {
          console.log(err.error.message);
          this.Toast.error("error", err.error.message);
        }
      );
    }
    console.log(colleagueData);
  }

  getColleagueId(id) {
    console.log(id, "jfksnsojdzn");
    this.colleague_id = id;
    this.deleteColleague();
  }

  deleteColleague() {
    this.api.deleteColleaguesProfiles({ id: this.colleague_id }).subscribe(
      (x) => {
        this.Toast.success("Success", x["message"]);
        $("#delete").modal("hide");
        setTimeout(() => {
          window.location.reload();
          this.getColleagues();
        }, 500);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  username =
    localStorage.getItem("userData") != undefined
      ? JSON.parse(localStorage.getItem("userData")).username
      : "";
  socialLinks1;
  socialLinks2;
  socialLinks3;
  socialLinks4;
  showName;
  companyname;
  description: any;
  getProfileData() {
    this.api.getProfileData(this.username).subscribe(
      (d) => {
        this.profiledata = d["data"];
        console.log(
          this.profiledata.company_detail.description,
          "Profile Data 999999999999999999999999999999"
        );
        this.socialLinks1 = this.profiledata.social_links[1];

        if (this.profiledata.company_detail) {
          this.showName = this.profiledata.company_detail["name"];
        } else {
          this.showName = this.profiledata.name;
        }
        this.socialLinks2 = this.profiledata.social_links[2];
        this.socialLinks3 = this.profiledata.social_links[3];
        this.socialLinks4 = this.profiledata.social_links[4];
        console.log(this.username, "userName");
        if (this.profiledata.profile_type == 1)
          this.profiledata.profile_type = "Personal";
        else if (this.profiledata.profile_type == 2)
          this.profiledata.profile_type = "Company";
        else if (this.profiledata.profile_type == 2)
          this.profiledata.profile_type = "Company colleague";

        this.companyname = this.profiledata
          ? this.profiledata.company_detail
            ? this.profiledata.company_detail["name"]
            : ""
          : "";
      },
      (err) => {
        console.log(err);
      }
    );
  }
  openLink(data) {
    // alert(data);
    // console.log(data)
    window.open(data);
  }

  getProject() {
    this.api.getProjectData(this.username).subscribe(
      (d) => {
        this.projectdata = d["data"];
        console.log(this.projectdata, "projectdata");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  user_id =
    localStorage.getItem("userData") != undefined
      ? JSON.parse(localStorage.getItem("userData")).id
      : "";

  postFollow() {
    this.api.getfollowunfollow(this.user_id).subscribe(
      (d) => {
        this.followdata = d["data"];
        console.log(this.followdata, "followdata");

        this.followdata.followed == true ? 1 : 0;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addUserTag(user) {
    var userName = user.username;
    let flag = false;
    for (var i = 0; i < this.userTaggs.length; i++) {
      if (this.userTaggs[i].username == userName) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if (flag) {
      this.Toast.error("Tag already inserted");
    } else {
      this.userTaggs.push(user);
      var index = this.userTagsList.indexOf(user.username);
      if (index > -1) {
        this.userTagsList.splice(index, 1);
      }
    }
  }

  sendingtags: any = [];

  getTags() {
    for (var i of this.taggs) {
      this.sendingtags.push(i.name);
    }

    for (var j in this.userTaggs) {
      this.sendingUsertags.push(this.userTaggs[j].id);
      // console.log(this.sendingUsertags)
    }
  }

  inviteResponse;
  invite() {
    this.getTags();
    // let a =  this.sendingtags.map((item)=>{
    //  return item.toString()
    // })
    const postData = new FormData();
    postData.append("user_id", this.sendingtags);

    console.log(JSON.stringify(postData), "postData");
    this.api.inviteuser(postData).subscribe(
      (a) => {
        this.inviteResponse = a["response"];
        this.Toast.success("sucessfull");
        console.log(this.inviteResponse, "inviteResponse");
      },
      (error) => {
        this.Toast.error(error.error.message);
        console.log(error.error.message, "errorMessage");
      }
    );
  }

  project_typeData: any = [];
  api_get_project_type() {
    this.api.getProjectType().subscribe(
      (response: any) => {
        this.project_typeData = response["data"];
        console.log(this.project_typeData, "999999999999999999999999999");
      },
      (error) => {
        console.log("error", error);
        this.Toast.error(error.error.message);
      }
    );
  }

  otherOption: boolean = false;
  base64Image: any;
  typ;
  taggs;
  hideCat;
  starType;
  postImageTag = "Enter Credit";
  selectedImages: any = [];
  imageTags: any = [];
  sendingUsertags: any = [];
  postImage;
  strD;
  endD;
  posttalcode;
  street;
  new_tag = new FormControl("");

  getMoreValues(callback) {
    this.latitude = $("#map-lat").val();
    this.longitude = $("#map-lon").val();
    this.api
      .getAddressNew({
        lat: this.latitude,
        lon: this.longitude,
      })
      .subscribe(
        (res) => {
          console.log(
            "===========1846===========",
            res["results"][0].address_components
          );
          console.log(res, "Whole data");

          let addressComponents = res["results"][0].address_components;

          for (var i = 0; i < addressComponents.length; i++) {
            if (addressComponents[i].types[0] == "country") {
              this.country = addressComponents[i].long_name;
            }

            if (
              addressComponents[i].types[0] == "administrative_area_level_2"
            ) {
              this.city = addressComponents[i].long_name;
            }

            if (addressComponents[i].types[0] == "postal_code") {
              this.posttalcode = addressComponents[i].long_name;
            }

            if (addressComponents[i].types[0] == "route") {
              this.street = addressComponents[i].long_name;
            }
          }

          if (this.country == undefined || this.country == null) {
            this.country = "N/A";
          }
          if (this.city == undefined || this.city == null) {
            this.city = "N/A";
          }
          if (this.street == undefined || this.street == null) {
            this.street = "N/A";
          }
          if (this.posttalcode == undefined || this.posttalcode == null) {
            this.posttalcode = "000000";
          }
          console.log(
            "===========1846===========",
            this.country,
            this.city,
            this.posttalcode,
            this.street
          );
          if (callback) callback();
        },
        (err) => {
          console.log("===========1848==============", err);
          this.country = "NA";
          this.posttalcode = "";
          this.city = "NA";
          this.street = "";
        }
      );
    // this.ApiService.getAddressFromLatLng(
    //   this.latitude + "," + this.longitude
    // ).then(
    //   (result) => {
    //     var address = result[0].Location.Address;
    //     console.log(result);

    //     this.country = address.AdditionalData[0].value;
    //     this.posttalcode = address.PostalCode;
    //     this.city = address.City;
    //     this.street = address.Label;
    //     if (callback) callback();
    //   },
    //   (error) => {
    //     console.log("error", error);
    //     // this.loginError(error.error.message);
    //     this.country = "NA";
    //     this.posttalcode = "";
    //     this.city = "NA";
    //     this.street = "";
    //   }
    // );
  }

  api_create_posts() {
    console.log("==================>", "api_create_posts", this.postForm.value);
    if (this.postForm.value.project_category == "Select Project Category") {
      this.postForm.value.project_category = "";
    }

    const postData = new FormData();
    postData.append("name", this.postForm.value.name),
      postData.append("project_type", this.postForm.value.project_type),
      postData.append("project_category", this.postForm.value.project_category),
      postData.append("year", this.postForm.value.year),
      postData.append("tags", this.sendingtags.toString()),
      postData.append("about_post", this.postForm.value.about_post),
      postData.append("lat", this.latitude),
      postData.append("lon", this.longitude),
      postData.append("taged_users", this.sendingUsertags.toString()),
      this.selectedImages.map((img) => {
        postData.append("images", img);
      });
    postData.append("image_tag", this.imageTags.toString()),
      postData.append("t_type_end_date", this.endD),
      postData.append("t_type_start_date", this.strD),
      postData.append("country", this.country),
      postData.append("city", this.city),
      postData.append("zip_code", this.posttalcode),
      postData.append("street", ""),
      this.api.postsCreate(postData).subscribe(
        (response: any) => {
          this.Toast.success("success", response.message);
          this.emptyPostForm();
          $("#involvement").modal("hide");

          this.ngOnInit();
        },
        (error) => {
          this.Toast.error(error.error.message);
        }
      );
  }

  submit_create_posts(e) {
    this.getTags();
    if (this.validate_create_posts()) {
      this.getImageTag();
      this.getStrEndDate();
      this.getMoreValues(() => {
        this.api_create_posts();
      });
    }
  }

  // save tags on click save button
  saveTag() {
    $("#mtChip").value = "";
  }

  // add tag on select from list
  addTag(event) {
    var tagName = event.target.textContent;
    let flag = false;
    for (var i = 0; i < this.taggs.length; i++) {
      if (this.taggs[i].name == tagName) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if (flag) {
      this.Toast.error("Tag already inserted");
    } else {
      this.taggs.push({ name: tagName });
      var index = this.tagsList.indexOf(event.target.textContent);
      if (index > -1) {
        this.tagsList.splice(index, 1);
      }
    }
  }
  // add tag on hit enter

  onEnter() {
    let flag = false;
    if (this.message.length > 3 && this.message != "") {
      for (var i = 0; i < this.taggs.length; i++) {
        if (this.taggs[i].name == this.message) {
          flag = true;
          break;
        } else {
          flag = false;
        }
      }

      if (flag) {
        this.Toast.error("Tag already inserted");
      } else {
        this.taggs.push({ name: this.message });
        this.new_tag.setValue("");
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // if ((value || '').trim()) {
    //   this.taggs.push({name: value.trim()});
    // }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(tagg: Taggs): void {
    const index = this.taggs.indexOf(tagg);
    if (index >= 0) {
      this.taggs.splice(index, 1);
      if (this.tagsList.includes(tagg.name)) {
        return;
      } else {
        this.tagsList.push(tagg.name);
      }
    }
  }

  // mat chip
  removeImage(image, index) {
    this.base64Image.splice(index, 1);
    this.imageTags.splice(index, 1);
    this.selectedImages.splice(index, 1);
    if (this.selectedImages.length == 1) {
      this.otherOption = true;
      // console.log(this.selectedImages.length)
    }
  }

  chooseImage(event) {
    var that = this;
    this.otherOption = true;
    for (let i = 0; i < event.target.files.length; i++) {
      let img = event.target.files[i];
      const reader = new FileReader();
      reader.onload = function () {
        that.base64Image.push(reader.result);
      };
      reader.readAsDataURL(img);
      this.selectedImages.push(img);
    }
    // let file = event.target.files[0];
    // var that = this;
    // const reader = new FileReader();
    // reader.onload = function() {
    //   that.base64Image.push(reader.result);
    // };
    // reader.readAsDataURL(event.target.files[0]);
    // this.selectedImages.push(event.target.files[0]);
  }

  load_create_posts() {
    this.api_get_project_type();
    this.api_get_project_category();
  }

  validate_create_posts() {
    var projTyp = this.postForm.value.project_type;
    var projCat = this.postForm.value.project_category;

    if (projTyp != "Select Project Type") {
      var project_type = this.postForm.value.project_type;
    } else {
      var project_type = null;
    }

    if (projCat != "Select Project Category") {
      var project_category = this.postForm.value.project_category;
    } else {
      var project_category = null;
    }

    var name = this.postForm.value.name;
    var year = this.postForm.value.year;
    var about_post = this.postForm.value.about_post;
    var images = this.postImage;
    var t_type_start_date = this.postForm.value.t_type_start_date;
    var t_type_end_date = this.postForm.value.t_type_end_date;
    var s = Date.parse(t_type_start_date);
    var e = Date.parse(t_type_end_date);

    if (!name || name == "") {
      this.loginError("Please provide project name");
      return false;
    }
    if (!project_type || project_type == "") {
      this.loginError("Please provide project type");
      return false;
    }
    if (
      this.starType == true &&
      (!project_category || project_category == "")
    ) {
      this.loginError("Please provide project category");
      return false;
    }
    if (this.typ == 0 && (!year || year == "")) {
      this.loginError("Please provide year");
      return false;
    }

    if (this.typ == 0 && year.toString().length < 4) {
      this.loginError("Please enter year in YYYY format");
      return false;
    }
    if (this.typ == 1 && (!t_type_start_date || t_type_start_date == "")) {
      this.loginError("Please provide start date");
      return false;
    }
    if (this.typ == 1 && (!t_type_end_date || t_type_end_date == "")) {
      this.loginError("Please provide end date");
      return false;
    } else {
      // console.log(s)
      // console.log(e)
    }
    if (this.typ == 1 && e <= s) {
      this.loginError("End date should be Greater");
      return false;
    }
    if (this.taggs.length == 0) {
      this.loginError("Please provide tags");
      return false;
    }
    if (!about_post || about_post == "") {
      this.loginError("Please provide descriptions");
      return false;
    }
    // if (this.base64Image.length <= 0) {
    //   this.loginError("Please provide images");
    //   return false;
    // }

    if (!$("#post_perms").is(":checked")) {
      this.loginError("Please accept content terms and conditions");
      return false;
    }
    return true;
  }
  getImageTag() {
    for (var i = 0; i < this.base64Image.length; i++) {
      this.imageTags.push($("#imgTag" + i).val());
    }
    // console.log(this.imageTags)
  }

  loginError(e) {
    console.log(e);

    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

  getType() {
    var id = $("#selType :selected").val();
    for (var i of this.project_typeData) {
      if (i.id == id) {
        var checkType = i.is_t_type;
        this.starType = i.is_star_type;
        // console.log(this.starType)
      }
    }
    if (checkType == true) {
      this.typ = 1;
    } else {
      this.typ = 0;
    }
    if (this.starType == false) {
      this.hideCat = 1;
    } else {
      this.hideCat = 0;
    }
  }

  api_get_project_category() {
    this.api.getProjectCategory().subscribe(
      (response: any) => {
        this.project_categoryData = Object.values(response.data);
        console.log(this.project_categoryData, "888888888888888888888888");
      },
      (error) => {
        console.log("error", error);
        this.loginError(error.error.message);
      }
    );
  }

  emptyPostForm() {
    this.postForm.setValue({
      name: "",
      project_type: "",
      project_category: "",
      year: "",
      t_type_end_date: "",
      t_type_start_date: "",
      tags: "",
      about_post: "",
      images: null,
    });
    for (var i = 0; i < this.imageTags.length; i++) {
      $("#imgTag" + i).val("");
    }
    this.taggs = [];
    this.selectedImages = [];
    this.base64Image = [];
    this.imageTags = [];
  }
  getStrEndDate() {
    if ($("#start-date").val()) {
      this.strD = $("#start-date").val();
    } else {
      this.strD = "2020-07-15";
    }
    if ($("#end-date").val()) {
      this.endD = $("#end-date").val();
    } else {
      this.endD = "2021-07-16";
    }
  }

  hit() {
    var img_tagg = $("#creditt").val();
    this.postImageTag = img_tagg;
  }

  onRightClick() {
    return false;
  }
}
