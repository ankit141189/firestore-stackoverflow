import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from './user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchQuestionsComponent } from './search-questions/search-questions.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'fs-stackoverflow';
  searchCtrl = new FormControl('');

  @ViewChild('app-search-questions', {static: false}) searchQuestions: SearchQuestionsComponent;

  userService;
  constructor(
      userService: UserService,
      private router: Router) {
    this.userService = userService;
  }

  login() {
    this.router.navigate(['/login', {
      callbackUrl: this.router.routerState.snapshot.url
    }])
  }

  logout() {
    this.userService.logout().then(res => this.router.navigateByUrl(''))
  }

  search() {
    this.router.navigate(['/search', this.searchCtrl.value])
  }

  ngAfterViewInit() {
    
    if (this.searchQuestions) {
      this.searchCtrl.setValue(this.searchQuestions.queryString);
    }
  }
}
