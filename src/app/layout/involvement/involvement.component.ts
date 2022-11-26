import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { FormBuilder, Validators } from "@angular/forms";
import { Lightbox } from "ngx-lightbox";

import { error } from "util";
import { CdkNestedTreeNode } from "@angular/cdk/tree";
import { empty } from "rxjs";
import { runInThisContext } from "vm";
import { CloseScrollStrategy } from "@angular/cdk/overlay";
import { timeout } from "rxjs-compat/operator/timeout";

declare var $: any;
@Component({
  selector: "app-involvement",
  templateUrl: "./involvement.component.html",
  styleUrls: ["./involvement.component.css"],
})
export class InvolvementComponent implements OnInit {
  inviteForm: FormGroup;
  _albums: any = [];
  content = new FormControl("");
  postDetails: any = [];
  post_images: any = [];
  projectType;
  dropdownSettings: IDropdownSettings;
  project_category;
  postname;
  postlocation;
  description;
  total_comments;
  comments: any = [];
  total_likes;
  total_reported;
  total_shares;
  created_on;
  involvements: any = [];
  allInvolvements: any = [];
  sub_involvements: any = [];
  involvements_Arraykeys: any = [];
  post_id;
  is_liked;
  lat;
  lon;
  errormessage;
  markinvolvementForm;
  selectedFile = "";
  involvements_types;
  userData: any = [];
  isMarkInv = false;
  isFullMarkForm = false;
  report_reasons;
  is_reported;
  username;
  taggedUsers: "";
  UserData: any = [];
  userTaggs: any = [];
  userTagsList = [];
  userTag = new FormControl("");
  created_by: string;
  finaldata;
  userName;
  formdata;
  integerPostId;
  business_type;
  businessType;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private Form: FormBuilder,
    private router: Router,
    private _lightbox: Lightbox
  ) {
    this.replayForm = this.Form.group({
      name: "",
    });
  }

  ngOnInit() {
    this.UserData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData.profile_type, "line no 77");
    console.log(
      JSON.parse(localStorage.getItem("userData")).business_type,
      "line no 85"
    );
    this.businessType = JSON.parse(
      localStorage.getItem("userData")
    ).business_type;
    console.log(this.businessType, "line non 96");

    if (this.businessType == "3") {
      this.getMarkInvolvement();
    } else {
      console.log("no data found");
    }

    this.username =
      localStorage.getItem("userData") != undefined
        ? JSON.parse(localStorage.getItem("userData")).username
        : "";

    console.log(this.username, "55555555555555");

    this.route.params.subscribe((params) => {
      // alert("ram")
      this.post_id = params["post_id"];

      this.getAuthUsers();
      if (!this.userData) {
        this.toast.error("Please login");
        this.router.navigate(["/home"]);
        return false;
      } else {
        if (this.userData.profile_type == "4") {
          this.toast.error("Please create your profile to see projects");
          this.router.navigate(["/home"]);
          return false;
        }

        // $('#likes').modal('show')
      }

      this.getProjectData();

      this.inviteForm = this.Form.group({
        email: [""],
      });

      this.dropdownSettings = {
        singleSelection: true,
        idField: "id",
        textField: "username",
        allowSearchFilter: true,
      };
      //check markinv eligibility

      if (
        JSON.parse(localStorage.getItem("userData")).profile_type == "2" ||
        JSON.parse(localStorage.getItem("userData")).profile_type == "3"
      ) {
        // this.isMarkInv = true;
        if (
          JSON.parse(localStorage.getItem("userData")).business_type == 3 ||
          JSON.parse(localStorage.getItem("userData")).business_type == 4 ||
          JSON.parse(localStorage.getItem("userData")).business_type == 5
        ) {
          // this.isMarkInv = true;
          this.isFullMarkForm = false;
        }
        if (
          JSON.parse(localStorage.getItem("userData")).business_type == 4 ||
          JSON.parse(localStorage.getItem("userData")).business_type == 5
        ) {
          this.isFullMarkForm = true;
          // this.isMarkInv = true;
        }
      }

      this.getPostDetails(this.post_id);
    });

    //  profile type hide on Involvement ismark

    if (
      JSON.parse(localStorage.getItem("userData")).profile_type == 2 ||
      JSON.parse(localStorage.getItem("userData")).profile_type == 4
    ) {
      this.isMarkInv = false;
    }
    // end

    
    this.markinvolvementForm = this.Form.group({
      involvement_type: "Involvement type",
      element: "",
      material: "",
      link: "",
    });
  }

  openMarkInvDialog() {
    this.markinvolvementForm.reset({
      involvement_type: "Involvement type",
    });
    $("#addpic").val("");
    $("#previewImg").attr("src", "/assets/images/place_image.png");
    $("#involvement").modal("show");
  }

  submitMarkInvolvementForm() {
    //validate all fields

    var element = this.markinvolvementForm.value.element;
    var material = this.markinvolvementForm.value.material;
    var link = this.markinvolvementForm.value.link;
    var involvementType = this.markinvolvementForm.value.involvement_type;
    var picture = this.selectedFile;

    if (
      !involvementType ||
      involvementType == "" ||
      involvementType == "Involvement type"
    )
      if (!element || element == "") {
        // {
        //   this.markInvError("Pleae select involvement type");
        //   return false;
        // }
        this.markInvError("Please enter keyword for element");
        return false;
      }
    if (!material || material == "") {
      this.markInvError("Please enter keyword for material");
      return false;
    }

    if (this.userData.business_type == 4 || this.userData.business_type == 5) {
      if (!$("#addpic").val() || $("#addpic").val() == null) {
        this.markInvError("Please provide picture");
        return false;
      }

      if (!link || link == "") {
        this.markInvError("Please embed the link with picture");
        return false;
      }
    }

    const data = new FormData();
    data.append("keyword_for_element", element);
    data.append("keyword_for_material", material);
    data.append("enter_link", link),
      data.append("involvement_type", involvementType),
      // data.append("image", picture),

      (this.integerPostId = parseInt(this.post_id));
    data.append("post_id", this.integerPostId),
      console.log(typeof this.integerPostId, "thiks is the type of post id");
    this.api.markInvolvment(data).subscribe(
      (response) => {
        this.toast.success(response["message"]);
        $("#involvement").modal("hide");
        this.getPostDetails(this.post_id);
      },
      (err) => {
        this.toast.error("Something went wrong. Please try after some time");
      }
    );
  }
  record: any = [];
  created_by_name: any;
  new_created_by: any;

  getPostDetails(id) {
    this.api.getProjectPostDetails(id).subscribe(
      (x) => {
        var data = x["data"];
        this.created_by_name = data.created_by;
        console.log(this.created_by_name, "this is myyyyyyyyyy");

        console.log(data, "Post Details");
        this.post_images = data.post_images;

        this._albums = [];
        for (let i = 0; i < this.post_images.length; i++) {
          const src = this.post_images[i]["image"];
          const album = {
            src: src,
            caption: "",
            thumb: src,
          };

          this._albums.push(album);
          console.log(this._albums, "post detailes from custom side");
        }

        // console.log(this.post_images)
        this.projectType = data.project_type.type;
        if (data.project_category == null) {
          this.project_category = "";
        } else {
          this.project_category = "|" + data.project_category.category;
        }

        this.postname = data.name;
        console.log(data, "line 257");
        this.created_by = data.created_by_name;
        this.new_created_by = data.created_by;
        this.postlocation = data.city + ", " + data.country + " | " + data.year;
        this.description = data.about_post;
        this.created_on = data.created_on;
        this.lat = data.lat;
        this.lon = data.lon;
        this.report_reasons = data.report_reasons;
        this.is_reported = data.is_reported;

        this.total_comments = data.total_comments;
        this.is_liked = data.is_liked;
        console.log(this.is_liked, "like like");
        this.comments = [];
        var comments = data.comments;
        for (var c = 0; c < comments.length; c++) {
          this.comments.push(comments[c]);
        }
        console.log(this.comments);
        this.total_likes = data.total_likes;
        this.total_reported = data.total_reported;
        this.total_shares = data.total_shares;
        this.involvements = data.involvements;
        this.involvements_types = data.involvements_types;
        this.involvements_Arraykeys = Object.keys(data.involvements).reverse();
        console.log(this.involvements_Arraykeys, "involvements_Arraykeys");
      },
      (err) => {
        this.toast.error("This post is blocked by admin");
      }
    );
  }
  // comment post
  // content = document.getElementById("content");

  commentPost() {
    if (this.content && this.post_id) {
      if (this.content.value == "" || this.content.value == null) {
        this.commentsPostError("This field is required");
        return false;
      }

      this.api
        .commentPost({ post_id: this.post_id, content: this.content.value })
        .subscribe(
          (x) => {
            console.log(x, "this is from submit comment");

            this.comments = [];
            this.getPostDetails(this.post_id);
            this.content.reset();
            this.toast.success(x["message"]);
            // location.reload();
          },
          (err) => {
            this.toast.error(
              "Something went wrong. Please try after some time"
            );
          }
        );
    }
  }

  isShowDiv = false;
  // show image
  showImage(img_url) {
    console.log(img_url);

    $("#my-pic").modal("show");
    $("#show_img").attr("src", img_url);
  }

  // single like button
  likeDislikePost(current_status) {
    window.location.reload();
    if (current_status == true) {
      var final_status = false;
    } else {
      var final_status = true;
    }

    this.api
      .likePost({
        post_id: this.post_id,
        is_liked: final_status,
      })
      .subscribe(
        (response) => {
          this.getPostDetails(this.post_id);
          this.toast.success(response["message"]);
        },
        (err) => {
          this.toast.error(
            "Something went wrong. Please try after some time adafafaf"
          );
        }
      );
  }

  likeDislikeComment(id, current_status) {
    if (current_status == true) {
      var final_status = false;
    } else {
      var final_status = true;
    }

    this.api
      .likeComment({
        comment_id: id,
        is_liked: final_status,
      })
      .subscribe(
        (response) => {
          this.getPostDetails(this.post_id);
          this.toast.success(response["message"]);
        },
        (err) => {
          this.toast.error("Something went wrong. Please try after some time");
        }
      );
  }

  navigateOnMap(lat, lon) {
    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      window.navigator.geolocation.getCurrentPosition(
        (data) => {
          var url =
            "https://maps.google.com/maps?saddr=" +
            data.coords.latitude +
            "," +
            data.coords.longitude +
            "&daddr=" +
            lat +
            "," +
            lon;
          window.open(url, "_blank", "location=yes");
        },
        (error) => {
          this.toast.error(
            "Unable to access your current location Because you blocked it."
          );
        }
      );
    } else {
      this.toast.error(
        "Sorry, your browser does not support geolocation services."
      );
    }
  }

  commentsPostError(e) {
    console.log(e);

    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

  markInvError(e) {
    console.log(e);

    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

  CheckUploadedImage(event) {
    var file = event.target.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
      this.markInvError("Whoops! That is not an image!");
      $("#addpic").val("");
      $("#previewImg").attr("src", "/assets/images/place_image.png");
    } else {
      var singleFiles = event.target.files;
      if (singleFiles) {
        for (let file of singleFiles) {
          let singleReader = new FileReader();
          singleReader.onload = (e: any) => {
            $("#previewImg").attr("src", e.target.result);
          };
          singleReader.readAsDataURL(file);
        }
      }

      this.selectedFile = file;
    }
  }

  reportPost(id) {
    console.log(id);

    this.api
      .reportPost({
        post_id: this.post_id,
        reason_id: id,
      })
      .subscribe(
        (response) => {
          this.is_reported = true;
          this.toast.success(response["message"]);
        },
        (err) => {
          this.toast.error("Something went wrong. Please try after some time");
        }
      );
  }

  copyLink() {
    var copyText = "https://insite.city/my-profile/involvement/" + this.post_id;
    var input = document.createElement("input");
    input.setAttribute("value", copyText);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);

    this.toast.success("Link copied");
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  getName(data) {
    if (data == this.username) {
      this.router.navigate(["/my-profile"]);
    } else {
      this.router.navigate(["/users-profile/" + data]);
    }
  }

  //

  //  add2(event: MatChipInputEvent): void {

  //     const input = event.input;
  //     const value = event.value;

  //     if (input) {
  //       input.value = '';
  //     }
  //   }

  // remove2(user): void {
  //     const index = this.userTaggs.indexOf(user);
  //     if (index >= 0) {
  //       this.userTaggs.splice(index, 1);
  //       if (this.userTagsList.includes(user.username)) {
  //         return;
  //       }
  //       else {
  //         this.userTagsList.push(user);
  //       }
  //     }
  //   }

  // addUserTag(user) {
  //
  //   var userName = user.username
  //   let flag = false;
  //   for (var i = 0; i < this.userTaggs.length; i++) {
  //     if (this.userTaggs[i].username == userName) {
  //       flag = true;
  //       break;
  //     } else {
  //       flag = false;
  //     }
  //   }

  //   if (flag) {
  //     this.toast.error("Tag already inserted")
  //   } else {
  //     this.userTaggs.push(user);
  //     var index = this.userTagsList.indexOf(user.username);
  //     if (index > -1) {
  //       this.userTagsList.splice(index, 1);
  //     }
  //   }
  // }

  //   addUserTag(user) {
  //     var userName = user.username
  //     this.userTaggs.push(user);
  //     var index = this.userTagsList.indexOf(user.username);

  // }

  // sendingtags:any = [];
  //   getTags(){

  //     for(var i of this.userTaggs){

  //       this.sendingtags.push(i.id)
  //       console.log(i,  this.sendingtags, "hhhhhh")
  //     }
  //   }

  inviteResponse;
  invite() {
    let post_id = parseInt(this.post_id);

    const postData = new FormData();
    postData.append("user_id", this.userId);
    postData.append("post_id", this.post_id);
    if (this.inviteForm.value.email != "")
      postData.append("email_id", this.inviteForm.value.email);

    this.api.inviteuser(postData).subscribe(
      (a) => {
        this.inviteResponse = a["response"];
        this.toast.success("sucessfull");
        console.log(this.inviteResponse, "inviteResponse");
      },
      (error) => {
        this.toast.error(error.error.message);
        console.log(error.error.message, "errorMessage");
      }
    );
  }

  userId;
  onItemSelect(item: any) {
    this.userId = item.id;
    console.log(this.userId, " selected Item");
  }

  removePostResponse;
  removePost() {
    let dataTosend = {
      post_id: this.post_id,
      sure_delete: true,
    };

    this.api.removepost(dataTosend).subscribe(
      (res) => {
        this.removePostResponse = res["message"];
        console.log(this.removePostResponse);
        this.router.navigate(["/my-profile"]);
      },
      (error) => {
        this.toast.error(error.error.message);
      }
    );
  }
  postDetail = [];

  ProjectData;
  new1_created_by: any;
  createdByuser;
  getProjectData() {
    this.api.getProjectDetails(this.post_id).subscribe((res) => {
      this.ProjectData = res["data"];
      this.postDetail = this.ProjectData;
      this.new1_created_by = this.ProjectData.created_by;
      this.createdByuser = this.ProjectData.created_by_user;
      console.log(this.ProjectData, "True False line 627");
    });
  }

  navigateProfile() {
    if (this.new_created_by == this.username) {
      this.router.navigate(["/my-profile/"]);
    } else {
      this.router.navigate(["/users-profile/" + this.new1_created_by]);
    }
  }

  tagsUsername = [];
  taggedUsrsList = [];
  getAuthUsers() {
    this.taggedUsers;
    this.api.getAllauthuser().subscribe((x: any) => {
      this.taggedUsrsList = x["data"];

      console.log(this.taggedUsrsList, "taggedUsersList");
    });
  }
  selectedTagsss;
  selectedTags(data) {
    this.selectedTagsss = data.id;
    console.log(this.selectedTagsss, "selectedTagsss");
  }

  // replay from

  replayForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });

  get name() {
    return this.replayForm.get("name");
  }

  replySubmit(result) {
    console.log(result);
  }

  markdata: any = [];

  getMarkInvolvement() {
    this.api.getInvolvement().subscribe((x) => {
      console.log(x, "******************************************************");
      this.markdata = x["data"];
    });
  }
}
