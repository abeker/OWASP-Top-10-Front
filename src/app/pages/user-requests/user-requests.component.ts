import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { formatDistance } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd';
import { RequestService } from 'src/app/services/request.service';
import { User } from 'src/app/shared/user.model';
import * as fromApp from '../../store/app.reducer';
import { AdResponse, CommentResponse } from './../../interfaces/adResponse.model';
import { Request, SimpleUserResponse } from './../../interfaces/request.model';
import { CommentService } from './../../services/comment.service';
import { RatingService } from './../../services/rating.service';
import { DomSanitizer } from '@angular/platform-browser';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

  requestStatus: string;
  requestList: Request[];
  userRating: string = '0';
  commentText: string | null = null;
  user: User;
  isVisibleCommentList = true;
  colorAvatar: string = colorList[4];
  commentList: CommentResponse[];
  isSanitizingChecked: boolean = true;

  constructor(private route: ActivatedRoute,
              private requestService: RequestService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>,
              private ratingService: RatingService,
              private commentService: CommentService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(this.requestStatus !== params['requestStatus']) {
        this.sendRequest(params['requestStatus']);
      }
    });

    this.store.select('auth').subscribe(authData => {
      this.user = authData.user;
    });

  }

  sendRequest(requestStatus: string): void {
    let user = this.getUser();
    this.requestService.getUserRequests(user.id, requestStatus).subscribe(requests => {
      this.requestList = requests;
    })
  }

  getTitle(request: Request): string {
    return request.ad.car.carModel.brandName + " " + request.ad.car.carModel.modelName;
  }

  payRequest(requestId: string): void {
    this.requestService.payRequest(requestId).subscribe(requests => {
      this.message.success('Request successfully paid!');
      this.requestList = requests;
    }, error => {
      this.message.error('Something went wrong!');
    });
  }

  dropRequest(requestId: string): void {
    this.requestService.dropRequest(requestId).subscribe(requests => {
      this.message.info('Request successfully dropped!');
      this.requestList = requests;
    }, error => {
      this.message.error('Something went wrong!');
    })
  }

  confirmRating(ad: AdResponse): void {
    this.ratingService.rate(this.userRating, ad.id).subscribe(response => {

    });
  }

  cancelRating(): void {
  }

  openComment(requestId: string): void {
    let commentArea = document.getElementById(requestId);
    if (commentArea.style.display === "none") {
      commentArea.style.display = "block";
    } else {
      commentArea.style.display = "none";
    }
  }

  closeComment(): void {
    let commentArea = document.getElementById("commentArea");
    commentArea.style.display = "none";
  }

  sendComment(adId: string): void {
    this.commentService.sendComment(adId, this.commentText).subscribe(response => {
      this.message.success("Successfully sent comment.");
    }, error => {
      this.message.error(error.error);
    });

    this.closeComment();
    this.commentText = null;
  }

  getUser(): any {
    let user = null;
    this.store.select('auth').subscribe(authData => {
      if(authData !== null) {
        user = authData.user;
      }
    });

    return user;
  }

  openCommentList(ad: AdResponse): void {
    this.commentService.getCommentsOfAd(ad.id).subscribe(comments => {
      this.commentList = comments;
      if(this.commentList.length === 0) {
        this.message.info('This ad has no comments.');
      } else {
        // this.createInnerHtmlComments(comments);
        this.isVisibleCommentList = true;
      }
    }, () => {
      this.message.info('Something went wrong.');
    });
  }

  createInnerHtmlComments(comments: CommentResponse[]): void {
    const commentContent = document.querySelector('.listCommentsDrawer');
    console.log(commentContent);
    let commentItems = '';
    comments.forEach(comment => {
       commentItems = `${commentItems}
       <nz-comment [nzAuthor]="${this.getCommentAuthor(comment.simpleUser)}" [nzDatetime]="${this.getCommentTime(comment.postTime)}">
        <nz-avatar [ngStyle]="{ 'background-color': colorAvatar }" nz-comment-avatar [nzText]="${this.getCommentInitial(comment.simpleUser)}" style="vertical-align: middle;"></nz-avatar>
        <nz-comment-content>
          <p>${comment.text}</p>
        </nz-comment-content>
      </nz-comment>`
    });
    commentContent.innerHTML = commentItems;
    console.log(commentContent);
  }

  closeCommentList(): void {
    this.isVisibleCommentList = false;
  }

  getCommentTime(postTime: Date): any {
    return formatDistance(new Date(postTime), new Date());
  }

  getCommentAuthor(simpleUser: SimpleUserResponse): string {
    return simpleUser.firstName + " " + simpleUser.lastName;
  }

  getCommentInitial(simpleUser: SimpleUserResponse): string {
    return simpleUser.firstName.substr(0,1) + simpleUser.lastName.substr(0,1);
  }

  getCommentContent(comment: CommentResponse) {
    if(this.isSanitizingChecked) {
      return comment.text;
    } else {
      let commentNonSanitized = this.sanitizer.bypassSecurityTrustHtml('<p>'+comment.text+'</p>');
      return commentNonSanitized;
    }
  }

}
