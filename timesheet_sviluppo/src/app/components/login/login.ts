import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    const username = form.value.username;
    const password = form.value.password;

    this.authService.signIn(username, password).subscribe({
      next: (data) => {
        this.authService.createUser(username, data.access_token);
        localStorage.setItem('user', JSON.stringify(this.authService.user));
        this.router.navigate(['/dashboard/timesheet']);
      },
      error: (err) => console.error(err),
    });

    form.reset();
  }
}
