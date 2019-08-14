import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';



export interface User {
  id: string
  email: string
}
export interface Answer extends AnswerDoc {
  id: string;
} 

interface AnswerDoc {
  questionId: string;
  answer: string
  submitter: User
  lastUpdateTimestamp: number
  votes: {[key: string]: number}
  votesCount: number
}

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private userService: UserService, private aFirestore: AngularFirestore) { }

  submitAnswer(answer: Answer): Promise<string> {
    const writeBatch = this.aFirestore.firestore.batch();
    let answerDocRef = this.aFirestore.doc('questions/' + answer.questionId)
        .collection('answers')
        .doc(this.aFirestore.createId());
   
    const answerDoc = {} as AnswerDoc
    answerDoc.answer = answer.answer
    answerDoc.questionId = answer.questionId
    answerDoc.votesCount = 0
    answerDoc.submitter = {
      id: this.userService.currentUser.id,
      email: this.userService.currentUser.email
    }
    answerDoc.lastUpdateTimestamp = Date.now()
    writeBatch.set(answerDocRef.ref, answerDoc)

    writeBatch.update(
      this.aFirestore.collection('questions').doc(answer.questionId).ref, {
      answerCount: firebase.firestore.FieldValue.increment(1),
      answerSubmitters: firebase.firestore.FieldValue.arrayUnion(answerDoc.submitter.id)
    })
    return writeBatch.commit().then(() => {
      return answerDocRef.get().toPromise()
    }).then(doc => {
      console.log(doc.id);
      return doc.id
    });
  }

  listAnswersForQuestion(questionId: string): Promise<Answer[]> {
    return this.aFirestore.doc('questions/' + questionId).collection('answers').ref
        .orderBy('votesCount', 'desc')
        .orderBy('lastUpdateTimestamp', 'desc')
        .limit(10)
        .get()
        .then(res => {
          return res.docs.map(doc => {
            const a = doc.data() as Answer
            a.questionId = a.questionId ||  questionId
            a.id = doc.id
            return a
          })
        });
  }

  updateVote(questionId: string, answerId: string, vote: 1 | -1 | 0): Promise<any> {
    const obj = {}
    const userVoteField = "votes." + this.userService.currentUser.id;
    obj[userVoteField] = vote
    console.log(obj);
    return this.aFirestore.doc('questions/' + questionId + '/answers/' + answerId).update(obj);
  }

  get(questionId: string, answerId: string): Promise<Answer> {
    return this.aFirestore.doc('questions/' + questionId + '/answers/' + answerId).get()
      .toPromise()
      .then(doc => {
        const a = doc.data() as Answer
        a.questionId = a.questionId || questionId
        a.id = doc.id
        return a
      })
  }

  delete(questionId: string, answerId: string): Promise<void> {
    const writeBatch = this.aFirestore.firestore.batch();
    const qRef = this.aFirestore.collection('questions').doc(questionId);
    const answerRef = qRef.collection('answers').doc(answerId);
    writeBatch.update(qRef.ref, {
      answerCount: firebase.firestore.FieldValue.increment(-1)
    })
    writeBatch.delete(answerRef.ref);
    return writeBatch.commit();
  }
}
