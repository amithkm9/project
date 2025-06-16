// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  ageGroup: string;
  difficulty: string;
  duration: string;
  lessonsCount: number;
  isActive: boolean;
  isCompleted?: boolean;
  createdAt: string;
}

interface CourseResponse {
  message: string;
  courses: Course[];
  ageGroup: string;
  totalCourses: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const age = searchParams.get('age');
    const userId = searchParams.get('userId');

    // Validate age parameter
    if (!age || isNaN(parseInt(age))) {
      return NextResponse.json(
        { 
          message: 'Valid age parameter is required',
          error: 'INVALID_AGE'
        },
        { status: 400 }
      );
    }

    const userAge = parseInt(age);

    // Validate age range
    if (userAge < 2 || userAge > 120) {
      return NextResponse.json(
        { 
          message: 'Age must be between 2 and 120',
          error: 'AGE_OUT_OF_RANGE'
        },
        { status: 400 }
      );
    }

    // Determine age group
    let ageGroup = '';
    if (userAge >= 2 && userAge <= 5) {
      ageGroup = '2-5';
    } else if (userAge >= 6 && userAge <= 10) {
      ageGroup = '6-10';
    } else if (userAge >= 11 && userAge <= 15) {
      ageGroup = '11-15';
    } else {
      ageGroup = '16+';
    }

    // Get courses based on age group
    const courses = getSampleCoursesByAgeGroup(ageGroup);

