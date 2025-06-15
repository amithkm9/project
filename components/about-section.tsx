import { Brain, Camera, Users, Award } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Recognition',
      description: 'Advanced machine learning algorithms detect and analyze sign language gestures in real-time.'
    },
    {
      icon: <Camera className="h-8 w-8 text-teal-600" />,
      title: 'Webcam Integration',
      description: 'Practice anywhere with our webcam-based learning system that provides instant feedback.'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Inclusive Community',
      description: 'Connect with learners, educators, and the deaf community in a supportive environment.'
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: 'Certified Learning',
      description: 'Earn certificates and track your progress with our comprehensive assessment system.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionizing Sign Language Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            EduSign combines cutting-edge AI technology with expert pedagogy to create an inclusive, 
            interactive learning experience that adapts to every learner's unique needs and pace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Breaking Barriers, Building Bridges
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Our mission is to make sign language education accessible, engaging, and effective for everyone. 
                Whether you're a hearing individual learning to communicate with the deaf community, or someone 
                looking to improve their existing skills, EduSign provides the tools you need.
              </p>
              <p>
                Through innovative AI technology, we've created an immersive learning environment that recognizes 
                and responds to your gestures, providing real-time feedback and personalized instruction that 
                adapts to your learning style.
              </p>
              <p>
                Join our community of learners and educators working together to create a more inclusive world 
                through the power of visual communication.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">🤟</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                AI Learning Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}