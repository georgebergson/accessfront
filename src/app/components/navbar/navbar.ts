
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isAdminUser: boolean = false;
  isLoggedIn: boolean = false;
  loggedInUserId: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    console.log('NavbarComponent: Constructor called');
  }

  ngOnInit() {
    console.log('NavbarComponent: ngOnInit called');
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      console.log('NavbarComponent: isLoggedIn$ subscription - loggedIn:', loggedIn);
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.isAdminUser = this.authService.isAdmin();
        this.loggedInUserId = this.authService.getUserId();
        console.log('NavbarComponent: Logged in, isAdminUser:', this.isAdminUser, 'loggedInUserId:', this.loggedInUserId);
      } else {
        this.isAdminUser = false;
        this.loggedInUserId = null;
        console.log('NavbarComponent: Not logged in, loggedInUserId set to null');
      }
    });
    console.log('NavbarComponent: After subscription setup, initial loggedInUserId:', this.loggedInUserId);
  }

  logout() {
    this.authService.logout();
  }
}
