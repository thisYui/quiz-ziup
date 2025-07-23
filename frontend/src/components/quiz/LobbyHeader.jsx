import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trophy } from 'lucide-react';

export default function LobbyHeader({ title, quizId, onLeaveRoom }) {
    return (
        <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm"
                 style={{backgroundColor: 'rgba(13, 13, 13, 0.9)', borderColor: '#F5F5F5', border: '1px solid'}}>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Trophy className="w-6 h-6" style={{color: '#F5F5F5'}}/>
                        <h1 className="text-xl font-bold" style={{color: '#F5F5F5'}}>
                            {title}
                        </h1>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {quizId}
                    </Badge>
                </div>
                <Button
                    onClick={onLeaveRoom}
                    variant="outline"
                    size="sm"
                    style={{borderColor: '#666666', color: '#F5F5F5'}}
                >
                    Leave Room
                </Button>
            </div>
        </div>
    );
}