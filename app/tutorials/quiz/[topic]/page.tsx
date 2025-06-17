'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, X, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface Question {
  id: string;
  prompt: string;
  expectedSign: string;
  difficulty: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const topic = params.topic as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const questions: Question[] = [
    {
      id: '1',
      prompt: 'Show the sign for "Hello"',
      expectedSign: 'hello',
      difficulty: 'easy'
    },
    {
      id: '2',
      prompt: 'Show the sign for "Thank you"',
      expectedSign: 'thanks',
      difficulty: 'easy'
    },
    {
      id: '3',
      prompt: 'Show the sign for "Yes"',
      expectedSign: 'yes',
      difficulty: 'easy'
    },
    {
      id: '4',
      prompt: 'Show the sign for "Family"',
      expectedSign: 'family',
      difficulty: 'medium'
    },
    {
      id: '5',
      prompt: 'Show the sign for "Happy"',
      expectedSign: 'happy',
      difficulty: 'medium'
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const startQuiz = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsQuizStarted(true);
      startCountdown();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Please allow camera access to take the quiz');
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const submitSign = async () => {
    setIsSubmitting(true);
    
    // Simulate AI recognition
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3; // 70% success rate for demo
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        setFeedback('Correct! Great job! 🎉');
      } else {
        setFeedback('Not quite right. Try again! 💪');
      }
      
      setIsSubmitting(false);
      
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }, 2000);
  };

  const nextQuestion = () => {
    setFeedback('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      startCountdown();
    } else {
      showQuizResults();
    }
  };

  const showQuizResults = () => {
    setShowResults(true);
    // Stop video stream
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setFeedback('');
    startQuiz();
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent work! 🌟';
    if (percentage >= 60) return 'Good job! Keep practicing! 👍';
    return 'Keep practicing, you\'re improving! 💪';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please sign in to take quizzes</p>
            <Button onClick={() => router.push('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Sign Language Quiz</CardTitle>
                <p className="text-gray-600 mt-1">Topic: {topic}</p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {!isQuizStarted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🤟</div>
                <h3 className="text-2xl font-bold mb-4">Ready to test your skills?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  This quiz will test your knowledge of {topic}. Make sure your camera is working 
                  and you have good lighting.
                </p>
                <Button onClick={startQuiz} size="lg" className="px-8">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </div>
            ) : showResults ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {score}/{questions.length}
                </div>
                <p className="text-xl text-gray-600 mb-8">{getScoreMessage()}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={restartQuiz} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={() => router.push('/tutorials')}>
                    Back to Tutorials
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} />
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {questions[currentQuestion]?.prompt}
                  </h3>
                </div>

                {/* Video Feed */}
                <div className="relative mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mx-auto max-w-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    
                    {/* Countdown Overlay */}
                    {countdown && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-6xl font-bold text-white">{countdown}</div>
                      </div>
                    )}
                    
                    {/* Feedback Overlay */}
                    {feedback && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">
                            {feedback.includes('Correct') ? '✅' : '❌'}
                          </div>
                          <div className="text-xl">{feedback}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={submitSign}
                    disabled={isSubmitting || countdown !== null || !!feedback}
                    size="lg"
                    className="px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Sign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}