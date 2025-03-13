import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../modules/auth/_services/auth.service';
import swal from 'sweetalert2';

@Component({
    selector: 'register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    registerForm!: FormGroup;

    get email() { return this.registerForm.get('email'); };
    get name() { return this.registerForm.get('name'); };
    get phone() { return this.registerForm.get('phone'); };
    get password() { return this.registerForm.get('password'); };
    get usr_option() { return this.registerForm.get('usr_option'); };

    hasError: boolean = false;
    hasErrorText: any = '';
    generica = 'rHJ7$p583YL@';
    dark: boolean = false;
    checked: boolean = false;
    options: any[] = [];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: Router,
        private router: ActivatedRoute
    ) {
        // Definir opciones del select
        this.options = [
            { label: 'Administrador', value: 4 },
            { label: 'Analista', value: 2 },
            { label: 'Ciudadano', value: 3 }
        ];
    }

    ngOnInit(): void {
        this.initForm();
    }
        
    initForm() {
        this.registerForm = this.fb.group({
            name: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
            email: [null, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
            phone: [null, [Validators.required, Validators.maxLength(200)]],
            password: [null, [Validators.required, Validators.maxLength(20)]],
            usr_option: [null, Validators.required] // ✅ Se mantiene dentro del FormGroup
        });
    }
        
    submit() {
        this.hasError = false;

        if (this.registerForm.valid) {
            const data = {
                name: this.registerForm.value.name,
                email: this.registerForm.value.email,
                phone: this.registerForm.value.phone,
                password: this.registerForm.value.password,
                RoleId: this.registerForm.value.usr_option
            };
            
            this.authService.register(data).subscribe((resp: any) => {
                if (!resp.error && resp) {
                    swal.fire({
                        title: 'Registro!',
                        text: 'El usuario se ha registrado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#86B444'
                    });
                    this.registerForm.reset();
                } else {
                    swal.fire({
                        title: 'Registro!',
                        text: resp.error.email[0],
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#4F91CE'
                    });
                }
            });
        } else {
            this.registerForm.markAllAsTouched(); // ✅ Marcar todos los campos para mostrar errores
        }
    }
}
