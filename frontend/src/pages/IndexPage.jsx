import React from 'react';
import { BGPattern } from '../components/ui/BGPattern.jsx';
import { GlowEffect } from '../components/ui/GlowEffect.jsx';
import { QuizInputForm } from '../components/quiz/form/index.js';
import { Navbar, Hero } from '../components/index';

export default function IndexPage() {

  return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
        {/* bg pattern */}
        <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />

        {/* navbar */}
        <Navbar />

        {/* main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <GlowEffect
                  colors={['#9333EA', '#DB2777', '#2563EB', '#14B8A6']}
                  mode="pulse"
                  blur="medium"
                  className="rounded-2xl"
              />

              <div
                  className="relative rounded-2xl p-12 border"
                  style={{
                    backgroundColor: '#1A1A1A',
                    borderColor: '#444444',
                  }}
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* left */}
                  <Hero />

                  {/* right */}
                  <QuizInputForm is_client={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
