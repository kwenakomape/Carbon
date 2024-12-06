
// import { Button } from 'aceternity-ui';
// export const Splash = () => (
//    <div className="splashingPage">
//       <img src="splashphoto.jpg" alt="Carbon" className="rotating-image" />
//    </div>

   
//   );

  import React from 'react';

  export const Splash = () => {
    return (
      <div className="landing-page">
        {/* Header Section */}
        <header className="header">
          <div className="logo">YourLogo</div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#specialists">Specialists</a>
            <a href="#appointments">Appointments</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>
  
        {/* Hero Section */}
        <section className="hero">
          <h1>Connecting You with Top Specialists for Your Health and IT Needs</h1>
          <p>Book appointments, manage services, and track your sessions with ease.</p>
          <button className="cta-button">Get Started</button>
        </section>
  
        {/* Services Overview */}
        <section className="services" id="services">
          <h2>Our Services</h2>
          <div className="service-cards">
            {/* Example Service Card */}
            <div className="service-card">
              <img src="service-icon.png" alt="Service" />
              <h3>Service Name</h3>
              <p>Brief description of the service.</p>
              <p>Price: $100</p>
            </div>
            {/* Add more service cards as needed */}
          </div>
        </section>
  
        {/* Specialists Section */}
        <section className="specialists" id="specialists">
          <h2>Our Specialists</h2>
          <div className="specialist-profiles">
            {/* Example Specialist Profile */}
            <div className="specialist-profile">
              <img src="specialist-photo.jpg" alt="Specialist" />
              <h3>Specialist Name</h3>
              <p>Specialization</p>
              <button className="view-profile-button">View Profile</button>
            </div>
            {/* Add more specialist profiles as needed */}
          </div>
        </section>
  
        {/* How It Works */}
        <section className="how-it-works" id="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <img src="step-icon.png" alt="Step" />
              <p>Step 1: Description</p>
            </div>
            <div className="step">
              <img src="step-icon.png" alt="Step" />
              <p>Step 2: Description</p>
            </div>
            {/* Add more steps as needed */}
          </div>
        </section>
  
        {/* Testimonials */}
        <section className="testimonials" id="testimonials">
          <h2>Testimonials</h2>
          <div className="testimonial">
            <p>"Great service! Highly recommend."</p>
            <p>- Satisfied Customer</p>
          </div>
          {/* Add more testimonials as needed */}
        </section>
  
        {/* Call-to-Action */}
        <section className="cta">
          <button className="cta-button">Join Now</button>
          <p>Sign up for our newsletter for updates and promotions.</p>
        </section>
  
        {/* Footer */}
        <footer className="footer">
          <div className="quick-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#faqs">FAQs</a>
          </div>
          <div className="contact-info">
            <p>Email: contact@yourapp.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="social-media">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#instagram">Instagram</a>
          </div>
        </footer>
      </div>
    );
  };
  