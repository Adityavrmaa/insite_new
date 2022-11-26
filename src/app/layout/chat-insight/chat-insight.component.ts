import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/service/api/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { ThrowStmt } from "@angular/compiler";
import { Observable, from, empty } from "rxjs";
import { environment } from "../../../environments/environment";
declare var $: any;
import "firebase/database";
import { emit } from "cluster";
@Component({
  selector: "app-chat-insight",
  templateUrl: "./chat-insight.component.html",
  styleUrls: ["./chat-insight.component.css"],
})
export class ChatInsightComponent implements OnInit {
  fileImg: boolean = false;
  environment = environment;
  items: any;
  name: any;
  msgVal: string = "";
  _message: any;
  userData: any;
  db: any;

  path: string;

  userId: any;
  userChat: any;
  file: File;
  ChatUserList:any;
  constructor(
    private af: AngularFireDatabase,

    private api: ApiService,
    private Toast: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    console.log("This image in const:", this.galleryFile);
  }
  chatId;
  ngOnInit() {
    this.imageUrl = environment.baseUrl.slice(0, -1);
    console.log(this.imageUrl, "imageurl");
    this.activatedRoute.params.subscribe((a) => {
      this.chatId = a.id;
    });
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = this.userData.id;

    // let dataTosaveRecent = {
    //   readState: '1',
    // }
    // this.af.database.ref('/recentMessage/' + this.userId + '/' + this.chatId).update(dataTosaveRecent)
    // this.af.database.ref('/recentMessage/' + this.chatId + '/' + this.userId).update(dataTosaveRecent)

    this.getRecent();

    this.getChatUserList();
    this.getList();

    this.getChatUser();

    this.getSingleUserChat();

    this.getProfile();

    setTimeout(function () {
      $(".chatBoxed").scrollTop($(".converstation").height());
    }, 2000);
  }
  fileType;
  Ftypes;
  singleFile(event) {
    this.file = event.target.files[0];
    console.log(this.file, "filess");
    this.fileType = this.file["type"];
    this.Ftypes = this.fileType.slice(0, 5);
    console.log(this.Ftypes, "ggg");

    $("#file-attach").modal("hide");
    // this._message = this.file['name'];
    this.fileImg = true;
    console.log("This image in constfunction:", this.galleryFile);
    $(".msg-type").attr("readonly", true);

    this.sendFilesInChat();
  }

  imageChatResponse;
  fileName;
  imageUrl;
  sendFilesInChat() {
    var data = new FormData();
    data.append("file", this.file);
    // if(this.file){
    //   this._message = "Image File"
    // }

    this.api.sendImageInChat(data).subscribe((res) => {
      this.imageChatResponse = res["data"];
      this.fileName = this.imageChatResponse["file"].toString();

      // (environment.baseUrl  + this.imageChatResponse['file'].toString().slice(1, )).toString()
      console.log(this.fileName, "gggg");
    });
  }

  galleryFile;
  removeImage() {
    this.file = null;
    this.fileImg = false;
    this.fileName = null;
    this.galleryFile = null;
    console.log("This image :", this.galleryFile);
    this._message = "";
  }

  recentMessage;
  blockedUser;
  blockedByUser;
  BlockedUndefined;
  getRecent() {
    let that = this;

    this.af.database
      .ref("/recentMessage/" + this.userId + "/" + this.chatId)
      .on("value", function (data) {
        var recentmessage = data.val();
        that.recentMessage = recentmessage;
        that.blockedUser = recentmessage ? recentmessage.blocked : "";
        that.blockedByUser = recentmessage ? recentmessage.blockedBy : "";
        // if(Boolean(this.blockedByUser) == false){
        //   that.blockedByUser = '0'
        //   that.blockedUser = '0'
        // }
        console.log(that.blockedUser, "000000000");

        console.log(that.recentMessage, "RecentMessage");
      });
  }
  // ngOnDestroy(){

  //   let  timestamp = new Date().getTime().toString()

  //   let dataTosaveRecent = {
  //     id: this.userId,
  //     name: this.userData.company_detail['name'],
  //     profile_image:this.userData.company_detail['picture'],
  //     onlineState:"0",
  //     timeStamp:timestamp,

  // }
  // this.af.database.ref('/userState/' + this.userId.toString()).set(dataTosaveRecent)

  // }

