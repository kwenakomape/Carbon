import React from 'react';

import { useEffect } from 'react';
import { ServiceSection } from '../components/ServiceSection';

export const LandingPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://www.ssisa.com/hubfs/Header-Logo.png" alt="Carbon Logo" className="h-10 mr-3" />
            <div className="text-2xl font-bold text-white">CARBON</div>
          </div>
          <nav>
            <a href="#home" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="Home">Home</a>
            <a href="#about" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="About">About</a>
            <a href="#services" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="Services">Services</a>
            <a href="#contact" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="Contact">Contact</a>
            <a href="/start-login" className="text-blue-400 mx-2 hover:text-blue-600 transition duration-300 ease-in-out" aria-label="Login/Register">Login/Register</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Manage Your Appointments with Ease</h1>
          <p className="text-xl mb-8 animate-fade-in delay-1s">Book appointments, track sessions, and manage payments all in one place.</p>
          <a href="/create-account" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 animate-fade-in">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Easy Registration</h3>
              <p>Quick and simple sign-up process.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Dashboard</h3>
              <p>Access all your details and manage appointments from one place.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Service Booking</h3>
              <p>Choose from a variety of services and specialists.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Appointment Management</h3>
              <p>Flexible scheduling with multiple date and time options.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Payment Tracking</h3>
              <p>Secure and transparent payment history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 animate-fade-in">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Register</h3>
              <p>Create an account to get started.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Login</h3>
              <p>Access your personalized dashboard.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Book Appointments</h3>
              <p>Select services and schedule appointments.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Sessions</h3>
              <p>Track your sessions and payments.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Receive Invoices</h3>
              <p>Get detailed invoices for all services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServiceSection />

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; 2024 Carbon. All rights reserved.</p>
          <div className="mt-4">
            <a href="#privacy" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="Privacy Policy">Privacy Policy</a>
            <a href="#terms" className="text-gray-300 mx-2 hover:text-white transition duration-300 ease-in-out" aria-label="Terms of Service">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};