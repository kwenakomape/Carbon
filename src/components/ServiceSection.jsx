import React, { useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const services = [
  {
    category: 'Biokineticist Services',
    items: [
      { name: 'Rehabilitation Program', description: 'Tailored exercise programs for recovery from injuries or surgeries.', price: 500.00, creditCost: 50 },
      { name: 'Chronic Disease Management', description: 'Exercise interventions for conditions like diabetes, cardiovascular diseases, and obesity.', price: 400.00, creditCost: 40 },
      { name: 'Sports Performance Enhancement', description: 'Training programs to improve athletic performance.', price: 600.00, creditCost: 60 },
      { name: 'Pain Management', description: 'Exercise therapy to manage chronic pain conditions.', price: 450.00, creditCost: 45 },
      { name: 'Geriatric Care', description: 'Programs to promote mobility and prevent falls in older adults.', price: 350.00, creditCost: 35 },
    ],
  },
  {
    category: 'Dietitian Services',
    items: [
      { name: 'Nutrition Counseling', description: 'Personalized advice on diet and nutrition.', price: 300.00, creditCost: 30 },
      { name: 'Chronic Disease Management', description: 'Dietary plans for managing conditions like diabetes, hypertension, and high cholesterol.', price: 350.00, creditCost: 35 },
      { name: 'Weight Management', description: 'Programs to help with weight loss or gain.', price: 250.00, creditCost: 25 },
      { name: 'Meal Planning', description: 'Creating balanced meal plans tailored to individual needs.', price: 200.00, creditCost: 20 },
      { name: 'Eating Disorder Recovery', description: 'Support and guidance for individuals recovering from eating disorders.', price: 400.00, creditCost: 40 },
    ],
  },
  {
    category: 'Physiotherapist Services',
    items: [
      { name: 'Musculoskeletal Rehabilitation', description: 'Treatment for injuries related to muscles, bones, and joints.', price: 500.00, creditCost: 50 },
      { name: 'Post-Surgical Rehabilitation', description: 'Recovery programs following surgeries like joint replacements.', price: 550.00, creditCost: 55 },
      { name: 'Neurological Rehabilitation', description: 'Therapy for conditions such as stroke, multiple sclerosis, and Parkinson\'s disease.', price: 600.00, creditCost: 60 },
      { name: 'Cardiopulmonary Rehabilitation', description: 'Programs to improve heart and lung function.', price: 450.00, creditCost: 45 },
      { name: 'Pediatric Therapy', description: 'Specialized care for children with developmental or physical disabilities.', price: 400.00, creditCost: 40 },
    ],
  },
];

export const ServiceSection = () => {
  const carouselRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.decrement();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.increment();
    }
  };

  return (
    <section className="bg-gray-100 py-10">
      <div className="container mx-auto px-4 text-center relative">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 animate-fade-in">Our Services</h2>
        <div className="relative">
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition duration-300 z-10"
            style={{ marginLeft: '-40px' }}
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition duration-300 z-10"
            style={{ marginRight: '-40px' }}
            aria-label="Next slide"
          >
            <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
          </button>
          <Carousel
            ref={carouselRef}
            showThumbs={false}
            infiniteLoop
            useKeyboardArrows
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            onChange={(index) => setSelectedIndex(index)}
          >
            {services.map((serviceCategory) => (
              <div key={serviceCategory.category} className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{serviceCategory.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceCategory.items.map((service) => (
                    <div key={service.name} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 animate-fade-in">
                      <h4 className="text-xl font-bold mb-4 text-gray-800">{service.name}</h4>
                      <p>{service.description}</p>
                      <p className="mt-2 font-semibold">Price: ${service.price.toFixed(2)}</p>
                      <p className="mt-1 text-gray-600">Credit Cost: {service.creditCost}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
          <div className="flex justify-center mt-4">
            <ul className="flex space-x-2">
              {services.map((_, index) => (
                <li
                  key={index}
                  className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center font-bold transition duration-300 transform ${
                    selectedIndex === index
                      ? 'bg-blue-500 text-white scale-125'
                      : 'bg-gray-300 text-gray-800 hover:scale-110'
                  }`}
                  onClick={() => carouselRef.current.moveTo(index)}
                  onKeyDown={() => carouselRef.current.moveTo(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Slide ${index + 1}`}
                >
                  {index + 1}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};