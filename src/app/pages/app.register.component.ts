import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../modules/auth/_services/auth.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './app.register.component.html',
})
export class AppRegisterComponent {
  registerForm: FormGroup;
  get email() { return this.registerForm.get('email'); };
  get name() { return this.registerForm.get('name'); };
  get phone() { return this.registerForm.get('phone'); };
  get usr_password_confirm() { return this.registerForm.get('usr_password_confirm'); };
  get usr_password() { return this.registerForm.get('usr_password'); };

  hasError: Boolean= false;
  hasErrorText: any = '';
  generica = 'rHJ7$p583YL@';
  dark: boolean;
  checked: boolean;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute){
    
if(this.authService.isLogin()){
  this.route.navigate(['dash']);
} 
    
}

ngOnInit(): void {
this.initForm();
}

initForm(){
 this.registerForm = this.fb.group({
    email:[null, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
    name:[null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    usr_password:[null, [ Validators.maxLength(200)]],
    usr_password_confirm:[null, [ Validators.maxLength(200)]],
    phone:[null, [Validators.required, Validators.maxLength(200)]]
  }) 
}

submit(){
  
  console.log("ingreso registro");
  this.hasError= false;
//  console.log(this.loginForm.value);
const data = {
  Name: this.registerForm.value.name,
  Password: this.registerForm.value.usr_password,
  Email: this.registerForm.value.email,
  Phone: this.registerForm.value.phone,
  PAssword_confirm: this.registerForm.value.usr_password_confirm,
}

console.log("data::", data);

this.authService.register(data)
  .subscribe({
    next: (resp: any) => {
      console.log(resp);
      if (resp.Success && resp) {
        swal.fire({
          title: '¡Registro!', 
          text: 'El usuario se ha registrado correctamente.', 
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#86B444'
        });
        this.route.navigate(['login']);
      } else {
        swal.fire({
          title: 'Registro!',
          text: resp.Message, 
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4F91CE'
        });
      }
    },
    error: (err) => {
      console.error('Error al registrar:', err.error.Message);

      swal.fire({
        title: '¡Registro!',
        text: err.error.Message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#4F91CE'
      });
    }
  });

  }

}
