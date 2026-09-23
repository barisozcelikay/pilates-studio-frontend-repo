import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../shared/service/seo-service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.set({
      title: 'Sayfa Bulunamadı (404)',
      description: 'Aradığınız sayfa bulunamadı. Olive Pilates Studio ana sayfasına dönebilirsiniz.',
      path: '/404',
      noindex: true,
    });
  }
}
