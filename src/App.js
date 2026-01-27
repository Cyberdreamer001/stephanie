import React, { useState, useEffect, useRef } from 'react';
import { Heart, Copy, Check, Send, Sparkles } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [recipientName, setRecipientName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [messageStep, setMessageStep] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [yesAccepted, setYesAccepted] = useState(false);
  const galleryImages = [
    'photo1.jpeg',
    'photo2.jpeg',
    'photo3.jpeg',
    'photo4.jpeg'
  ];

  // Get name from URL hash for message page
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const nameFromUrl = decodeURIComponent(hash.substring(1));
      setRecipientName(nameFromUrl);
      setCurrentPage('message');
      setTimeout(() => setShowCard(true), 100);
    }
  }, []);

  const messages = [
    { emoji: '✨', text: 'Your smile lights up my world' },
    { emoji: '🌟', text: 'Every moment with you is magical' },
    { emoji: '❤️', text: "You're the missing piece to my heart" },
    { emoji: '💝', text: 'My heart beats only for you' },
    { emoji: '🌹', text: 'You make every day feel like a dream' }
  ];

  const generateLink = () => {
    if (recipientName.trim()) {
      const link = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(recipientName.trim())}`;
      setGeneratedLink(link);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextMessage = () => {
    if (messageStep < messages.length) {
      setMessageStep(messageStep + 1);
    }
  };

  const resetAndGoHome = () => {
    setCurrentPage('home');
    setRecipientName('');
    setGeneratedLink('');
    setMessageStep(0);
    setShowCard(false);
    window.location.hash = '';
  };

  const moveNoButton = () => {
    const container = containerRef.current;
    const btn = noBtnRef.current;
    if (!container || !btn) return;
    const bounds = container.getBoundingClientRect();
    const btnWidth = btn.offsetWidth || 80;
    const btnHeight = btn.offsetHeight || 40;
    const padding = 8;
    const maxX = bounds.width - btnWidth - padding;
    const maxY = bounds.height - btnHeight - padding;
    const x = Math.max(padding, Math.random() * maxX);
    const y = Math.max(padding, Math.random() * maxY);
    setNoPos({ x, y });
  };

  const playYesSound = () => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      let ctx = audioCtxRef.current;
      if (!ctx) {
        ctx = new AC();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.6, now + 0.03);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      master.connect(ctx.destination);
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        const g = ctx.createGain();
        const start = now + i * 0.06;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.5, start + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
        osc.frequency.setValueAtTime(f, start);
        osc.connect(g);
        g.connect(master);
        osc.start(start);
        osc.stop(start + 0.5);
      });
      const ping = ctx.createOscillator();
      ping.type = 'sine';
      const pg = ctx.createGain();
      pg.gain.setValueAtTime(0.0001, now + 0.2);
      pg.gain.exponentialRampToValueAtTime(0.6, now + 0.25);
      pg.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      ping.frequency.setValueAtTime(1200, now + 0.2);
      ping.connect(pg);
      pg.connect(master);
      ping.start(now + 0.2);
      ping.stop(now + 0.6);
    } catch (_) {}
  };

  const onYes = () => {
    setYesAccepted(true);
    playYesSound();
  };

  // Floating hearts animation
  const FloatingHearts = () => {
    const hearts = Array.from({ length: 24 }, (_, i) => i);
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((i) => (
          <div
            key={i}
            className="absolute opacity-25 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
              fontSize: `${18 + Math.random() * 18}px`
            }}
          >
            ❤️
          </div>
        ))}
      </div>
    );
  };

  // Home Page
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4">
        <FloatingHearts />
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
              <Heart className="w-12 h-12 text-red-500 fill-current" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-2"> Valentine Love Message Generator</h1>
            <p className="text-gray-600">Create a personalized message link for someone special</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient's Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter their name..."
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-red-400 focus:outline-none transition"
              />
            </div>

            <button
              onClick={generateLink}
              disabled={!recipientName.trim()}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Generate Link
            </button>

            {generatedLink && (
              <div className="mt-6 p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Share this link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-pink-200 rounded text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              How it works:
            </h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Enter the recipient's name</li>
              <li>Click "Generate Link" to create a unique message page</li>
              <li>Copy and share the link with them</li>
              <li>They'll see beautiful animated messages just for them!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Message Display Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      <div 
        className={`bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 ${yesAccepted ? 'max-w-2xl' : 'max-w-md'} w-full text-center relative z-10 transition-all duration-700 ${
          showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {!yesAccepted && (
          <button
            onClick={resetAndGoHome}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition"
          >
            ← Back
          </button>
        )}

        {!yesAccepted && (
          <div className="absolute -top-6 -right-6 text-6xl animate-bounce">
            ❤️
          </div>
        )}

        <h1 className="text-3xl font-bold text-red-600 mb-8 capitalize">
          My Dear {recipientName}
        </h1>

        {!yesAccepted && (
          <div className="space-y-4 mb-6">
            {messages.slice(0, messageStep).map((msg, index) => (
              <div
                key={index}
                className="flex items-start justify-center space-x-3 animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className="text-3xl">{msg.emoji}</span>
                <p className="text-lg text-gray-700 text-left flex-1">{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        {messageStep < messages.length ? (
          <button
            onClick={nextMessage}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
          >
            {messageStep === 0 ? 'Start' : 'Next'} ❤️
          </button>
        ) : (
          <>
            {!yesAccepted ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-5xl mb-2">💕</div>
                <h2 className="text-2xl font-bold text-red-600">
                  Will You Be My Val?
                </h2>
                <p className="text-gray-600 italic">
                  You mean the world to me! 💖
                </p>
                <div
                  ref={containerRef}
                  className="relative mt-4 mx-auto w-full max-w-sm h-40 sm:h-44 md:h-48 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={onYes}
                    onTouchStart={onYes}
                    className="absolute bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    Yes 💘
                  </button>
                  <button
                    type="button"
                    ref={noBtnRef}
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    className="absolute bg-white border-2 border-pink-300 text-pink-600 font-semibold py-2.5 px-5 rounded-full transition duration-200 shadow"
                    style={{
                      left: noPos.x !== null ? `${noPos.x}px` : '65%',
                      top: noPos.y !== null ? `${noPos.y}px` : '60%'
                    }}
                  >
                    No 🙈
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="absolute -top-6 -right-6 animate-bounce">
                  <img
                    src="/images/mr_valentine.jpg"
                    alt="My Valentine"
                    className="w-20 h-20 rounded-full shadow-lg object-cover border-2 border-white"
                  />
                </div>
                <div className="text-5xl">🎊🎉</div>
                <h2 className="text-2xl font-extrabold text-red-600">
                  OF COURSE IT'S A YES!
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    From the moment I met you, I knew there was something special about you. Your smile brightens my day, and your laughter fills my heart with joy. Every moment we spend together is a memory I cherish, and I can't wait to create many more with you.
                  </p>
                  <p>
                    Thank you for being you: incredible, kind, and beautiful. I am so happy that you are my Valentine.
                  </p>
                </div>
                <div className="text-4xl">❤️</div>
                <h3 className="text-xl font-bold text-red-600">
                  Beautiful  💕
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow">
                      <img
                        src={`/images/${img}`}
                        alt="Memory"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-center text-pink-700 font-medium italic">
                  Forever Yours, My Valentine 💖
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
