// app/home/page.tsx - FIXED VERSION with proper auth validation
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { CourseCard } from '@/components/course-card';
import { WelcomeSection } from '@/components/welcome-section';
import { Loader2, BookOpen, Clock, Trophy, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication on home page...');
        
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        console.log('💾 Stored user data:', storedUser ? 'Found' : 'Not found');
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('✅ Valid user data found:', userData.email);
            
            // Validate that the user data has required fields
            if (userData.id && userData.fullName && userData.email && userData.age) {
              setUser(userData);
              setAuthChecked(true);
              setIsLoading(false);
              return;
            } else {
              console.warn('⚠️ Stored user data is incomplete');
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('❌ Failed to parse stored user data:', error);
            localStorage.removeItem('user');
          }
        }

        // If no valid localStorage data, check Supabase session
        console.log('🔍 Checking Supabase session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
        }
        
        if (session?.user) {
          console.log('✅ Found Supabase session for:', session.user.email);
          
          try {
            // Get user data from database
            const { data: userData, error } = await supabase
              .from('users')
              .select('id, full_name, email, age')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('❌ Failed to fetch user data from DB:', error);
            } else if (userData) {
              const user = {
                id: userData.id,
                fullName: userData.full_name,
                email: userData.email,
                age: userData.age,
              };
              
              console.log('✅ Got user data from DB:', user.email);
              setUser(user);
              localStorage.setItem('user', JSON.stringify(user));
              setAuthChecked(true);
              setIsLoading(false);
              return;
            }
          } catch (dbError) {
            console.error('❌ Database error:', dbError);
          }
        }

        // If we get here, no valid authentication found
        console.log('❌ No valid authentication found');
        setAuthChecked(true);
        setIsLoading(false);
        
        // Short delay before redirect to prevent flash
        setTimeout(() => {
          toast.error('Please sign in to access this page');
          router.push('/login');
        }, 100);
        
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setAuthChecked(true);
        setIsLoading(false);
        
        setTimeout(() => {
          toast.error('Authentication error');
          router.push('/login');
        }, 100);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch courses based on user age and create categories
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.age || !authChecked) {
        console.log('⏳ User not ready for course fetch yet');
        return;
      }

      console.log('📚 Fetching courses for user age:', user.age);
      setCoursesLoading(true);
      
      try {
        // Fetch courses for user's age group
        const response = await fetch(`/api/courses?age=${user.age}&userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer fallback`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Courses API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch courses: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        console.log('📦 Courses data received:', data);
        
        setCourses(data.courses || []);

        // Create course categories based on age groups
        const categories = createCourseCategories(user.age, data.courses || []);
        setCourseCategories(categories);

        if (data.courses && data.courses.length > 0) {
          toast.success(`Found ${data.courses.length} courses for you!`);
        }

      } catch (error) {
        console.error('❌ Failed to fetch courses:', error);
        toast.error('Failed to load courses, using sample data');
        
        // Fallback: Use sample courses based on age
        console.log('🔄 Using fallback sample courses');
        const fallbackCourses = getSampleCourses(user.age);
        setCourses(fallbackCourses);
        const categories = createCourseCategories(user.age, fallbackCourses);
        setCourseCategories(categories);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [user, authChecked]);

  // Create course categories based on age groups
  const createCourseCategories = (userAge: number, allCourses: Course[]): CourseCategory[] => {
    const categories: CourseCategory[] = [];
    
    // Always show user's age group first
    const userAgeGroup = getAgeGroup(userAge);
    const userCourses = allCourses.filter(course => course.ageGroup === userAgeGroup);
    
    if (userCourses.length > 0) {
      categories.push({
        ageGroup: userAgeGroup,
        title: `For Ages ${userAgeGroup}`,
        description: getAgeGroupDescription(userAgeGroup),
        courses: userCourses,
      });
    }

    return categories;
  };

  const getAgeGroup = (age: number): string => {
    if (age >= 2 && age <= 5) return '2-5';
    if (age >= 6 && age <= 10) return '6-10';
    if (age >= 11 && age <= 15) return '11-15';
    return '16+';
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

  // Sample courses fallback
  const getSampleCourses = (age: number): Course[] => {
    const allCourses: Course[] = [
      // Ages 2-5
      {
        id: '1',
        title: 'Basic Hand Shapes',
        description: 'Learn simple hand shapes and finger movements with fun games and colorful visuals.',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '15 min',
        lessonsCount: 8,
      },
      {
        id: '2',
        title: 'Family Signs',
        description: 'Learn to sign family members like mommy, daddy, and grandma with interactive stories.',
        thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '20 min',
        lessonsCount: 12,
      },
      {
        id: '3',
        title: 'Colors & Shapes',
        description: 'Discover signs for colors and basic shapes through playful activities.',
        thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '18 min',
        lessonsCount: 10,
      },
      // Ages 6-10
      {
        id: '4',
        title: 'School Vocabulary',
        description: 'Essential signs for school subjects, classroom items, and daily school activities.',
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '25 min',
        lessonsCount: 15,
      },
      {
        id: '5',
        title: 'Animals & Nature',
        description: 'Learn signs for farm animals, wild animals, and elements of nature.',
        thumbnail: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '30 min',
        lessonsCount: 18,
      },
      {
        id: '6',
        title: 'Sports & Hobbies',
        description: 'Sign language for sports activities, games, and popular hobbies.',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '28 min',
        lessonsCount: 16,
      },
      // Ages 11-15
      {
        id: '7',
        title: 'Conversational Skills',
        description: 'Build fluency in everyday conversations and social interactions.',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '40 min',
        lessonsCount: 22,
      },
      {
        id: '8',
        title: 'Advanced Grammar',
        description: 'Master complex grammar structures and advanced ASL concepts.',
        thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        ageGroup: '11-15',
        difficulty: 'Advanced',
        duration: '45 min',
        lessonsCount: 25,
      },
      {
        id: '9',
        title: 'Professional ASL',
        description: 'Advanced sign language for workplace and professional settings.',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        ageGroup: '16+',
        difficulty: 'Advanced',
        duration: '50 min',
        lessonsCount: 30,
      },
    ];

    // Filter courses based on age
    const ageGroup = getAgeGroup(age);
    return allCourses.filter(course => course.ageGroup === ageGroup);
  };

  const handleStartCourse = (courseId: string) => {
    console.log('🚀 Starting course:', courseId);
    router.push(`/lesson/${courseId}`);
  };

  // Show loading screen while checking auth
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection user={user} />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-600">Available Courses</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Hours Learned</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Courses Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Course Categories */}
        {coursesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        ) : courseCategories.length > 0 ? (
          <div className="space-y-12">
            {courseCategories.map((category, index) => (
              <section key={index}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {category.title}
                      </h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Perfect for you!
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
              No courses available yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on creating amazing courses for your age group. 
              Check back soon for new content!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}