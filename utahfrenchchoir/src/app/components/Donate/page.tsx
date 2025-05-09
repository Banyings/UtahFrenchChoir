
'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const predefinedAmounts = [
    { value: '5', label: '$5' },
    { value: '10', label: '$10' },
    { value: '20', label: '$20' },
    { value: '30', label: '$30' },
    { value: '50', label: '$50' },
  ];

  const handleDonate = () => {
    const amount = selectedAmount || customAmount;
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please select or enter a valid donation amount.');
      return;
    }

    setShowPaymentOptions(true);
  };

  const handlePaymentSelection = (method: string) => {
    setSelectedPayment(method);
    console.log('Donation amount:', selectedAmount || customAmount);
    console.log('Donation type:', donationType);
    console.log('Payment method:', method);
    alert(`Thank you for your donation via ${method}!`);
    // Reset state
    setSelectedAmount('');
    setCustomAmount('');
    setShowPaymentOptions(false);
    setSelectedPayment('');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Main Content Section */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 h-64 md:h-[500px] relative">
              <Image
                src="/choir-group.png"
                alt="Group photo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="w-full md:w-1/3 p-6">
              <div className="space-y-4">
                <h1 className='text-2xl sm:text-3xl md:text-4xl sm:ml-8 md:ml-16'>Donate</h1>
                <p className="text-gray-800 leading-relaxed">
                  Your donation means a lot to us! It helps us sing for our Lord Jesus Christ and uplift hearts.
                </p>
                <p className="text-gray-800 leading-relaxed">
                  With your help, we can buy musical instruments to make our music even more joyful and impactful.
                </p>
                <p className="text-gray-800 font-medium">Thank you so much!</p>
              </div>
            </div>
          </div>

          {/* Donation Form Section */}
          <div className="p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="font-medium text-center text-teal-800">Select the amount:</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount.value}
                    onClick={() => {
                      setSelectedAmount(amount.value);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 border rounded-md text-center transition-colors
                      ${selectedAmount === amount.value
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-600'}`}
                  >
                    {amount.label}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Other Amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount('');
                  }}
                  className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Donation Type */}
              <div className="flex items-center justify-center space-x-6 mt-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={donationType === 'one-time'}
                    onChange={() => setDonationType('one-time')}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">One-time Donation</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={donationType === 'monthly'}
                    onChange={() => setDonationType('monthly')}
                    className="form-radio h-4 w-4 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">Monthly Donation</span>
                </label>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                className="w-full max-w-md mx-auto block bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors mt-6"
              >
                Donate
              </button>

              {/* Payment Method Modal */}
              {showPaymentOptions && (
                <div className="mt-6 p-4 bg-white border rounded-md shadow">
                  <p className="text-center font-semibold mb-4">Select a Payment Method:</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {['Venmo', 'Zelle', 'PayPal', 'Credit/Debit Card'].map((method) => (
                      <button
                        key={method}
                        onClick={() => handlePaymentSelection(method)}
                        className="py-2 px-4 border rounded hover:bg-green-100 transition-colors"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
