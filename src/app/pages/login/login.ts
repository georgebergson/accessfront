import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.errorMessage = '';

    // Validação customizada
    if (!this.username.trim()) {
      this.errorMessage = 'Usuário é obrigatório';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Senha é obrigatória';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // login ok, redireciona
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // mostra mensagem do backend
        console.log('Erro completo:', err); // para debug
        this.errorMessage = err.error?.message || err.message || 'Erro desconhecido';
        this.cdr.detectChanges(); // força a detecção de mudanças
      }
    });
  }
}
