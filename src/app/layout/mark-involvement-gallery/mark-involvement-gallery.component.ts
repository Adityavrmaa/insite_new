import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { HttpClient } from "@angular/common/http";
declare var $: any;

export interface Taggs {
  name: string;
}

@Component({
  selector: "app-mark-involvement-gallery",
  templateUrl: "./mark-involvement-gallery.component.html",
  styleUrls: ["./mark-involvement-gallery.component.css"],
})
export class MarkInvolvementGalleryComponent implements OnInit {
  [x: string]: any;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  userId;
  editForm: FormGroup;
  _albums: any;
  projectType: any;
  project_category: string;
  postname: any;
  postlocation: string;
  description: any;
  created_on: any;
  lat: any;
  lon: any;
  report_reasons: any;
  is_reported: any;
  total_comments: any;
  otherOption = false;
  is_liked: any;
  comments: any[];
  total_likes: any;
  total_reported: any;
  total_shares: any;
  involvements: any;
  involvements_types: any;
  involvements_Arraykeys: string[];
  post_images: any;
  city;
  country;
  year;
  tags;
  taggs: Taggs[] = [];
  tagsList = [];
  new_tag = new FormControl("");
  message: string;
  d: string;
  filesCount;
  imageId = [];
  imgmodal: any;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastrService,
    private Form: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe((data) => {
      console.log(data, "datassss");
      this.userId = data["post_id"];
      console.log(this.userId, "hhh");
    });
    this.getPostDetails();

    console.log(this.country, "ccccc");

    this.load_create_posts();

    this.editForm = this.Form.group({
      name: [""],
      tags: [""],
      projectType: [""],
      projectCategory: [""],
      image: [""],
      description: [""],
      country: [""],
      year: [""],

      city: [""],
      likes: [""],
      comment: [""],
      share: [""],
    });

    var imagesPreview = function (input, placeToInsertImagePreview) {
      if (input.files) {
        var filesAmount = input.files.length;

        var i;
        for (i = 0; i < filesAmount; i++) {
          var reader: any, target: EventTarget;
          reader = new FileReader();
          reader.onload = function (event) {
            var html = $(
              '<li class="marks"><a href="JavaScript:void(0);" data-toggle="modal" data-target="#my-pic"><img src=' +
                event.target.result +
                '></a><button  class="remove-pic">&#10006;</button><label class="d-block"><input type="radio" name="select-pic"><span class="btn-gray btn-block"></span></label></li>'
            );
            $(html).appendTo(placeToInsertImagePreview);
            $(".remove-pic").click(function () {
              $(this).closest("li").remove();
            });
          };
          reader.readAsDataURL(input.files[i]);
        }
      }
    };

    $("#multiImageSelet").on("change", function () {
      imagesPreview(this, "ul.pictures");
    });

