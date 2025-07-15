import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function QuizInputForm({ onSubmit }) {
  const [quizCode, setQuizCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quizCode.trim()) {
      onSubmit(quizCode.trim());
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label htmlFor="quizCode" className="text-lg font-medium mb-3" style={{ color: '#F5F5F5' }}>
            Quiz Code
          </Label>
          <Input
            id="quizCode"
            type="text"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            placeholder="Enter quiz code"
            className="px-6 py-4 rounded-lg border text-lg transition-colors focus:outline-none focus:ring-2"
            style={{
              backgroundColor: '#2A2A2A',
              borderColor: '#666666',
              color: '#F5F5F5',
              '--tw-ring-color': '#2563EB'
            }}
            required
          />
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full py-4 px-8 rounded-lg font-medium text-white text-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #9333EA, #DB2777)',
            boxShadow: '0 4px 14px 0 rgba(219, 39, 119, 0.3)'
          }}
        >
          Join Quiz
        </Button>
      </form>
    </div>
  );
}
