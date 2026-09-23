import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/service/auth-service';
import { SeoService } from '../../shared/service/seo-service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private readonly seoService: SeoService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    this.seoService.set({
      title: 'Yetkisiz Erişim (401)',
      description: 'Bu sayfayı görüntülemek için giriş yapmanız veya yetkiniz olması gerekiyor.',
      path: '/unauthorized',
      noindex: true,
    });
  }
}
