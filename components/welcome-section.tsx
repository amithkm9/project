// components/welcome-section.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface UserStats {
  coursesCompleted: number;
  totalLessons: number;
  currentStreak: number;
  lastActivity: string;
}

interface WelcomeSectionProps {
  user: User;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const [stats, setStats] = useState<UserStats>({
    coursesCompleted: 0,
    totalLessons: 0,
    currentStreak: 0,
    lastActivity: '',
  });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set current time
    const now = new Date();
    const timeString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentTime(timeString);

    // Load user stats (in real app, this would come from API)
    // For now, using sample data
    setStats({
      coursesCompleted: 2,
      totalLessons: 15,
      currentStreak: 5,
      lastActivity: 'Yesterday',
    });
  }, [user.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getAgeGroupMessage = (age: number) => {
    if (age >= 2 && age <= 5) {
      return "Let's learn with fun games and colorful signs!";
    } else if (age >= 6 && age <= 10) {
      return "Ready to explore new signs and build your vocabulary?";
    } else if (age >= 11 && age <= 15) {
      return "Time to master advanced concepts and conversational skills!";
    } else {
      return "Continue your professional sign language journey!";
    }
  };

  return (
    <section className="mb-8">
      {/* Main Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white border-0 shadow-xl mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {getGreeting()}, {user.fullName.split(' ')[0]}! 👋
                </h1>
              </div>
              
              <p className="text-blue-100 text-lg mb-2">{currentTime}</p>
              
              <p className="text-xl text-blue-50 mb-4">
                {getAgeGroupMessage(user.age)}
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Age Group: {user.age >= 2 && user.age <= 5 ? '2-5' : 
                             user.age >= 6 && user.age <= 10 ? '6-10' : 
                             user.age >= 11 && user.age <= 15 ? '11-15' : '16+'} years
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {stats.currentStreak} day streak 🔥
                </Badge>
              </div>
            </div>
            
            {/* Quick Action Button */}
            <div className="lg:text-right">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.coursesCompleted}
            </h3>
            <p className="text-gray-600 text-sm">Courses Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalLessons}
            </h3>
            <p className="text-gray-600 text-sm">Lessons Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.currentStreak}
            </h3>
            <p className="text-gray-600 text-sm">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {stats.lastActivity}
            </h3>
            <p className="text-gray-600 text-sm">Last Activity</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}