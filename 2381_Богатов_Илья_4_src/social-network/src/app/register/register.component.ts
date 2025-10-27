import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {ApiService} from "../api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  maxBirthday: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private cookieService: CookieService) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      birthday: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]]
    });

    const today = new Date();
    this.maxBirthday = today.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
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