    // If userId is provided, fetch user progress to mark completed courses
    let userProgress = null;
    if (userId) {
      try {
        const { data: progressData, error: progressError } = await supabaseServer
          .from('user_progress')
          .select('courses_completed')
          .eq('user_id', userId)
          .single();

        if (progressError) {
          console.warn('No user progress found for user:', userId);
        } else {
          userProgress = progressData;
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    }

    // Mark courses as completed if user has progress
    const coursesWithProgress = courses.map(course => ({
      ...course,
      isCompleted: userProgress?.courses_completed?.includes(course.id) || false,
    }));

    const response: CourseResponse = {
      message: 'Courses fetched successfully',
      courses: coursesWithProgress,
      ageGroup: ageGroup,
      totalCourses: coursesWithProgress.length,
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getSampleCoursesByAgeGroup(ageGroup: string): Course[] {
  const baseUrl = 'https://images.unsplash.com';
  
  const coursesData: Record<string, Course[]> = {
    '2-5': [
      {
        id: 'basic-hands-2-5',
        title: 'Basic Hand Shapes',
        description: 'Learn simple hand shapes and finger movements with fun games and colorful visuals. Perfect for little learners starting their sign language journey.',
        thumbnail: `${baseUrl}/400x300/?baby,hands,learning`,
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '15 min',
        lessonsCount: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'family-signs-2-5',
        title: 'Family Signs',
        description: 'Learn to sign family members like mommy, daddy, and grandma with interactive stories and fun animations.',
        thumbnail: `${baseUrl}/400x300/?family,children,love`,
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '20 min',
        lessonsCount: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'colors-shapes-2-5',
        title: 'Colors & Shapes',
        description: 'Discover signs for colors and basic shapes through playful activities and engaging visual games.',
        thumbnail: `${baseUrl}/400x300/?colors,shapes,kids`,
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '18 min',
        lessonsCount: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'animal-friends-2-5',
        title: 'Animal Friends',
        description: 'Meet and learn signs for friendly animals like cats, dogs, birds, and farm animals.',
        thumbnail: `${baseUrl}/400x300/?animals,cute,children`,
        ageGroup: '2-5',
        difficulty: 'Beginner',
        duration: '16 min',
        lessonsCount: 9,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    '6-10': [
      {
        id: 'school-vocab-6-10',
        title: 'School Vocabulary',
        description: 'Essential signs for school subjects, classroom items, and daily school activities. Perfect for young students.',
        thumbnail: `${baseUrl}/400x300/?school,children,classroom`,
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '25 min',
        lessonsCount: 15,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'animals-nature-6-10',
        title: 'Animals & Nature',
        description: 'Learn signs for farm animals, wild animals, and elements of nature through interactive lessons.',
        thumbnail: `${baseUrl}/400x300/?animals,nature,wildlife`,
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '30 min',
        lessonsCount: 18,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'sports-hobbies-6-10',
        title: 'Sports & Hobbies',
        description: 'Sign language for sports activities, games, and popular hobbies that kids love.',
        thumbnail: `${baseUrl}/400x300/?sports,games,children`,
        ageGroup: '6-10',
        difficulty: 'Intermediate',
        duration: '28 min',
        lessonsCount: 16,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'food-drinks-6-10',
        title: 'Food & Drinks',
        description: 'Learn to sign different foods, beverages, and meal-related vocabulary.',
        thumbnail: `${baseUrl}/400x300/?food,healthy,kids`,
        ageGroup: '6-10',
        difficulty: 'Beginner',
        duration: '22 min',
        lessonsCount: 14,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    '11-15': [
      {
        id: 'conversation-skills-11-15',
        title: 'Conversational Skills',
        description: 'Build fluency in everyday conversations and social interactions with peers and adults.',
        thumbnail: `${baseUrl}/400x300/?conversation,teenagers,communication`,
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '40 min',
        lessonsCount: 22,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'advanced-grammar-11-15',
        title: 'Advanced Grammar',
        description: 'Master complex grammar structures and advanced ASL concepts for more sophisticated communication.',
        thumbnail: `${baseUrl}/400x300/?study,grammar,learning`,
        ageGroup: '11-15',
        difficulty: 'Advanced',
        duration: '45 min',
        lessonsCount: 25,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'culture-community-11-15',
        title: 'Deaf Culture & Community',
        description: 'Learn about Deaf culture, history, and community values to better understand the Deaf world.',
        thumbnail: `${baseUrl}/400x300/?community,culture,diversity`,
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '35 min',
        lessonsCount: 20,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'academic-vocab-11-15',
        title: 'Academic Vocabulary',
        description: 'Essential signs for high school subjects including science, math, history, and literature.',
        thumbnail: `${baseUrl}/400x300/?study,books,academic`,
        ageGroup: '11-15',
        difficulty: 'Advanced',
        duration: '38 min',
        lessonsCount: 24,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'emotions-feelings-11-15',
        title: 'Emotions & Feelings',
        description: 'Express complex emotions and feelings effectively in sign language for better emotional communication.',
        thumbnail: `${baseUrl}/400x300/?emotions,feelings,expression`,
        ageGroup: '11-15',
        difficulty: 'Intermediate',
        duration: '32 min',
        lessonsCount: 19,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    '16+': [
      {
        id: 'professional-asl-16',
        title: 'Professional ASL',
        description: 'Advanced sign language for workplace and professional settings including business terminology.',
        thumbnail: `${baseUrl}/400x300/?professional,workplace,communication`,
        ageGroup: '16+',
        difficulty: 'Advanced',
        duration: '50 min',
        lessonsCount: 30,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'interpreter-prep-16',
        title: 'Interpreter Preparation',
        description: 'Intensive training for aspiring ASL interpreters including ethics, techniques, and practice.',
        thumbnail: `${baseUrl}/400x300/?interpreter,professional,certification`,
        ageGroup: '16+',
        difficulty: 'Expert',
        duration: '60 min',
        lessonsCount: 35,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'medical-legal-16',
        title: 'Medical & Legal ASL',
        description: 'Specialized vocabulary for medical and legal settings with professional terminology.',
        thumbnail: `${baseUrl}/400x300/?medical,legal,professional`,
        ageGroup: '16+',
        difficulty: 'Expert',
        duration: '55 min',
        lessonsCount: 32,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'advanced-linguistics-16',
        title: 'ASL Linguistics',
        description: 'Deep dive into the linguistic structure of ASL including phonology, morphology, and syntax.',
        thumbnail: `${baseUrl}/400x300/?linguistics,research,academic`,
        ageGroup: '16+',
        difficulty: 'Expert',
        duration: '65 min',
        lessonsCount: 40,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'teaching-asl-16',
        title: 'Teaching ASL',
        description: 'Learn how to effectively teach ASL to others with pedagogy and teaching methodologies.',
        thumbnail: `${baseUrl}/400x300/?teaching,education,instructor`,
        ageGroup: '16+',
        difficulty: 'Advanced',
        duration: '48 min',
        lessonsCount: 28,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  return coursesData[ageGroup] || [];
}

// Additional endpoint for getting a specific course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, userId } = body;

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }

    // This would typically fetch from a database
    // For now, we'll search through our sample data
    const allCourses = [
      ...getSampleCoursesByAgeGroup('2-5'),
      ...getSampleCoursesByAgeGroup('6-10'),
      ...getSampleCoursesByAgeGroup('11-15'),
      ...getSampleCoursesByAgeGroup('16+'),
    ];

    const course = allCourses.find(c => c.id === courseId);

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user has completed this course
    let isCompleted = false;
    if (userId) {
      try {
        const { data: progressData } = await supabaseServer
          .from('user_progress')
          .select('courses_completed')
          .eq('user_id', userId)
          .single();

        isCompleted = progressData?.courses_completed?.includes(courseId) || false;
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    }

    return NextResponse.json({
      message: 'Course fetched successfully',
      course: {
        ...course,
        isCompleted,
      },
    });

  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}