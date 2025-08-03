import {
  Archive,
  Check,
  Clipboard,
  Eye,
  EyeOff,
  FileText,
  Image,
  Link,
  LogOut,
  Settings,
  Share2,
  User,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
function CTA() {
  return (
    <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
      <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl md:text-4xl font-bold mb-6'>
          Ready to Transform Your Workflow?
        </h2>
        <p className='text-xl mb-8 opacity-90'>
          Join thousands of users who have simplified their cross-device
          experience with ClipSync
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button className='bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg'>
            Start Free Trial
          </button>
          <button className='border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all font-semibold text-lg'>
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id='pricing' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-800 mb-4'>
            Simple, Transparent Pricing
          </h2>
          <p className='text-xl text-slate-600'>
            Choose the plan that fits your needs
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {/* Free Plan */}
          <div className='bg-slate-50 rounded-2xl p-8 border border-slate-200'>
            <h3 className='text-2xl font-bold text-slate-800 mb-2'>Free</h3>
            <p className='text-slate-600 mb-6'>Perfect for getting started</p>
            <div className='text-4xl font-bold text-slate-800 mb-8'>
              $0{" "}
              <span className='text-lg font-normal text-slate-600'>/month</span>
            </div>

            <ul className='space-y-4 mb-8'>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span className='text-slate-700'>5 clipboards</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span className='text-slate-700'>100MB storage</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span className='text-slate-700'>Basic sharing</span>
              </li>
              <li className='flex items-center space-x-3 text-slate-400'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Advanced security</span>
              </li>
              <li className='flex items-center space-x-3 text-slate-400'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Unlimited devices</span>
              </li>
            </ul>

            <button className='w-full py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-semibold'>
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className='bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 transform scale-105 relative'>
            <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
              <span className='bg-yellow-400 text-slate-800 px-4 py-1 rounded-full text-sm font-bold'>
                MOST POPULAR
              </span>
            </div>
            <h3 className='text-2xl font-bold mb-2'>Pro</h3>
            <p className='opacity-90 mb-6'>For professionals and teams</p>
            <div className='text-4xl font-bold mb-8'>
              $9 <span className='text-lg font-normal opacity-90'>/month</span>
            </div>

            <ul className='space-y-4 mb-8'>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5' />
                <span>Unlimited clipboards</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5' />
                <span>10GB storage</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5' />
                <span>Password protection</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5' />
                <span>Advanced sharing controls</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5' />
                <span>Unlimited devices</span>
              </li>
            </ul>

            <button className='w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-slate-100 transition-colors font-semibold'>
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className='bg-slate-50 rounded-2xl p-8 border border-slate-200'>
            <h3 className='text-2xl font-bold text-slate-800 mb-2'>
              Enterprise
            </h3>
            <p className='text-slate-600 mb-6'>
              For large teams and organizations
            </p>
            <div className='text-4xl font-bold text-slate-800 mb-8'>
              Custom{" "}
              <span className='text-lg font-normal text-slate-600'>/month</span>
            </div>

            <ul className='space-y-4 mb-8'>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span>Everything in Pro</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span>Unlimited storage</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span>Team management</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span>SSO integration</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Check className='w-5 h-5 text-green-600' />
                <span>Dedicated support</span>
              </li>
            </ul>

            <button className='w-full py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-semibold'>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className='py-20 bg-slate-800 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Bank-Level Security
            </h2>
            <p className='text-xl text-slate-300 mb-8 leading-relaxed'>
              Your data's security is our top priority. ClipSync uses end-to-end
              encryption and advanced security protocols to keep your
              information safe.
            </p>

            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold mb-2'>
                    End-to-End Encryption
                  </h4>
                  <p className='text-slate-300'>
                    All content is encrypted before it leaves your device and
                    only decrypted when you access it.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold mb-2'>
                    Password Protection
                  </h4>
                  <p className='text-slate-300'>
                    Add an extra layer of security with password-protected
                    clipboards that only authorized users can access.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <Check className='w-5 h-5' />
                </div>
                <div>
                  <h4 className='text-lg font-semibold mb-2'>
                    Zero-Knowledge Architecture
                  </h4>
                  <p className='text-slate-300'>
                    We never have access to your unencrypted content. Your data
                    remains private and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-slate-700 rounded-2xl p-8'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-slate-600 rounded-lg'>
                <span className='text-slate-200'>Personal Notes</span>
                <span className='text-green-400 text-sm'>Encrypted</span>
              </div>
              <div className='flex items-center justify-between p-4 bg-slate-600 rounded-lg'>
                <span className='text-slate-200'>Work Documents</span>
                <span className='text-green-400 text-sm'>Encrypted</span>
              </div>
              <div className='flex items-center justify-between p-4 bg-slate-600 rounded-lg'>
                <span className='text-slate-200'>Project Files</span>
                <span className='text-green-400 text-sm'>Encrypted</span>
              </div>
              <div className='flex items-center justify-between p-4 bg-slate-600 rounded-lg'>
                <span className='text-slate-200'>Private Links</span>
                <span className='text-green-400 text-sm'>Encrypted</span>
              </div>
            </div>
            <div className='mt-6 p-4 bg-blue-600 rounded-lg text-center'>
              <p className='font-semibold'>
                All data secured with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks(props: { useCases: string[] }) {
  return (
    <section
      id='how-it-works'
      className='py-20 bg-gradient-to-br from-slate-50 to-slate-100'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-800 mb-4'>
            How ClipSync Works
          </h2>
          <p className='text-xl text-slate-600 max-w-3xl mx-auto'>
            Three simple steps to revolutionize your cross-device workflow
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6'>
              1
            </div>
            <h3 className='text-2xl font-semibold text-slate-800 mb-4'>
              Upload Content
            </h3>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Add text, images, links, or files from any device. Our intuitive
              interface makes uploading effortless.
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6'>
              2
            </div>
            <h3 className='text-2xl font-semibold text-slate-800 mb-4'>
              Generate Link
            </h3>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Instantly create a secure, shareable link that gives you access to
              your content from anywhere.
            </p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6'>
              3
            </div>
            <h3 className='text-2xl font-semibold text-slate-800 mb-4'>
              Access Anywhere
            </h3>
            <p className='text-slate-600 text-lg leading-relaxed'>
              Open your link on any device to access your content. No more
              emailing files to yourself!
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className='mt-20 bg-white rounded-2xl p-8 shadow-lg'>
          <h3 className='text-2xl font-semibold text-slate-800 mb-8 text-center'>
            Perfect For
          </h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {props.useCases.map((useCase, index) => (
              <div
                key={index}
                className='flex items-center space-x-3 p-4 bg-slate-50 rounded-lg'
              >
                <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                <span className='text-slate-700'>{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features(props: {
  features: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }[];
}) {
  return (
    <section id='features' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-slate-800 mb-4'>
            Powerful Features
          </h2>
          <p className='text-xl text-slate-600 max-w-3xl mx-auto'>
            Everything you need to streamline your workflow and collaborate
            seamlessly across devices
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {props.features.map((feature, index) => (
            <div
              key={index}
              className='bg-slate-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105'
            >
              {/* <feature.icon className='w-12 h-12 text-blue-600 mb-6' /> */}
              <h3 className='text-xl font-semibold text-slate-800 mb-4'>
                {feature.title}
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero(props: {
  copied: boolean;
  isPasswordProtected: boolean;
  setIsPasswordProtected: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  handleCopy: () => void;
}) {
  return (
    <section className='pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 '>
      <div className='max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h1 className='text-4xl md:text-6xl font-bold text-slate-800 leading-tight '>
                Centralized
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  {" "}
                  Clipboard
                </span>
                <br />
                Anywhere, Anytime
              </h1>
              <p className='text-xl text-slate-600 leading-relaxed'>
                Upload content from one device and access it from anywhere with
                just a link. The ultimate solution for seamless cross-device
                collaboration.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button className='bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg'>
                Start Free Trial
              </button>
              <button className='border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg'>
                Watch Demo
              </button>
            </div>

            <div className='flex items-center space-x-6 pt-4'>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='w-10 h-10 bg-slate-300 rounded-full border-2 border-white'
                  ></div>
                ))}
              </div>
              <div>
                <p className='font-semibold text-slate-800'>
                  Trusted by 10,000+ users
                </p>
                <p className='text-sm text-slate-600'>Across 50+ countries</p>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='bg-white rounded-2xl shadow-2xl p-8 border border-slate-200'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-semibold text-slate-800'>
                  Create New Clipboard
                </h3>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() =>
                      props.setIsPasswordProtected(!props.isPasswordProtected)
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      props.isPasswordProtected
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {props.isPasswordProtected ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>

              {props.isPasswordProtected && (
                <div className='mb-6'>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Password
                  </label>
                  <input
                    type='password'
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter password'
                  />
                </div>
              )}

              <div className='space-y-4 mb-6'>
                <button className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'>
                  <FileText className='w-5 h-5 text-slate-600' />
                  <span className='text-slate-700'>Add Text</span>
                </button>
                <button className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'>
                  <Image className='w-5 h-5 text-slate-600' />
                  <span className='text-slate-700'>Upload Image</span>
                </button>
                <button className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'>
                  <Link className='w-5 h-5 text-slate-600' />
                  <span className='text-slate-700'>Add Link</span>
                </button>
                <button className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'>
                  <Archive className='w-5 h-5 text-slate-600' />
                  <span className='text-slate-700'>Upload ZIP</span>
                </button>
              </div>

              <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold'>
                Create Clipboard
              </button>

              <div className='mt-6 p-4 bg-slate-50 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-slate-700'>
                    Shareable Link:
                  </span>
                  <button
                    onClick={props.handleCopy}
                    className='flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium'
                  >
                    {props.copied ? (
                      <>
                        <Check className='w-4 h-4' />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className='w-4 h-4' />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className='text-sm text-slate-500 mt-1 truncate'>
                  clipsync.io/share/abc123xyz
                </p>
              </div>
            </div>

            {/* Floating elements */}
            <div className='absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-full opacity-50 animate-pulse'></div>
            <div className='absolute -bottom-4 -left-4 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-pulse delay-1000'></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavBar(props: {
  setIsOpen: (open: boolean) => void;
  isLogged: boolean;
  user: any;
  router: any;
}) {
  return (
    <nav className='bg-white backdrop-blur-md border-b border-slate-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <Clipboard className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold text-slate-800'>ClipSync</span>
          </div>
          <div className='hidden md:flex space-x-8'>
            <a
              href='#features'
              className='text-slate-600 hover:text-blue-600 transition-colors'
            >
              Features
            </a>
            <a
              href='#how-it-works'
              className='text-slate-600 hover:text-blue-600 transition-colors'
            >
              How It Works
            </a>
            <a
              href='#pricing'
              className='text-slate-600 hover:text-blue-600 transition-colors'
            >
              Pricing
            </a>
            <a
              href='#contact'
              className='text-slate-600 hover:text-blue-600 transition-colors'
            >
              Contact
            </a>
          </div>
          <div className='flex items-center space-x-4'>
            {props.isLogged ? (
              <div className='flex items-center space-x-2 gap-4'>
                <Button
                  onClick={() => {
                    props.router.push("/dashboard");
                  }}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
                >
                  Dashboard
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <User className='w-6 h-6 text-slate-600' />
                  </PopoverTrigger>
                  <PopoverContent className='w-44 mr-28 p-2'>
                    <div className='flex flex-col space-y-2 '>
                      <Button
                        variant='outline'
                        onClick={() => {
                          props.router.push("/dashboard");
                        }}
                        className='flex justify-between items-center'
                        // className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
                      >
                        <Settings size={16} />
                        Profile
                      </Button>
                      <Button
                        variant='outline'
                        className='flex items-center justify-between  bg-transparent hover:bg-white/10 text-red-500 hover:border-red-500 hover:text-red-500'
                        // onClick={() => {
                        //   props.setIsOpen(true);
                        // }}
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                onClick={() => {
                  props.setIsOpen(true);
                }}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer id='contact' className='bg-slate-800 text-white py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-8'>
          <div className='md:col-span-2'>
            <div className='flex items-center space-x-2 mb-6'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <Clipboard className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold'>ClipSync</span>
            </div>
            <p className='text-slate-300 mb-6 leading-relaxed'>
              The ultimate centralized clipboard solution that lets you upload
              content from one device and access it from anywhere with just a
              link.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
                </svg>
              </a>
              <a
                href='#'
                className='w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-6'>Product</h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-lg font-semibold mb-6'>Company</h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-slate-300 hover:text-white transition-colors'
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-slate-400'>
            © 2024 ClipSync. All rights reserved.
          </p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <a
              href='#'
              className='text-slate-400 hover:text-white transition-colors text-sm'
            >
              Privacy Policy
            </a>
            <a
              href='#'
              className='text-slate-400 hover:text-white transition-colors text-sm'
            >
              Terms of Service
            </a>
            <a
              href='#'
              className='text-slate-400 hover:text-white transition-colors text-sm'
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { CTA, Features, Footer, Hero, HowItWorks, NavBar, Pricing, Security };
