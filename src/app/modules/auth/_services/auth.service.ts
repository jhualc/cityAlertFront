import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/auth'; 
  private registryUrl = 'https://cityalertapi-dev.azurewebsites.net/users';// URL base de la API
  private tokenKey = 'auth_token'; // Clave para almacenar el token
  private userKey= 'user';
  private roleKey= 'role';

  constructor(private http: HttpClient, private router: Router) {}

  // Método para autenticar con el endpoint real
  login(email: string, password: string): Observable<any> {
    console.log("ingreso autenticacion");
    const body = { email, password }; // Cuerpo de la solicitud con las credenciales
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Realiza la solicitud HTTP POST al endpoint real de login
    return this.http.post(`${this.apiUrl}/login`, body, { headers });
  }

  // Guardar el token en el localStorage
  setToken(token: string, user: string, role: string): void {

    const jsonObject: { id: number | string } = {
      id: user
    };

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(jsonObject));
    localStorage.setItem(this.roleKey, role);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser (): string | null {
    return localStorage.getItem(this.userKey);
  }

  getRole (): string | null {
    return localStorage.getItem(this.roleKey);
  }


  isLogin(): boolean {
    return !!this.getToken();
  }

  // Eliminar token al hacer logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }

  // Método para registrar nuevos usuarios
  register(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.registryUrl}`, data, { headers });
  }
}
