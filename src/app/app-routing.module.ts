import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { UserAnswersComponent } from './user-answers/user-answers.component';
import { SubscribedQuestionsComponent } from './subscribed-questions/subscribed-questions.component';
import { SearchQuestionsComponent } from './search-questions/search-questions.component';
import { SubscribeTopicsComponent } from './subscribe-topics/subscribe-topics.component';
import { TopicQuestionsComponent } from './topic-questions/topic-questions.component';


const routes: Routes = [
  {path: 'questions/:id', component: DisplayQuestionComponent},
  {path: 'ask-question', component: AskQuestionComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-questions', component: UserQuestionsComponent},
  {path: 'user-answers', component: UserAnswersComponent},
  {path: 'subscribed-questions', component: SubscribedQuestionsComponent},
  {path: 'edit-tags', component: EditTagsComponent},
  {path: 'search/:q', component: SearchQuestionsComponent},
  {path: 'subscribed-topics', component: SubscribeTopicsComponent},
  {path: 'topics/:topicId', component: TopicQuestionsComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
