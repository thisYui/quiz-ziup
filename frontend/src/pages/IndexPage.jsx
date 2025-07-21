import React from 'react';
import { Trophy, Users, Play, Star } from 'lucide-react';
import { BGPattern } from '../components/ui/BGPattern.jsx';
import { GlowEffect } from '../components/ui/GlowEffect.jsx';
import { QuizInputForm } from '../components/quiz/QuizInputForm.jsx';

export default function IndexPage({ onStartQuiz }) {
  return (
      <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
        <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />

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
                    borderColor: '#444444'
                  }}
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left side - Welcome content */}
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                         style={{ background: 'linear-gradient(135deg, #9333EA, #DB2777)' }}>
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4" style={{ color: '#F5F5F5' }}>
                      Join the Quiz
                    </h1>
                    <p className="text-lg mb-6" style={{ color: '#CCCCCC' }}>
                      Enter the quiz code to start playing and compete with others in real-time
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                        <Users className="w-4 h-4" style={{ color: '#14B8A6' }} />
                        <span className="text-sm" style={{ color: '#F5F5F5' }}>Multiplayer</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                        <Play className="w-4 h-4" style={{ color: '#14B8A6' }} />
                        <span className="text-sm" style={{ color: '#F5F5F5' }}>Real-time</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                        <Star className="w-4 h-4" style={{ color: '#14B8A6' }} />
                        <span className="text-sm" style={{ color: '#F5F5F5' }}>Competitive</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Form */}
                  <QuizInputForm onSubmit={onStartQuiz} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
