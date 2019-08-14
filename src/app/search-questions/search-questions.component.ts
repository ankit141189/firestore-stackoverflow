import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionService, Question } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-search-questions',
  templateUrl: './search-questions.component.html',
  styleUrls: ['./search-questions.component.css']
})
export class SearchQuestionsComponent implements OnInit {

  questions: Question[]
  queryString: string

  constructor(
    private thisRoute: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router) { }

  ngOnInit() {
    this.thisRoute.paramMap.pipe(map(paramMap => paramMap.get('q'))).subscribe(
      query => {
        this.queryString = query;
        this.questionService.searchQuestions(query)
        .then(res => {
                this.questions = res
              })
      }
    )
  }

  getQuery(): string {
    return this.queryString;
  }

}
