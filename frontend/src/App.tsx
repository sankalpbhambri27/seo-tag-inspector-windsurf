import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface SEOItem {
  tag: string;
  status: 'present' | 'missing' | 'warning';
  value: string | null;
}

interface AnalysisResult {
  url: string;
  score: number;
  maxScore: number;
  results: SEOItem[];
  preview: {
    title: string;
    description: string;
    image?: string;
  };
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Toggle dark mode class on body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const analyzeSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/analyze', { url });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze URL');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'missing':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'warning':
        return '⚠';
      case 'missing':
        return '✗';
      default:
        return '?';
    }
  };

  const getTagDisplayName = (tag: string) => {
    const names: Record<string, string> = {
      'title': 'Title',
      'description': 'Description',
      'robots': 'Robots',
      'canonical': 'Canonical URL',
      'og:title': 'OG Title',
      'og:description': 'OG Description',
      'og:image': 'OG Image',
      'og:type': 'OG Type',
      'og:url': 'OG URL',
      'twitter:card': 'Twitter Card',
      'twitter:title': 'Twitter Title',
      'twitter:description': 'Twitter Description',
      'twitter:image': 'Twitter Image'
    };
    return names[tag] || tag;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">SEO Tag Inspector</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 min-h-[60vh]">
        <form onSubmit={analyzeSEO} className="mb-8">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="block w-full px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2.5 bottom-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                  <span>Analyzing</span>
                </>
              ) : (
                <span>Go</span>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* SEO Score Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            className="stroke-gray-200 dark:stroke-gray-700"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            className={`${
                              result.score > 70 ? 'stroke-green-500' : 
                              result.score > 40 ? 'stroke-yellow-500' : 'stroke-red-500'
                            } ${isLoading ? 'animate-pulse' : ''}`}
                            strokeWidth="2.5"
                            strokeDasharray="100"
                            strokeDashoffset={100 - result.score}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                          <text 
                            x="50%" 
                            y="50%" 
                            textAnchor="middle" 
                            dy=".3em"
                            className="text-lg font-bold fill-gray-900 dark:fill-white"
                          >
                            {result.score}
                          </text>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">SEO Score</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {result.score}/100
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {result.score > 70 ? 'Excellent' : result.score > 40 ? 'Good' : 'Needs Work'}
                      </p>
                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            result.score > 70 ? 'bg-green-500' : 
                            result.score > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {result.score > 70 ? 'Great job! Your site has good SEO fundamentals.' :
                      result.score > 40 ? 'Your site has some SEO elements in place but could use improvement.' :
                      'Your site needs significant SEO improvements.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Cards - Side by side on larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Google Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Google Search Preview</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      <p className="text-blue-700 dark:text-blue-400 text-lg font-medium truncate">
                        {result.preview.title || 'Example Title'}
                      </p>
                      <p className="text-green-700 dark:text-green-400 text-sm">
                        {new URL(result.url).protocol}//{new URL(result.url).hostname}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {result.preview.description || 'A description of the page that shows in search results.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Social Media Preview</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {result.preview.image ? (
                        <div className="relative pt-[42.5%] bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                          <img 
                            src={result.preview.image} 
                            alt="Social preview" 
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="relative pt-[42.5%] bg-gray-100 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm absolute inset-0 flex items-center justify-center">No image available</span>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {result.preview.title || 'Your Website Title'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {result.preview.description || 'A brief description of your content.'}
                        </p>
                        <p className="text-gray-400 text-xs mt-1 truncate">
                          {new URL(result.url).hostname}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Tags - Full width below previews */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">SEO Tags Analysis</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                  {result.results.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start gap-3">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {getTagDisplayName(item.tag)}
                          </h4>
                          {item.value ? (
                            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                              {item.value}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                              {item.status === 'missing' 
                                ? 'This tag is missing.' 
                                : item.status === 'warning' 
                                  ? 'This tag has issues.' 
                                  : 'No value found.'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SEO Tag Inspector. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
