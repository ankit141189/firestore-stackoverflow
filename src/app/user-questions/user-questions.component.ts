import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../question.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-user-questions',
  templateUrl: './user-questions.component.html',
  styleUrls: ['./user-questions.component.css']
})
export class UserQuestionsComponent implements OnInit {

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
        this.questionService.listQuestionsCreatedByCurrentUser()
          .then(res => {
              this.questions = res
          })
      }
    })
  }
}
