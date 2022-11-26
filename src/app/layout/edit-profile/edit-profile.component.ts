import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../environments/environment";
import { FormBuilder, Validators } from "@angular/forms";
import { error } from "protractor";
declare var $: any;

export interface Taggs {
  name: string;
}

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  single = new Array();
  userId: any;
  editForm: FormGroup;
  profiledata: any;
  file: File;
  name;
  submitted = false;
  environment: any = environment;
  singleFiles(event) {
    this.file = event.target.files[0];
    this.single = [];
    let singleFiles = event.target.files;
    if (singleFiles) {
      for (let file of singleFiles) {
        let singleReader = new FileReader();
        singleReader.onload = (e: any) => {
          this.single.push(e.target.result);
          $(event.target)
            .closest(".img-box")
            .find(".imagefile")
            .attr("src", e.target.result);
        };
        singleReader.readAsDataURL(file);
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastrService,
    private Form: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // this.route.params.subscribe(data => {
    //   console.log(data, 'datassss');
    //   this.userId = data['post_id'];
    //   console.log(this.userId, "hhh")
    // })
    this.getProfileData();

    this.editForm = this.Form.group({
      email: [""],
      ProfileType: [""],
      facebook: [""],
      twitter: [""],
      insta: [""],
      google: [""],
      description: [""],
    });

    // setTimeout(() => {
    //   this.name = this.profiledata ? this.profiledata["name"] : "";
    // }, 300);

   this.name= localStorage.getItem("userData")
   console.log(this.name,"sfdasfdsafssfsf")
    

  }
  companyname;
  companyDescription;
  username =
    localStorage.getItem("userData") != undefined
      ? JSON.parse(localStorage.getItem("userData")).username
      : "";
  typeOfProfile;
  Company;
  Peronal;


  getProfileData() {
    this.api.getProfileData(this.username).subscribe(
      (d) => {
        this.profiledata = d["data"];
        console.log(this.profiledata, "profiledata23");
        console.log(this.profiledata.name, "profile name 9999999999");

        this.typeOfProfile = this.profiledata.profile_type;

        if (this.profiledata.profile_type == 1)
          this.profiledata.profile_type = "Personal";
        else if (this.profiledata.profile_type == 2) {
          this.profiledata.profile_type = "Company";
          this.Company = this.profiledata.profile_type;
          console.log(this.Company, "thiscompany");
        } else if (this.profiledata.profile_type == 2)
          this.profiledata.profile_type = "Company colleague";
        console.log();
        this.companyname = this.profiledata
          ? this.profiledata.company_detail
            ? this.profiledata.company_detail["name"]
            : ""
          : "";

        console.log(this.companyname, "dfggggggggggggggggg");
        this.companyDescription = this.profiledata
          ? this.profiledata.company_detail
            ? this.profiledata.company_detail["description"]
            : ""
          : "";
        this.editForm.patchValue({
          // name: this.profiledata ? this.profiledata.name : '',
          email: this.profiledata ? this.profiledata.email : "",
          mobile_number: this.profiledata ? this.profiledata.mobile_number : "",
          ProfileType: this.profiledata ? this.profiledata.profile_type : "",
          facebook: this.profiledata ? this.profiledata.social_links[1] : "",
          twitter: this.profiledata ? this.profiledata.social_links[2] : "",
          google: this.profiledata ? this.profiledata.social_links[4] : "",
          insta: this.profiledata ? this.profiledata.social_links[3] : "",
          description: this.profiledata ? this.profiledata.about : "",
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  get f() {
    return this.editForm.controls;
  }
  editProfile() {
    this.submitted = true;
    if (this.editForm.invalid) return;

    const editData = new FormData();

    if (this.profiledata.profile_type != "Company") {
      editData.append("name", this.name);
    }
    editData.append("about", this.editForm.value.description);
    editData.append(
      "fb",
      this.editForm.value.facebook ? this.editForm.value.facebook : ""
    );
    editData.append(
      "google",
      this.editForm.value.google ? this.editForm.value.google : ""
    );
    editData.append(
      "twitter",
      this.editForm.value.twitter ? this.editForm.value.twitter : ""
    );
    editData.append(
      "insta",
      this.editForm.value.insta ? this.editForm.value.insta : ""
    );
    if (this.Company) {
      editData.append("company_name", this.companyname);
      editData.append("company_desc", this.companyDescription);
    }

    if (this.file != undefined) {
      editData.append("profile_image", this.file);
    }

    console.log(this.editForm.value.description, "Line number 161");

    this.api.editprofile(editData).subscribe(
      (res) => {
        this.toast.success("Profile Updated Successfully");
        setTimeout(() => {
          this.router.navigate(["/my-profile"]);
        }, 500);
      },
      (error) => {
        this.toast.error(error.error.message);
      }
    );
  }
}
