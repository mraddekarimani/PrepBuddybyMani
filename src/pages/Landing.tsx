import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Target, Calendar, Award, BarChart2,
  Users, CheckCircle, Github, Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Target className="h-6 w-6 text-indigo-500" />,
      title: "100-Day Challenge",
      description: "Structured plan covering DSA, aptitude, and interview prep"
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      title: "Daily Progress Tracking",
      description: "Monitor tasks and maintain consistency"
    },
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: "Streak System",
      description: "Build momentum with daily completions"
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      title: "Progress Analytics",
      description: "Visual insights into your growth"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Mock Interviews",
      description: "Practice with AI or peer interviews"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-rose-500" />,
      title: "Organized Categories",
      description: "Structured learning for each topic"
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
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="flex justify-center items-center mb-6">
          <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h1 className="ml-3 text-5xl font-extrabold text-gray-900 dark:text-white">
            PrepBuddy
          </h1>
        </div>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your ultimate placement companion. Stay consistent, track your growth, and unlock your dream job!
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/auth?mode=signup"
            className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium flex items-center"
          >
            Get Started <ArrowRight className="ml-2" />
          </motion.a>
          <a
            href="/auth?mode=signin"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium"
          >
            Sign In
          </a>
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="max-w-4xl mx-auto text-center italic text-xl text-gray-600 dark:text-gray-400 px-4 py-4"
      >
        “Success is the sum of small efforts, repeated day in and day out.”
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Everything you need to crack placements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Coding Profiles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Practice Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {codingProfiles.map((profile, index) => (
            <motion.a
              key={index}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ${profile.color}`}
            >
              {profile.icon}
              <span className="ml-3 font-semibold">{profile.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
