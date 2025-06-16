// components/course-card.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, CheckCircle, Users, Star } from 'lucide-react';
import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  ageGroup: string;
  difficulty: string;
  duration: string;
  lessonsCount: number;
  isCompleted?: boolean;
}

interface CourseCardProps {
  course: Course;
  onStart: () => void;
}

export function CourseCard({ course, onStart }: CourseCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgeGroupColor = (ageGroup: string) => {
    switch (ageGroup) {
      case '2-5':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case '6-10':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '11-15':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '16+':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate fallback image URL
  const getFallbackImage = () => {
    const colors = ['3B82F6', '10B981', '8B5CF6', 'F59E0B', 'EF4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/400x300/${randomColor}/FFFFFF?text=${encodeURIComponent(course.title.substring(0, 20))}`;
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden">
      {/* Course Thumbnail with Video Preview */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {/* Video Thumbnail Image */}
        <div className="relative w-full h-full">
          {!imageError ? (
            <img
              src={course.thumbnail}
              alt={`${course.title} video thumbnail`}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          ) : (
            <img
              src={getFallbackImage()}
              alt={`${course.title} thumbnail`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Loading...</div>
            </div>
          )}
        </div>

        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Course Status Badge */}
        {course.isCompleted && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-green-500 text-white border-0 flex items-center gap-1 shadow-lg">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          </div>
        )}
        
        {/* Age Group Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className={`${getAgeGroupColor(course.ageGroup)} border-0 shadow-lg`}>
            Ages {course.ageGroup}
          </Badge>
        </div>

        {/* Video duration badge */}
        <div className="absolute bottom-4 right-4 z-20">
          <Badge className="bg-black/70 text-white border-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </Badge>
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-full p-6 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
            <Play className="h-8 w-8 text-blue-600 fill-blue-600" />
          </div>
        </div>

        {/* Video preview text */}
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Play className="h-4 w-4 fill-white" />
            Watch Preview
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-xl text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <Badge className={getDifficultyColor(course.difficulty)}>
            {course.difficulty}
          </Badge>
        </div>
        
        {/* Course stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>1.2k students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {course.description}
        </p>
        
        {/* Course Meta Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {/* Progress indicator */}
          {!course.isCompleted && (
            <div className="text-xs text-gray-400">
              Not started
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={onStart}
          className={`w-full font-medium transition-all duration-200 group-hover:shadow-lg ${
            course.isCompleted
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white'
          }`}
        >
          {course.isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Review Course
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Lesson
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}