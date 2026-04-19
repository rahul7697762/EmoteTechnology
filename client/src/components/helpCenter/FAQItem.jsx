import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-[#3B4FD8]/20 rounded-xl overflow-hidden bg-white dark:bg-[#1A1D2E] transition-all hover:shadow-md mb-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none group"
      >
        <span className="text-base font-semibold text-gray-900 dark:text-[#E8EAF2] group-hover:text-blue-600 dark:group-hover:text-[#6C7EF5] transition-colors">
          {faq.question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 dark:text-[#8B90B8] transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 dark:text-[#8B90B8] leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default FAQItem;
