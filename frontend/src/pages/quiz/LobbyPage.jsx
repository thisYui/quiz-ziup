import React from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Users, Trophy, Clock, Play } from 'lucide-react';

const LobbyPage = ({
  room = {
    id: 'QUIZ01',
    name: 'General Knowledge Quiz',
    players: [
      { id: '1', name: 'Alice', isReady: true, avatar: '👩' },
      { id: '2', name: 'Bob', isReady: false, avatar: '👨' },
      { id: '3', name: 'Charlie', isReady: true, avatar: '🧑' }
    ],
    maxPlayers: 8,
    isStarted: false,
    questionCount: 20,
    timePerQuestion: 30
  },
  currentPlayer = { id: '1', name: 'Alice', isReady: true },
  onStartQuiz = () => {},
  onLeaveRoom = () => {},
  onToggleReady = () => {}
}) => {
  const readyPlayers = room.players.filter(p => p.isReady).length;
  const canStart = readyPlayers >= 2 && readyPlayers === room.players.length;

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(13, 13, 13, 0.9)', borderColor: '#F5F5F5', border: '1px solid' }}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6" style={{ color: '#F5F5F5' }} />
              <h1 className="text-xl font-bold" style={{ color: '#F5F5F5' }}>
                {room.name}
              </h1>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {room.id}
            </Badge>
          </div>
          <Button
            onClick={onLeaveRoom}
            variant="outline"
            size="sm"
            style={{ borderColor: '#666666', color: '#F5F5F5' }}
          >
            Leave Room
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: '#F5F5F5' }}>
              Players ({room.players.length}/{room.maxPlayers})
            </h2>
            <div className="text-sm" style={{ color: '#CCCCCC' }}>
              {readyPlayers} ready
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {room.players.map((player) => (
              <Card
                key={player.id}
                className="p-4"
                style={{
                  backgroundColor: '#1A1A1A',
                  borderColor: player.isReady ? '#2563EB' : '#444444',
                  borderWidth: player.isReady ? '2px' : '1px'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center text-white font-semibold">
                    {player.avatar || player.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium" style={{ color: '#F5F5F5' }}>
                        {player.name}
                      </span>
                      {player.id === currentPlayer.id && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          player.isReady ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-xs" style={{ color: '#888888' }}>
                        {player.isReady ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty slots */}
            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <Card
                key={`empty-${i}`}
                className="p-4 border-dashed"
                style={{ backgroundColor: '#2A2A2A', borderColor: '#666666' }}
              >
                <div className="flex items-center justify-center h-16">
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-1" style={{ color: '#888888' }} />
                    <span className="text-xs" style={{ color: '#888888' }}>
                      Waiting for player
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quiz Info & Controls */}
        <div className="space-y-4">
          {/* Quiz Settings */}
          <Card className="p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#444444' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#F5F5F5' }}>
              Quiz Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#CCCCCC' }}>Questions</span>
                <span className="text-sm font-medium" style={{ color: '#F5F5F5' }}>
                  {room.questionCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#CCCCCC' }}>Time per question</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" style={{ color: '#888888' }} />
                  <span className="text-sm font-medium" style={{ color: '#F5F5F5' }}>
                    {room.timePerQuestion}s
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#CCCCCC' }}>Category</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                  General
                </Badge>
              </div>
            </div>
          </Card>

          {/* Start Quiz */}
          <Card className="p-4" style={{ backgroundColor: '#1A1A1A', borderColor: '#444444' }}>
            <Button
              onClick={onStartQuiz}
              disabled={!canStart}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {canStart ? (
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Start Quiz</span>
                </div>
              ) : (
                <span className="text-center">Waiting for all players to be ready</span>
              )}
            </Button>

            {!canStart && (
              <p className="text-xs text-center mt-2" style={{ color: '#888888' }}>
                All players must be ready to start
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
