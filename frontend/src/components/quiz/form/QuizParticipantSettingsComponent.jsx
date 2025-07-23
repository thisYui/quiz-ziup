import React from 'react';
import { Button } from '../../ui/button.jsx';
import { Input } from '../../ui/input.jsx';

export function QuizParticipantSettingsComponent({ maxParticipants, setMaxParticipants }) {
    return (
        <div>
            <label className="block mb-1">Số người tham gia tối đa</label>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    onClick={() => setMaxParticipants(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 px-0 bg-gray-600"
                >
                    −
                </Button>
                <Input
                    type="number"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(Number(e.target.value))}
                    className="w-20 text-center"
                    min={1}
                    required
                />
                <Button
                    type="button"
                    onClick={() => setMaxParticipants(prev => prev + 1)}
                    className="w-8 h-8 px-0 bg-gray-600"
                >
                    +
                </Button>
            </div>
        </div>
    );
}