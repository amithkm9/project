import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TeachersSection() {
  const teachers = [
    {
      name: 'Sarah Johnson',
      role: 'ASL Master Instructor',
      specialization: 'Deaf Education & AI Integration',
      experience: '15+ years',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Sarah is a certified ASL interpreter and educator who has pioneered the integration of AI technology in sign language instruction.'
    },
    {
      name: 'Michael Chen',
      role: 'Technology Integration Specialist',
      specialization: 'AI & Computer Vision',
      experience: '12+ years',
      image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Michael leads our AI development team, creating innovative solutions that make sign language learning more accessible and effective.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Inclusive Education Director',
      specialization: 'Deaf Community Advocacy',
      experience: '20+ years',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dr. Rodriguez is a deaf educator and advocate who ensures our platform serves the authentic needs of the deaf community.'
    }
  ];

  return (
    <section id="teachers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Sign Language Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from certified instructors, technology innovators, and community advocates 
            who are passionate about inclusive education and AI-powered learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {teacher.role}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {teacher.specialization}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {teacher.experience}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {teacher.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}