    this.new_tag.valueChanges.subscribe((val) => {
      this.message = val;
      this.tagsList = [];
      this.api.getTagsList(this.message).subscribe((x) => {
        if (val != "") {
          var data = x["data"];
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            this.d = data[i].tag;
            this.tagsList.push(this.d);
          }
        } else {
          this.tagsList = [];
        }
      });
    });
  }

  saveTag() {
    $("#mtChip").value = "";
  }

  ProjectData;
  getProjectData() {
    this.api.getProjectDetails(this.userId).subscribe((res) => {
      this.ProjectData = res["data"];
      console.log(this.ProjectData, "Post Data");
    });
  }

  wholeData;
  mytags = "";

  getPostDetails() {
    this.api.getProjectPostDetails(this.userId).subscribe(
      (x) => {
        var data = x["data"];
        console.log(data, "Post Details");
        this.post_images = data.post_images;
        console.log(this.post_images, "line");
        this.wholeData = data;
        this._albums = [];
        var self = this;
        for (let i = 0; i < this.post_images.length; i++) {
          const src = this.post_images[i]["image"];
          var sd = 0;
          // var html = $('<li class="marks"><a href="JavaScript:void(0);" data-toggle="modal" data-target="#my-pic"><img class="imageToZoom" src=' + src + '></a> <button  class="remove-pic' + i + '">&#10006;</button><label class="d-block"><input type="radio" name="select-pic"><input type="text" value=>' + this.post_images[i]['image_tag'] + '</label></li>');
          // var html = $('<li class="marks"><a href="JavaScript:void(0);" data-toggle="modal" data-target="#my-pic"><img class="imageToZoom" src=' + src + '></a> <button  class="remove-pic' + i + '">&#10006;</button><label class="d-block"><input type="text" [(ngModel)]=' + this.post_images[i]['image_tags'] + '></label></li>');
          // $(html).appendTo('ul.pictures');
          $(".remove-pic" + i).click(function () {
            $(this).closest("li").remove();
            self.imageId.push(self.post_images[i]["id"]);
            console.log(self.imageId);
          });

          const album = {
            src: src,
            caption: "",
            thumb: src,
          };

          this._albums.push(album);
          console.log(this._albums);
        }
        let images = document.getElementsByClassName("imageToZoom");
        for (var i = 0; i < images.length; i++) {
          images[i].addEventListener("click", (event) => {
            $("#zoomedImage").prop("src", $(event.target).prop("src"));
          });
        }
        // console.log(this.post_images)
        this.projectType = data.project_type.type;
        if (data.project_category == null) {
          this.project_category = "";
        } else {
          this.project_category = data.project_category.category;
        }

        this.postname = data.name;
        this.city = data.city;
        this.country = data.country;
        this.year = data.year;
        console.log(this.year);
        this.postlocation = data.city + ", " + data.country + " | " + data.year;
        this.description = data.about_post;
        this.created_on = data.created_on_at;

        this.lat = data.lat;
        this.lon = data.lon;
        this.report_reasons = data.report_reasons;
        this.is_reported = data.is_reported;
        this.tags = data.tags;
        console.log(this.tags, "tagssggg");

        this.total_comments = data.total_comments;
        this.is_liked = data.total_likes;
        for (let i = 0; i < this.tags.length; i++) {
          this.taggs[i] = { name: this.tags[i].tag };
          console.log(this.tags[i].tag);
        }

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

        for (var i = 0; i < this.tags.length; i++) {
          this.mytags = this.tags[i].tag + ",";
        }
        console.log(`projectCategory ${this.project_category}`);
        this.editForm.patchValue({
          name: this.postname,
          // tags: this.mytags,
          // image: this._albums,
          projectType: this.projectType,
          projectCategory: this.project_category,
          description: this.description,
          country: this.country,
          year: this.year,
          // createdOn: this.created_on,
          city: this.city,
          likes: this.total_likes,
          comment: this.total_comments,
          share: this.total_shares,
        });
        this.formatDate(this.created_on);
      },
      (err) => {
        this.toast.error("Something went wrong. Please try after some time");
      }
    );
  }

  // Add tags
  // imgget(img){
  //   this.imgmodal = img
  //   console.log(this.imgmodal)
  // }
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
      this.toast.error("Tag already inserted");
    } else {
      this.taggs.push({ name: tagName });
      var index = this.tagsList.indexOf(event.target.textContent);
      if (index > -1) {
        this.tagsList.splice(index, 1);
      }
    }
  }

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
        this.toast.error("Tag already inserted");
      } else {
        this.taggs.push({ name: this.message });
        this.new_tag.setValue("");
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

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

  sendingtags: any = [];

  getTags() {
    for (var i of this.taggs) {
      this.sendingtags.push(i.name);
    }
  }

  selectedImages: any = [];
  base64Image: any = [];
  image_Id: any = [];
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
    let file = event.target.files[0];
    var that = this;
    const reader = new FileReader();
    reader.onload = function () {
      that.base64Image.push(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImages.push(event.target.files[0]);
  }
  imageTags: any = [];
  getImageTag() {
    for (var i = 0; i < this.base64Image.length; i++) {
      this.imageTags.push($("#imgTag" + i).val());
    }
    // console.log(this.imageTags)
  }

  removeImage(img, index) {
    this.image_Id = img.id;
    // alert(this.image_Id);
    console.log(this.image_Id, "image data ");


    this.api.deletePostImage(img).subscribe(
      (res) => {
        console.log(res, "delete image form api");
        this.imageId.splice(index , 1)
        this.toast.success("Image submit successfully");

        // window.location.reload()
        this.post_images.splice(img, 1);
        console.log(this.post_images,"line no 396")
     
      },
      (error) => {
        this.toast.error("image not delete");
      }
    );

    // this.image_Id.splice(img.id, 1);
    // this.imageTags.splice(img.id, 1);
    // this.selectedImages.splice(img.id, 1);
    // if (this.selectedImages.length == 1) {
    //   this.otherOption = true;
    // }
  }

  FinalDate;
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    this.FinalDate = [year, month, day].join("-");
    console.log(date, "dd");

    console.log(this.FinalDate, "finalDate");
  }

  editPost() {
    this.getTags();

    const editData = new FormData();
    editData.append("name", this.editForm.value.name);
    editData.append("tags", this.sendingtags.toString()),
      editData.append("about_post", this.editForm.value.description);
    editData.append("project_type", this.wholeData.project_type["id"]);
    if (this.wholeData.project_category == null) {
      editData.append("project_category", "");
    } else {
      editData.append(
        "project_category",
        this.wholeData.project_category["id"]
      );
    }

    editData.append("year", this.editForm.value.year);
    console.log(
      editData.append("year", this.editForm.value.year),
      "7878787878787878787878787"
    );
    editData.append("lat", this.wholeData.lat);
    editData.append("lon", this.wholeData.lon);
    editData.append("taged_users", this.wholeData.lon);
    console.log(
      editData.append("taged_users", this.wholeData.lon),
      "7878787878787878787878787"
    );
    this.selectedImages.map((img) => {
      editData.append("images", img);
    });
    editData.append("image_tag", this.imageTags.toString());
    editData.append("created_by_name", this.editForm.value.companyName);
    editData.append("t_type_end_date", this.wholeData.t_type_end_date);
    editData.append("t_type_start_date", this.wholeData.t_type_start_date);
    editData.append("country", this.wholeData.country);
    editData.append("city", this.wholeData.city);
    editData.append("zip_code", this.wholeData.zip_code);
    editData.append("street", this.wholeData.street);
    editData.append("user_id", this.wholeData.id);
    editData.append("deleted_images", this.imageId.toString());

    console.log(editData);

    this.api.editpost(editData, this.userId).subscribe(
      (res) => {
        this.toast.success("Edit Successfull");

        setTimeout(() => {
          window.history.back();
        }, 500);
      },
      (error) => {
        this.toast.error(error.error.message, "please try again");
      }
    );
  }

  getName(data) {
    this.router.navigate(["/users-profile/" + data]);
  }

  load_create_posts() {
    this.api_get_project_type();
    this.api_get_project_category();
  }

  api_get_project_type() {
    this.api.getProjectType().subscribe(
      (response: any) => {
        this.project_typeData = response["data"];
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  project_categoryData;
  api_get_project_category() {
    this.api.getProjectCategory().subscribe(
      (response: any) => {
        this.project_categoryData = Object.values(response.data);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  project_typeData: any = [];
  starType;
  typ;
  hideCat;
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
}
