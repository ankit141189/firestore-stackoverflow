import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../question.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-user-answers',
  templateUrl: './user-answers.component.html',
  styleUrls: ['./user-answers.component.css']
})
export class UserAnswersComponent implements OnInit {

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
        this.questionService.listQuestionsAnsweredByCurrentUser()
          .then(res => {
              this.questions = res
          })
      }
    })
  }

}
