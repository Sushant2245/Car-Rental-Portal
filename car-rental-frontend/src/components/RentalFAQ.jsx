import { useState } from 'react';

const RentalFAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "Do I need to enter the car's license plate when booking?",
      answer: "No! The car's license plate (like 'SF001', 'NYC123') is already stored with each vehicle. You only provided your driver's license number during registration to prove you can legally drive."
    },
    {
      question: "What information do I need to rent a car?",
      answer: "You just need to: 1) Be logged in with your account (which has your driver's license), 2) Select pickup and return dates, 3) Choose your car and book. That's it!"
    },
    {
      question: "What's the difference between my driver's license and the car's license plate?",
      answer: "Your driver's license number (like DL1234567890) proves you can drive and was provided during registration. The car's license plate (like SF001) identifies the specific vehicle and is already stored in our system."
    },
    {
      question: "Can I change my booking dates after confirmation?",
      answer: "Contact our support team to modify booking dates. Changes are subject to car availability and may involve additional charges."
    },
    {
      question: "What documents do I need when picking up the car?",
      answer: "Bring your physical driver's license (matching the one registered) and a valid credit card. We'll handle all the paperwork for the specific car."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-yellow-400">❓</span>
        Frequently Asked Questions
      </h3>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-white/10 last:border-b-0">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full text-left py-3 flex items-center justify-between text-white hover:text-blue-300 transition-colors duration-300"
            >
              <span className="font-medium pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  openQuestion === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openQuestion === index && (
              <div className="pb-3 text-slate-300 text-sm leading-relaxed animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
        <p className="text-green-400 text-sm flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span><strong>Quick Tip:</strong> As a customer, you don't need to worry about car license plates. Just pick your dates, choose a car, and book!</span>
        </p>
      </div>
    </div>
  );
};

export default RentalFAQ;
