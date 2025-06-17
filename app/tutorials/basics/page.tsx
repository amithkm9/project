'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface VideoLesson {
  id: string;
  title: string;
  video: string;
  duration: string;
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: VideoLesson[];
  expanded: boolean;
}

export default function BasicsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoLesson | null>(null);
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'section-1',
      title: 'Section 1 - Introduction',
      expanded: false,
      lessons: [
        {
          id: '001',
          title: 'Introduction to Sign Language',
          video: '/videos/intro.mp4',
          duration: '5:30',
          completed: false,
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Section 2 - Numbers',
      expanded: false,
      lessons: [
        {
          id: '002',
          title: 'Numbers 1-10',
          video: '/videos/numbers.mp4',
          duration: '8:45',
          completed: false,
        },
        {
          id: 'quiz-1',
          title: 'Quiz 1 - Numbers',
          video: '',
          duration: '10:00',
          completed: false,
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Section 3 - Alphabets',
      expanded: false,
      lessons: [
        {
          id: '003',
          title: 'Alphabet A-Z',
          video: '/videos/alphabets.mp4',
          duration: '12:20',
          completed: false,
        },
        {
          id: 'quiz-2',
          title: 'Quiz 2 - Alphabets',
          video: '',
          duration: '15:00',
          completed: false,
        }
      ]
    }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Set default video
    if (sections[0]?.lessons[0]) {
      setCurrentVideo(sections[0].lessons[0]);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const selectVideo = (lesson: VideoLesson) => {
    setCurrentVideo(lesson);
  };

  const markCompleted = (lessonId: string) => {
    setSections(prev =>
      prev.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === lessonId
            ? { ...lesson, completed: true }
            : lesson
        )
      }))
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access tutorials</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {currentVideo ? (
                  <div>
                    <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                      {currentVideo.video ? (
                        <video
                          className="w-full h-full object-cover"
                          controls
                          key={currentVideo.id}
                        >
                          <source src={currentVideo.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🤟</div>
                            <p className="text-xl">{currentVideo.title}</p>
                            <p className="text-sm opacity-75">Interactive Quiz</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary">{currentVideo.duration}</Badge>
                        {currentVideo.completed && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!currentVideo.completed && (
                          <Button
                            onClick={() => markCompleted(currentVideo.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                        {currentVideo.id.includes('quiz') && (
                          <Link href={`/tutorials/quiz/basics`}>
                            <Button variant="outline">
                              Take Quiz
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <p className="text-gray-500">Select a lesson to start learning</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Navigation */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                        onClick={() => toggleSection(section.id)}
                      >
                        <span className="font-medium">{section.title}</span>
                        {section.expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {section.expanded && (
                        <div className="ml-4 mt-2 space-y-2">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                currentVideo?.id === lesson.id ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                              onClick={() => selectVideo(lesson)}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Play className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}