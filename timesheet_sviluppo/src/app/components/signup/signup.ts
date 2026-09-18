import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    const username = form.value.username;
    const password = form.value.password;

    this.authService.signUp(username, password).subscribe({
      next: () => {
        form.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => console.error(err),
    });
  }
}
