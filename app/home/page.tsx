// app/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { CourseCard } from '@/components/course-card';
import { WelcomeSection } from '@/components/welcome-section';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check localStorage fallback
          const storedUser = localStorage.getItem('user');
          if (!storedUser) {
            toast.error('Please sign in to access this page');
            router.push('/signup');
            return;
          }
          
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          // Get user data from database
          const { data: userData, error } = await supabase
            .from('users')
            .select('id, full_name, email, age')
            .eq('id', session.user.id)
            .single();

          if (error || !userData) {
            console.error('Failed to fetch user data:', error);
            toast.error('Failed to load user data');
            router.push('/signup');
            return;
          }

          setUser({
            id: userData.id,
            fullName: userData.full_name,
            email: userData.email,
            age: userData.age,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Authentication error');
        router.push('/signup');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch courses based on user age
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.age) return;

      setCoursesLoading(true);
      try {
        const response = await fetch(`/api/courses?age=${user.age}`, {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || 'fallback'}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses');
        
        // Fallback: Use sample courses based on age
        setCourses(getSampleCourses(user.age));
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Sample courses fallback
  const getSampleCourses = (age: number): Course[] => {
    const allCourses: Course[] = [
      // Ages 2-5
      {
        id: '1',
        title: 'Basic Hand Shapes',
        description: 'Learn simple hand shapes and finger movements',
        thumbnail: '/images/course-basic-hands.jpg',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '15 min',
        lessonsCount: 8,
      },
      {
        id: '2',
        title: 'Family Signs',
        description: 'Learn to sign family members and relationships',
        thumbnail: '/images/course-family.jpg',
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '20 min',
        lessonsCount: 12,
      },
      // Ages 6-10
      {
        id: '3',
        title: 'School Vocabulary',
        description: 'Essential signs for school and classroom',
        thumbnail: '/images/course-school.jpg',
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '25 min',
        lessonsCount: 15,
      },
      {
        id: '4',
        title: 'Animals & Nature',
        description: 'Learn signs for animals and nature elements',
        thumbnail: '/images/course-animals.jpg',
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '30 min',
        lessonsCount: 18,
      },
      // Ages 11-15
      {
        id: '5',
        title: 'Conversational Skills',
        description: 'Build fluency in everyday conversations',
        thumbnail: '/images/course-conversation.jpg',
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '40 min',
        lessonsCount: 22,
      },
      {
        id: '6',
        title: 'Advanced Grammar',
        description: 'Master complex grammar structures in ASL',
        thumbnail: '/images/course-grammar.jpg',
        ageGroup: '11-15',
        difficulty: 'Advanced',
        duration: '45 min',
        lessonsCount: 25,
      },
    ];

    // Filter courses based on age
    let ageGroup = '';
    if (age >= 2 && age <= 5) ageGroup = '2-5';
    else if (age >= 6 && age <= 10) ageGroup = '6-10';
    else if (age >= 11 && age <= 15) ageGroup = '11-15';
    else ageGroup = '11-15'; // Default for older users

    return allCourses.filter(course => course.ageGroup === ageGroup);
  };

  const handleStartCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection user={user} />
        
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recommended Courses
              </h2>
              <p className="text-gray-600 mt-2">
                Courses tailored for your age group ({getAgeGroupLabel(user.age)})
              </p>
            </div>
          </div>

          {coursesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onStart={() => handleStartCourse(course.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No courses available for your age group yet.
              </p>
              <p className="text-gray-500 mt-2">
                Check back soon for new content!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function getAgeGroupLabel(age: number): string {
  if (age >= 2 && age <= 5) return '2-5 years';
  if (age >= 6 && age <= 10) return '6-10 years';
  if (age >= 11 && age <= 15) return '11-15 years';
  return '16+ years';
}