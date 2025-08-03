"use client";
import React, { useState, useEffect } from "react";
import {
  Clipboard,
  Upload,
  Link as LinkIcon,
  Image,
  File,
  Lock,
  Unlock,
  Moon,
  Sun,
  Check,
  X,
  Plus,
  Share2,
  Copy,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark") ?? false
  );
  const [activeTab, setActiveTab] = useState("text");
  const [clipboardItems, setClipboardItems] = useState([
    {
      id: 1,
      title: "Project Ideas",
      type: "text",
      content: "1. Build a new app\n2. Learn React\n3. Create a website",
      link: "clipshare.io/abc123",
      locked: false,
      createdAt: "2023-11-15",
    },
    {
      id: 2,
      title: "Vacation Photos",
      type: "image",
      content: "https://placehold.co/300x200",
      link: "clipshare.io/def456",
      locked: true,
      createdAt: "2023-11-14",
    },
    {
      id: 3,
      title: "Resources",
      type: "link",
      content: "https://example.com, https://docs.google.com",
      link: "clipshare.io/ghi789",
      locked: false,
      createdAt: "2023-11-13",
    },
  ]);
  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    type: "text",
    locked: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const nextTheme = useTheme();

  useEffect(() => {
    console.log("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
      nextTheme.setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      nextTheme.setTheme("light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // document.body.classList.toggle("dark");
  };

  const handleCreateClipboard = () => {
    if (newItem.title.trim() === "") return;

    const newItemObj = {
      id: clipboardItems.length + 1,
      title: newItem.title,
      type: activeTab,
      content:
        activeTab === "image"
          ? "https://placehold.co/300x200"
          : newItem.content,
      link: `clipshare.io/${Math.random().toString(36).substr(2, 6)}`,
      locked: newItem.locked,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClipboardItems([newItemObj, ...clipboardItems]);
    setNewItem({ title: "", content: "", type: "text", locked: false });
    setShowModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "text", label: "Text", icon: Clipboard },
    { id: "link", label: "Link", icon: LinkIcon },
    { id: "image", label: "Image", icon: Image },
    { id: "file", label: "File", icon: File },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
      {/* Navigation */}
      <nav className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <Clipboard className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='ml-3'>
                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                  ClipShare
                </h1>
              </div>
            </div>
            <div className='hidden md:flex items-center space-x-8'>
              <a
                href='#features'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
              >
                Features
              </a>
              <a
                href='#how-it-works'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
              >
                How It Works
              </a>
              <a
                href='#pricing'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
              >
                Pricing
              </a>
              <a
                href='#faq'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
              >
                FAQ
              </a>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                onClick={toggleTheme}
                className='p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              >
                {darkMode ? (
                  <Sun className='h-5 w-5' />
                ) : (
                  <Moon className='h-5 w-5' />
                )}
              </button>
              <button className='hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md'>
                Sign In
              </button>
              <button
                onClick={() => setShowModal(true)}
                className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md'
              >
                <Plus className='h-4 w-4 mr-2' />
                New Clipboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28'>
        <div className='absolute inset-0 -z-10'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl'></div>
          <div className='absolute top-1/4 right-1/4 transform translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl'></div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
            <div className='lg:col-span-6'>
              <div className='mx-auto max-w-2xl'>
                <div className='text-center lg:text-left'>
                  <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl'>
                    <span className='block'>Centralized Clipboard for</span>
                    <span className='block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                      All Your Devices
                    </span>
                  </h1>
                  <p className='mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0'>
                    Upload text, images, links, and files from one device and
                    access them anywhere with a secure link. Share instantly
                    across all your devices with ClipShare.
                  </p>
                  <div className='mt-10 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4'>
                    <button
                      onClick={() => setShowModal(true)}
                      className='inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 shadow-lg'
                    >
                      Start Free
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </button>
                    <a
                      href='#how-it-works'
                      className='inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-base font-semibold rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all'
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-12 lg:mt-0 lg:col-span-6'>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300'>
                <div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6'>
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      Your Clipboards
                    </h3>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Online
                      </span>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    {clipboardItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className='bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            {item.type === "text" && (
                              <Clipboard className='h-4 w-4 text-blue-500 mr-2' />
                            )}
                            {item.type === "image" && (
                              <Image className='h-4 w-4 text-green-500 mr-2' />
                            )}
                            {item.type === "link" && (
                              <LinkIcon className='h-4 w-4 text-purple-500 mr-2' />
                            )}
                            {item.type === "file" && (
                              <File className='h-4 w-4 text-orange-500 mr-2' />
                            )}
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {item.title}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            {item.locked ? (
                              <Lock className='h-3 w-3 text-red-500' />
                            ) : (
                              <Unlock className='h-3 w-3 text-green-500' />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-600'>
                    <button
                      onClick={() => setShowModal(true)}
                      className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      New Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Everything You Need in One Place
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              ClipShare combines powerful features to make cross-device sharing
              seamless and secure.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700'>
              <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6'>
                <Zap className='h-6 w-6 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Instant Access Anywhere
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Start from any device and your content is instantly available
                everywhere. No more emailing files to yourself or using multiple
                cloud services.
              </p>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    Real-time synchronization
                  </span>
                </li>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    Cross-platform compatibility
                  </span>
                </li>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    No installation required
                  </span>
                </li>
              </ul>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700'>
              <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6'>
                <Upload className='h-6 w-6 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Support All Content Types
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Whether it's text snippets, important links, images, or
                compressed files, ClipShare handles all your sharing needs in
                one place.
              </p>
              <div className='grid grid-cols-2 gap-3'>
                <div className='flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg'>
                  <Clipboard className='h-4 w-4 text-blue-500 mr-2' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Text
                  </span>
                </div>
                <div className='flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg'>
                  <LinkIcon className='h-4 w-4 text-purple-500 mr-2' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Links
                  </span>
                </div>
                <div className='flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg'>
                  <Image className='h-4 w-4 text-green-500 mr-2' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Images
                  </span>
                </div>
                <div className='flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg'>
                  <File className='h-4 w-4 text-orange-500 mr-2' />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Files
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6'>
                <Shield className='h-6 w-6 text-white' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Enterprise-Grade Security
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-6'>
                Your data is protected with end-to-end encryption and optional
                password protection. We never store your content longer than
                necessary.
              </p>
              <ul className='space-y-3'>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    End-to-end encryption
                  </span>
                </li>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    Password protection
                  </span>
                </li>
                <li className='flex items-center'>
                  <Check className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    Auto-expire options
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id='how-it-works'
        className='py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              How ClipShare Works
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              Sharing across devices has never been this simple. Just three easy
              steps to get started.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                  1
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Create
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Upload your text, images, links, or files from any device. Give
                it a name and optional password protection.
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <div className='w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                  2
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Generate
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                ClipShare creates a unique, secure link for your content. Copy
                it or share it directly with anyone.
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold'>
                  3
                </div>
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Access
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Open the link from any device to access your content. No login
                required for recipients.
              </p>
            </div>
          </div>

          <div className='mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden'>
            <div className='px-6 py-8 sm:p-8'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Try it now
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mt-2'>
                  Create your first clipboard in seconds
                </p>
              </div>
              <div className='max-w-md mx-auto'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-6'>
                  <div className='flex items-center mb-4'>
                    <div className='w-3 h-3 bg-red-500 rounded-full mr-2'></div>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full mr-2'></div>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg'>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        Project Ideas
                      </span>
                      <div className='flex items-center space-x-2'>
                        <Lock className='h-4 w-4 text-gray-400' />
                        <Copy className='h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200' />
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg'>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        Meeting Notes
                      </span>
                      <div className='flex items-center space-x-2'>
                        <Unlock className='h-4 w-4 text-gray-400' />
                        <Copy className='h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200' />
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg'>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        Resources
                      </span>
                      <div className='flex items-center space-x-2'>
                        <Unlock className='h-4 w-4 text-gray-400' />
                        <Copy className='h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200' />
                      </div>
                    </div>
                  </div>
                  <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-600'>
                    <button
                      onClick={() => setShowModal(true)}
                      className='w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md'
                    >
                      <Plus className='h-5 w-5 mr-2' />
                      Create Your First Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='py-20 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Simple, Transparent Pricing
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              Choose the plan that works best for your needs. All plans include
              our core features.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            {/* Free Plan */}
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700'>
              <div className='text-center'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Free
                </h3>
                <div className='mt-4 flex items-baseline justify-center'>
                  <span className='text-5xl font-extrabold text-gray-900 dark:text-white'>
                    $0
                  </span>
                  <span className='ml-1 text-xl font-medium text-gray-500 dark:text-gray-400'>
                    /month
                  </span>
                </div>
                <p className='mt-2 text-gray-600 dark:text-gray-300'>
                  Perfect for getting started
                </p>
              </div>
              <div className='mt-8'>
                <ul className='space-y-4'>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      5 clipboards
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      100MB storage
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      Basic sharing
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      7-day history
                    </span>
                  </li>
                </ul>
                <div className='mt-8'>
                  <button className='w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className='bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative transform scale-105 z-10 shadow-xl'>
              <div className='absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg'>
                POPULAR
              </div>
              <div className='text-center'>
                <h3 className='text-2xl font-bold'>Pro</h3>
                <div className='mt-4 flex items-baseline justify-center'>
                  <span className='text-5xl font-extrabold'>$9</span>
                  <span className='ml-1 text-xl font-medium text-blue-100'>
                    /month
                  </span>
                </div>
                <p className='mt-2 text-blue-100'>
                  For professionals and teams
                </p>
              </div>
              <div className='mt-8'>
                <ul className='space-y-4'>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-white mr-3' />
                    <span>Unlimited clipboards</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-white mr-3' />
                    <span>10GB storage</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-white mr-3' />
                    <span>Password protection</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-white mr-3' />
                    <span>30-day history</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-white mr-3' />
                    <span>Team sharing</span>
                  </li>
                </ul>
                <div className='mt-8'>
                  <button className='w-full px-6 py-3 bg-white text-blue-600 rounded-lg text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
                    Start 14-day Free Trial
                  </button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700'>
              <div className='text-center'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Enterprise
                </h3>
                <div className='mt-4 flex items-baseline justify-center'>
                  <span className='text-5xl font-extrabold text-gray-900 dark:text-white'>
                    $29
                  </span>
                  <span className='ml-1 text-xl font-medium text-gray-500 dark:text-gray-400'>
                    /user/month
                  </span>
                </div>
                <p className='mt-2 text-gray-600 dark:text-gray-300'>
                  For large teams and organizations
                </p>
              </div>
              <div className='mt-8'>
                <ul className='space-y-4'>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span>Unlimited everything</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span>Custom storage</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span>Advanced security</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span>Unlimited history</span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-5 w-5 text-green-500 mr-3' />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <div className='mt-8'>
                  <button className='w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Loved by Teams Worldwide
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              Join thousands of professionals who trust ClipShare for their
              cross-device sharing needs.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg'>
              <div className='flex items-center mb-6'>
                <div className='flex-shrink-0'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>SJ</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Sarah Johnson
                  </h4>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Product Manager, TechCorp
                  </p>
                </div>
              </div>
              <p className='text-gray-600 dark:text-gray-300 italic'>
                "ClipShare has transformed how our team shares information. No
                more lost files or broken links. Everything is just one click
                away."
              </p>
              <div className='mt-4 flex text-yellow-400'>
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg'>
              <div className='flex items-center mb-6'>
                <div className='flex-shrink-0'>
                  <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>MD</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Michael Davis
                  </h4>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Designer, CreativeStudio
                  </p>
                </div>
              </div>
              <p className='text-gray-600 dark:text-gray-300 italic'>
                "As a designer, I'm constantly switching between devices.
                ClipShare makes it effortless to access my assets wherever I
                am."
              </p>
              <div className='mt-4 flex text-yellow-400'>
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg'>
              <div className='flex items-center mb-6'>
                <div className='flex-shrink-0'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold'>AJ</span>
                  </div>
                </div>
                <div className='ml-4'>
                  <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Alex Johnson
                  </h4>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Developer, StartupXYZ
                  </p>
                </div>
              </div>
              <p className='text-gray-600 dark:text-gray-300 italic'>
                "The API integration with our existing tools was seamless.
                ClipShare has become an essential part of our development
                workflow."
              </p>
              <div className='mt-4 flex text-yellow-400'>
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
                <Star className='h-5 w-5' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-6'>
            Ready to Simplify Your Workflow?
          </h2>
          <p className='text-xl text-blue-100 mb-10 max-w-3xl mx-auto'>
            Join thousands of professionals who have already made the switch to
            ClipShare. Start your free trial today and experience seamless
            cross-device sharing.
          </p>
          <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'>
            <button
              onClick={() => setShowModal(true)}
              className='inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-full text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105 shadow-lg'
            >
              Start Free Trial
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
            <a
              href='#how-it-works'
              className='inline-flex items-center px-8 py-4 border border-white text-base font-semibold rounded-full text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all'
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id='faq' className='py-20 bg-white dark:bg-gray-900'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300'>
              Everything you need to know about ClipShare.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                How secure is ClipShare?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                ClipShare uses end-to-end encryption to protect your data. Your
                content is encrypted before it leaves your device and can only
                be decrypted by the intended recipient. We never store your
                encryption keys on our servers.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                Is there a file size limit?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Yes, the free plan has a 100MB limit per file. Pro and
                Enterprise plans allow up to 2GB per file. For larger files, we
                recommend using our chunked upload feature which breaks large
                files into smaller pieces for reliable transfer.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                How long are my files stored?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Files are stored according to your plan: 7 days for Free, 30
                days for Pro, and indefinitely for Enterprise (unless you set an
                expiration). You can also set custom expiration dates for
                individual clipboards.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                Can I use ClipShare offline?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                While you need an internet connection to upload and share files,
                our Progressive Web App (PWA) allows you to access recently
                viewed clipboards offline. Any changes will sync when you're
                back online.
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                Do you offer team plans?
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Yes! Our Pro and Enterprise plans include team features like
                shared workspaces, user management, and admin controls. You can
                easily invite team members and control their access levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1 md:col-span-2'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                    <Clipboard className='h-6 w-6 text-white' />
                  </div>
                </div>
                <div className='ml-3'>
                  <h3 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text'>
                    ClipShare
                  </h3>
                </div>
              </div>
              <p className='mt-4 text-gray-600 dark:text-gray-300 max-w-md'>
                The easiest way to share content across all your devices. No
                more emailing files to yourself or using multiple cloud
                services.
              </p>
              <div className='mt-6 flex space-x-6'>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                >
                  <span className='sr-only'>Twitter</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                >
                  <span className='sr-only'>GitHub</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                >
                  <span className='sr-only'>LinkedIn</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider'>
                Product
              </h3>
              <ul className='mt-4 space-y-4'>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider'>
                Support
              </h3>
              <ul className='mt-4 space-y-4'>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-base text-gray-600 dark:text-gray-400 text-center'>
              © 2023 ClipShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Create Clipboard Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-fade-in'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Create New Clipboard
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Title
              </label>
              <input
                type='text'
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                placeholder='Enter clipboard title'
              />
            </div>

            <div className='mb-6'>
              <div className='border-b border-gray-200 dark:border-gray-700'>
                <nav className='flex -mb-px'>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      <tab.icon className='h-4 w-4 mr-1' />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {activeTab === "text" && (
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Content
                </label>
                <textarea
                  value={newItem.content}
                  onChange={(e) =>
                    setNewItem({ ...newItem, content: e.target.value })
                  }
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder='Enter your text here...'
                />
              </div>
            )}

            {activeTab === "link" && (
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  URLs (one per line)
                </label>
                <textarea
                  value={newItem.content}
                  onChange={(e) =>
                    setNewItem({ ...newItem, content: e.target.value })
                  }
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder='https://example.com&#10;https://another-example.com'
                />
              </div>
            )}

            {activeTab === "image" && (
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Image URL
                </label>
                <input
                  type='text'
                  value={newItem.content}
                  onChange={(e) =>
                    setNewItem({ ...newItem, content: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  placeholder='https://example.com/image.jpg'
                />
              </div>
            )}

            {activeTab === "file" && (
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  File Upload
                </label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'>
                  <div className='space-y-1 text-center'>
                    <Upload className='mx-auto h-12 w-12 text-gray-400' />
                    <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                      <label className='relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none'>
                        <span>Upload a file</span>
                        <input type='file' className='sr-only' />
                      </label>
                      <p className='pl-1'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      ZIP, PDF, DOC up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className='flex items-center mb-6'>
              <input
                id='locked'
                type='checkbox'
                checked={newItem.locked}
                onChange={(e) =>
                  setNewItem({ ...newItem, locked: e.target.checked })
                }
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='locked'
                className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
              >
                <div className='flex items-center'>
                  <Lock className='h-4 w-4 mr-1' />
                  Password protect this clipboard
                </div>
              </label>
            </div>

            <div className='flex justify-end space-x-3'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClipboard}
                disabled={!newItem.title.trim()}
                className='px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Create Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Star icon for testimonials
const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill='currentColor' viewBox='0 0 20 20'>
    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
  </svg>
);

export default App;
