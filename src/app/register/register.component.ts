import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


interface UserRegistration {
  email: string
  password: string
  confirmPassword: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userRegistration;

  constructor(
      private userService: UserService,
      private router: Router,
      formBuilder: FormBuilder) {
    this.userRegistration = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    })
  }

  register() {
    return this.userService.register(this.userRegistration.value.email, this.userRegistration.value.password)
        .then(res =>  this.router.navigateByUrl(''));
  }

  ngOnInit() {
  }

}
