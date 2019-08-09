import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { EditTagsComponent } from './edit-tags/edit-tags.component';


const routes: Routes = [
  {path: 'questions/:id', component: DisplayQuestionComponent},
  {path: 'ask-question', component: AskQuestionComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-questions', component: UserQuestionsComponent},
  {path: 'edit-tags', component: EditTagsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
