import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studio-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './studio-home.component.html',
  styleUrl: './studio-home.component.scss',
})
export class StudioHomeComponent implements AfterViewInit, OnDestroy {
  mobileMenuOpen = false;
  openFaqIndex: number | null = null;
  private revealObserver?: IntersectionObserver;
  private scrollFrame?: number;
  private readonly updateIntroProgress = (): void => {
    if (this.scrollFrame !== undefined) {
      return;
    }

    this.scrollFrame = requestAnimationFrame(() => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / (viewportHeight * 0.62), 0), 1);
      const style = this.elementRef.nativeElement.style;
      style.setProperty('--intro-progress', progress.toFixed(4));
      style.setProperty('--intro-y', `${(-progress * 38).toFixed(2)}vh`);
      style.setProperty('--intro-scale', (1 - progress * 0.58).toFixed(4));
      style.setProperty('--intro-opacity', Math.max(1 - progress * 0.92, 0).toFixed(4));
      style.setProperty('--intro-ambient-opacity', Math.max(1 - progress, 0).toFixed(4));
      style.setProperty('--intro-grid-opacity', Math.max(0.22 * (1 - progress), 0).toFixed(4));
      style.setProperty('--intro-cue-opacity', Math.max(1 - progress * 3, 0).toFixed(4));
      this.scrollFrame = undefined;
    });
  };

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  readonly instagramPosts = [
    {
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85',
      alt: 'Reformer pilates dersi',
      caption: 'Güç, kontrol ve zarafetin aynı akışta buluştuğu anlar.',
    },
    {
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=85',
      alt: 'Pilates stüdyosu atmosferi',
      caption: 'Kendinize ayırdığınız sakin bir alan.',
    },
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85',
      alt: 'Kontrollü pilates hareketi',
      caption: 'Her harekette biraz daha dengeli, biraz daha güçlü.',
    },
    {
      image: 'https://images.unsplash.com/photo-1518611012118-f0c5e29f4c9f?auto=format&fit=crop&w=900&q=85',
      alt: 'Pilates egzersizi',
      caption: 'Bedeninizi dinleyerek ilerleyen kişisel bir yolculuk.',
    },
    {
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=900&q=85',
      alt: 'Esneme ve nefes çalışması',
      caption: 'Nefes alın, uzayın ve kendi ritminizi bulun.',
    },
    {
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85',
      alt: 'Mat üzerinde pilates çalışması',
      caption: 'İyi hissetmek, kendinize verdiğiniz zamanla başlar.',
    },
  ];

  readonly faqs = [
    {
      question: 'Daha önce pilates yapmadım, başlayabilir miyim?',
      answer: 'Elbette. İlk görüşmede deneyiminizi ve ihtiyaçlarınızı değerlendirir, size uygun başlangıç akışını birlikte belirleriz.',
    },
    {
      question: 'Grup dersleri kimler için uygun?',
      answer: 'Küçük grup dersleri, eğitmenin rehberliğini yakından hissederken birlikte hareket etmenin motivasyonunu isteyenler için uygundur.',
    },
    {
      question: 'Birebir dersin farkı nedir?',
      answer: 'Birebir derslerde tempo, egzersiz seçimi ve program tamamen sizin hedeflerinize ve bedeninizin ihtiyacına göre şekillenir.',
    },
  ];

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.updateIntroProgress, { passive: true });
    this.updateIntroProgress();

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.studio-home-page section:not(.hero-shell), .instagram-card, #paketler article, #yaklasim article',
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

    if (this.scrollFrame !== undefined) {
      cancelAnimationFrame(this.scrollFrame);
    }
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
