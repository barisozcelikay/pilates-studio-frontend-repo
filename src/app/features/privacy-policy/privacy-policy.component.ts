import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../shared/service/seo-service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.set({
      title: 'Gizlilik Politikası',
      description:
        'Olive Pilates Studio gizlilik politikası: kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.',
      path: '/gizlilik-politikasi',
    });
  }
}
