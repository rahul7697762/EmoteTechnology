import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart3, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const COOKIE_KEY = 'emote_cookie_consent';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,   // always on
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (!stored) {
            // Show after 3 seconds
            const timer = setTimeout(() => setVisible(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const saveConsent = (prefs) => {
        localStorage.setItem(COOKIE_KEY, JSON.stringify({
            ...prefs,
            timestamp: new Date().toISOString(),
        }));
        setVisible(false);
    };

    const handleAcceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const handleRejectAll = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
    };

    const togglePref = (key) => {
        if (key === 'necessary') return; // can't toggle necessary
        setPreferences(p => ({ ...p, [key]: !p[key] }));
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop blur overlay */}
                    <motion.div
                        key="cookie-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[200] pointer-events-none"
                        style={{ background: 'rgba(10,12,30,0.18)', backdropFilter: 'blur(1px)' }}
                    />

                    {/* Cookie Banner */}
                    <motion.div
                        key="cookie-banner"
                        initial={{ y: 120, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 120, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-4 left-1/2 z-[201] w-[calc(100%-2rem)] max-w-2xl"
                        style={{ transform: 'translateX(-50%)' }}
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #1A1D2E 0%, #252A41 100%)',
                                border: '1px solid rgba(108,126,245,0.25)',
                                boxShadow: '0 24px 80px rgba(59,79,216,0.25), 0 0 0 1px rgba(108,126,245,0.1)',
                            }}
                        >
                            {/* Decorative gradient top bar */}
                            <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #3B4FD8, #6C7EF5, #F5A623)' }} />

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(108,126,245,0.15)', border: '1px solid rgba(108,126,245,0.25)' }}>
                                            <Cookie size={18} className="text-[#6C7EF5]" />
                                        </div>
                                        <div>
                                            <h3 className="text-[#E8EAF2] font-semibold text-base" style={{ fontFamily: SERIF }}>
                                                We value your privacy
                                            </h3>
                                            <p className="text-[10px] text-[#6C7EF5] tracking-widest uppercase" style={{ fontFamily: MONO }}>
                                                Cookie Preferences
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRejectAll}
                                        className="text-[#8B90B8] hover:text-[#E8EAF2] transition-colors mt-0.5 flex-shrink-0"
                                        aria-label="Close cookie banner"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Description */}
                                <p className="text-[#8B90B8] text-sm leading-relaxed mb-4">
                                    We use cookies to enhance your learning experience, analyse site usage, and assist in our marketing efforts. 
                                    You can choose which cookies to allow.{' '}
                                    <a href="/blog/privacy-policy" className="text-[#6C7EF5] hover:text-[#F5A623] transition-colors underline underline-offset-2">
                                        Learn more
                                    </a>
                                </p>

                                {/* Expandable preferences */}
                                <AnimatePresence>
                                    {expanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden mb-4"
                                        >
                                            <div className="space-y-3 py-2">
                                                {[
                                                    {
                                                        key: 'necessary',
                                                        icon: Shield,
                                                        label: 'Strictly Necessary',
                                                        desc: 'Essential cookies for the website to function. Cannot be disabled.',
                                                        color: '#6C7EF5',
                                                        locked: true,
                                                    },
                                                    {
                                                        key: 'analytics',
                                                        icon: BarChart3,
                                                        label: 'Analytics',
                                                        desc: 'Help us understand how visitors interact with our platform.',
                                                        color: '#F5A623',
                                                        locked: false,
                                                    },
                                                    {
                                                        key: 'marketing',
                                                        icon: Megaphone,
                                                        label: 'Marketing',
                                                        desc: 'Used to track visitors across websites and show relevant ads.',
                                                        color: '#2DC653',
                                                        locked: false,
                                                    },
                                                ].map(({ key, icon: Icon, label, desc, color, locked }) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center gap-4 p-3 rounded-xl"
                                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(108,126,245,0.12)' }}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                                                            <Icon size={14} style={{ color }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[#E8EAF2] text-sm font-medium">{label}</p>
                                                            <p className="text-[#8B90B8] text-xs leading-snug">{desc}</p>
                                                        </div>
                                                        {/* Toggle */}
                                                        <button
                                                            onClick={() => togglePref(key)}
                                                            disabled={locked}
                                                            className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                                                                preferences[key]
                                                                    ? 'bg-[#3B4FD8]'
                                                                    : 'bg-[#373C57]'
                                                            } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                                                            aria-checked={preferences[key]}
                                                            role="switch"
                                                        >
                                                            <span
                                                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                                                                    preferences[key] ? 'left-[1.4rem]' : 'left-0.5'
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => setExpanded(e => !e)}
                                        className="flex items-center gap-1.5 text-xs text-[#8B90B8] hover:text-[#E8EAF2] transition-colors"
                                        style={{ fontFamily: MONO }}
                                    >
                                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                        {expanded ? 'Hide options' : 'Manage preferences'}
                                    </button>

                                    <div className="flex-1" />

                                    {expanded && (
                                        <button
                                            onClick={handleSavePreferences}
                                            className="px-4 py-2 text-sm font-medium text-[#E8EAF2] transition-colors rounded-lg"
                                            style={{ background: 'rgba(108,126,245,0.18)', border: '1px solid rgba(108,126,245,0.3)' }}
                                        >
                                            Save preferences
                                        </button>
                                    )}

                                    <button
                                        onClick={handleRejectAll}
                                        className="px-4 py-2 text-sm font-medium text-[#8B90B8] hover:text-[#E8EAF2] transition-colors rounded-lg"
                                        style={{ border: '1px solid rgba(139,144,184,0.2)' }}
                                    >
                                        Reject all
                                    </button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAcceptAll}
                                        className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-all"
                                        style={{ background: 'linear-gradient(135deg, #3B4FD8, #6C7EF5)', boxShadow: '0 4px 14px rgba(59,79,216,0.4)' }}
                                    >
                                        Accept all
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
