/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  date: string;
  address: string;
  details: string;
  french: string;
  musical: string;
  voice: string;
  religious: string;
  congregation: string;
  gender: string;
  time: string;
  status: string;
  organization: string;
  affiliated: string;
}

const UtahFrcChoirApplication: React.FC = () => {
  const router = useRouter();
  const [isReligious, setIsReligious] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);

  const handleReligiousChange = (value: boolean) => {
    setIsReligious(value);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-pictures/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('choir-applications')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      const { data: urlData } = supabase.storage
        .from('choir-applications')
        .getPublicUrl(fileName);

      return urlData?.publicUrl || null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  };

  const handleCharacterCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setCharacterCount(text.length);
    } else {
      e.target.value = text.substring(0, 500);
      setCharacterCount(500);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      if (!selectedFile) throw new Error('Please upload your picture');

      const formData = new FormData(e.currentTarget);
      const data: Partial<FormData> = {};
      formData.forEach((value, key) => {
        data[key as keyof FormData] = value as string;
      });

      // Check if user already submitted an application
      const { data: existingApplication, error: checkError } = await supabase
        .from('choir_applications')
        .select('id, full_name, email')
        .or(`email.eq.${data.email},full_name.ilike.${data.fullname}`)
        .limit(1);

      if (checkError) {
        console.error('Error checking existing applications:', checkError);
      }

      if (existingApplication && existingApplication.length > 0) {
        // Set the message directly instead of throwing an error
        setSubmitMessage('We are working on your inquiry. Please allow some time while we are working on your application. Thank you for your patience!');
        
        // Redirect to homepage after 3 seconds (same as success)
        setTimeout(() => {
          router.push('/');
        }, 3000);
        
        return; // Exit early without processing
      }

      const imageUrl = await uploadImage(selectedFile);

      const applicationData = {
        full_name: data.fullname,
        email: data.email,
        phone: data.phone,
        application_date: data.date,
        physical_address: data.address,
        musical_background: data.details,
        picture_url: imageUrl,
        speaks_french: data.french === 'yes',
        has_musical_skills: data.musical === 'yes',
        favorite_voice: data.voice,
        is_religious: data.religious === 'yes',
        congregation: data.religious === 'yes' ? data.congregation : null,
        gender: data.gender,
        rehearsal_time_works: data.time === 'yes',
        marital_status: data.status,
        volunteer_willingness: data.organization === 'yes',
        church_restriction_comfortable: data.affiliated === 'no'
      };

      const { error } = await supabase
        .from('choir_applications')
        .insert([applicationData]);

      if (error) throw new Error(`Database error: ${error.message}`);

      // Show success message
      setSubmitMessage('Application submitted successfully! We will review it and get back to you soon.');
      
      // Clear form safely
      const form = e.currentTarget;
      if (form) {
        form.reset();
      }
      setIsReligious(null);
      setSelectedFile(null);
      setImagePreview(null);
      setCharacterCount(0);

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitMessage(error.message || 'There was an error submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto p-6">
        <form className="bg-white shadow-2xl rounded-3xl overflow-hidden" onSubmit={handleSubmit}>
          {/* Header with Image */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white">
              <h1 className="text-3xl font-bold mb-2">Utah French Choir</h1>
              <p className="text-blue-100">We are so happy to have you join us!</p>
            </div>
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image 
                src="/choir-group.png" 
                alt="Utah FRC Choir community" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-semibold">Join our musical community</p>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Personal Information - Takes 2 columns on desktop */}
              <div className="xl:col-span-2 space-y-8">
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-3">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="fullname" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" name="email" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input type="tel" name="phone" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input type="date" name="date" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input type="text" name="address" required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select name="gender" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                    <select name="status" required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                      <option value="">Select...</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Musical Background * <span className="text-xs text-gray-500">({characterCount}/500)</span>
                  </label>
                  <textarea name="details" rows={4} required maxLength={500} onChange={handleCharacterCount}
                    placeholder="Tell us about your musical experience, instruments you play, singing background, etc."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Voice *</label>
                  <select name="voice" required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 md:w-1/2">
                    <option value="">Select...</option>
                    <option value="Bass">Bass</option>
                    <option value="Tenor">Tenor</option>
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Right Sidebar - Photo Upload & Questions */}
              <div className="space-y-8">
                {/* Photo Upload */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-3 mb-6">Your Picture</h2>
                  {imagePreview && (
                    <div className="mb-6 flex justify-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                        <Image src={imagePreview} alt="Preview" width={128} height={128} className="object-cover w-full h-full" />
                      </div>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition duration-200">
                    <input type="file" id="picture-upload" accept="image/*" onChange={handleFileSelect} className="hidden" required={!selectedFile} />
                    <label htmlFor="picture-upload" className="cursor-pointer">
                      <div className="text-gray-600">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm font-medium">Click to upload photo</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quick Questions */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-3 mb-6">Quick Questions</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Do you speak French? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="french" value="yes" required className="mr-2 text-blue-600" />
                          Yes
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="french" value="no" required className="mr-2 text-blue-600" />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Do you have musical instrument skills? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="musical" value="yes" required className="mr-2 text-blue-600" />
                          Yes
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="musical" value="no" required className="mr-2 text-blue-600" />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Are you religious? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="religious" value="yes" required className="mr-2 text-blue-600" 
                                 onChange={() => handleReligiousChange(true)} />
                          Yes
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="religious" value="no" required className="mr-2 text-blue-600"
                                 onChange={() => handleReligiousChange(false)} />
                          No
                        </label>
                      </div>
                    </div>

                    {isReligious && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Congregation *</label>
                        <select name="congregation" required={isReligious}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                          <option value="">Select...</option>
                          <option value="Baptist">Baptist</option>
                          <option value="Catholic">Catholic</option>
                          <option value="Methodist">Methodist</option>
                          <option value="Lutheran">Lutheran</option>
                          <option value="Presbyterian">Presbyterian</option>
                          <option value="Latter-Day Saints">Latter-Day Saints</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Sunday 5-6:30pm rehearsals work for you? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="time" value="yes" required className="mr-2 text-blue-600" />
                          Yes
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="time" value="no" required className="mr-2 text-blue-600" />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Willing to volunteer (unpaid)? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="organization" value="yes" required className="mr-2 text-blue-600" />
                          Yes
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="organization" value="no" required className="mr-2 text-blue-600" />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-700 mb-3">Comfortable with church restrictions? *</p>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="affiliated" value="yes" required className="mr-2 text-blue-600" />
                          Would be offended
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input type="radio" name="affiliated" value="no" required className="mr-2 text-blue-600" />
                          Would not be offended
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 text-center">
              <button type="submit" disabled={isSubmitting}
                className={`px-12 py-4 rounded-full font-semibold text-white transition duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                }`}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

            {/* Status Message */}
            {submitMessage && (
              <div className={`mt-8 p-6 rounded-xl border-2 transition-all duration-500 ${
                submitMessage.includes('error') || submitMessage.includes('Error')
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                <div className="flex items-center justify-center gap-3">
                  {submitMessage.includes('error') || submitMessage.includes('Error') ? (
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-lg">{submitMessage}</p>
                    {!submitMessage.includes('error') && !submitMessage.includes('Error') && (
                      <p className="text-sm mt-1 opacity-80">Redirecting to homepage in 3 seconds...</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-sm text-gray-600 bg-gray-50 p-6 rounded-lg">
              <p className="font-medium">Please fill out this form so we can learn more about you.</p>
              <p className="mt-2">We will review your application and get back to you within 2 weeks. Wishing you a blessed day!</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtahFrcChoirApplication;