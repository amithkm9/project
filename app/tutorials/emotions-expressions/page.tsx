'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

export default function EmotionsExpressionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentVideo, setCurrentVideo] = useState({
    id: '005',
    title: 'Emotions and Expressions - Happy, Sad, Angry, Excited',
    video: '/videos/emotions.mp4',
    duration: '7:30'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    controls
                  >
                    <source src={currentVideo.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                  <Badge variant="secondary" className="mb-4">{currentVideo.duration}</Badge>
                  <p className="text-gray-600 mb-4">
                    Express your feelings with sign language. Learn how to communicate emotions effectively.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emotions & Expressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded bg-blue-50">
                    <Play className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Emotions Introduction</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded border border-gray-300"></div>
                    <span className="text-sm">Practice Exercises</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotions You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>😊 Happy</div>
                  <div>😢 Sad</div>
                  <div>😠 Angry</div>
                  <div>🤩 Excited</div>
                  <div>😨 Scared</div>
                  <div>😴 Tired</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}