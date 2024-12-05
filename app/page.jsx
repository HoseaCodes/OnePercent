/* eslint-disable import/extensions */

"use client";

import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// StarBackground component remains the same
function StarBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          blinkDuration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `blink ${star.blinkDuration}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes blink {
          0% {
            opacity: var(--tw-opacity);
          }
          100% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}

function LandingPage() {
  const [activeTab, setActiveTab] = useState("Work");
  const navItems = ["Work", "Expertise", "About", "Pricing", "Blog"];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <StarBackground />

      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <svg
          className="absolute left-0 top-1/4 opacity-20"
          width="400"
          height="800"
          viewBox="0 0 400 800"
        >
          <path
            d="M-100,0 Q50,400 -100,800"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <svg
          className="absolute right-0 top-1/4 opacity-20"
          width="400"
          height="800"
          viewBox="0 0 400 800"
        >
          <path
            d="M500,0 Q350,400 500,800"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            {/* <img
              src="/onepercent-100.png"
              alt="One Percent"
              className="h-full"
            /> */}
            <span className="text-xl font-semibold">One Percent</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                type="button" // Add type attribute
                className={`px-6 py-2 rounded-full transition-colors relative ${
                  activeTab === item
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item}
                {activeTab === item && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
            type="button"
          >
            Get in touch
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 mb-6">Ambitious Concepts</p>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent h-full">
            If you want to find the secrets of the universe, think in terms of
            energy, frequency, and vibration.
          </h1>

          <p className="text-xl text-gray-300 mb-12">
            Harnessing the Future: How Energy, Frequency, and Vibration Drive
            Technological Progress
          </p>
        </div>
        <Button href="/auth/signin">Sign In</Button>
        <Button href="/auth/signup">Sign Up</Button>
      </main>
    </div>
  );
}

export default LandingPage;
