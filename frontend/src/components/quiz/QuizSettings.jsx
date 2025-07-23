import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export default function QuizSettings({ questionCount }) {
    return (
        <Card className="p-4" style={{backgroundColor: '#1A1A1A', borderColor: '#444444'}}>
            <h3 className="font-semibold mb-3" style={{color: '#F5F5F5'}}>
                Quiz Settings
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm" style={{color: '#CCCCCC'}}>Questions</span>
                    <span className="text-sm font-medium" style={{color: '#F5F5F5'}}>
                        {questionCount}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm" style={{color: '#CCCCCC'}}>Category</span>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        General
                    </Badge>
                </div>
            </div>
        </Card>
    );
}