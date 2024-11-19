import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm!: FormGroup;
  hasError: Boolean= false;
  hasErrorText: any = '';
  generica = '123456';

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private route: Router,
                private router: ActivatedRoute){
                
    if(this.authService.isLogin()){
      this.route.navigate(['/inicio']);
    }
                
  }

  ngOnInit(): void {
      this.initForm();
      this.loginForm.controls.password.setValue('123456');
  }



  initForm(){
  
    this.loginForm = this.fb.group({
    
      email:[
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])
      ],
      password:[
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])
      ]
    })
  }

  submit(){
    this.hasError= false;
  //  console.log(this.loginForm.value);
    
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((resp: any) => {
        console.log(resp);
        if(!resp.error && resp){
          this.route.navigate(['/dash']);
          console.log("Ingreso al submit");
          document.location.reload();

        }else{
          if(resp.error.error == 'Unauthorized'){
            this.route.navigate(['/dash']);
          
            this.hasError = true;
            this.hasErrorText = "El usuario o la contraseña son incorrectos";
          }
        }
      })
      
      
  }

}
