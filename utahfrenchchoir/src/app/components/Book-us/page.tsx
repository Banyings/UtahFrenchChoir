// Book Us Page
'use client'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Contact Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        {/* Get in Touch Section */}
        <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-300 hover:shadow-2xl transition duration-300 ease-in-out">
          <div className="relative w-full h-48 mb-6">
            <Image 
              src="/choir-group.png" 
              alt="Choir or music"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-6">Get In Touch</h2>
          <div className="space-y-6 text-gray-700 text-base">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600" />
              <a href="tel:385-230-9434" className="hover:underline">385-230-9434</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <a href="mailto:utahchoir@gmail.com" className="hover:underline">utahchoir@gmail.com</a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <p>234 N 200 W, Orem, Utah, United States, 84058</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <p>Send us a message to plan with our event planner</p>
            </div>
          </div>
        </div>

        {/* Send Us A Message Section */}
        <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-300 hover:shadow-2xl transition duration-300 ease-in-out">
          <div className="relative w-full h-48 mb-6">
            <Image 
              src="/choir-group.png" 
              alt="Message illustration"
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-6">Send Us A Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 transition"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 transition"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 transition"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all duration-200 ease-in-out shadow"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-72 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-md animate-fade-in-up">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.6783974489483!2d-111.6932392!3d40.2967777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x874d9271930c1947%3A0x1d90f12600b556ef!2s234%20N%20200%20W%2C%20Orem%2C%20UT%2084057!5e0!3m2!1sen!2sus!4v1630000000000!5m2!1sen!2sus"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
