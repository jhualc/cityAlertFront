import {Component} from '@angular/core';
import {BreadcrumbService} from '../../breadcrumb.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/_services/auth.service';
import swal from 'sweetalert2'

@Component({
    selector: 'register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    registerForm: FormGroup;
    get email() { return this.registerForm.get('email'); };
    get name() { return this.registerForm.get('name'); };
    get phone() { return this.registerForm.get('phone'); };
    get password() { return this.registerForm.get('password'); };
  
  
    hasError: Boolean= false;
    hasErrorText: any = '';
    generica = 'rHJ7$p583YL@';
    dark: boolean;
    checked: boolean;
    
    constructor( private fb: FormBuilder,
        private authService: AuthService,
        private route: Router,
        private router: ActivatedRoute){
        
    }

    ngOnInit(): void {
        this.initForm();
        }
        
        initForm(){
         this.registerForm = this.fb.group({
            email:[null, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
            name:[null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
            phone:[null, [Validators.required, Validators.maxLength(200)]],
            password:[null, [Validators.required, Validators.maxLength(20)]],
          }) 
        }
        
        submit(){
          this.hasError= false;
        //  console.log(this.loginForm.value);
        const data = {
          name: this.registerForm.value.name,
          email: this.registerForm.value.email,
          phone: this.registerForm.value.phone,
          password: this.registerForm.value.password,
        }
        
          this.authService.register(data)
            .subscribe((resp: any) => {
              console.log(resp);
              if(!resp.error && resp){
                swal.fire({
                  title: 'Registro!', 
                  text: 'El usuario se ha registrado correctamente.', 
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#86B444'
                });
                this.registerForm.reset();
              }else{
                  swal.fire({
                    title: 'Registro!',
                    text: resp.error.email[0], 
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#4F91CE'
                  });
                  
              }
            })
          }

}
