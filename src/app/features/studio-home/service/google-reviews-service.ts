import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string;
  rating: number;
  text: string;
  relativeTime: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

let scriptLoadPromise: Promise<void> | null = null;

/**
 * Loads Google's Maps JavaScript API (Places library) on demand and fetches
 * the studio's real Google reviews client-side. Requires a domain-restricted
 * API key + Place ID in environment config; resolves to an empty array (and
 * never throws) when either is missing, so the landing page always falls
 * back gracefully to a plain "see reviews on Google" link.
 */
@Injectable({ providedIn: 'root' })
export class GoogleReviewsService {
  isConfigured(): boolean {
    return !!environment.googleMapsApiKey && !!environment.googlePlaceId;
  }

  async findReviews(): Promise<GoogleReview[]> {
    if (!this.isConfigured()) return [];

    try {
      await this.loadScript();
      const google = window.google;
      if (!google?.maps?.places) return [];

      const service = new google.maps.places.PlacesService(document.createElement('div'));

      return await new Promise<GoogleReview[]>((resolve) => {
        service.getDetails(
          { placeId: environment.googlePlaceId, fields: ['reviews'] },
          (place: any, status: string) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.reviews) {
              resolve([]);
              return;
            }

            resolve(
              place.reviews.slice(0, 6).map((review: any) => ({
                authorName: review.author_name,
                authorPhotoUrl: review.profile_photo_url,
                rating: review.rating,
                text: review.text,
                relativeTime: review.relative_time_description,
              })),
            );
          },
        );
      });
    } catch {
      return [];
    }
  }

  private loadScript(): Promise<void> {
    if (window.google?.maps?.places) return Promise.resolve();
    if (scriptLoadPromise) return scriptLoadPromise;

    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(script);
    });

    return scriptLoadPromise;
  }
}
