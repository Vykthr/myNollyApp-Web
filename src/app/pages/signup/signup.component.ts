import { Router } from '@angular/router';
import { AuthGuard } from './../../services/auth/auth.guard';
import { GeneralService } from './../../services/general/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  days = new Array(31);
  years = new Array(100);
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  date = new Date().getFullYear() - 18;
  loading = false;
  error = '';
  success = '';

  constructor(private formBuilder: FormBuilder, private general: GeneralService, private auth: AuthGuard, private router: Router) { 
    this.signupForm = this.formBuilder.group({
      surname: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      day: ['', Validators.compose([Validators.required])],
      month: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      conPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      // checked: ['', Validators.compose([Validators.required])],
    })
  }

  ngOnInit(): void {    
    this.auth.getValue().subscribe((res) => {
      if(res) this.router.navigateByUrl('/account')
    })
  }

  async signupUser(signupForm: FormGroup): Promise<void> {
    this.loading = true
    this.error = '';
    this.success = ''
    const {day, month, year} = this.signupForm.value
    let dob = year + '-' + month + '-' + day 
    try {
      await this.general.signup(signupForm.value.email, signupForm.value.password,
        signupForm.value.firstName, signupForm.value.surname, signupForm.value.phone, dob, signupForm.value.country);
        this.success = 'Account has been created successfully. You can Sign in now'
    }
    catch (err) {
      this.success = ''
      if(err.message) this.error = err.message 
      else this.error = "Error creating account, please try again"
    }
    finally {
      this.loading = false
    }

  }

}
