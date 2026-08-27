import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../shared/service/toast-service';
import {
  ContactRequestPayload,
  ContactRequestService,
} from '../contact-requests/contact-request.service';

@Component({
  selector: 'app-studio-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './studio-home.component.html',
  styleUrl: './studio-home.component.scss',
})
export class StudioHomeComponent implements AfterViewInit, OnDestroy {
  mobileMenuOpen = false;
  openFaqIndex: number | null = null;
  contactSubmitting = false;
  contactSubmitted = false;
  contactForm: ContactRequestPayload = this.emptyContactForm();
  private revealObserver?: IntersectionObserver;
  private scrollFrame?: number;
  private pointerFrame?: number;
  private parallaxLayers: Array<{ element: HTMLElement; speed: number }> = [];
  private readonly updatePointerGlow = (event: PointerEvent): void => {
    if (this.pointerFrame !== undefined || event.pointerType === 'touch') return;
    this.pointerFrame = requestAnimationFrame(() => {
      const style = this.elementRef.nativeElement.style;
      style.setProperty('--pointer-x', `${event.clientX}px`);
      style.setProperty('--pointer-y', `${event.clientY}px`);
      this.pointerFrame = undefined;
    });
  };
  private readonly updateIntroProgress = (): void => {
    if (this.scrollFrame !== undefined) {
      return;
    }

    this.scrollFrame = requestAnimationFrame(() => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const host = this.elementRef.nativeElement;
      const introStage = host.querySelector<HTMLElement>('.intro-logo-stage');
      const introLogo = host.querySelector<HTMLElement>('.intro-logo-wrap');
      const brandLogo = host.querySelector<HTMLElement>('.brand-logo');
      const header = host.querySelector<HTMLElement>('.studio-header');
      const transitionDistance = Math.max(
        (introStage?.offsetHeight ?? viewportHeight * 1.45) - viewportHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / transitionDistance, 0), 1);
      const videoProgress = Math.min(progress / 0.72, 1);
      const transitionProgress = Math.min(Math.max((progress - 0.72) / 0.28, 0), 1);
      const easedProgress = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
      const brandRect = brandLogo?.getBoundingClientRect();
      const headerRect = header?.getBoundingClientRect();
      const introWidth = introLogo?.offsetWidth ?? Math.min(window.innerWidth * 0.78, 880);
      const targetCenterX = brandRect ? brandRect.left + brandRect.width / 2 : 128;
      const targetCenterY = brandRect
        ? brandRect.top - (headerRect?.top ?? 0) + brandRect.height / 2
        : 48;
      const targetScale = brandRect
        ? Math.min(Math.max(brandRect.width / Math.max(introWidth, 1), 0.18), 0.42)
        : 0.3;
      const headerProgress = Math.min(Math.max((progress - 0.76) / 0.2, 0), 1);
      const heroProgress = Math.min(Math.max((progress - 0.78) / 0.22, 0), 1);
      const style = host.style;
      style.setProperty('--intro-progress', progress.toFixed(4));
      style.setProperty('--intro-video-progress', videoProgress.toFixed(4));
      style.setProperty(
        '--intro-x',
        `${((targetCenterX - window.innerWidth / 2) * easedProgress).toFixed(2)}px`,
      );
      style.setProperty(
        '--intro-y',
        `${((targetCenterY - viewportHeight / 2) * easedProgress).toFixed(2)}px`,
      );
      style.setProperty('--intro-scale', (1 - (1 - targetScale) * easedProgress).toFixed(4));
      style.setProperty(
        '--intro-opacity',
        Math.max(1 - Math.max((progress - 0.94) / 0.06, 0), 0).toFixed(4),
      );
      style.setProperty('--intro-ambient-opacity', Math.max(1 - progress, 0).toFixed(4));
      style.setProperty('--intro-grid-opacity', Math.max(0.22 * (1 - progress), 0).toFixed(4));
      style.setProperty('--intro-cue-opacity', Math.max(1 - progress * 3, 0).toFixed(4));
      style.setProperty('--header-progress', headerProgress.toFixed(4));
      style.setProperty(
        '--header-nav-progress',
        Math.min(Math.max((progress - 0.82) / 0.16, 0), 1).toFixed(4),
      );
      style.setProperty('--hero-progress', heroProgress.toFixed(4));
      const documentProgress =
        window.scrollY / Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      style.setProperty('--page-progress', Math.min(Math.max(documentProgress, 0), 1).toFixed(5));
      if (header) header.style.pointerEvents = headerProgress > 0.9 ? 'auto' : 'none';

      const parallaxEnabled =
        window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.parallaxLayers.forEach(({ element, speed }) => {
        if (!parallaxEnabled) {
          element.style.setProperty('--parallax-y', '0px');
          return;
        }

        const rect = element.getBoundingClientRect();
        const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        const shift = Math.min(Math.max(distanceFromCenter * speed, -56), 56);
        element.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
      });
      this.scrollFrame = undefined;
    });
  };

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly contactRequestService: ContactRequestService,
    private readonly toastService: ToastService,
  ) {}

  submitContactRequest(): void {
    if (
      this.contactSubmitting ||
      !this.contactForm.fullName.trim() ||
      !this.contactForm.email.trim() ||
      !this.contactForm.phone.trim() ||
      !this.contactForm.note.trim()
    ) {
      this.toastService.warning('Lütfen tüm alanları doldurun.');
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

  readonly instagramPosts = [
    {
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85',
      alt: 'Reformer pilates dersi',
      caption: 'Güç, kontrol ve zarafetin aynı akışta buluştuğu anlar.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=85',
      alt: 'Pilates stüdyosu atmosferi',
      caption: 'Kendinize ayırdığınız sakin bir alan.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85',
      alt: 'Kontrollü pilates hareketi',
      caption: 'Her harekette biraz daha dengeli, biraz daha güçlü.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1518611012118-f0c5e29f4c9f?auto=format&fit=crop&w=900&q=85',
      alt: 'Pilates egzersizi',
      caption: 'Bedeninizi dinleyerek ilerleyen kişisel bir yolculuk.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=900&q=85',
      alt: 'Esneme ve nefes çalışması',
      caption: 'Nefes alın, uzayın ve kendi ritminizi bulun.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85',
      alt: 'Mat üzerinde pilates çalışması',
      caption: 'İyi hissetmek, kendinize verdiğiniz zamanla başlar.',
    },
  ];

  readonly faqs = [
    {
      question: 'Daha önce pilates yapmadım, başlayabilir miyim?',
      answer:
        'Elbette. İlk görüşmede deneyiminizi ve ihtiyaçlarınızı değerlendirir, size uygun başlangıç akışını birlikte belirleriz.',
    },
    {
      question: 'Grup dersleri kimler için uygun?',
      answer:
        'Küçük grup dersleri, eğitmenin rehberliğini yakından hissederken birlikte hareket etmenin motivasyonunu isteyenler için uygundur.',
    },
    {
      question: 'Birebir dersin farkı nedir?',
      answer:
        'Birebir derslerde tempo, egzersiz seçimi ve program tamamen sizin hedeflerinize ve bedeninizin ihtiyacına göre şekillenir.',
    },
  ];

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  private applyOliveWordmark(): void {
    const host = this.elementRef.nativeElement;
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    const matches: Text[] = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      const textNode = currentNode as Text;
      const parent = textNode.parentElement;
      if (
        parent &&
        /\bolive\b/i.test(textNode.data) &&
        !textNode.data.includes('@') &&
        !parent.closest('.olive-signature, script, style')
      ) {
        matches.push(textNode);
      }
      currentNode = walker.nextNode();
    }

    matches.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      textNode.data.split(/(\bolive\b)/gi).forEach((part) => {
        if (/^olive$/i.test(part)) {
          const signature = document.createElement('span');
          signature.className = 'olive-signature';
          signature.textContent = 'Olive';
          fragment.appendChild(signature);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      textNode.replaceWith(fragment);
    });
  }

  private initializeParallax(): void {
    const host = this.elementRef.nativeElement;
    const layerGroups: Array<{ selector: string; speed: number }> = [
      { selector: '.hero-orbit', speed: -0.12 },
      { selector: '.hero-glow', speed: 0.08 },
      { selector: '.hero-copy', speed: -0.045 },
      { selector: '.hero-visual', speed: 0.065 },
      { selector: '#studio > div > div', speed: 0.035 },
      { selector: '#yaklasim h2', speed: -0.035 },
      { selector: '#yaklasim article', speed: 0.045 },
      { selector: '#dersler article', speed: 0.025 },
      { selector: '.studio-story-section img', speed: 0.075 },
      { selector: '.studio-story-section .story-copy', speed: -0.04 },
      { selector: '#paketler article', speed: 0.045 },
      { selector: '.instagram-card', speed: 0.035 },
      { selector: '#iletisim > div > div', speed: 0.04 },
    ];

    this.parallaxLayers = layerGroups.flatMap(({ selector, speed }) =>
      Array.from(host.querySelectorAll<HTMLElement>(selector)).map((element, index) => {
        element.classList.add('parallax-layer');
        return { element, speed: speed * (1 + (index % 3) * 0.16) };
      }),
    );
  }

  ngAfterViewInit(): void {
    this.applyOliveWordmark();
    this.initializeParallax();
    window.addEventListener('scroll', this.updateIntroProgress, { passive: true });
    window.addEventListener('resize', this.updateIntroProgress, { passive: true });
    window.addEventListener('pointermove', this.updatePointerGlow, { passive: true });
    this.updateIntroProgress();

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.studio-home-page section:not(.hero-shell):not(.intro-logo-stage), .instagram-card, #paketler article, #yaklasim article',
      ),
    );

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach((element) => element.classList.add('reveal-visible'));
      return;
    }

    revealElements.forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
    });

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('reveal-visible');
          this.revealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    revealElements.forEach((element) => this.revealObserver?.observe(element));
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    window.removeEventListener('scroll', this.updateIntroProgress);
    window.removeEventListener('resize', this.updateIntroProgress);
    window.removeEventListener('pointermove', this.updatePointerGlow);

    if (this.scrollFrame !== undefined) {
      cancelAnimationFrame(this.scrollFrame);
    }
    if (this.pointerFrame !== undefined) cancelAnimationFrame(this.pointerFrame);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.closeMobileMenu();

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `/home#${sectionId}`);
    section.classList.remove('section-arrived');
    requestAnimationFrame(() => section.classList.add('section-arrived'));
    window.setTimeout(() => section.classList.remove('section-arrived'), 900);
  }
}
