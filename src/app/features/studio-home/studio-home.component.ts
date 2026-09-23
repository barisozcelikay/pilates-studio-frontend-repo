import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../shared/service/seo-service';
import { ToastService } from '../../shared/service/toast-service';
import {
  ContactRequestPayload,
  ContactRequestService,
} from '../contact-requests/contact-request.service';
import { GoogleReview, GoogleReviewsService } from './service/google-reviews-service';

interface Lesson {
  title: string;
  description: string;
  illustration: 'reformer' | 'cadillac' | 'mat' | 'hammock';
  artUrl: string;
  artWidth: number;
  artHeight: number;
  brushWidth: number;
  revealPath: string;
  comingSoon?: boolean;
}

const SECTION_IDS = [
  'anasayfa',
  'hakkimizda',
  'dersler',
  'yaklasim',
  'yorumlar',
  'konum',
  'iletisim',
];

@Component({
  selector: 'app-studio-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './studio-home.component.html',
  styleUrl: './studio-home.component.scss',
})
export class StudioHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  mobileMenuOpen = false;
  headerCompact = false;
  headerHidden = false;
  activeSection = 'anasayfa';
  contactSubmitting = false;
  contactSubmitted = false;
  contactForm: ContactRequestPayload = this.emptyContactForm();

  readonly logoUrl = '/images/olive-brand-lockup-dark.svg';
  readonly mapMarkUrl = '/images/olive-brand-mark-dark.svg';
  readonly studioSignUrl = '/images/olive-studio-sign-v1.jpg';
  readonly instagramUrl = 'https://www.instagram.com/olive.pilatesstudio/';
  readonly address = 'İncek, 3035. Cadde 143/2, 06830 Gölbaşı/Ankara';
  readonly mapSearchLabel = this.address;
  readonly mapEmbedUrl: SafeResourceUrl;
  readonly directionsUrl: string;
  readonly googleReviewsUrl: string;
  readonly hasLiveReviews: boolean;

  reviews: GoogleReview[] = [];

  readonly lessons: Lesson[] = [
    {
      title: 'Reformer Pilates',
      description:
        'Direnç, denge ve kontrollü akışla bütün bedeni güçlendiren kişiselleştirilmiş seanslar.',
      illustration: 'reformer',
      artUrl: '/images/lesson-drawings/reformer-ink.png',
      artWidth: 650,
      artHeight: 380,
      brushWidth: 105,
      revealPath: 'M10 355 H640 V280 H10 V205 H640 V130 H10 V55 H640',
    },
    {
      title: 'Cadillac',
      description:
        'Hareket alanını güvenle genişleten, mobilite ve postür odağında destekli çalışmalar.',
      illustration: 'cadillac',
      artUrl: '/images/lesson-drawings/cadillac-ink.png',
      artWidth: 480,
      artHeight: 484,
      brushWidth: 105,
      revealPath: 'M10 465 H470 V385 H10 V305 H470 V225 H10 V145 H470 V65 H10',
    },
    {
      title: 'Mat Pilates',
      description: 'Nefes, merkez kuvveti ve beden farkındalığını bir araya getiren akıcı dersler.',
      illustration: 'mat',
      artUrl: '/images/lesson-drawings/mat-ink.png',
      artWidth: 630,
      artHeight: 300,
      brushWidth: 100,
      revealPath: 'M10 285 H620 V215 H10 V145 H620 V75 H10 V10 H620',
    },
    {
      title: 'Hamak Yoga',
      description:
        'Yer çekimini desteğe dönüştüren; esneklik, hafiflik ve özgürlük hissi veren pratik.',
      illustration: 'hammock',
      artUrl: '/images/lesson-drawings/hammock-ink.png',
      artWidth: 520,
      artHeight: 490,
      brushWidth: 105,
      revealPath: 'M10 470 H510 V390 H10 V310 H510 V230 H10 V150 H510 V70 H10',
      comingSoon: true,
    },
  ];

  readonly principles = [
    {
      number: '01',
      title: 'Seni dinleriz',
      text: 'Hedefini, hareket geçmişini ve bugünkü enerjini anlayarak başlarız.',
    },
    {
      number: '02',
      title: 'Sana göre planlarız',
      text: 'Programı kalıplara değil, bedeninin ihtiyacına ve yaşam ritmine göre şekillendiririz.',
    },
    {
      number: '03',
      title: 'Yakından takip ederiz',
      text: 'Küçük gruplar ve birebir geri bildirimle güvenli, sürdürülebilir ilerleme sağlarız.',
    },
  ];

  private revealObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;
  private lastScrollY = 0;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly contactRequestService: ContactRequestService,
    private readonly toastService: ToastService,
    private readonly sanitizer: DomSanitizer,
    private readonly seoService: SeoService,
    private readonly googleReviewsService: GoogleReviewsService,
  ) {
    const query = encodeURIComponent(this.mapSearchLabel);
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${query}&output=embed`,
    );
    const isAppleMobile =
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1));
    this.directionsUrl = isAppleMobile
      ? `https://maps.apple.com/?daddr=${query}`
      : `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    this.googleReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Olive Pilates Studio ' + this.address)}`;
    this.hasLiveReviews = this.googleReviewsService.isConfigured();
  }

  ngOnInit(): void {
    this.seoService.set({
      title: 'Olive Pilates | İncek, Gölbaşı Ankara Reformer Pilates Stüdyosu',
      description:
        "Olive Pilates Studio, İncek/Gölbaşı Ankara'da reformer pilates, Cadillac, mat pilates ve birebir dersler sunan butik stüdyo. Stüdyomuzu ve derslerimizi keşfedin.",
      path: '/',
    });

    if (this.hasLiveReviews) {
      this.googleReviewsService.findReviews().then((reviews) => {
        this.reviews = reviews;
      });
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const currentScrollY = Math.max(0, window.scrollY);
    const scrollDelta = currentScrollY - this.lastScrollY;

    this.headerCompact = currentScrollY > 32;
    if (this.mobileMenuOpen || currentScrollY < 80) {
      this.headerHidden = false;
    } else if (Math.abs(scrollDelta) > 5) {
      this.headerHidden = scrollDelta > 0;
    }
    this.lastScrollY = currentScrollY;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.mobileMenuOpen = false;
  }

  ngAfterViewInit(): void {
    const host = this.elementRef.nativeElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = Array.from(host.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
      );
      revealElements.forEach((element, index) => {
        element.style.setProperty('--delay', `${(index % 4) * 70}ms`);
        this.revealObserver?.observe(element);
      });
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) this.activeSection = visible.target.id;
      },
      { rootMargin: '-20% 0px -68% 0px', threshold: [0, 0.25, 0.5] },
    );
    SECTION_IDS.map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => !!section)
      .forEach((section) => this.sectionObserver?.observe(section));

    const initialSection = window.location.hash.slice(1);
    if (SECTION_IDS.includes(initialSection)) {
      requestAnimationFrame(() => {
        const target = document.getElementById(initialSection);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - this.headerOffset();
        window.scrollTo({ top, behavior: 'auto' });
      });
    }
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.mobileMenuOpen = false;
    this.headerHidden = false;

    const target = document.getElementById(sectionId);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - this.headerOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    }
    history.replaceState(null, '', sectionId === 'anasayfa' ? '/' : `/#${sectionId}`);
  }

  private headerOffset(): number {
    const header = this.elementRef.nativeElement.querySelector<HTMLElement>('.header');
    return header ? header.offsetHeight : 0;
  }

  submitContactRequest(): void {
    if (
      this.contactSubmitting ||
      !this.contactForm.fullName.trim() ||
      !this.contactForm.email.trim() ||
      !this.contactForm.phone.trim() ||
      !this.contactForm.note.trim()
    ) {
      this.toastService.warning('Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    this.contactSubmitting = true;
    this.contactRequestService.create(this.contactForm).subscribe({
      next: () => {
        this.contactSubmitting = false;
        this.contactSubmitted = true;
        this.contactForm = this.emptyContactForm();
        this.toastService.success('Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.');
      },
      error: (error) => {
        this.contactSubmitting = false;
        const message =
          error?.status === 429
            ? 'Çok fazla talep gönderildi. Lütfen bir süre sonra tekrar deneyin.'
            : 'Talebiniz gönderilemedi. Lütfen tekrar deneyin.';
        this.toastService.error(message);
      },
    });
  }

  private emptyContactForm(): ContactRequestPayload {
    return { fullName: '', email: '', phone: '', note: '', website: '' };
  }
}
