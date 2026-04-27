import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const sections = [
    {
        title: '1. Acceptance of Terms',
        body: `By accessing or using the Indian Heritage Preservation platform ("the Platform"), you agree
    to be bound by these Terms of Use. If you do not agree, please discontinue use of the Platform
    immediately. These terms apply to all visitors, registered users, and contributors.`,
    },
    {
        title: '2. Purpose of the Platform',
        body: `The Platform exists exclusively to document, preserve, and promote India's cultural and
    architectural heritage. It aggregates community-contributed information about temples, forts,
    monuments, lakes, and living traditions for educational and conservation purposes. The Platform is
    not a commercial travel agency or ticketing service.`,
    },
    {
        title: '3. User Contributions',
        body: `Users may submit heritage site entries, photographs, reviews, and historical descriptions.
    All contributions must be accurate, respectful, and free of copyrighted material you do not have
    the right to share. Fabricated, defamatory, or commercially promotional content will be removed
    without notice. By submitting content, you confirm you hold the rights to share it and grant the
    Platform a perpetual, royalty-free licence to display it for cultural preservation purposes.`,
    },
    {
        title: '4. Accuracy of Cultural Information',
        body: `While we strive for accuracy, heritage information on this platform is community-curated
    and subject to ongoing revision. The Platform does not guarantee the accuracy, completeness, or
    timeliness of any site description, historical account, or visitor detail. Always cross-reference
    with official sources (ASI, UNESCO, or local authorities) before making travel decisions. If you
    spot an error, please use the "Report" feature so our moderators can review it.`,
    },
    {
        title: '5. Intellectual Property',
        body: `The Platform's design, logo, codebase, and non-community content are the intellectual
    property of the Indian Heritage Preservation project. The codebase is open-source and available
    on GitHub (github.com/AbhayHegde05/Culture-heritage-preservation) under an open licence. Community
    contributions remain the property of their respective authors; the Platform holds a display
    licence only.`,
    },
    {
        title: '6. Donations',
        body: `Donations made through the Platform are processed by certified payment gateways and directed
    towards operational costs and verified conservation projects. Donations are non-refundable unless
    the Platform is unable to process a valid payment. We publish annual transparency reports
    summarising fund utilisation.`,
    },
    {
        title: '7. Prohibited Conduct',
        body: `You may not use the Platform to: submit false or misleading heritage information; scrape or
    bulk-download content without prior written permission; attempt to breach system security;
    impersonate another person or organisation; use the Platform for commercial advertising; or engage
    in any activity that violates Indian law or international cultural-heritage conventions.`,
    },
    {
        title: '8. Modifications & Termination',
        body: `We reserve the right to modify these Terms at any time. Continued use of the Platform after
    changes are published constitutes acceptance. We also reserve the right to terminate or suspend
    accounts that violate these Terms without prior notice.`,
    },
    {
        title: '9. Limitation of Liability',
        body: `The Platform is provided "as is" without warranties of any kind. To the fullest extent
    permitted by law, the Indian Heritage Preservation project shall not be liable for any indirect,
    incidental, or consequential damages arising from use of or inability to use the Platform.`,
    },
    {
        title: '10. Governing Law',
        body: `These Terms are governed by the laws of the Republic of India. Any disputes shall be
    subject to the exclusive jurisdiction of courts in New Delhi, India.`,
    },
    {
        title: '11. Contact',
        body: `For questions about these Terms, please email: legal@cultureheritage.in`,
    },
];

const TermsOfUse = () => (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF5E5' }}>
        {/* Header */}
        <section
            className="py-16 text-white"
            style={{ background: 'linear-gradient(135deg, #580000 0%, #720e0e 100%)' }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <DocumentTextIcon className="w-14 h-14 mx-auto mb-4" style={{ color: '#D4AF37' }} />
                <h1
                    className="text-4xl md:text-5xl font-bold mb-4 gold-text"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Terms of Use
                </h1>
                <p className="text-lg font-serif" style={{ color: '#f5ead5' }}>
                    Indian Heritage Preservation — the rules that protect our community and cultural data.
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
                    Please read these Terms of Use carefully before contributing to or using the Indian Heritage
                    Preservation platform. These terms govern your rights and responsibilities as a participant
                    in this open cultural preservation project.
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
                <Link to="/privacy" className="inline-flex items-center font-display text-xs uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                    ← Privacy Policy
                </Link>
            </div>
        </div>
    </div>
);

export default TermsOfUse;
