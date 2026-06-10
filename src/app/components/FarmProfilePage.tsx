import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Share2 } from 'lucide-react';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function FarmProfilePage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const farmImages = [
    'https://images.unsplash.com/photo-1500595046891-ffc8e1c4b36b?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1552397954-ba1efb35167f?w=400&h=250&fit=crop',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=250&fit=crop',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % farmImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + farmImages.length) % farmImages.length);
  };

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex flex-col pb-20">
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden bg-[#F8FCFA]">
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
            {farmImages.map((image, index) => (
              <img key={index} src={image} alt={`Farm ${index + 1}`} className="h-64 w-full flex-shrink-0 object-cover" />
            ))}
          </div>

          {/* Navigation buttons */}
          {currentImageIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#17212B] hover:bg-white"
            >
              ‹
            </button>
          )}
          {currentImageIndex < farmImages.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#17212B] hover:bg-white"
            >
              ›
            </button>
          )}

          {/* Active Seller Badge */}
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-[#1E9E6F] px-4 py-2 text-white">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">Active Seller</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-6">
          <h1 className="text-4xl font-extrabold text-[#17212B]">Gazi Farm</h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <Star className="h-6 w-6 fill-[#FCA311] text-[#FCA311]" />
            <span className="text-lg font-bold text-[#6B7785]">2 Reviews</span>
          </div>

          {/* Location */}
          <div className="mt-3 flex items-start gap-2">
            <MapPin className="mt-1 h-5 w-5 text-[#6B7785]" />
            <span className="text-base font-medium text-[#6B7785]">Gazi Farm, Dhanmondi, 1209</span>
          </div>

          {/* Share Profile Button */}
          <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-[24px] border-2 border-[#1E9E6F] bg-white px-4 py-4 text-lg font-bold text-[#1E9E6F]">
            <Share2 className="h-5 w-5" />
            Share Profile
          </button>
        </div>

        {/* Action Cards */}
        <div className="px-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Livestock Card */}
            <button
              onClick={() => navigate('/farm-management')}
              className="rounded-[24px] bg-[#E6F7EF] p-6 text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center">
                <svg className="h-16 w-16 text-[#1E9E6F]" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm4-1a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm font-bold text-[#17212B]">Livestock</p>
            </button>

            {/* Veterinary Services Card */}
            <button
              onClick={() => navigate('/booking')}
              className="rounded-[24px] bg-[#FEF3E2] p-6 text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center">
                <svg className="h-16 w-16 text-[#FCA311]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9h-2.5V7h-2v4H7v2h4v4h2v-4h2.5v-2z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-bold text-[#17212B]">Veterinary</p>
            </button>

            {/* Vaccination Card with Badge */}
            <button
              onClick={() => navigate('/vaccination-schedule')}
              className="relative rounded-[24px] bg-[#F3EBFF] p-6 text-center transition-transform hover:scale-105"
            >
              <div className="flex justify-center">
                <svg className="h-16 w-16 text-[#7C3AED]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 2v4h2V2h-2zm6 1.5l-2.83 2.83 1.41 1.41L18 4.91l1.42 1.42 2.83-2.83-1.41-1.41-2.84 2.83zM17 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zM5 8H3.59L2 6.41 6.41 2 8 3.59V8H5zm6 14v-4h-2v4h2zm0-10v-4h-2v4h2z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-bold text-[#17212B]">Vaccination</p>
              {/* Notification Badge */}
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#DC2626] text-white">
                <span className="text-lg font-bold">1</span>
              </div>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 px-6">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="w-full rounded-[24px] bg-[#1E9E6F] px-4 py-4 text-lg font-bold text-white"
          >
            Continue
          </button>
        </div>
      </div>

      <MobileBottomNav active="home" />
    </MobileShell>
  );
}
