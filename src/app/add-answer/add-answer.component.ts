import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AnswerService, Answer } from '../answer.service';


export interface AddAnswerFormActionEvent {
  answerId?: string
  event: string
}

@Component({
  selector: 'app-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.css']
})
export class AddAnswerComponent {

  @Input() questionId: string;
  @Output() formAction = new EventEmitter<AddAnswerFormActionEvent>();

  inputFormCtrl = new FormControl('', Validators.required);

  constructor(private answerService: AnswerService) { }

  submit() {
    const answer = {} as Answer
    answer.questionId = this.questionId
    answer.answer = this.inputFormCtrl.value
    this.answerService.submitAnswer(answer).then(
      res => {
        console.log("New AnswerID: " + res);
        this.formAction.emit({
          answerId: res,
          event:'submitted'
        });
      }
    )
  }

  cancel() {
    this.formAction.emit({event: 'cancelled'});
  }

}
