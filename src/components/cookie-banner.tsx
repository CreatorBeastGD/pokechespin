import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getCookie('cookieConsent');
    if (consent) {
      setShowBanner(false);
      initializeAnalytics();
    } else {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookieConsent', 'true', 365);
    setShowBanner(false);
    initializeAnalytics();
  };

  const initializeAnalytics = () => {
    // Inicializar Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID', {
      'anonymize_ip': true
    });

    // Inicializar Vercel Analytics
    // Aquí puedes agregar cualquier configuración adicional para Vercel Analytics si es necesario
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
      <p>We use cookies to improve your experience. By using our site, you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.</p>
      <button onClick={handleAccept} className="bg-blue-500 text-white p-2 rounded">Accept</button>
    </div>
  );
};

export default CookieBanner;