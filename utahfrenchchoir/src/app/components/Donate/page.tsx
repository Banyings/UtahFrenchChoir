/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Heart, Lock, CreditCard, Mail, User, DollarSign, Calendar, Gift, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function DonatePage() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Predefined donation amounts
  const donationAmounts = [
    { value: '25', label: '$25' },
    { value: '50', label: '$50' },
    { value: '100', label: '$100' },
    { value: '250', label: '$250' },
    { value: 'custom', label: 'Custom' }
  ];

  // Card formatting functions
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0, len = v.length; i < len; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const formatCVV = (value: string): string => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  const getCardType = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    if (number.startsWith('6')) return 'Discover';
    return '';
  };

  // Event handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData({ ...cardData, expiryDate: formatted });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setCardData({ ...cardData, cvv: formatted });
  };

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount);
    if (amount !== 'custom') {
      setCustomAmount('');
    }
  };

  const getFinalAmount = () => {
    return donationAmount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(donationAmount) || 0;
  };

  // Validate form based on payment method
  const validateForm = () => {
    if (!donationAmount) {
      return 'Please select a donation amount.';
    }
    
    if (donationAmount === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)) {
      return 'Please enter a valid custom amount.';
    }
    
    if (paymentMethod === 'card') {
      // Card only requires email
      if (!donorInfo.email) {
        return 'Please enter your email address.';
      }
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
        return 'Please fill in all card details.';
      }
    }
    
    if (paymentMethod === 'venmo' || paymentMethod === 'cashapp') {
      // Venmo/CashApp require name and email
      if (!donorInfo.fullName || !donorInfo.email) {
        return 'Please fill in your name and email address.';
      }
    }
    
    return null;
  };

  // Handle external payment method clicks (Venmo/CashApp)
  const handleExternalPayment = async (method: string) => {
    const validationError = validateForm();
    if (validationError) {
      setPaymentStatus({ type: 'error', message: validationError });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus({ type: null, message: '' });

    try {
      const amount = getFinalAmount();
      
      // Save donor info to Supabase for Venmo/CashApp
      const donorData = {
        fullName: donorInfo.fullName,
        email: donorInfo.email,
        phone: donorInfo.phone || null,
        message: donorInfo.message || null,
        amount,
        donationType,
        paymentMethod: method,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      console.log('Sending donor data:', donorData);

      // Call API to save to Supabase
      const response = await fetch('/api/save-donors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.details || 'Failed to save donor information');
      }

      console.log('Success Response:', responseData);

      // Redirect to external payment
      const url = method === 'venmo' 
        ? "https://venmo.com/code?user_id=4210396596536513543&created=1747079270"
        : "https://cash.app/$UtahFrenchChoir";
      
      window.open(url, '_blank');
      
      setPaymentStatus({
        type: 'success',
        message: `Thank you ${donorInfo.fullName}! Your information has been saved. Please complete your $${amount.toFixed(2)} donation through ${method === 'venmo' ? 'Venmo' : 'Cash App'}.`
      });

      // Reset form after successful submission
      setDonorInfo({ fullName: '', email: '', phone: '', message: '' });
      setDonationAmount('');
      setCustomAmount('');

    } catch (error) {
      console.error('External payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setPaymentStatus({
        type: 'error',
        message: `Failed to save information: ${errorMessage}. Please check your connection and try again.`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle card payment submission
  const handleCardPayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      setPaymentStatus({ type: 'error', message: validationError });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus({ type: null, message: '' });

    try {
      // TODO: Implement real Stripe payment integration
      // Temporarily disabled until create-payment-intent API is ready
      
      setPaymentStatus({
        type: 'error',
        message: 'Card payments are temporarily disabled. Please use Venmo or Cash App for now.'
      });
      
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row w-full mb-8 gap-6">
        {/* Image Section with Overlay */}
        <div className="relative w-full lg:w-3/4 h-64 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Support Our Ministry</h1>
            <p className="text-lg lg:text-xl opacity-90">Help us spread joy through music</p>
          </div>
          <div className="relative w-full h-full">
            <img 
              src="/choir-group.png" 
              alt="Utah French Choir Group"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Thank You Message Card */}
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-center space-y-4 border border-gray-200">
          <div className="text-center mb-4">
            <Gift className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-800">Your Gift Matters</h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            Your donation helps us reach our goals to sing for our Lord Jesus Christ, uplift hearts, and bring peace to communities.
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            We use your gifts to buy music instruments and enhance our ministry outreach.
          </p>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="font-semibold text-green-700 text-center">
              Thank you for your generosity! 🙏
            </p>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg w-full border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Make a Donation</h2>
          <p className="text-gray-600">Choose your preferred way to support our ministry</p>
        </div>

        {/* Security Notice - Red Alert */}
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Important Notice</h3>
              <p className="text-red-700 mb-2">
                We are so sorry - our card payment system is not working properly at the moment and we want to ensure your donation process is completely secure and smooth.
              </p>
              <p className="text-red-700">
                For your safety and peace of mind, please use Venmo or Cash App as they are fully secure and working perfectly. We sincerely apologize for any inconvenience and truly appreciate your understanding and continued support! 🙏
              </p>
            </div>
          </div>
        </div>

        {/* Donation Amount Selection */}
        <div className="mb-8">
          <label className="block mb-4 font-semibold text-gray-700 text-lg">
            <DollarSign className="w-5 h-5 inline mr-2" />
            Select Donation Amount
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {donationAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => handleAmountSelect(amount.value)}
                className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                  donationAmount === amount.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                }`}
              >
                {amount.label}
              </button>
            ))}
          </div>
          
          {donationAmount === 'custom' && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
            </div>
          )}
        </div>

        {/* Donation Type */}
        <div className="mb-8">
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            <Calendar className="w-5 h-5 inline mr-2" />
            Donation Frequency
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setDonationType('one-time')}
              className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
                donationType === 'one-time'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              One-Time Gift
            </button>
            <button
              onClick={() => setDonationType('monthly')}
              className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
                donationType === 'monthly'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              Monthly Giving
            </button>
          </div>
        </div>

        {/* Donor Information - Conditional Requirements */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 text-lg mb-4">
            <User className="w-5 h-5 inline mr-2" />
            Your Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={paymentMethod === 'card' ? 'Full Name (Optional)' : 'Full Name *'}
              value={donorInfo.fullName}
              onChange={(e) => setDonorInfo({ ...donorInfo, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required={paymentMethod === 'venmo' || paymentMethod === 'cashapp'}
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={donorInfo.email}
              onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={donorInfo.phone}
            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <textarea
            placeholder="Personal message (Optional)"
            rows={3}
            value={donorInfo.message}
            onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          {/* Information Requirements Notice */}
          <div className="mt-3 text-sm text-gray-600">
            {paymentMethod === 'card' && (
              <p>* Only email address is required for card payments</p>
            )}
            {(paymentMethod === 'venmo' || paymentMethod === 'cashapp') && (
              <p>* Name and email are required for {paymentMethod === 'venmo' ? 'Venmo' : 'Cash App'} donations</p>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <label className="block mb-4 font-semibold text-gray-700 text-lg">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                paymentMethod === 'card'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Credit/Debit Card
            </button>
            <button
              onClick={() => setPaymentMethod('venmo')}
              className={`p-4 border-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                paymentMethod === 'venmo'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              Venmo
            </button>
            <button
              onClick={() => setPaymentMethod('cashapp')}
              className={`p-4 border-2 rounded-lg font-medium transition-all flex items-center justify-center ${
                paymentMethod === 'cashapp'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              Cash App
            </button>
          </div>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 text-lg mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Secure Card Payment
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardData.cardholderName}
                onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  maxLength={19}
                  required
                />
                {getCardType(cardData.cardNumber) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {getCardType(cardData.cardNumber)}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleExpiryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  maxLength={5}
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardData.cvv}
                  onChange={handleCVVChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {paymentMethod === 'card' && (
            <button
              onClick={handleCardPayment}
              disabled={isProcessing || !donationAmount}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center ${
                isProcessing || !donationAmount
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Processing Donation...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Donate ${getFinalAmount() > 0 ? `${getFinalAmount().toFixed(2)}` : ''} with Card
                </>
              )}
            </button>
          )}

          {paymentMethod === 'venmo' && (
            <button
              onClick={() => handleExternalPayment('venmo')}
              disabled={isProcessing || !donationAmount}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center ${
                isProcessing || !donationAmount
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Saving Info...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Continue with Venmo (${getFinalAmount() > 0 ? `${getFinalAmount().toFixed(2)}` : ''})
                </>
              )}
            </button>
          )}

          {paymentMethod === 'cashapp' && (
            <button
              onClick={() => handleExternalPayment('cashapp')}
              disabled={isProcessing || !donationAmount}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center ${
                isProcessing || !donationAmount
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Saving Info...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Continue with Cash App (${getFinalAmount() > 0 ? `${getFinalAmount().toFixed(2)}` : ''})
                </>
              )}
            </button>
          )}
        </div>

        {/* Status Message */}
        {paymentStatus.type && (
          <div className={`mt-6 p-4 rounded-lg flex items-start ${
            paymentStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {paymentStatus.type === 'success' ? (
              <CheckCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div className="font-medium">{paymentStatus.message}</div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Lock className="w-4 h-4 mr-2" />
            Your donation is secure and encrypted. You will receive a confirmation email.
          </div>
        </div>
      </div>
    </div>
  );
}