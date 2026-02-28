import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showFiller = false;
  title = 'JET-ANGULAR-2';

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {

    // FOR TIMER
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
       // FOR TIMER ENDING

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      
    }

  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    
    // window.location.reload();
    window.location.href="/"
  }

 //TIMER LIVE
 currentTime: string = '';
 private intervalId: any;
  isSidebarVisible = true; // Initial state of the sidebar

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }


  isArrowDown = false;
  toggleArrow() {
    this.isArrowDown = !this.isArrowDown;
  }







  

}
