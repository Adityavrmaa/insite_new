import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-edit-my-post',
  templateUrl: './edit-my-post.component.html',
  styleUrls: ['./edit-my-post.component.css']
})
export class EditMyPostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
    var imagesPreview = function(input, placeToInsertImagePreview) {
      if (input.files) {
        var filesAmount = input.files.length;
        var i;
        for (i = 0; i < filesAmount; i++) {
          var reader:any,
          target:EventTarget;
          reader = new FileReader();
          reader.onload = function(event) {
            var html = $('<li class="marks"><a href="JavaScript:void(0);" data-toggle="modal" data-target="#my-pic"><img src='+ event.target.result +'></a><button class="remove-pic">&#10006;</button><label class="d-block"><button class="btn-gray-2 btn-block" data-toggle="modal" data-target="#enter-credit">Give Credit</button></label></li>');
            $(html).appendTo(placeToInsertImagePreview);
            $('.remove-pic').click(function(){
              $(this).closest('li').remove();
            });
          }
          reader.readAsDataURL(input.files[i]);
        }
      }
    };
  
    $('#multiImageSelet').on('change', function() {
      imagesPreview(this, 'ul.pictures');
    });
  }

}
