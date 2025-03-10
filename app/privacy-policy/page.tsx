"use client"

import CookieBanner from '@/components/cookie-banner';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4 space-y-4 text-gray-800 max-w-2xl text-lg leading-relaxed text-justify dark:text-gray-200 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p>We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website.</p>
      
      <h2 className="text-xl font-bold mt-4">What Data We Collect</h2>
      <p>We may collect the following data:</p>
      <ul className="list-disc list-inside">
        <li>IP address</li>
        <li>Device information (e.g., device type, operating system, browser type)</li>
        <li>Geolocation data (e.g., country)</li>
        <li>Pages visited and links clicked</li>
      </ul>
      
      <h2 className="text-xl font-bold mt-4">How We Use Your Data</h2>
      <p>We use the collected data to:</p>
      <ul className="list-disc list-inside">
        <li>Analyze website traffic and usage</li>
        <li>Improve our website and services</li>
        <li>Ensure the security of our website</li>
      </ul>
      
      <h2 className="text-xl font-bold mt-4">Your Rights</h2>
      <p>You have the right to:</p>
      <ul className="list-disc list-inside">
        <li>Access the personal data we hold about you</li>
        <li>Request the correction of inaccurate data</li>
        <li>Request the deletion of your data</li>
        <li>Object to the processing of your data</li>
      </ul>
      
      <h2 className="text-xl font-bold mt-4">Contact Us</h2>
      <p>If you have any questions about this privacy policy or our data practices, please contact us at <a href="mailto:javiskorpion@gmail.com">javiskorpion@gmail.com</a>.</p>
      
      <CookieBanner />
    </div>
  );
};

export default PrivacyPolicy;