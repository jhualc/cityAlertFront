import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../modules/auth/_services/auth.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './app.activate.component.html',
})
export class AppActivateComponent {

  dark: boolean;
  loading: boolean = false;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute){
  
   
}

ngOnInit() {
  this.router.params.subscribe(params => {
      const code = params['id']; // Leer Code
      if (code) {
        this.submit(code);
      }
    });
}

submit(code:any){
  const data = {
    ActivationCode: code,
  }

  console.log("ingreso registro");

  this.authService.activateUser(data)
    .subscribe((resp: any) => {
      console.log(resp);
      
      if(resp.Success && resp){
        swal.fire({
          title: 'Activación!', 
          text: resp.Message, 
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#86B444'
        });
        this.route.navigate(['login']);
      }else{
          swal.fire({
            title: 'Activación!',
            text: resp.Message, 
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4F91CE'
          });
          this.route.navigate(['/login']); 
      }
      
    })
  }

}
