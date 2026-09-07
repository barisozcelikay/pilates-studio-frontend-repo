import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../shared/service/toast-service';
import {
  ContactRequestPayload,
  ContactRequestService,
} from '../contact-requests/contact-request.service';

interface Lesson {
  number: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  accent: string;
}

const SECTION_IDS = ['anasayfa', 'hakkimizda', 'dersler', 'yaklasim', 'konum', 'iletisim'];

@Component({
  selector: 'app-studio-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './studio-home.component.html',
  styleUrl: './studio-home.component.scss',
})
export class StudioHomeComponent implements AfterViewInit, OnDestroy {
  mobileMenuOpen = false;
  headerCompact = false;
  headerHidden = false;
  activeSection = 'anasayfa';
  contactSubmitting = false;
  contactSubmitted = false;
  contactForm: ContactRequestPayload = this.emptyContactForm();

  readonly logoUrl = '/images/olive-logo-lockup-transparent.svg';
  readonly iconLogoUrl = '/images/olive-logo-icon-primary-v2.png';
  readonly studioSignUrl = '/images/olive-studio-sign-v1.jpg';
  readonly instagramUrl = 'https://www.instagram.com/beyzadoespilates/';
  readonly address = 'İncek, 3035. Cadde 143A, 06830 Gölbaşı/Ankara';
  readonly mapSearchLabel = this.address;
  readonly mapEmbedUrl: SafeResourceUrl;
  readonly directionsUrl: string;

  readonly lessons: Lesson[] = [
    {
      number: '01',
      title: 'Reformer Pilates',
      description:
        'Direnç, denge ve kontrollü akışla bütün bedeni güçlendiren kişiselleştirilmiş seanslar.',
      duration: '50 dakika',
      level: 'Her seviye',
      accent: 'Güç',
    },
    {
      number: '02',
      title: 'Cadillac',
      description:
        'Hareket alanını güvenle genişleten, mobilite ve postür odağında destekli çalışmalar.',
      duration: '50 dakika',
      level: 'Kişiye özel',
      accent: 'Mobilite',
    },
    {
      number: '03',
      title: 'Mat Pilates',
      description: 'Nefes, merkez kuvveti ve beden farkındalığını bir araya getiren akıcı dersler.',
      duration: '50 dakika',
      level: 'Her seviye',
      accent: 'Denge',
    },
    {
      number: '04',
      title: 'Hamak Yoga',
      description:
        'Yer çekimini desteğe dönüştüren; esneklik, hafiflik ve özgürlük hissi veren pratik.',
      duration: '50 dakika',
      level: 'Başlangıç dostu',
      accent: 'Akış',
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
  ) {
    const query = encodeURIComponent(this.mapSearchLabel);
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${query}&output=embed`,
    );
    this.directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
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
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.mobileMenuOpen = false;
    this.headerHidden = false;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', sectionId === 'anasayfa' ? '/home' : `/home#${sectionId}`);
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
      error: () => {
        this.contactSubmitting = false;
        this.toastService.error('Talebiniz gönderilemedi. Lütfen tekrar deneyin.');
      },
    });
  }

  private emptyContactForm(): ContactRequestPayload {
    return { fullName: '', email: '', phone: '', note: '' };
  }
}
