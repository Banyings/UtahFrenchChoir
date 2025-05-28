// Contact Us Page 
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const MAX_MESSAGE_LENGTH = 300;

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  // Phone formatter
  const formatPhoneInput = (input: string): string => {
    const digitsOnly = input.replace(/\D/g, '');
    
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all fields.'
      });
      setIsSubmitting(false);
      return;
    }

    // Validate message length
    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setSubmitStatus({
        type: 'error',
        message: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      setIsSubmitting(false);
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid 10-digit US/Canada phone number.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if contact exists
      const checkResponse = await fetch('/api/contacts/checkExistingContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone.replace(/\D/g, '')
        }),
      });

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error('Check existing contact error:', errorText);
        throw new Error('Failed to verify contact information');
      }

      const checkResult = await checkResponse.json();
      
      if (checkResult.exists) {
        setSubmitStatus({
          type: 'error',
          message: 'We are working on your inquiry. Please allow some time for us to get back to you.'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Send contact email
      const response = await fetch('/api/contacts/sendContactEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          message: formData.message
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Send contact email error:', errorText);
        throw new Error('Failed to send message');
      }

      // Reset form and show success
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        message: ''
      });
      
      setSubmitStatus({
        type: 'success',
        message: 'Message Successfully Submitted!'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Our Choir</h1>
          <p className="text-xl text-blue-100">Let&#39;s create beautiful music together for your special event</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Contact Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Get in Touch Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <div className="relative w-full h-56 mb-8 rounded-xl overflow-hidden">
              <Image 
                src="/choir-group.png" 
                alt="Utah French Choir"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Ready to Perform</h3>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Call us</p>
                  <a href="tel:385-307-3623" className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                    +1 (385) 307-3623
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email us</p>
                  <a href="mailto:utahfrchoir@gmail.com" className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                    utahfrchoir@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Visit us</p>
                  <p className="text-lg font-semibold text-slate-800">200 N Center St, Lehi, UT 84043</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Event Planning</p>
                  <p className="text-lg font-semibold text-blue-800">Let&rsquo;s plan your perfect event together</p>
                </div>
              </div>
            </div>
          </div>

          {/* Send Us A Message Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <div className="relative w-full h-56 mb-8 rounded-xl overflow-hidden">
              <Image 
                src="/choir-group.png" 
                alt="Send us a message"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Let&rsquo;s Connect</h3>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-8">Send Us A Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={14}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Format: (XXX) XXX-XXXX</p>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Tell us about your event and how we can help make it special..."
                  rows={5}
                  className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700 placeholder-slate-400 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={MAX_MESSAGE_LENGTH}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-white text-lg transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
              
              {submitStatus && (
                <div className={`p-4 rounded-xl border-2 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {submitStatus.type === 'success' ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <span className="font-medium">{submitStatus.message}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Find Us</h3>
            <p className="text-slate-600">Located in the heart of Lehi, Utah</p>
          </div>
          <div className="h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.8107385100116!2d-111.85140332399024!3d40.390887071443686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x874d81d3a7a2a869%3A0xd6673d732f749e71!2s200%20N%20Center%20St%2C%20Lehi%2C%20UT%2084043!5e0!3m2!1sen!2sus!4v1747616900918!5m2!1sen!2sus"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}