  sendMessage() {
    console.log(this.ChatUserList,"search mathod")
    let timestamp = new Date().getTime().toString();
    let toName = this.ChatUserList.find((a) => {
      return a.id == this.chatId;
      
    });

    console.log(toName, "Toname ppppppppppppppppppppppppp");
    // if(this.file){
    //   this.sendFilesInChat()
    // }

    // If UserId is smaller than Chat Id

    $(".msg-type").attr("readonly", false);

    if (this.fileImg == false && this._message) {
      this._message = this._message.trim();
    }

    if (this.userId < parseInt(this.chatId)) {
      if (this.fileName) {
        let dataTOSave = {
          chat_id: this.userId + "_" + parseInt(this.chatId),
          content: "",
          deleted: "",
          mediaType: this.Ftypes == "image" ? "image" : "Document",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          senderName: this.userData.username,
          status: "sent",
          thumnilImageurl: this.fileName,
          timeStamp: timestamp,
          to_name: toName.username,
          // this.SingleUserChat[0].to_name == this.userData.username ? this.SingleUserChat[0].senderName : this.SingleUserChat[0].to_name
        };
        // this.af.list('/message/' + this.userId + '_' + this.chatId).push(dataTOSave)
        var key = this.af
          .list("/message/" + this.userId + "_" + this.chatId)
          .push(dataTOSave).key;

        let dataTosaveRecent = {
          id: this.chatId,
          lastMessage: "",
          mediaType: this.Ftypes == "image" ? "image" : "Document",
          name: toName.username,
          profile_image: "",
          readState: "0",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          timeStamp: timestamp,
          uid: key,
        };
        this.af.database
          .ref("/recentMessage/" + this.userId + "/" + this.chatId)
          .update(dataTosaveRecent);
        this.af.database
          .ref("/recentMessage/" + this.chatId + "/" + this.userId)
          .update(dataTosaveRecent);
        //  this.af.list('/recentMessage/' + this.userId + '/' + this.chatId).set()
        // this.af.list('/recentMessage/' + this.chatId + '/' + this.userId).push(dataTosaveRecent)

        this.file = null;
        this._message = "";
        this.fileName = null;
      } else {
        let dataTOSave = {
          chat_id: this.userId + "_" + parseInt(this.chatId),
          content: Boolean(this._message) == true ? this._message : undefined,
          deleted: "",
          mediaType: "text",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          senderName: this.userData.username,
          status: "sent",
          thumnilImageurl: "",
          timeStamp: timestamp,
          to_name: toName.username,
          // this.SingleUserChat[0].to_name == this.userData.username ? this.SingleUserChat[0].senderName : this.SingleUserChat[0].to_name
        };

        // this.af.list('/message/' + this.userId + '_' + this.chatId).push(dataTOSave)
        var key = this.af
          .list("/message/" + this.userId + "_" + this.chatId)
          .push(dataTOSave).key;

        let dataTosaveRecent = {
          id: this.chatId,
          lastMessage: this._message,
          mediaType: "text",
          name: toName.username,
          profile_image: "",
          readState: "0",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          timeStamp: timestamp,
          uid: key,
        };
        this.af.database
          .ref("/recentMessage/" + this.userId + "/" + this.chatId)
          .update(dataTosaveRecent);
        this.af.database
          .ref("/recentMessage/" + this.chatId + "/" + this.userId)
          .update(dataTosaveRecent);
        //  this.af.list('/recentMessage/' + this.userId + '/' + this.chatId).set()
        // this.af.list('/recentMessage/' + this.chatId + '/' + this.userId).push(dataTosaveRecent)

        this._message = "";
      }
      setTimeout(function () {
        $(".chatBoxed").scrollTop($(".converstation").height());
      }, 200);
    }

    // If Chat Id is smaller than User Id

    if (parseInt(this.chatId) < this.userId) {
      if (this.fileName) {
        let dataTOSave = {
          chat_id: parseInt(this.chatId) + "_" + this.userId,
          content: "",
          deleted: "",
          mediaType: this.Ftypes == "image" ? "image" : "Document",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          senderName: this.userData.username,
          status: "sent",
          thumnilImageurl: this.fileName,
          timeStamp: timestamp,
          to_name: toName.username,
          // this.SingleUserChat[0].to_name == this.userData.username ? this.SingleUserChat[0].senderName : this.SingleUserChat[0].to_name
        };

        // this.af.list('/message/' + this.userId + '_' + this.chatId).push(dataTOSave)
        var key = this.af
          .list("/message/" + this.chatId + "_" + this.userId)
          .push(dataTOSave).key;

        let dataTosaveRecent = {
          id: this.chatId,
          lastMessage: "",
          mediaType: this.Ftypes == "image" ? "image" : "Document",
          name: toName.username,
          profile_image: "",
          readState: "0",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          timeStamp: timestamp,
          uid: key,
        };
        this.af.database
          .ref("/recentMessage/" + this.userId + "/" + this.chatId)
          .update(dataTosaveRecent);
        this.af.database
          .ref("/recentMessage/" + this.chatId + "/" + this.userId)
          .update(dataTosaveRecent);
        //  this.af.list('/recentMessage/' + this.userId + '/' + this.chatId).set()
        // this.af.list('/recentMessage/' + this.chatId + '/' + this.userId).push(dataTosaveRecent)

        this.file = null;
        this._message = "";
        this.fileName = null;
      } else {
        let dataTOSave = {
          chat_id: parseInt(this.chatId) + "_" + this.userId,
          content: Boolean(this._message) == true ? this._message : undefined,
          deleted: "",
          mediaType: "text",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          senderName: this.userData.username,
          status: "sent",
          thumnilImageurl: "",
          timeStamp: timestamp,
          to_name: toName.username,
          // this.SingleUserChat[0].to_name == this.userData.username ? this.SingleUserChat[0].senderName : this.SingleUserChat[0].to_name
        };

        // this.af.list('/message/' + this.userId + '_' + this.chatId).push(dataTOSave)
        var key = this.af
          .list("/message/" + this.chatId + "_" + this.userId)
          .push(dataTOSave).key;

        let dataTosaveRecent = {
          id: this.chatId,
          lastMessage: this._message,
          mediaType: "text",
          name: toName.username,
          profile_image: "",
          readState: "0",
          receiverId: this.chatId,
          senderId: this.userId.toString(),
          timeStamp: timestamp,
          uid: key,
        };
        this.af.database
          .ref("/recentMessage/" + this.userId + "/" + this.chatId)
          .update(dataTosaveRecent);
        this.af.database
          .ref("/recentMessage/" + this.chatId + "/" + this.userId)
          .update(dataTosaveRecent);
        //  this.af.list('/recentMessage/' + this.userId + '/' + this.chatId).set()
        // this.af.list('/recentMessage/' + this.chatId + '/' + this.userId).push(dataTosaveRecent)

        this._message = "";

        //   function scrollToBottomFunc() {
        //     $('.chatBoxed').animate({
        //         scrollTop: $('.converstation').get(0).scrollHeight
        //     }, 50);
        // }
      }
      setTimeout(function () {
        $(".chatBoxed").scrollTop($(".converstation").height());
      }, 200);
    }
    this.fileImg = false;
    // this.getSingleUserChat()
    // setTimeout(function () {
    //   $(".chatBoxed").scrollTop($('.converstation').height());
    // }, 200);
  }

