'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  fullName: string;
  email: string;
  age: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  ageGroup: string;
  duration: string;
  videoCount: number;
  href: string;
}

export default function TutorialsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const tutorials: Tutorial[] = [
    {
      id: 'basics',
      title: 'Sign Language Basics',
      description: 'Learn the foundational hand signs for the alphabet and numbers',
      thumbnail: '/assets/imgs/tutorialbasic.jpg',
      level: 'Beginner',
      ageGroup: '2-5',
     duration: '15 minutes',
     videoCount: 3,
     href: '/tutorials/basics'
   },
   {
     id: 'family-signs',
     title: 'Family Signs',
     description: 'Learn how to sign family members and relationships',
     thumbnail: '/assets/imgs/tutorialfamily.jpg',
     level: 'Beginner',
     ageGroup: '6-10',
     duration: '4 minutes',
     videoCount: 1,
     href: '/tutorials/family-signs'
   },
   {
     id: 'emotions-expressions',
     title: 'Emotions and Expressions',
     description: 'Learn how to communicate feelings and emotions',
     thumbnail: '/assets/imgs/tutorialemotions.jpg',
     level: 'Intermediate',
     ageGroup: '11-15',
     duration: '5 minutes',
     videoCount: 1,
     href: '/tutorials/emotions-expressions'
   }
 ];

 useEffect(() => {
   const storedUser = localStorage.getItem('user');
   if (storedUser) {
     setUser(JSON.parse(storedUser));
   }
 }, []);

 const filteredTutorials = tutorials.filter(tutorial => {
   if (selectedAge !== 'all' && tutorial.ageGroup !== selectedAge) return false;
   if (selectedDifficulty !== 'all' && tutorial.level.toLowerCase() !== selectedDifficulty) return false;
   return true;
 });

 const getDifficultyColor = (level: string) => {
   switch (level.toLowerCase()) {
     case 'beginner': return 'bg-green-100 text-green-800';
     case 'intermediate': return 'bg-yellow-100 text-yellow-800';
     case 'advanced': return 'bg-red-100 text-red-800';
     default: return 'bg-gray-100 text-gray-800';
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
     <Navbar user={user} />
     
     <main className="container mx-auto px-4 py-8">
       {/* Hero Section */}
       <section className="text-center mb-12">
         <h1 className="text-4xl font-bold text-gray-900 mb-4">
           Sign Language Tutorials
         </h1>
         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
           Browse our collection of age-appropriate sign language lessons
         </p>
       </section>

       {/* Filters */}
       <section className="mb-8">
         <Card>
           <CardHeader>
             <CardTitle>Filter Tutorials</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                 <label className="block text-sm font-medium mb-2">Age Group:</label>
                 <select 
                   value={selectedAge}
                   onChange={(e) => setSelectedAge(e.target.value)}
                   className="w-full p-2 border rounded-lg"
                 >
                   <option value="all">All Ages</option>
                   <option value="2-5">Ages 2-5</option>
                   <option value="6-10">Ages 6-10</option>
                   <option value="11-15">Ages 11-15</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2">Category:</label>
                 <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="w-full p-2 border rounded-lg"
                 >
                   <option value="all">All Categories</option>
                   <option value="alphabet">Alphabet</option>
                   <option value="numbers">Numbers</option>
                   <option value="family">Family</option>
                   <option value="emotions">Emotions</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-2">Difficulty:</label>
                 <select 
                   value={selectedDifficulty}
                   onChange={(e) => setSelectedDifficulty(e.target.value)}
                   className="w-full p-2 border rounded-lg"
                 >
                   <option value="all">All Levels</option>
                   <option value="beginner">Beginner</option>
                   <option value="intermediate">Intermediate</option>
                   <option value="advanced">Advanced</option>
                 </select>
               </div>
               <div className="flex items-end">
                 <Button 
                   onClick={() => {
                     setSelectedAge('all');
                     setSelectedCategory('all');
                     setSelectedDifficulty('all');
                   }}
                   variant="outline"
                   className="w-full"
                 >
                   Clear Filters
                 </Button>
               </div>
             </div>
           </CardContent>
         </Card>
       </section>

       {/* Tutorials Grid */}
       <section>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTutorials.map((tutorial) => (
             <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
               <div className="aspect-video overflow-hidden">
                 <img
                   src={tutorial.thumbnail}
                   alt={tutorial.title}
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                 />
               </div>
               <CardContent className="p-6">
                 <div className="flex items-center gap-2 mb-2">
                   <Badge className={getDifficultyColor(tutorial.level)}>
                     {tutorial.level}
                   </Badge>
                   <Badge variant="outline">Ages {tutorial.ageGroup}</Badge>
                 </div>
                 <h3 className="text-xl font-bold mb-2">{tutorial.title}</h3>
                 <p className="text-gray-600 mb-4">{tutorial.description}</p>
                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                   <div className="flex items-center gap-1">
                     <Clock className="h-4 w-4" />
                     <span>{tutorial.duration}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <BookOpen className="h-4 w-4" />
                     <span>{tutorial.videoCount} videos</span>
                   </div>
                 </div>
                 <Link href={tutorial.href}>
                   <Button className="w-full">Start Learning</Button>
                 </Link>
               </CardContent>
             </Card>
           ))}
         </div>
       </section>
     </main>
   </div>
 );
}