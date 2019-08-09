import { Component } from '@angular/core';
import { UserService } from './user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fs-stackoverflow';

  userService;
  constructor(userService: UserService,
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
}
