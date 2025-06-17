// app/home/page.tsx - Direct access without authentication
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { CourseCard } from '@/components/course-card';
import { WelcomeSection } from '@/components/welcome-section';
import { Loader2, BookOpen, Clock, Trophy, Target, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

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

interface CourseCategory {
  ageGroup: string;
  title: string;
  description: string;
  courses: Course[];
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('16+');

  // Auto-create a default user and load courses
  useEffect(() => {
    const initializeUser = () => {
      // Create a default user if none exists
      const defaultUser: User = {
        id: 'demo-user-123',
        fullName: 'Demo User',
        email: 'demo@edusign.com',
        age: 25
      };

      setUser(defaultUser);
      console.log('✅ Default user created:', defaultUser);
      
      // Load all courses for all age groups
      loadAllCourses();
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const loadAllCourses = () => {
    console.log('📚 Loading all courses...');
    
    const allCourses = getAllSampleCourses();
    setCourses(allCourses);

    // Create categories for all age groups
    const categories = createAllCourseCategories(allCourses);
    setCourseCategories(categories);
    
    toast.success(`Loaded ${allCourses.length} courses across all age groups!`);
  };

  const getAllSampleCourses = (): Course[] => {
    const allCourses: Course[] = [
      // Ages 2-5
      {
        id: 'basic-hands-2-5',
        title: 'Basic Hand Shapes',
        description: 'Learn simple hand shapes and finger movements with fun games and colorful visuals.',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '15 min',
        lessonsCount: 8,
      },
      {
        id: 'family-signs-2-5',
        title: 'Family Signs',
        description: 'Learn to sign family members like mommy, daddy, and grandma with interactive stories.',
        thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '20 min',
        lessonsCount: 12,
      },
      {
        id: 'colors-shapes-2-5',
        title: 'Colors & Shapes',
        description: 'Discover signs for colors and basic shapes through playful activities.',
        thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '18 min',
        lessonsCount: 10,
      },
      {
        id: 'animal-friends-2-5',
        title: 'Animal Friends',
        description: 'Meet and learn signs for friendly animals like cats, dogs, birds, and farm animals.',
        thumbnail: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '16 min',
        lessonsCount: 9,
      },
      // Ages 6-10
      {
        id: 'school-vocab-6-10',
        title: 'School Vocabulary',
        description: 'Essential signs for school subjects, classroom items, and daily school activities.',
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '25 min',
        lessonsCount: 15,
      },
      {
        id: 'animals-nature-6-10',
        title: 'Animals & Nature',
        description: 'Learn signs for farm animals, wild animals, and elements of nature.',
        thumbnail: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '30 min',
        lessonsCount: 18,
      },
      {
        id: 'sports-hobbies-6-10',
        title: 'Sports & Hobbies',
        description: 'Sign language for sports activities, games, and popular hobbies.',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '28 min',
        lessonsCount: 16,
      },
      {
        id: 'food-drinks-6-10',
        title: 'Food & Drinks',
        description: 'Learn to sign different foods, beverages, and meal-related vocabulary.',
        thumbnail: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '22 min',
        lessonsCount: 14,
      },
      // Ages 11-15
      {
        id: 'conversation-skills-11-15',
        title: 'Conversational Skills',
        description: 'Build fluency in everyday conversations and social interactions.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '40 min',
        lessonsCount: 22,
      },
      {
        id: 'advanced-grammar-11-15',
        title: 'Advanced Grammar',
        description: 'Master complex grammar structures and advanced ASL concepts.',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Advanced',
        duration: '45 min',
        lessonsCount: 25,
      },
      {
        id: 'culture-community-11-15',
        title: 'Deaf Culture & Community',
        description: 'Learn about Deaf culture, history, and community values.',
        thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '35 min',
        lessonsCount: 20,
      },
      {
        id: 'emotions-feelings-11-15',
        title: 'Emotions & Feelings',
        description: 'Express complex emotions and feelings effectively in sign language.',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '32 min',
        lessonsCount: 19,
      },
      // Ages 16+
      {
        id: 'professional-asl-16',
        title: 'Professional ASL',
        description: 'Advanced sign language for workplace and professional settings.',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        ageGroup: '16+',
        difficulty: 'Advanced',
        duration: '50 min',
        lessonsCount: 30,
      },
      {
        id: 'interpreter-prep-16',
        title: 'Interpreter Preparation',
        description: 'Intensive training for aspiring ASL interpreters.',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        ageGroup: '16+',
        difficulty: 'Expert',
        duration: '60 min',
        lessonsCount: 35,
      },
      {
        id: 'medical-legal-16',
        title: 'Medical & Legal ASL',
        description: 'Specialized vocabulary for medical and legal settings.',
        thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
        ageGroup: '16+',
        difficulty: 'Expert',
        duration: '55 min',
        lessonsCount: 32,
      },
      {
        id: 'teaching-asl-16',
        title: 'Teaching ASL',
        description: 'Learn how to effectively teach ASL to others.',
        thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
        ageGroup: '16+',
        difficulty: 'Advanced',
        duration: '48 min',
        lessonsCount: 28,
      }
    ];

    return allCourses;
  };

  const createAllCourseCategories = (allCourses: Course[]): CourseCategory[] => {
    const ageGroups = ['2-5', '6-10', '11-15', '16+'];
    
    return ageGroups.map(ageGroup => {
      const groupCourses = allCourses.filter(course => course.ageGroup === ageGroup);
      
      return {
        ageGroup,
        title: `Ages ${ageGroup}`,
        description: getAgeGroupDescription(ageGroup),
        courses: groupCourses,
      };
    });
  };

  const getAgeGroupDescription = (ageGroup: string): string => {
    switch (ageGroup) {
      case '2-5':
        return 'Fun and colorful lessons designed for young learners with interactive games and simple gestures.';
      case '6-10':
        return 'Engaging lessons that build vocabulary and basic conversation skills through interactive activities.';
      case '11-15':
        return 'Advanced lessons focusing on fluency, grammar, and real-world conversation skills.';
      case '16+':
        return 'Professional-level courses including workplace communication and specialized terminology.';
      default:
        return 'Courses tailored to your learning level and interests.';
    }
  };

  const handleStartCourse = (courseId: string) => {
    console.log('🚀 Starting course:', courseId);
    router.push(`/lesson/${courseId}`);
  };

  const handleChangeAge = (age: number) => {
    const newUser = { ...user!, age };
    setUser(newUser);
    
    const ageGroup = getAgeGroup(age);
    setSelectedAgeGroup(ageGroup);
    
    toast.success(`Switched to age ${age} - viewing ${ageGroup} courses`);
  };

  const getAgeGroup = (age: number): string => {
    if (age >= 2 && age <= 5) return '2-5';
    if (age >= 6 && age <= 10) return '6-10';
    if (age >= 11 && age <= 15) return '11-15';
    return '16+';
  };

  const filteredCategories = selectedAgeGroup === 'all' 
    ? courseCategories 
    : courseCategories.filter(cat => cat.ageGroup === selectedAgeGroup);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Age Group Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Choose Your Age Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedAgeGroup === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedAgeGroup('all')}
              >
                All Ages
              </Button>
              {['2-5', '6-10', '11-15', '16+'].map(age => (
                <Button
                  key={age}
                  variant={selectedAgeGroup === age ? 'default' : 'outline'}
                  onClick={() => setSelectedAgeGroup(age)}
                >
                  Ages {age}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Select an age group to see appropriate courses, or view all courses at once.
            </p>
          </CardContent>
        </Card>

        {user && <WelcomeSection user={user} />}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {filteredCategories.reduce((acc, cat) => acc + cat.courses.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Available Now</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Age Groups</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {courses.reduce((acc, course) => acc + course.lessonsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </CardContent>
          </Card>
        </div>

        {/* Course Categories */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-12">
            {filteredCategories.map((category, index) => (
              <section key={index}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {category.title}
                      </h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {category.courses.length} courses
                      </Badge>
                    </div>
                    <p className="text-gray-600 max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onStart={() => handleStartCourse(course.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select a different age group to see available courses.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}