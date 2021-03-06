import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const db = admin.initializeApp(functions.config().firebase).firestore();

interface VotesMap {
  [key: string]: number
}

export const updateVoteCount = functions.firestore
    .document('/questions/{questionId}/answers/{answerId}')
    .onWrite((change, context) => {
     if (!change.after.exists) {
       return Promise.resolve(null);
     }
     return db.runTransaction(transaction => {
       const ansDocRef = db.collection('questions')
          .doc(context.params.questionId)
          .collection('answers')
          .doc(context.params.answerId)
       return transaction.get(ansDocRef).then(answerDoc => {
         const votes = (answerDoc.data().votes || {}) as VotesMap;
         const votesCount = Object.values<number>(votes).reduce((a, b) => a + b, 0)
         return transaction.update(ansDocRef, {
           votesCount: votesCount
         })
       })
     })
    });

export const syncAnswerSubmittersForQuestion = functions.firestore
    .document('/questions/{questionId}/answers/{answerId}')
    .onDelete((doc, context) => {
      return db.runTransaction(transaction => {
        const answersRef = db.collection('questions').doc(context.params.questionId).collection('answers');
        return transaction.get(answersRef)
          .then(answers => {
            const answerSubmitters = Array.from(new Set<string>(answers.docs.map(ansDoc => ansDoc.data().submitter.id)));
            return transaction.update(db.collection('questions').doc(context.params.questionId), {
              answerSubmitters: answerSubmitters
            })  
          });
        });
    });

export const sendNotificationToSubscribedUsers = functions.firestore
     .document('/questions/{questionId}/answers/{answerId}')
     .onCreate((doc, context) => {
        const qRef = db.collection('questions').doc(context.params.questionId)
        return qRef.get().then(qDoc => sendEmail(
          context.params.questionId,
          context.params.answerId,
          doc.data(), qDoc.data().title, qDoc.data().subscribers || [] ));
        });

function sendEmail(questionId: string, answerId: string, answer: any, questionTitle: string, subscriberIds: string[]): Promise<any> {

  const transporter = createNodeMailer()

  const submitterEmail = answer.submitter.email;
  console.log(subscriberIds);
  return Promise.all(subscriberIds.map(subscriberId => transporter.sendMail({
    from: 'firestore.stackoverflow@gmail.com',
    to: subscriberId,
    subject: `${submitterEmail} has answered question \"${questionTitle}\"`,
    text: `http://localhost:4200/questions/${questionId}#${answerId}`
  })))
};

import * as algoliasearch from 'algoliasearch'; // When using TypeScript

const algoliaClient = algoliasearch('O2IFKZ9FBL', '65f060638042a338aca6555b3fe5ca10');
const index = algoliaClient.initIndex('questions');
export const indexFullTextSearchDoc = functions.firestore
    .document('questions/{questionId}')
    .onWrite((change, context) => {
      if (change.after.exists) {
        return db.collection('questions').doc(context.params.questionId).get().then(res => {
          const qDoc = res.data();
          return new Promise((resolve, reject) => {
            index.saveObject({
              objectID: context.params.questionId,
              title: qDoc.title,
              description: qDoc.description,
              topics:(qDoc.topicTags || []).map(tag => tag.name),
            }, (err, task) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log(`objectID=${task.objectID}`);
                resolve(task);
              }
            })
          })
        });
      } else {
        console.log('Document not found')
        return Promise.resolve(null);
      }
    })


export const deleteQuestion = functions.firestore.document('/questions/{questionId}')   
  .onDelete((doc, context) => {
    const writeBatch = db.batch();    
    
    const answerDeletes = db.collection('questions').doc(context.params.questionId).collection('answers').get()
      .then(res => res.docs.forEach(answerDoc => writeBatch.delete(answerDoc.ref)))
      .then(res => writeBatch.commit());

    const indexDocDelete = new Promise<void>((resolve, reject) => 
      index.deleteObject(context.params.questionId, (err, task) => {
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
    }));
    return Promise.all([answerDeletes, indexDocDelete]);
  });

export const sendNewQuestionNotificationToTopicSubscribers = functions.firestore
    .document('/questions/{questionId}')
    .onCreate((doc, context) => {
      const topicIds = (doc.data().topicTags || []).map(topic => db.collection('tags').doc(topic.id));
      return db.getAll(...topicIds).then(docs => {
        const subscribers = new Set<string>();
        docs.forEach(topicDoc => {
          (topicDoc.data().subscribers || []).forEach(sId => subscribers.add(sId))
        }) 
        const transporter = createNodeMailer()
        console.log(subscribers);
        return Promise.all(Array.from(subscribers).map(subscriberId => transporter.sendMail({
          from: 'firestore.stackoverflow@gmail.com',
          to: subscriberId,
          subject: `New question \"${doc.data().title.substring(0, 50)}..\"`,
          text: `http://localhost:4200/questions/${context.params.questionId}`
        })))
      })
    })

export const updateTopicQuestionCount = functions.firestore
    .document('/questions/{questionId}')
    .onWrite((change, context) => {
      const previousTopics : string[] = change.before.exists ? change.before.data().topicIds : []
      const newTopics : string[] = change.after.exists ? change.after.data().topicIds : []
      const removedTopics = previousTopics.filter(t => !newTopics.includes(t))
      const addedTopics = newTopics.filter(t => !previousTopics.includes(t))

      const writeBatch = db.batch()
      removedTopics.forEach(t => writeBatch.update(db.collection('tags').doc(t), {
        questionsCount : admin.firestore.FieldValue.increment(-1)
      }))
      addedTopics.forEach(t => writeBatch.update(db.collection('tags').doc(t), {
        questionsCount : admin.firestore.FieldValue.increment(1)
      }))

      console.log('Tags removed: ', removedTopics)
      console.log('Tags added: ', addedTopics)
      return writeBatch.commit()
    })

function createNodeMailer(): any {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'firestore.stackoverflow@gmail.com',
      pass: ':3;ZPB5D?Yw!ng8'
    }
  });
}