import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../question.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-subscribed-questions',
  templateUrl: './subscribed-questions.component.html',
  styleUrls: ['./subscribed-questions.component.css']
})
export class SubscribedQuestionsComponent implements OnInit {

  questions: Question[]

  constructor(
    private afAuth: AngularFireAuth,
    private questionService: QuestionService,
    private router: Router) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login', {
          callbackUrl: this.router.routerState.snapshot.url
        }])
      } else {
        this.questionService.listQuestionsSubscribedByCurrentUser()
          .then(res => {
              this.questions = res
          })
      }
    })
  }

}
