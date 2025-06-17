'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Square, RefreshCw, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface Recognition {
  sign: string;
  confidence: number;
  timestamp: Date;
}

export default function NumbersLettersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string>('---');
  const [confidence, setConfidence] = useState<number>(0);
  const [frameCount, setFrameCount] = useState(0);
  const [history, setHistory] = useState<Recognition[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      stopRecognition();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Please allow camera access to use sign recognition');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    stopRecognition();
  };

  const startRecognition = () => {
    if (!isCameraActive) return;
    
    setIsRecognizing(true);
    setFrameCount(0);
    
    // Simulate AI recognition
    recognitionInterval.current = setInterval(() => {
      setFrameCount(prev => {
        const newCount = prev + 1;
        
        // Simulate recognition every 30 frames (about 1 second)
        if (newCount % 30 === 0) {
          simulateRecognition();
        }
        
        return newCount > 150 ? 0 : newCount; // Reset after 150 frames
      });
    }, 33); // ~30 FPS
  };

  const stopRecognition = () => {
    setIsRecognizing(false);
    if (recognitionInterval.current) {
      clearInterval(recognitionInterval.current);
      recognitionInterval.current = null;
    }
    setFrameCount(0);
  };

  const simulateRecognition = () => {
    // Simulate AI detection of numbers and letters
    const possibleSigns = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', 'Hello', 'Thanks', 'Yes'];
    const randomSign = possibleSigns[Math.floor(Math.random() * possibleSigns.length)];
    const randomConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    setDetectedSign(randomSign);
    setConfidence(randomConfidence);
    
    // Add to history
    const newRecognition: Recognition = {
      sign: randomSign,
      confidence: randomConfidence,
      timestamp: new Date()
    };
    
    setHistory(prev => [newRecognition, ...prev.slice(0, 9)]); // Keep last 10
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600';
    if (conf >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Numbers & Letters Recognition</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Camera Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {isRecognizing && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm animate-pulse">
                              Recording...
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Camera not active</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </div>
                  
                  {/* Controls */}
                  <div className="flex gap-2">
                    {!isCameraActive ? (
                      <Button onClick={startCamera} className="flex-1">
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        {!isRecognizing ? (
                          <Button onClick={startRecognition} className="flex-1">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Start Recognition
                          </Button>
                        ) : (
                          <Button onClick={stopRecognition} variant="destructive" className="flex-1">
                            <Square className="mr-2 h-4 w-4" />
                            Stop Recognition
                          </Button>
                        )}
                        <Button onClick={stopCamera} variant="outline">
                          Stop Camera
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Frame Counter */}
              {isRecognizing && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Frames Processed</span>
                      <span className="text-sm text-gray-600">{frameCount}</span>
                    </div>
                    <Progress value={(frameCount / 150) * 100} />
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Results Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Detected Sign:</div>
                    <div className="text-4xl font-bold text-gray-900 mb-4">{detectedSign}</div>
                    {confidence > 0 && (
                      <div className={`text-lg font-medium ${getConfidenceColor(confidence)}`}>
                        Confidence: {confidence}%
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* History */}
              <Card>
                <CardHeader>
                  <CardTitle>Recognition History</CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recognitions yet</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {history.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold">{item.sign}</div>
                            <Badge variant="outline" className={getConfidenceColor(item.confidence)}>
                              {item.confidence}%
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(item.timestamp)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Click "Start Camera" to activate your webcam</li>
                    <li>Click "Start Recognition" to begin sign detection</li>
                    <li>Make clear sign language gestures in front of the camera</li>
                    <li>Hold each sign for a few seconds for better accuracy</li>
                    <li>View detected signs and confidence levels in real-time</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}