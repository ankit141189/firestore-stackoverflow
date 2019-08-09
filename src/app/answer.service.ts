import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';


export interface Answer extends AnswerDoc {
  questionId: string;
  id: string;
} 

interface AnswerDoc {
  answer: string
  submitter: string
  lastUpdateTimestamp: number
}

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private userService: UserService, private aFirestore: AngularFirestore) { }

  submitAnswer(answer: Answer): Promise<string> {
    const answerDoc = {} as AnswerDoc
    answerDoc.answer = answer.answer
    answerDoc.submitter = this.userService.currentUser.id
    answerDoc.lastUpdateTimestamp = Date.now()
    return this.aFirestore.doc('questions/' + answer.questionId).collection('answers').add(answerDoc)
        .then(res => res.id);
  }

  listAnswersForQuestion(questionId: string): Promise<Answer[]> {
    return this.aFirestore.doc('questions/' + questionId).collection('answers').ref
        .orderBy('lastUpdateTimestamp', 'desc')
        .limit(10)
        .get()
        .then(res => {
          return res.docs.map(doc => {
            const a = doc.data() as Answer
            a.questionId = questionId
            a.id = a.id
            return a
          })
        });
  }
}
