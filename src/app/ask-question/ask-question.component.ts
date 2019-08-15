import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService, Question } from '../question.service';
import { Router } from '@angular/router';
import { EditTagsComponent } from '../edit-tags/edit-tags.component';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {

  formControl: FormGroup

  @ViewChild('editTags', {static: false}) editTags: EditTagsComponent;

  constructor(
      formBuilder: FormBuilder,
      private questionService: QuestionService,
      private router: Router) {
    this.formControl = formBuilder.group({
      title: ['', Validators.required],
      desc: [''] 
    })
   }

  ngOnInit() {
  }

  submit() {
    console.log(this.formControl.value);
    var formValue = this.formControl.value; 
    return this.questionService.submit({
       title:  formValue.title,
       description: formValue.desc || '',
       tags: this.editTags.getTags() || [],
    } as Question).then(questionId => this.router.navigateByUrl("/questions/" + questionId))
  }
}
