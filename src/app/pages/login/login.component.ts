import { Router } from '@angular/router';
import { AuthGuard } from './../../services/auth/auth.guard';
import { GeneralService } from './../../services/general/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const TOKEN_KEY = 'myNollyApp_User'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(private formBuilder: FormBuilder, private general: GeneralService, private auth: AuthGuard, private router: Router) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      checked: [true]
    })
  }

  ngOnInit(): void {
    this.auth.getValue().subscribe((res) => {
      if(res) this.router.navigateByUrl('/account')
    })
    Storage.get({key: TOKEN_KEY}).then(async (res: any) => {
      if(res.value){
        res = JSON.parse(res.value)
        const pass = await this.general.decrypt(res.password);
        this.loginForm.setValue({
          email: res.email,
          password: pass,
          checked: true
        })
      }
    })
  }

  async login() {
    this.loading = true
    this.error = "";
    const { email, password, checked } = this.loginForm.value
    if(email && password) {
      try{
        await this.general.login(email, password).then(() => {
          setTimeout(() => {
            this.general.getUserProfile().then(async (data) => {
              this.auth.setValue(true);
              if (data.isAdmin) {
                window.location.href = 'https://admin.myNollyApp.com';
              } else {              
                if(checked){
                  const pass = await this.general.encrypt(password)
                  const obj = {
                    email,
                    password: pass
                  };
                  Storage.set({key: TOKEN_KEY, value: JSON.stringify(obj)});
                }
                this.router.navigateByUrl('account');
              };
            })
          }, 500);
        });
      }
      catch (err) {
        this.error = "An error occurred while logging in. Please try again"
      }
      finally {
        this.loading = false;
      }
    } else {
      this.error = "Email Address and Password is required";
      this.loading = false;
    }
  }

}
