
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})
export class EditUser implements OnInit {
  editUserForm: FormGroup;
  errorMessage = '';
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const loggedInUserId = this.authService.getUserId();
    const isAdmin = this.authService.isAdmin();

    if (!this.userId) {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (!isAdmin && this.userId !== loggedInUserId) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.editUserForm.patchValue({
          username: user.username,
          role: user.role
        });

        if (!isAdmin) {
          this.editUserForm.get('role')?.disable();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao carregar usuário';
      }
    });
  }

  onSubmit() {
    if (this.editUserForm.valid && this.userId) {
      const updatedUser = { ...this.editUserForm.value };
      if (!updatedUser.password) {
        delete updatedUser.password;
      }

      this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          const loggedInUserId = this.authService.getUserId();
          // If the edited user is the currently logged-in user, log them out
          if (this.userId === loggedInUserId) {
            this.authService.logout(); // This will also navigate to /login
          } else if (this.authService.isAdmin()) {
            // If an admin edited another user, go to the list
            this.router.navigate(['/list-users']);
          } else {
            // Fallback for non-admin editing their own profile (should be handled by logout above)
            // or if for some reason logout didn't navigate
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao atualizar usuário';
        }
      });
    }
  }
}
