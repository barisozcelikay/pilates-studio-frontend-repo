import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}

const SITE_NAME = 'Olive Pilates Studio';
const BASE_URL = 'https://theolivepilates.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
  ) {}

  set(data: SeoData): void {
    const fullTitle = data.title.includes('Olive Pilates') ? data.title : `${data.title} | ${SITE_NAME}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });

    const url = `${BASE_URL}${data.path ?? '/'}`;
    this.meta.updateTag({ property: 'og:url', content: url });
    this.setCanonical(url);

    this.meta.updateTag({
      name: 'robots',
      content: data.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    });
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
