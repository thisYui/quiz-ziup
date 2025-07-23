import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Play } from 'lucide-react';

export default function StartQuizButton({ onStartQuiz, isHost }) {
    return (
        <Card className="p-4" style={{backgroundColor: '#1A1A1A', borderColor: '#444444'}}>
            <Button
                onClick={onStartQuiz}
                disabled={!isHost}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isHost ? (
                    <div className="flex items-center space-x-2">
                        <Play className="w-5 h-5"/>
                        <span>Start Quiz</span>
                    </div>
                ) : (
                    <span className="text-center">Waiting for the host to start</span>
                )}
            </Button>
        </Card>
    );
}