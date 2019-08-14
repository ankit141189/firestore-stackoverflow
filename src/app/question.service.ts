import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase/app';
import * as algolia from 'algoliasearch';

export interface Question extends QuestionDoc {
  id: string
}

interface QuestionDoc {
  title: string
  description: string
  tags: string[]
  createdByUser: string
  lastUpdateTimestamp: number 
  answerCount?: number
  subscribers: string[]
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private algoliaIndex: algolia.Index;

  constructor(private userService: UserService, private aFirestore: AngularFirestore) {
    const algoliaClient = algolia('O2IFKZ9FBL', '8d73a3dfccdd123148364821a73009a6');
    this.algoliaIndex = algoliaClient.initIndex('questions');
  }

  submit(question: Question): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      if (!this.userService.currentUser) {
        reject(new Error("No logged in user"));
      }
      const qDoc = {} as QuestionDoc
      qDoc.title = question.title
      qDoc.description = question.description
      qDoc.tags = question.tags
      qDoc.createdByUser = this.userService.currentUser.id;
      qDoc.lastUpdateTimestamp = Date.now()
      this.aFirestore.collection('questions').add(qDoc)
          .then(result => resolve(result.id))
    });
  }

  get(id: string): Promise<Question|null> {
    return this.aFirestore.doc('questions/' + id).get().toPromise()
        .then(this.convertDocToQuestion_);
  }

  listQuestionsCreatedByCurrentUser(): Promise<Question[]> {
    if (!this.userService.currentUser) {
      return Promise.reject("No logged in user");
    }
    return this.aFirestore.collection('questions').ref
        .where('createdByUser', '==', this.userService.currentUser.id)
        .orderBy('lastUpdateTimestamp', 'desc')
        .limit(20)
        .get()
        .then(res => res.docs.map(this.convertDocToQuestion_));
  }

  listQuestionsAnsweredByCurrentUser(): Promise<Question[]> {
    if (!this.userService.currentUser) {
      return Promise.reject("No logged in user");
    }
    return this.aFirestore.firestore.collectionGroup('answers')
        .where('submitter.id', '==', this.userService.currentUser.id)
        .limit(20)
        .get()
        .then(res => this.getQuestionsByIds_(res.docs.map(doc => doc.data().questionId)));
          
  }

  listQuestionsSubscribedByCurrentUser(): Promise<Question[]> {
    if (!this.userService.currentUser) {
      return Promise.reject("No logged in user");
    }
    return this.aFirestore.firestore.collection('questions')
        .where('subscribers', 'array-contains', this.userService.currentUser.email)
        .limit(20)
        .get()
        .then(res => res.docs.map(this.convertDocToQuestion_));
  }

  convertDocToQuestion_(doc: firestore.DocumentSnapshot): Question {
    if (!doc.exists) {
      return null;
    }
    const q = doc.data() as Question;
    q.id = doc.id;
    q.answerCount = q.answerCount || 0;
    q.subscribers = q.subscribers || [];
    return q;
  }

  update(question: Question): Promise<void> {
    const qDoc = {} as QuestionDoc;
    if (question.title) {
      qDoc.title = question.title
    }
    if (question.description) {
      qDoc.description = question.description;
    }
    qDoc.tags = question.tags;
    qDoc.lastUpdateTimestamp = Date.now();
    return this.aFirestore.doc('questions/' + question.id).update(qDoc);
  }

  subscribe(questionId: string) {
    return this.aFirestore.collection('questions').doc(questionId).update({
      subscribers: firestore.FieldValue.arrayUnion(this.userService.currentUser.email)
    });
  }

  unsubscribe(questionId: string) {
    return this.aFirestore.collection('questions').doc(questionId).update({
      subscribers: firestore.FieldValue.arrayRemove(this.userService.currentUser.email)
    });
  }

  searchQuestions(query: string): Promise<Question[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.algoliaIndex.search({
        query: query,
        attributesToRetrieve: ['objectID']
      }, (err, respone) => {
        if (err) {
          reject(err);
        } else {
          resolve(respone.hits.map(hit => hit.objectID))
        }
      })
    }).then(questionIds => this.getQuestionsByIds_(questionIds))
  }

  getQuestionsByIds_(questionIds: string[]): Promise<Question[]> {
    console.log(questionIds);
    return Promise.all(Array.from(new Set(questionIds))
      .map(qId => this.aFirestore.collection('questions').doc(qId)
                .get().toPromise()
                .then(this.convertDocToQuestion_)))
  }

  deleteQuestion(questionId: string): Promise<void> {
    return this.aFirestore.collection('questions').doc(questionId).delete();
  }
}
