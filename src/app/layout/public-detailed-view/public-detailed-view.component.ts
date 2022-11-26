import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { ApiService } from "../../service/api/api.service";
import { ToastrService } from "ngx-toastr";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { log } from "console";

declare var $: any;

@Component({
  selector: "app-public-detailed-view",
  templateUrl: "./public-detailed-view.component.html",
  styleUrls: ["./public-detailed-view.component.css"],
  providers: [ApiService, ToastrService],
})
export class PublicDetailedViewComponent implements OnInit {
  questionDetail;
  post_id;
  comments;
  errormessage;
  content = new FormControl("");
  is_reported;
  userData;
  commentname;

  constructor(
    protected fb: FormBuilder,
    private ApiService: ApiService,
    private toast: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.post_id = params["post_id"];
      this.userData = this.ApiService.getUserData();

      if (!this.userData) {
        this.toast.error("Please login");
        this.router.navigate(["/home"]);
        return false;
      } else {
        this.get_post(this.post_id);
        // $("#comment").modal("show");
      }
    });
  }


commantsImage;

  get_post(post_id) {
    this.ApiService.questionDetails(post_id).subscribe(
      (response) => {
        this.questionDetail = response["data"];
        console.log(this.questionDetail,"line no 65")
        
        this.commentname= this.questionDetail.comments;
     

        this.commantsImage= this.questionDetail.comments[0].comment_by.profile_image;

        console.log(this.questionDetail.comments,"this is 70 line")
        console.log(this.questionDetail.comments[0].comment_by.profile_image,"this is 71 line")

        this.comments = this.questionDetail.comments;
        this.is_reported = this.questionDetail.is_reported;
      },
      (err) => {
        this.toast.error("Something went wrong. Please try after some time");
      }
    );
  }

  commentPost() {
    if (this.content && this.post_id) {
      if (this.content.value == "" || this.content.value == null) {
        this.commentsPostError("This field is required");
        return false;
      }

      this.ApiService.commentOnQuestionPost({
        question_id: this.post_id,
        content: this.content.value,
      }).subscribe(
        (x) => {
          console.log(x);
          this.get_post(this.post_id);
          this.content.reset();
          this.toast.success(x["message"]);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  likeDislikePost(current_status) {
    if (current_status == true) {
      var final_status = false;
    } else {
      var final_status = true;
    }

    this.ApiService.likeQuestionPost({
      question_id: this.post_id,
      is_liked: final_status,
    }).subscribe(
      (response) => {
        this.get_post(this.post_id);
        this.toast.success(response["message"]);
      },
      (err) => {
        this.toast.error("Something went wrong. Please try after some time");
      }
    );
  }

  likeDislikeComment(id, current_status) {
    if (current_status == true) {
      var final_status = false;
    } else {
      var final_status = true;
    }

    this.ApiService.likeQuestionComment({
      comment_id: id,
      is_liked: final_status,
    }).subscribe(
      (response) => {
        this.get_post(this.post_id);
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
          console.log("ok");
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
        (eoor) => {
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

  reportPost(id) {
    console.log(id);

    this.ApiService.reportQuestionPost({
      question_id: this.post_id,
      reason_id: id,
    }).subscribe(
      (response) => {
        this.toast.success(response["message"]);
        this.is_reported = true;
      },
      (err) => {
        this.toast.error("Something went wrong. Please try after some time");
      }
    );
  }

  copyLink() {
    var copyText =
      "https://insite.fluper.in/public-detailed-view/" + this.post_id;
    var input = document.createElement("input");
    input.setAttribute("value", copyText);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);

    this.toast.success("Link copied");
  }
}
