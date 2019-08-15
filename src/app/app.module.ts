import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {environment} from '../environments/environment';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '../material-module';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { RegisterComponent } from './register/register.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { AddAnswerComponent } from './add-answer/add-answer.component';
import { AnswerService } from './answer.service';
import { DisplayAnswerComponent } from './display-answer/display-answer.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { UserAnswersComponent } from './user-answers/user-answers.component';
import { SubscribedQuestionsComponent } from './subscribed-questions/subscribed-questions.component';
import { SearchQuestionsComponent } from './search-questions/search-questions.component';
import { SubscribeTopicsComponent } from './subscribe-topics/subscribe-topics.component';
import { TopicQuestionsComponent } from './topic-questions/topic-questions.component';

@NgModule({
  declarations: [
    AppComponent,
    AskQuestionComponent,
    DisplayQuestionComponent,
    LoginComponent,
    RegisterComponent,
    UserQuestionsComponent,
    EditTagsComponent,
    AddAnswerComponent,
    DisplayAnswerComponent,
    QuestionListComponent,
    UserAnswersComponent,
    SubscribedQuestionsComponent,
    SearchQuestionsComponent,
    SubscribeTopicsComponent,
    TopicQuestionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    MaterialModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
