import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup
  constructor(
      private userService: UserService, 
      private router: Router,
      private activeRoute: ActivatedRoute,
      formBuilder: FormBuilder) { 
    this.form = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    return this.userService.login(this.form.value.email, this.form.value.password)
      .then(res =>  this.router.navigateByUrl(
        this.activeRoute.snapshot.paramMap.get('callbackUrl') || ''))
  }

  isSignedIn(): boolean {
    return !!this.userService.currentUser;
  }

  ngOnInit() {
    
  }

}
