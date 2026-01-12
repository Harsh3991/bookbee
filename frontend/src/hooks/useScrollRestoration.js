import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Custom hook for managing scroll restoration across route navigation
 * - Scrolls to top on forward navigation
 * - Restores scroll position on back/forward navigation
 * - Persists scroll positions in sessionStorage
 */
export const useScrollRestoration = (delay = 100, options = {}) => {
  const {
    enabled = true,
    preserveOnForward = false, // Keep scroll position even on forward navigation
    scrollToTopOnMount = false, // Always scroll to top on mount
  } = options;

  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef(new Map());
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Load scroll positions from sessionStorage on mount
    const savedPositions = sessionStorage.getItem('scrollPositions');
    if (savedPositions) {
      try {
        const parsed = JSON.parse(savedPositions);
        scrollPositions.current = new Map(Object.entries(parsed));
      } catch (e) {
        console.error('Failed to parse scroll positions:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save current scroll position before navigation
    const saveScrollPosition = () => {
      if (!isRestoringRef.current) {
        const currentPath = location.pathname + location.search;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        scrollPositions.current.set(currentPath, scrollY);
        
        // Persist to sessionStorage
        const positionsObj = Object.fromEntries(scrollPositions.current);
        sessionStorage.setItem('scrollPositions', JSON.stringify(positionsObj));
      }
    };

    // Save scroll position on scroll events (debounced)
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      saveScrollPosition(); // Save on unmount
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Delay to allow animations and content to render
    const timeoutId = setTimeout(() => {
      if (navigationType === 'POP') {
        // Back/Forward navigation - restore scroll position
        const savedPosition = scrollPositions.current.get(currentPath);
        if (savedPosition !== undefined) {
          isRestoringRef.current = true;
          window.scrollTo({
            top: savedPosition,
            left: 0,
            behavior: 'instant' // Use 'instant' to avoid animation conflicts
          });
          // Reset flag after a brief delay
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 50);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      } else {
        // PUSH or REPLACE navigation - scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, navigationType, delay]);

  // Scroll to top on mount if enabled
  useEffect(() => {
    if (scrollToTopOnMount) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [scrollToTopOnMount]);

  // Preserve scroll position on forward navigation if enabled
  useEffect(() => {
    if (preserveOnForward && navigationType === 'POP') {
      const currentPath = location.pathname + location.search;
      const savedPosition = scrollPositions.current.get(currentPath);
      if (savedPosition !== undefined) {
        window.scrollTo({ top: savedPosition, left: 0, behavior: 'instant' });
      }
    }
  }, [navigationType, location.pathname, location.search, preserveOnForward]);
};
