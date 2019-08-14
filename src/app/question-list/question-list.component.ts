import { Component, Input } from '@angular/core';
import { Question } from '../question.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent {
  @Input() questions: Question[]

  constructor() {}
}
