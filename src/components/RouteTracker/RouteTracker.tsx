import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteTracker
 * - Listens for route transitions in React Router
 * - Scrolls window to top instantly on route change
 * - Dispatches 'page_view' events to Google Tag Manager and GA4
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const currentPath = location.pathname + location.search;

    // Dispatch to GTM dataLayer
    if (typeof window !== 'undefined' && Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({
        event: 'page_view',
        page_path: currentPath,
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Dispatch to gtag if present
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: currentPath,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location]);

  return null;
}
