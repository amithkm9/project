// app/lesson/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Mic,
  Volume2,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  signs: string[];
  instructions: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  difficulty: string;
  lessons: Lesson[];
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error('Please sign in to access lessons');
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Load course data (mock for now)
    loadCourseData();
  }, [courseId, router]);

  const loadCourseData = () => {
    // Mock course data - in real app, this would come from API
    const mockCourse: Course = {
      id: courseId,
      title: 'Basic Hand Shapes',
      description: 'Learn fundamental hand shapes and finger movements',
      ageGroup: '2-5',
      difficulty: 'Beginner',
      lessons: [
        {
          id: '1',
          title: 'Introduction to Hand Shapes',
          description: 'Learn the basic hand positions used in sign language',
          videoUrl: 'https://example.com/video1.mp4',
          duration: '3:45',
          signs: ['A', 'B', 'C', 'Open Hand', 'Fist'],
          instructions: [
            'Watch the video demonstration',
            'Practice each hand shape',
            'Use your camera to get AI feedback',
            'Complete the practice session'
          ]
        },
        {
          id: '2',
          title: 'Letter A Formation',
          description: 'Master the letter A hand shape',
          videoUrl: 'https://example.com/video2.mp4',
          duration: '2:30',
          signs: ['Letter A', 'Thumb Position', 'Finger Curl'],
          instructions: [
            'Form a fist with your dominant hand',
            'Place thumb alongside your index finger',
            'Keep other fingers curled',
            'Practice the movement 5 times'
          ]
        },
        {
          id: '3',
          title: 'Letter B Formation',
          description: 'Learn the letter B hand shape',
          videoUrl: 'https://example.com/video3.mp4',
          duration: '2:15',
          signs: ['Letter B', 'Flat Hand', 'Thumb Tuck'],
          instructions: [
            'Extend your four fingers upward',
            'Keep fingers together and straight',
            'Tuck thumb against palm',
            'Practice transitioning from A to B'
          ]
        }
      ]
    };

    setCourse(mockCourse);
    setIsLoading(false);
  };

  const currentLesson = course?.lessons[currentLessonIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Video paused' : 'Video playing');
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
    toast.info('Lesson restarted');
  };

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setProgress(0);
      setIsPlaying(false);
      toast.success('Moving to next lesson!');
    } else {
      toast.success('Course completed! 🎉');
      router.push('/home');
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    toast.info(cameraActive ? 'Camera disabled' : 'Camera enabled for AI feedback');
  };

  const toggleMic = () => {
    setMicActive(!micActive);
    toast.info(micActive ? 'Microphone disabled' : 'Microphone enabled');
  };

  const handleCompleteLesson = () => {
    setProgress(100);
    toast.success('Lesson completed! 🎉');
    
    // Auto-advance after a short delay
    setTimeout(() => {
      handleNextLesson();
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!user || !course || !currentLesson) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">
              Lesson {currentLessonIndex + 1} of {course.lessons.length}: {currentLesson.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {course.difficulty}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              Ages {course.ageGroup}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Course Progress
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentLessonIndex + progress/100) / course.lessons.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={((currentLessonIndex + progress/100) / course.lessons.length) * 100} 
              className="w-full"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-600" />
                  {currentLesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Video Player Placeholder */}
                <div className="relative aspect-video bg-gray-900 rounded-lg mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🤟</div>
                      <p className="text-lg mb-2">Sign Language Video</p>
                      <p className="text-sm opacity-75">
                        {currentLesson.duration} • {currentLesson.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRestart}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex-1">
                        <Progress value={progress} className="bg-white/20" />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI Feedback Section */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button
                    variant={cameraActive ? "default" : "outline"}
                    onClick={toggleCamera}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    {cameraActive ? 'Camera On' : 'Enable Camera'}
                  </Button>
                  
                  <Button
                    variant={micActive ? "default" : "outline"}
                    onClick={toggleMic}
                    className="flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    {micActive ? 'Mic On' : 'Enable Mic'}
                  </Button>
                </div>

                {/* Camera Feed Placeholder */}
                {cameraActive && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Camera className="h-12 w-12 mx-auto mb-2" />
                          <p>Your camera feed</p>
                          <p className="text-sm">AI is analyzing your signs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lesson Controls */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleCompleteLesson}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Complete Lesson
                  </Button>
                  
                  <Button
                    onClick={handleNextLesson}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Info Sidebar */}
          <div className="space-y-6">
            {/* Signs to Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Signs in This Lesson
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentLesson.signs.map((sign, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{sign}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {currentLesson.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Lesson Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Lesson</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentLessonIndex + 1}
                      </div>
                      <div className="text-xs text-gray-600">Lessons Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {course.lessons.length - currentLessonIndex - 1}
                      </div>
                      <div className="text-xs text-gray-600">Lessons Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}