  // Recent Messages

  AllMessagelists = [];
  senderProfilePic;
  getList() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = this.userData.id;
    this.senderProfilePic = this.userData.profile_image;

    this.af
      .list("/recentMessage/" + this.userId)
      .valueChanges()
      .subscribe((data) => {
        this.AllMessagelists = data;

        //this.userChat = data;
        console.log(this.AllMessagelists, "AllMessageList");
      });
  }
  blocked = "blocked";
  blockedBy = "blockedBy";
  dataBlocked;
  dataBlockedBy;
  BlockChatUser(val) {
    if (val == "1") {
      this.dataBlocked = {
        blocked: val,
      };
    }
    if (val == "0") {
      this.dataBlocked = {
        blocked: val,
      };
    }
    // let dataBlocked = {
    //   blocked: "1",
    // }
    if (val == "0") {
      this.dataBlockedBy = {
        blockedBy: "0",
      };
    }
    if (val == "1") {
      this.dataBlockedBy = {
        blockedBy: this.userId.toString(),
      };
    }

    this.af.database
      .ref("/recentMessage/" + this.userId.toString() + "/" + this.chatId)
      .update(this.dataBlocked);
    this.af.database
      .ref("/recentMessage/" + this.userId.toString() + "/" + this.chatId)
      .update(this.dataBlockedBy);

    this.af.database
      .ref("/recentMessage/" + this.chatId + "/" + this.userId.toString())
      .update(this.dataBlocked);
    this.af.database
      .ref("/recentMessage/" + this.chatId + "/" + this.userId.toString())
      .update(this.dataBlockedBy);
    window.location.reload();
  }
  ProfileName;
  ProfileData;
  ProfileonlineStatus;
  ProfileImage;
  getProfile() {
    this.af
      .list("/userState/" + this.chatId)
      .valueChanges()
      .subscribe((data) => {
        this.ProfileData = data;
        this.ProfileName = this.ProfileData[1];
        this.ProfileonlineStatus = this.ProfileData[2];
        this.ProfileImage = this.ProfileData[3];

        //this.userChat = data;
        console.log(this.ProfileData, "ProfileData");
      });
  }

  //Users Chat Messages

  SingleUserChat = [];
  getSingleUserChat() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userId = this.userData.id;

    if (this.userId < this.chatId) {
      this.af
        .list("/message/" + this.userId + "_" + this.chatId)
        .valueChanges()
        .subscribe((data) => {
          this.SingleUserChat = data;
          console.log(this.SingleUserChat,"sfadfjklsadfklsadf sdfsdfsdf")

          // for (let index = 0; index < this.chatUserarr.length; index++) {

          //   this.SingleUserChat.map((a) => {
          //     if ((this.chatUserarr[index].id == a.receiverId) || (this.chatUserarr[index].id == a.senderId)) {
          //       this.SingleUserChat[index]['profilePic'] = this.chatUserarr[index].profile_image ? this.chatUserarr[index].profile_image : ''
          //     }
          //   })

          // }
          //this.userChat = data;
          setTimeout(function () {
            $(".chatBoxed").scrollTop($(".converstation").height());
          }, 200);

          console.log(this.SingleUserChat, "SingleUserChat");
        });
    }
    if (this.userId > this.chatId) {
      this.af
        .list("/message/" + this.chatId + "_" + this.userId)
        .valueChanges()
        .subscribe((data) => {
          this.SingleUserChat = data;

          // for (let index = 0; index < this.chatUserarr.length; index++) {

          //   this.SingleUserChat.map((a) => {
          //     if ((this.chatUserarr[index].id == a.receiverId) || (this.chatUserarr[index].id == a.senderId)) {
          //       this.SingleUserChat[index]['profilePic'] = this.chatUserarr[index].profile_image ?  this.chatUserarr[index].profile_image : ''
          //     }
          //   })

          // }
          //this.userChat = data;
          setTimeout(function () {
            $(".chatBoxed").scrollTop($(".converstation").height());
          }, 200);

          console.log(this.SingleUserChat, "SingleUserChat");
        });
    }
  }

  addEmoji(event) {
    if (this._message) {
      this._message = this._message + event.emoji.native;
    } else {
      this._message = event.emoji.native;
    }
  }

  // users List with whoom User did chatting

  chatUserarr = [];
  userStateData = [];
  getChatUser() {
    this.af
      .list("/userState")
      .valueChanges()
      .subscribe((data) => {
        this.chatUserarr = [];
        this.userStateData = data;
        for (
          let index = 0;
          index < (this.AllMessagelists || []).length;
          index++
        ) {
          var x = this.userStateData.find((f) => {
            return this.AllMessagelists[index].id == f.id;
          });
          if (x) this.chatUserarr.push(x);
        }
        var arr = this.AllMessagelists.filter((e) =>
          this.userStateData.filter((f) => {
            return e.id == f.id;
          })
        );
      });

    console.log(this.chatUserarr, "chatUserarr");
  }

  getChat(user) {
    this.userData = user;
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.path = "message/";
    this.db
      .list(this.path)
      .valueChanges()
      .subscribe((data) => {
        this.userChat = data;
        console.log(this.userChat, "asdddddddddd");
        $("#chatUser").show();
      });
  }

 
  getChatUserList() {
    this.api.getChatUsers().subscribe((a) => {
      this.ChatUserList = a["data"];
      console.log(this.ChatUserList, "Chat User List");
    });
  }



  // slideTop(e) {
  //   console.log("Upar lelo");
  //   $('.converstation').animate({ scrollTop: $('#neeche').scrollTop() }, 1000);
  //   // $('.converstation').scrollBottom(100, 100);
  //   // $('html, body').animate({scrolltop:0}, 50);
  // }

  myKey;
  zoomImg(key) {
    this.myKey = key;
    $("#zoom").modal("show");
  }
  openFile(val) {
    window.open(val);
  }

  clearChat() {
    if (this.userId < this.chatId) {
      let dataTosaveRecent = {
        lastMessage: "",
      };
      this.af.list("/message/" + this.userId + "_" + this.chatId).remove();

      this.af.database
        .ref("/recentMessage/" + this.userId.toString() + "/" + this.chatId)
        .update(dataTosaveRecent);
      this.af.database
        .ref("/recentMessage/" + this.chatId + "/" + this.userId.toString())
        .update(dataTosaveRecent);
      window.location.reload();
    } else {
      let dataTosaveRecent = {
        lastMessage: "",
      };
      this.af.list("/message/" + this.chatId + "_" + this.userId).remove();

      this.af.database
        .ref("/recentMessage/" + this.userId.toString() + "/" + this.chatId)
        .update(dataTosaveRecent);
      this.af.database
        .ref("/recentMessage/" + this.chatId + "/" + this.userId.toString())
        .update(dataTosaveRecent);
      window.location.reload();
    }
  }
}
