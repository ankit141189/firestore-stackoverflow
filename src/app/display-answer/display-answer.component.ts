import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Answer, AnswerService } from '../answer.service';
import { UserService } from '../user.service';



@Component({
  selector: 'app-display-answer',
  templateUrl: './display-answer.component.html',
  styleUrls: ['./display-answer.component.css']
})
export class DisplayAnswerComponent implements OnInit {

  currentAnswer: Answer
  hasLoggedInUser = false

  @Output() answerDeleted = new EventEmitter<string>();

  constructor(private answerService: AnswerService, private userService: UserService) { }


  @Input()
  set answer(initialValue: Answer) {
    this.currentAnswer = initialValue;
  }

  ngOnInit() {
    this.hasLoggedInUser = !!this.userService.currentUser;
  }

  voteCount():number {
    return this.currentAnswer.votes ? 
      Object.values<number>(this.currentAnswer.votes).reduce((a, b) => a + b) : 0
  }

  toggleVote(vote: -1 | 1) {
    this.answerService.updateVote(this.currentAnswer.questionId, this.currentAnswer.id, 
      this.hasUserVote() ? 0 : vote).then(res => {
      return this.answerService.get(this.currentAnswer.questionId, this.currentAnswer.id)
    }).then(doc => {
      this.currentAnswer = doc
    })

  }

  hasUserVote() : boolean {
    return [1, -1].includes(this.getUserVote());
  }

  hasUserUpvote(): boolean {
    return this.getUserVote() == 1;
  }

  hasUserDownvote(): boolean {
    return this.getUserVote() == -1;
  }

  getUserVote(): number|undefined {
    return this.hasLoggedInUser ? (this.currentAnswer.votes || {})[this.userService.currentUser.id] : undefined;
  }

  isAuthor(): boolean {
    return this.hasLoggedInUser && this.currentAnswer.submitter.id == this.userService.currentUser.id;
  }

  deleteAnswer() {
    this.answerService.delete(this.currentAnswer.questionId, this.currentAnswer.id).then(
      res => this.answerDeleted.emit(this.currentAnswer.id)
    )
  }
}
