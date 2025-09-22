import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.html',
  styleUrls: ['./list-users.css']
})
export class ListUsers implements OnInit, OnDestroy {
  users: any[] = [];
  loading: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('ListUsers ngOnInit chamado');
    this.checkAuthAndLoadUsers();

    this.authSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      console.log('Auth state changed:', loggedIn);
      this.checkAuthAndLoadUsers();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkAuthAndLoadUsers() {
    console.log('Checking auth and loading users');

    // Método mais simples para verificar autenticação
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdmin = this.authService.isAdmin();

    console.log('isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin);

    if (isLoggedIn && isAdmin) {
      this.loadUsers();
    } else if (!isLoggedIn) {
      console.log('Não logado, redirecionando para login');
      this.router.navigate(['/login']);
    } else if (isLoggedIn && !isAdmin) {
      console.log('Logado mas não admin, redirecionando para dashboard');
      this.router.navigate(['/dashboard']);
    }
  }

  loadUsers() {
    console.log('Iniciando carregamento de usuários');
    this.loading = true;

    // Força a atualização da UI
    this.users = [];

    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Usuários carregados com sucesso:', users);

        // Força uma nova referência para o array
        this.users = Array.isArray(users) ? [...users] : [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Array users atualizado:', this.users);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.loading = false;
        this.users = [];
        this.router.navigate(['/dashboard']);
      }
    });
  }

  editUser(id: string) {
    console.log('Editando usuário:', id);
    this.router.navigate(['/edit-user', id]);
  }

  refreshUsers() {
    console.log('Atualizando lista de usuários');
    this.loadUsers();
  }

  trackByUserId(index: number, user: any): any {
    return user?.id || index;
  }
}
