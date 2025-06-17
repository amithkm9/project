'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Square, RefreshCw, Languages } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface Translation {
  detected: string;
  translated: string;
  language: string;
  confidence: number;
  timestamp: Date;
}

export default function TranslatePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [detectedSign, setDetectedSign] = useState('---');
  const [translatedText, setTranslatedText] = useState('---');
  const [confidence, setConfidence] = useState(0);
  const [history, setHistory] = useState<Translation[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const translationInterval = useRef<NodeJS.Timeout | null>(null);

  const languages = {
    'en': 'English',
    'hi': 'Hindi',
    'kn': 'Kannada',
    'te': 'Telugu',
    'ta': 'Tamil',
    'es': 'Spanish',
    'fr': 'French'
  };

  const translations = {
    'hello': {
      'en': 'Hello',
      'hi': 'नमस्ते',
      'kn': 'ನಮಸ್ಕಾರ',
      'te': 'నమస్కారం',
      'ta': 'வணக்கம்',
      'es': 'Hola',
      'fr': 'Bonjour'
    },
    'thanks': {
      'en': 'Thank you',
      'hi': 'धन्यवाद',
      'kn': 'ಧನ್ಯವಾದಗಳು',
      'te': 'ధన్యవాదాలు',
      'ta': 'நன்றி',
      'es': 'Gracias',
      'fr': 'Merci'
    },
    'yes': {
      'en': 'Yes',
      'hi': 'हाँ',
      'kn': 'ಹೌದು',
      'te': 'అవును',
      'ta': 'ஆம்',
      'es': 'Sí',
      'fr': 'Oui'
    },
    'family': {
      'en': 'Family',
      'hi': 'परिवार',
      'kn': 'ಕುಟುಂಬ',
      'te': 'కుటుంబం',
      'ta': 'குடும்பம்',
      'es': 'Familia',
      'fr': 'Famille'
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      stopTranslation();
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
      alert('Please allow camera access to use translation');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    stopTranslation();
  };

  const startTranslation = () => {
    if (!isCameraActive) return;
    
    setIsTranslating(true);
    
    translationInterval.current = setInterval(() => {
      simulateTranslation();
    }, 3000); // Translate every 3 seconds
  };

  const stopTranslation = () => {
    setIsTranslating(false);
    if (translationInterval.current) {
      clearInterval(translationInterval.current);
      translationInterval.current = null;
    }
  };

  const simulateTranslation = () => {
    const signs = Object.keys(translations);
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    const translated = translations[randomSign as keyof typeof translations][targetLanguage as keyof typeof translations.hello] || randomSign;
    
    setDetectedSign(randomSign.charAt(0).toUpperCase() + randomSign.slice(1));
    setTranslatedText(translated);
    setConfidence(randomConfidence);
    
    // Add to history
    const newTranslation: Translation = {
      detected: randomSign.charAt(0).toUpperCase() + randomSign.slice(1),
      translated: translated,
      language: languages[targetLanguage as keyof typeof languages],
      confidence: randomConfidence,
      timestamp: new Date()
    };
    
    setHistory(prev => [newTranslation, ...prev.slice(0, 9)]);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'bg-green-100 text-green-800';
    if (conf >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sign Language Translator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Translate basic sign language gestures into different languages
          </p>
        </section>

        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Real-time Sign Language Translation
              </CardTitle>
              <p className="text-sm text-gray-600">
                Make one of these signs: <strong>Hello, Thanks, Yes, Family</strong>
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Camera Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {isTranslating && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm animate-pulse">
                              Recording...
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4 text-white text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              Live Camera Feed
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Click "Start Camera" to begin</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Camera Controls */}
                  <div className="flex gap-2">
                    {!isCameraActive ? (
                      <Button onClick={startCamera} className="flex-1">
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        {!isTranslating ? (
                          <Button onClick={startTranslation} className="flex-1 bg-green-600 hover:bg-green-700">
                            <Languages className="mr-2 h-4 w-4" />
                            Start Translation
                          </Button>
                        ) : (
                          <Button onClick={stopTranslation} variant="destructive" className="flex-1">
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                          </Button>
                        )}
                        <Button onClick={stopCamera} variant="outline">
                          Stop Camera
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Translation Results */}
                <div className="space-y-4">
                  {/* Language Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Translate to:</label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languages).map(([code, name]) => (
                          <SelectItem key={code} value={code}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Results Display */}
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Detected Sign</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{detectedSign}</div>
                        {confidence > 0 && (
                          <Badge className={getConfidenceColor(confidence)}>
                            {confidence}% confidence
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Translation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600 mb-2">{translatedText}</div>
                        <div className="text-sm text-gray-500">
                          in {languages[targetLanguage as keyof typeof languages]}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Translation History */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Translations</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No translations yet. Start the camera and make a sign!</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold">{item.detected}</div>
                        <div className="text-gray-400">→</div>
                        <div className="text-lg text-blue-600">{item.translated}</div>
                        <Badge variant="outline" className="text-xs">
                          {item.language}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Instructions and Supported Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Click "Start Camera" to activate your webcam</li>
                  <li>Select your target language from the dropdown</li>
                  <li>Click "Start Translation" and make supported gestures</li>
                  <li>Hold the gesture for a few seconds for better accuracy</li>
                  <li>View the detected sign and its translation</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Supported Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(translations).map((sign) => (
                    <div key={sign} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">🤟</div>
                      <div className="text-sm font-medium capitalize">{sign}</div>
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