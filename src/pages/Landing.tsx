import React from 'react';
import { ArrowRight, BookOpen, Target, Calendar, Award, BarChart2, Users, CheckCircle, Github, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Target className="h-6 w-6 text-indigo-500" />,
      title: "100-Day Challenge",
      description: "Structured preparation plan covering DSA, aptitude, and interview prep"
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      title: "Daily Progress Tracking",
      description: "Monitor your daily tasks and maintain consistency"
    },
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: "Streak System",
      description: "Build momentum with daily completion streaks"
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      title: "Progress Analytics",
      description: "Visual insights into your preparation journey"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Mock Interviews",
      description: "Practice with AI and peer interview simulations"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-rose-500" />,
      title: "Organized Categories",
      description: "Structured learning paths for different topics"
    }
  ];

  const codingProfiles = [
    {
      icon: <Code2 />,
      name: "GeeksforGeeks",
      link: "https://www.geeksforgeeks.org/user/addekarimcov2/",
      color: "text-green-600 hover:text-green-700"
    },
    {
      icon: <Github />,
      name: "LeetCode",
      link: "https://leetcode.com/u/Manikanta11/",
      color: "text-yellow-600 hover:text-yellow-700"
    },
    {
      icon: <Code2 />,
      name: "CodeChef",
      link: "https://www.codechef.com/users/addekarimani",
      color: "text-purple-600 hover:text-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
              <h1 className="ml-3 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                PrepBuddy
              </h1>
            </div>
            <p className="max-w-md mx-auto text-xl text-gray-500 dark:text-gray-300 sm:text-2xl md:max-w-3xl">
              Your ultimate companion for placement preparation. Track progress, maintain consistency, and achieve your career goals.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/auth?mode=signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/auth?mode=signin"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Everything you need to crack placements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coding Profiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Practice Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {codingProfiles.map((profile, index) => (
            <a
              key={index}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
             className={`flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${profile.color}`}
            >
              {profile.icon}
              <span className="ml-2 font-semibold">{profile.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;