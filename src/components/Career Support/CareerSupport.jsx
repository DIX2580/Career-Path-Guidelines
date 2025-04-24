import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './CareerSupport.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Particles component for header animation
const ParticlesAnimation = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const count = window.innerWidth < 768 ? 15 : 30;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (10 - 3) + 3,
          duration: Math.random() * (25 - 10) + 10,
          delay: Math.random() * 5
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Regenerate on window resize
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);
  
  return (
    <div className="particles-container">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="service-card"
      variants={fadeIn}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="service-card__icon">
        <i className={icon}></i>
      </div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>
    </motion.div>
  );
};

const PricingCard = ({ title, price, features, primaryAction, icon }) => {
  return (
    <motion.div 
      className="pricing-card"
      variants={fadeIn}
      whileHover={{ 
        y: -10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <div className="pricing-card__header">
        <div className="pricing-card__icon">
          <i className={icon}></i>
        </div>
        <h3 className="pricing-card__title">{title}</h3>
        <div className="pricing-card__price">{price}</div>
      </div>
      <ul className="pricing-card__features">
        {features.map((feature, index) => (
          <li key={index}><i className="fas fa-check"></i> {feature}</li>
        ))}
      </ul>
      <motion.button 
        className="pricing-card__button"
        onClick={primaryAction.onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {primaryAction.label}
      </motion.button>
    </motion.div>
  );
};

const CareerSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const pricingSectionRef = useRef(null);
  
  // Check if user is authenticated - modified to use a mock authentication check
  useEffect(() => {
    // Replace Firebase auth check with session check or other auth method
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('userAuthenticated');
      if (!isAuthenticated) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    const params = {
      name,
      email,
      message,
      created_date: new Date().toISOString(),
    };

    // Send email using EmailJS
    emailjs.send("service_5wwoq0k", "template_pg1iusg")
      .then(() => {
        console.log('Email sent successfully');
        // Store form data in local storage or another service instead of Firebase
        const careerQueries = JSON.parse(localStorage.getItem('careerQueries') || '[]');
        careerQueries.push(params);
        localStorage.setItem('careerQueries', JSON.stringify(careerQueries));
        
        setShowPopup(true);
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Email send error:', error);
        toast.error('Failed to send email. Please try again.');
      });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const services = [
    {
      icon: "fas fa-briefcase",
      title: "Job Placement",
      description: "We connect you with top employers in your field, leveraging our extensive network of industry partners."
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Skill Development",
      description: "Enhance your skills with our targeted training programs, designed to keep you competitive in today's job market."
    },
    {
      icon: "fas fa-handshake",
      title: "Career Counseling",
      description: "Get personalized advice from experienced professionals to guide your career decisions and growth strategy."
    },
    {
      icon: "fas fa-file-alt",
      title: "Resume Building",
      description: "Craft a compelling resume that highlights your strengths and catches the eye of potential employers."
    },
    {
      icon: "fas fa-comments",
      title: "Interview Preparation",
      description: "Boost your confidence with mock interviews and expert tips to ace your next job interview."
    },
    {
      icon: "fas fa-chart-line",
      title: "Career Advancement",
      description: "Develop strategies for climbing the corporate ladder and achieving your long-term career goals."
    }
  ];

  const pricingPlans = [
    {
      title: "First Session",
      price: "Free",
      icon: "fas fa-rocket",
      features: [
        "30-minute consultation",
        "Career path assessment",
        "Basic advice and guidance"
      ],
      primaryAction: {
        label: "Get Started",
        onClick: () => window.location.href = '/livechat'
      }
    },
    {
      title: "Basic Package",
      price: "₹99",
      icon: "fas fa-star",
      features: [
        "3 one-hour sessions",
        "Personalized career plan",
        "Resume review and Interview preparation"
      ],
      primaryAction: {
        label: "Choose Plan",
        onClick: () => {}
      }
    },
    {
      title: "Premium Package",
      price: "₹149",
      icon: "fas fa-crown",
      features: [
        "5 sessions and Ongoing email support",
        "Comprehensive career and job strategy",
        "LinkedIn profile optimization"
      ],
      primaryAction: {
        label: "Choose Plan",
        onClick: () => {}
      }
    }
  ];

  return (
    <>
      <div className="career-support dark-theme">
        <Navbar />
        <motion.header 
          className="career-support__header"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <ParticlesAnimation />
          
          <motion.h1 
            className="career-support__main-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Career
          </motion.h1>
          <motion.p 
            className="career-support__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Empowering professionals to reach new heights
          </motion.p>
          <motion.button 
            className="career-support__cta-button header-cta"
            onClick={scrollToPricing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Explore Services
          </motion.button>
        </motion.header>

        <motion.section 
          className="career-support__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="career-support__title"
            variants={fadeIn}
          >
            Our Career Support Services
          </motion.h2>
          <motion.div 
            className="career-support__services"
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className="career-support__pricing" 
          ref={pricingSectionRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="career-support__pricing-title"
            variants={fadeIn}
          >
            Career Advice Pricing
          </motion.h2>
          <motion.div 
            className="pricing-cards"
            variants={staggerContainer}
          >
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                icon={plan.icon}
                features={plan.features}
                primaryAction={plan.primaryAction}
              />
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className="career-support__form-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h2 
            className="career-support__form-title"
            variants={fadeIn}
          >
            Get Personalized Career Advice
          </motion.h2>
          <motion.form 
            className="career-support__form" 
            onSubmit={handleSubmit}
            variants={staggerContainer}
          >
            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </motion.div>
            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Your email"
              />
            </motion.div>
            <motion.div className="form-group" variants={fadeIn}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="How can we help you?"
                rows="5"
              ></textarea>
            </motion.div>
            <motion.button 
              type="submit" 
              className="career-support__form-submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeIn}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.section>

        <motion.section 
          className="career-support__cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h2 
            className="career-support__cta-title"
            variants={fadeIn}
          >
            Ready to Take the Next Step?
          </motion.h2>
          <motion.p 
            className="career-support__cta-text"
            variants={fadeIn}
          >
            Join thousands of professionals who have accelerated their careers with our support.
          </motion.p>
          <motion.button
            className="career-support__cta-button"
            onClick={scrollToPricing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeIn}
          >
            Get Started Today
          </motion.button>
        </motion.section>

        {showPopup && (
          <motion.div 
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="popup-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Thank You!
              </motion.h2>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your message has been sent successfully. We will reach out to you soon.
              </motion.p>
              <motion.button 
                onClick={closePopup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CareerSupport;