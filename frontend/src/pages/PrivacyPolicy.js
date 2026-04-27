import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const sections = [
    {
        title: '1. Information We Collect',
        body: `When you use the Indian Heritage Preservation platform, we collect the information you
    voluntarily provide when creating an account (name, email address), submitting heritage site data
    (descriptions, photographs, coordinates), writing reviews, or making donations. We do not collect
    sensitive personal data such as financial instrument numbers — payment processing is handled by
    certified third-party gateways.`,
    },
    {
        title: '2. How We Use Your Information',
        body: `Your data is used solely to operate and improve the platform: to display your contributions,
    to credit you as a contributor on verified heritage site entries, to send transactional emails (e.g.,
    submission confirmations), and to generate anonymised aggregate statistics that help us understand
    which regions and categories need greater preservation attention.`,
    },
    {
        title: '3. Cultural Data & Intellectual Ownership',
        body: `Heritage site information (descriptions, historical accounts, photographs) submitted to this
    platform is treated as community-owned data. You retain copyright over content you author; however,
    by submitting it you grant the platform a perpetual, royalty-free licence to display, share, and
    archive that content in the spirit of public cultural preservation. Data that originates from
    governmental or institutional sources (ASI, UNESCO, INTACH) is attributed accordingly and remains
    the property of those organisations.`,
    },
    {
        title: '4. Data Sharing & Third Parties',
        body: `We do not sell, rent, or trade your personal information. Aggregate, anonymised statistics
    may be shared with our institutional partners (listed on the About page) exclusively for heritage
    research and conservation planning. We use trusted third-party services for hosting (cloud
    infrastructure) and analytics; these providers are bound by their own privacy policies and
    applicable data-protection law.`,
    },
    {
        title: '5. Data Retention & Deletion',
        body: `Your account and associated contributions are retained for as long as your account is active
    or as required by law. You may request deletion of your personal account at any time by emailing
    support@cultureheritage.in. Note that heritage site entries you have submitted may be retained in
    anonymised form as part of the cultural record, consistent with our preservation mandate.`,
    },
    {
        title: '6. Security',
        body: `We implement industry-standard security measures including HTTPS encryption, hashed password
    storage, and regular security audits. Despite these precautions, no system is entirely infallible;
    we encourage you to use a strong, unique password and to report any suspected vulnerabilities to our
    security team immediately.`,
    },
    {
        title: '7. Cookies & Local Storage',
        body: `We use session cookies and browser local storage exclusively to maintain authentication state
    and user preferences (such as map zoom level). We do not use tracking or advertising cookies. You
    may disable cookies in your browser settings; doing so will require you to log in on each visit.`,
    },
    {
        title: '8. Changes to This Policy',
        body: `We may update this Privacy Policy as the platform evolves. Material changes will be
    communicated via a notice on the home page and, where possible, by email. Continued use of the
    platform after changes take effect constitutes acceptance of the revised policy.`,
    },
    {
        title: '9. Contact',
        body: `For any privacy-related queries, please reach out at: privacy@cultureheritage.in`,
    },
];

const PrivacyPolicy = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF5E5' }}>
        {/* Header */}
        <section
            className="py-16 text-white"
            style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 100%)' }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <ShieldCheckIcon className="w-14 h-14 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                <h1
                    className="text-4xl md:text-5xl font-bold mb-4 gold-text"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Privacy Policy
                </h1>
                <p className="text-lg font-serif" style={{ color: '#f5ead5' }}>
                    Indian Heritage Preservation — how we protect your data and cultural contributions.
                </p>
                <p className="text-sm mt-3 font-display uppercase tracking-widest" style={{ color: '#D4AF37' }}>
                    Effective Date: January 2025
                </p>
            </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="vintage-card p-8 md:p-12">
                <p className="text-lg font-serif mb-8 leading-relaxed" style={{ color: '#2d1a00' }}>
                    At Indian Heritage Preservation, we believe transparency is a cornerstone of trust. This
                    Privacy Policy describes what information we collect, how we use it, and the choices you
                    have regarding your data when you use our platform.
                </p>
                <hr style={{ borderColor: '#D4AF37', marginBottom: '2rem' }} />

                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h2
                                className="text-xl font-bold mb-3 font-display"
                                style={{ color: '#580000', fontFamily: "'Playfair Display', serif" }}
                            >
                                {section.title}
                            </h2>
                            <p className="font-serif leading-relaxed" style={{ color: '#2d1a00' }}>
                                {section.body}
                            </p>
                            {i < sections.length - 1 && (
                                <div className="mt-6" style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)' }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <Link to="/" className="inline-flex items-center font-display text-xs uppercase tracking-wider transition-colors" style={{ color: '#580000' }}>
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <Link to="/terms" className="inline-flex items-center font-display text-xs uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                    Terms of Use →
                </Link>
            </div>
        </div>
    </div>
);

export default PrivacyPolicy;
