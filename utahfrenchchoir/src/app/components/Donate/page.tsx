// Donation Page
'use client';

import { useState } from 'react';
import Image from 'next/image';
import donationImg from '/public/choir-group.png';

export default function DonatePage() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donationType, setDonationType] = useState('one-time');

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex flex-col">
      {/* Top Section: Image (3/4) + Message (1/4) */}
      <div className="flex flex-col lg:flex-row w-full mb-8 gap-6">
        {/* Image Section */}
        <div className="relative w-full lg:w-3/4 h-64 lg:h-[500px] rounded-lg overflow-hidden">
          <Image
            src={donationImg}
            alt="Choir Group"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thank You Message */}
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md flex flex-col justify-center space-y-4">
          <p className="text-gray-700 text-lg">
            Your donation means a lot to us! It helps us reach our goals to sing for our Lord Jesus Christ, uplift hearts, and bring peace.
          </p>
          <p className="text-gray-700 text-lg">
            We use your gifts to buy music instruments and enhance our ministry.
          </p>
          <p className="font-semibold text-green-600 text-lg">
            Thank you so much!
          </p>
        </div>
      </div>

      {/* Bottom Section: Payment Form */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4 w-full">
        <h2 className="text-xl font-semibold text-center">Make a Donation</h2>

        {/* Payment Method */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Select Payment Method</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-400"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Choose --</option>
            <option value="card">Card</option>
            <option value="venmo">Venmo</option>
            <option value="cashapp">Cash App</option>
          </select>
        </div>

        {/* Donation Type for Venmo/Cash App */}
        {(paymentMethod === 'venmo' || paymentMethod === 'cashapp') && (
          <div>
            <label className="block mb-1 font-medium text-gray-700">Donation Type</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-400"
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
            >
              <option value="one-time">One-Time</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 border border-gray-300 rounded-md p-2"
              />
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
              Donate with Card
            </button>
          </div>
        )}

        {/* External Donation Buttons */}
        {paymentMethod === 'venmo' && (
          <a
            href="https://venmo.com/code?user_id=4210396596536513543&created=1747079270"
            target="_blank"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center py-2 rounded-md"
          >
            Donate with Venmo
          </a>
        )}
        {paymentMethod === 'cashapp' && (
          <a
            href="https://cash.app/$UtahFrenchChoir"
            target="_blank"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-center py-2 rounded-md"
          >
            Donate with Cash App
          </a>
        )}
      </div>
    </div>
  );
}
