import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

export default function PlayersList({ participants, maxPlayers }) {
    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{color: '#F5F5F5'}}>
                    Players ({participants.length}/{maxPlayers})
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {participants.map((player) => (
                    <Card
                        key={player.id}
                        className="p-4"
                        style={{
                            backgroundColor: '#1A1A1A',
                            borderColor: '#2563EB',
                            borderWidth: '2px'
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center text-white font-semibold">
                                {player.avatar || player.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium" style={{color: '#F5F5F5'}}>
                                        {player.name}
                                    </span>
                                    {player.id === sessionStorage.getItem('participator_id') && (
                                        <Badge variant="secondary" className="text-xs">You</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Empty slots */}
                {Array.from({length: maxPlayers - participants.length}).map((_, i) => (
                    <Card
                        key={`empty-${i}`}
                        className="p-4 border-dashed"
                        style={{backgroundColor: '#2A2A2A', borderColor: '#666666'}}
                    >
                        <div className="flex items-center justify-center h-16">
                            <div className="text-center">
                                <Users className="w-6 h-6 mx-auto mb-1" style={{color: '#888888'}}/>
                                <span className="text-xs" style={{color: '#888888'}}>
                                    Waiting for player
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
