import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService, Question } from '../question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditTagsComponent } from '../edit-tags/edit-tags.component';
import { Answer, AnswerService } from '../answer.service';
import { AddAnswerFormActionEvent } from '../add-answer/add-answer.component';

@Component({
  selector: 'app-display-question',
  templateUrl: './display-question.component.html',
  styleUrls: ['./display-question.component.css']
})
export class DisplayQuestionComponent implements OnInit {

  questionId: string;
  question: Question;
  editMode: boolean = false;
  formControl: FormGroup;
  addAnswerMode: boolean = false;
  answers: Promise<Answer[]> = Promise.resolve([])

  @ViewChild('editTags', {static: false}) editTags: EditTagsComponent;

  constructor(
    private route: ActivatedRoute,  
    private router: Router,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private userService: UserService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    this.questionService.get(this.questionId).then(res => {
      this.question = res
    }).then(res => {
      console.log(this.question.createdByUser);
      console.log(this.userService.currentUser);
    });

    this.answers = this.answerService.listAnswersForQuestion(this.questionId);  
  }

  isEditable(): boolean {
    return !!this.userService.currentUser && this.question.createdByUser == this.userService.currentUser.id;
  }

  switchToEditMode() {
    this.editMode = true;
    this.addAnswerMode = false;
    this.formControl = this.formBuilder.group({
      title: this.question.title,
      description: this.question.description
    });
  }

  cancel() {
    this.editMode = false;
    this.formControl = undefined;
  }

  updateQuestion(): Promise<any> {
    console.log(this.editTags.getTags());
    const updatedQuestion = {
      id: this.question.id
    } as Question

    if (this.formControl.get('title').dirty) {
      updatedQuestion.title = this.formControl.value.title;
    }

    if (this.formControl.get('description').dirty) {
      updatedQuestion.description = this.formControl.value.description;
    }

    updatedQuestion.tags = this.editTags.getTags();

    return this.questionService.update(updatedQuestion)
      .then(res => this.questionService.get(this.question.id))
      .then(doc => {
        this.question = doc;
        this.editMode = false;
      });
  }

  isFormValid():boolean {
    return this.formControl.valid;
  }

  switchToAnswerMode() {
    this.addAnswerMode = true;
  }

  handleAddAnswer(formAction: AddAnswerFormActionEvent) {
    switch (formAction.event) {
      case 'submitted':
        this.answers = this.answerService.listAnswersForQuestion(this.question.id);
        this.addAnswerMode = false;
        break;
      case 'cancelled':
        this.addAnswerMode = false;
        break;
    }
  }
}
