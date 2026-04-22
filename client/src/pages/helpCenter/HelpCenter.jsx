import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import SearchBar from '../../components/helpCenter/SearchBar';
import FAQItem from '../../components/helpCenter/FAQItem';
import { faqs, faqCategories } from '../../data/faqs';
import { MessageCircle } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F1120] font-sans">
      <Helmet>
        <title>Help Center | Emote Technology – FAQs & Support</title>
        <meta name="description" content="Find answers to frequently asked questions about Emote Technology's courses, payments, account management, and technical support. Get help fast." />
        <link rel="canonical" href="https://emotetechnology.in/help" />
        <meta property="og:title" content="Help Center | Emote Technology" />
        <meta property="og:description" content="Find answers to FAQs about courses, payments, and account management at Emote Technology." />
        <meta property="og:url" content="https://emotetechnology.in/help" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": "Emote Technology Help Center",
            "url": "https://emotetechnology.in/help",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How do I enroll in a course?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Browse our course catalog, select a course, and click Enroll. You can pay securely online and start learning immediately." }
                },
                {
                    "@type": "Question",
                    "name": "What payment methods are accepted?",
                    "acceptedAnswer": { "@type": "Answer", "text": "We accept UPI, credit/debit cards, net banking, and other popular payment methods via Razorpay." }
                },
                {
                    "@type": "Question",
                    "name": "Can I get a certificate after completing a course?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes, you receive a verifiable certificate upon successfully completing all course requirements." }
                }
            ]
        })}</script>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Header Section */}
        <div className="bg-[#1A1D2E] dark:bg-[#0F1120] text-white py-20 px-4 mb-12 border-b border-[#3B4FD8]/20">
          <div className="max-w-4xl mx-auto text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#E8EAF2]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              How can we help you today?
            </h1>
            <p className="text-[#8B90B8] mb-8 text-lg max-w-2xl mx-auto">
              Search our knowledge base or browse categories below to find the answers you need.
            </p>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#6C7EF5] text-white shadow-md'
                    : 'bg-white dark:bg-[#252A41] text-gray-600 dark:text-[#E8EAF2] hover:bg-gray-100 dark:hover:bg-[#3B4FD8]/20 border border-gray-200 dark:border-[#3B4FD8]/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="mb-16 min-h-[300px]">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#1A1D2E] rounded-xl border border-gray-100 dark:border-[#3B4FD8]/20 shadow-sm">
                <p className="text-gray-500 dark:text-[#8B90B8] text-lg mb-4">No results found for "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[#6C7EF5] hover:text-[#5A6CE4] hover:underline font-medium transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* Contact Support CTA */}
          <div className="bg-white dark:bg-[#1A1D2E] border border-gray-200 dark:border-[#3B4FD8]/20 rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-[#3B4FD8]/20 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-[#6C7EF5]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E8EAF2] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-[#8B90B8] mb-8 max-w-md">
              Can't find the answer you're looking for? Our dedicated support team is ready to assist you.
            </p>
            <Link 
              to="/help/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#F5A623] hover:bg-[#d9911a] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5A623] dark:focus:ring-offset-[#1A1D2E]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
