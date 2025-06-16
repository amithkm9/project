// components/course-card.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, CheckCircle } from 'lucide-react';
import Image from 'next/image';

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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden">
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 z-10" />
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if thumbnail fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(course.title)}`;
          }}
        />
        
        {/* Course Status Badge */}
        {course.isCompleted && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-green-500 text-white border-0 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          </div>
        )}
        
        {/* Age Group Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 border-0">
            Ages {course.ageGroup}
          </Badge>
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-8 w-8 text-blue-600 fill-blue-600" />
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">
            {course.title}
          </h3>
          <Badge className={getDifficultyColor(course.difficulty)}>
            {course.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {course.description}
        </p>
        
        {/* Course Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessonsCount} lessons</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium transition-all duration-200 group-hover:shadow-lg"
          disabled={course.isCompleted}
        >
          {course.isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Course
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}