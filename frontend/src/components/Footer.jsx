import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-sm font-bold text-white mb-2">KisanQ Platform</h4>
          <p className="text-slate-400 leading-relaxed">
            Smart Procurement Management Platform for Farmers. Developed for Smart India Hackathon (SIH) Problem Statement 26032 under the Department of Consumer Affairs (DoCA).
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-2">Core Workflow</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>✓ Smart Slot Booking & Dynamic Token Generation</li>
            <li>✓ Transparent Real-Time Queue & Wait Time Calculation</li>
            <li>✓ Digital Procurement Verification & Quality Grading</li>
            <li>✓ Direct Payment Tracking & Notifications</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-2">Ministry & Contact</h4>
          <p className="text-slate-400">
            Department of Consumer Affairs (DoCA)<br />
            Ministry of Consumer Affairs, Food & Public Distribution<br />
            Government of India, New Delhi
          </p>
          <p className="text-emerald-400 font-semibold mt-2">Tagline: "Book. Track. Procure. Without the Wait."</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-slate-800 text-center text-slate-500">
        © 2026 KisanQ - Smart Procurement Management System. Built for SIH 2026.
      </div>
    </footer>
  );
};

export default Footer;
