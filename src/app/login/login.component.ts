import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
      formBuilder: FormBuilder) { 
    this.form = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    return this.userService.login(this.form.value.email, this.form.value.password)
      .then(res =>  this.router.navigateByUrl('/'))
  }

  isSignedIn(): boolean {
    return !!this.userService.currentUser;
  }

  ngOnInit() {
  }

}
