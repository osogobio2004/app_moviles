import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent {
  @Input() nombre: string = '';
  @Input() color: string = 'personalizado';

  constructor(private auth: AuthService, private router: Router) {}

  async cerrarSesion(): Promise<void> {
    try {
      await this.auth.cerrarSesion();
    } finally {
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
