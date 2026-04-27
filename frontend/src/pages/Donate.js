import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { donations, heritage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UPI_ID = 'heritage.india@upi';
const UPI_NAME = 'Indian Heritage Preservation';

// UPI Donation Form Component
const DonationForm = ({ selectedSite, onDonationSuccess }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'upi'
  const [utrNumber, setUtrNumber] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];
  const finalAmount = customAmount || donationAmount;

  const getQrUrl = () => {
    const upiStr = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${finalAmount}&cu=INR&tn=HeritageDonation`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiStr)}&bgcolor=FFFFF0&color=580000`;
  };

  const handleAmountSelect = (amount) => { setDonationAmount(amount); setCustomAmount(''); };
  const handleCustomAmount = (val) => { setCustomAmount(val); setDonationAmount(''); };

  const handleProceed = () => {
    if (!finalAmount || parseFloat(finalAmount) < 1) { toast.error('Please select or enter a donation amount'); return; }
    setStep('upi');
  };

  const handleConfirmPayment = async () => {
    if (!utrNumber.trim() || utrNumber.trim().length < 6) { toast.error('Please enter a valid UTR / Transaction Reference Number'); return; }
    setIsProcessing(true);
    try {
      await donations.processDonation({
        amount: parseFloat(finalAmount), currency: 'INR', paymentMethod: 'upi',
        paymentId: `UTR_${utrNumber.trim()}`, donationType,
        heritageSite: selectedSite?._id, isAnonymous,
      });
      toast.success('🙏 Thank you for your generous donation!');
      reset(); setDonationAmount(''); setCustomAmount(''); setUtrNumber(''); setStep('form');
      onDonationSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const upiApps = [
    { name: 'Google Pay', color: '#4285F4', emoji: '🔵' },
    { name: 'PhonePe', color: '#5f259f', emoji: '🟣' },
    { name: 'Paytm', color: '#00BAF2', emoji: '🔷' },
    { name: 'BHIM UPI', color: '#00538C', emoji: '🏛️' },
  ];

  if (step === 'upi') {
    return (
      <div className="space-y-5">
        <div className="text-center pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Complete Payment</p>
          <p className="text-2xl font-bold" style={{ color: '#580000' }}>₹{finalAmount}</p>
        </div>
        <div className="flex justify-center">
          <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <img src={getQrUrl()} alt="UPI QR Code" className="w-48 h-48" />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">UPI ID</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-base font-bold" style={{ color: '#580000' }}>{UPI_ID}</code>
            <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('Copied!'); }}
              className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded">Copy</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {upiApps.map(app => (
            <div key={app.name} className="flex flex-col items-center p-2 border border-gray-200 rounded-lg text-center text-xs">
              <span className="text-2xl mb-1">{app.emoji}</span>
              <span className="font-medium text-gray-700">{app.name}</span>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UTR / Transaction Reference *</label>
          <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)}
            placeholder="Enter UTR number after paying" className="input-field" />
          <p className="text-xs text-gray-400 mt-1">Find the UTR in your UPI app's transaction history</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setStep('form')}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">← Back</button>
          <button type="button" onClick={handleConfirmPayment} disabled={isProcessing}
            className="flex-1 btn-primary py-3 disabled:opacity-50">
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Secure UPI Payment</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleProceed)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setDonationType('general')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              donationType === 'general' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}>
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-6 h-6 text-primary-600" />
              <div><div className="font-medium">General Fund</div><div className="text-sm text-gray-600">Support overall preservation</div></div>
            </div>
          </button>
          <button type="button" onClick={() => setDonationType('site_specific')} disabled={!selectedSite}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              donationType === 'site_specific' ? 'border-primary-600 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
            } ${!selectedSite ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center space-x-3">
              <BuildingLibraryIcon className="w-6 h-6 text-primary-600" />
              <div><div className="font-medium">Site Specific</div><div className="text-sm text-gray-600">{selectedSite ? selectedSite.name : 'Select a site below'}</div></div>
            </div>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount (INR)</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {predefinedAmounts.map((amount) => (
            <button key={amount} type="button" onClick={() => handleAmountSelect(amount)}
              className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                donationAmount === amount ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 hover:border-gray-400'}`}>
              ₹{amount}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input type="number" placeholder="Enter custom amount" value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500" min="1" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded" />
        <label htmlFor="anonymous" className="text-sm text-gray-700">Make this donation anonymous</label>
      </div>
      <button type="submit" disabled={!donationAmount && !customAmount}
        className="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50 flex items-center justify-center">
        <HeartIcon className="w-5 h-5 mr-2" />
        Proceed to Pay ₹{finalAmount || '0'} via UPI
      </button>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <ShieldCheckIcon className="w-4 h-4" />
        <span>Secure UPI Payment — GPay · PhonePe · Paytm · BHIM</span>
      </div>
    </form>
  );
};

const Donate = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  // Fetch heritage sites for site-specific donations
  const { data: sitesData } = useQuery(
    'heritageSitesForDonation',
    () => heritage.getAll({ limit: 10 }),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const handleDonationSuccess = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  const impactAreas = [
    {
      icon: BuildingLibraryIcon,
      title: 'Site Restoration',
      description: 'Fund restoration projects for endangered heritage sites',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Programs',
      description: 'Support local communities in preserving their cultural heritage',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: GlobeAltIcon,
      title: 'Digital Documentation',
      description: 'Help digitize and document heritage sites for future generations',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: SparklesIcon,
      title: 'Education & Awareness',
      description: 'Fund educational programs and awareness campaigns',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Heritage Enthusiast',
      content: 'I\'m proud to support the preservation of our cultural heritage. Every contribution helps protect these treasures for future generations.',
      amount: '₹5,000',
    },
    {
      name: 'Raj Kumar',
      role: 'Regular Donor',
      content: 'The transparency and impact of this platform convinced me to contribute regularly. Seeing the restoration progress is truly rewarding.',
      amount: '₹2,000/month',
    },
    {
      name: 'Maria Fernandez',
      role: 'International Supporter',
      content: 'As someone who loves Indian culture, I\'m happy to support the preservation of these magnificent heritage sites from abroad.',
      amount: '₹10,000',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-accent-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>
              Support Heritage Preservation
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100 mb-8">
              Your generous contribution helps protect and preserve our invaluable cultural heritage 
              for future generations to cherish and learn from.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-6 h-6" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Tax Deductible</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-6 h-6" />
                <span>Transparent Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Message */}
      {showThankYou && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white p-6 rounded-lg shadow-xl max-w-sm animate-slide-up">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-8 h-8" />
            <div>
              <h3 className="font-bold">Thank You!</h3>
              <p className="text-sm">Your donation has been processed successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Impact Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Where Your Donation Goes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every contribution makes a real difference in preserving our cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${area.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600 text-sm">{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Make Your Donation</h2>
              <p className="text-gray-600">
                Choose your donation amount and help preserve our cultural heritage.
              </p>
            </div>

            {/* Site Selection (Optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Support a Specific Heritage Site (Optional)
              </label>
              <select
                value={selectedSite?._id || ''}
                onChange={(e) => {
                  const site = sitesData?.data?.find(s => s._id === e.target.value);
                  setSelectedSite(site || null);
                }}
                className="input-field"
              >
                <option value="">Support general fund</option>
                {Array.isArray(sitesData?.data) ? sitesData.data.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.name} - {site.location.city}
                  </option>
                )) : null}
              </select>
            </div>

            <DonationForm
              selectedSite={selectedSite}
              onDonationSuccess={handleDonationSuccess}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Donors Say</h2>
            <p className="text-xl text-gray-600">
              Join thousands of supporters who are making a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="text-sm font-medium text-primary-600">
                  Donated: {testimonial.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Every Contribution Counts
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Whether big or small, your donation helps protect our shared cultural heritage 
            and ensures it survives for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#donation-form" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              Donate Now
            </a>
            <a href="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 inline-flex items-center justify-center">
              Learn More
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
