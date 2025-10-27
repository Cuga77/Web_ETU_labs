import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {ApiService} from "../api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this.cookieService.set('_id', response._id, 7);
          this.cookieService.set('role', response.role, 7);
          void this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          alert(error.message);
        }
      });
    }
  }
}
