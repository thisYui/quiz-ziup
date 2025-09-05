import React from 'react';
import { Trophy } from 'lucide-react';
import { FeatureBadges } from './FeatureBadges.jsx';

export const Hero = () => {
  return (
    <div className="text-center lg:text-left">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ background: 'linear-gradient(135deg, #9333EA, #DB2777)' }}
      >
        <Trophy className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold mb-4" style={{ color: '#F5F5F5' }}>
        Join the Quiz
      </h1>
      <p className="text-lg mb-6" style={{ color: '#CCCCCC' }}>
        Enter the quiz code to start playing and compete with others in real-time
      </p>
      <FeatureBadges />
    </div>
  );
};