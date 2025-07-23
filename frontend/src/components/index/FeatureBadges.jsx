import React from 'react';
import { Users, Play, Star } from 'lucide-react';

export const FeatureBadges = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <Users className="w-4 h-4" style={{ color: '#14B8A6' }} />
        <span className="text-sm" style={{ color: '#F5F5F5' }}>
          Multiplayer
        </span>
      </div>
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <Play className="w-4 h-4" style={{ color: '#14B8A6' }} />
        <span className="text-sm" style={{ color: '#F5F5F5' }}>
          Real-time
        </span>
      </div>
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        <Star className="w-4 h-4" style={{ color: '#14B8A6' }} />
        <span className="text-sm" style={{ color: '#F5F5F5' }}>
          Competitive
        </span>
      </div>
    </div>
  );
};