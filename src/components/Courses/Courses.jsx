import React, { useEffect, useState } from "react";
import "./Courses.css";
import coursesData from "./courses.json";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';

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

const CashfreeButton = () => (
  <a href="https://payments.cashfree.com/forms/sucessdsa" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
    <div className="button-container" style={{ background: '#000', border: '1px solid black', borderRadius: '15px', display: 'flex', padding: '10px', width: 'fit-content', cursor: 'pointer' }}>
      <div>
        <img src="https://cashfree-checkoutcartimages-prod.cashfree.com/logoH8d8q8h2pv80_prod.png" alt="logo" className="logo-container" style={{ width: '40px', height: '40px' }} />
      </div>
      <div className="text-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px', justifyContent: 'center', marginRight: '10px' }}>
        <div style={{ fontFamily: 'Arial', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
          Pay Now
        </div>
        <div style={{ fontFamily: 'Arial', color: '#fff', fontSize: '10px' }}>
          <span>Powered By Cashfree</span>
          <img src="https://cashfreelogo.cashfree.com/cashfreepayments/logosvgs/Group_4355.svg" alt="logo" className="seconday-logo-container" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />
        </div>
      </div>
    </div>
  </a>
);

const Courses = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Check if user is authenticated using MongoDB token
  useEffect(() => {
    const token = localStorage.getItem('mongoToken');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    // Fetch user's enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://career-path-guidelines-backend.onrender.com'}/api/user/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setEnrolledCourses(response.data.enrolledCourses || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to load your enrolled courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrolledCourses();
  }, [navigate]);

  const handleEnrollCourse = async (courseId) => {
    const token = localStorage.getItem('mongoToken');
    
    if (!token) {
      toast.error('You must be logged in to enroll in courses');
      navigate('/');
      return;
    }
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://career-path-guidelines-backend.onrender.com'}/api/user/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Successfully enrolled in course!');
      // Update enrolled courses list
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <motion.div 
        className="courses-container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="courses-title"
          variants={fadeIn}
        >
          Available Courses
        </motion.h1>
        
        {isLoading ? (
          <div className="loading-spinner">Loading courses...</div>
        ) : (
          <motion.div 
            className="courses-list"
            variants={staggerContainer}
          >
            {coursesData.map((course, index) => (
              <motion.div
                className="course-card"
                key={course.id}
                variants={fadeIn}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div className="course-image-container">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-image"
                    loading="lazy"
                  />
                  <div className="course-overlay">
                    {enrolledCourses.includes(course.id) ? (
                      <motion.button
                        className="enrolled-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        Go to Course
                      </motion.button>
                    ) : (
                      <CashfreeButton />
                    )}
                  </div>
                </div>
                
                <motion.div className="course-info">
                  <h2 className="course-title">{course.title}</h2>
                  <p className="course-description">{course.description}</p>
                  <div className="course-details">
                    <div className="detail-item">
                      <span className="detail-label">Instructor:</span>
                      <span className="detail-value">{course.instructor}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{course.duration}</span>
                    </div>
                    <div className="detail-item price">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value price-value">{course.price}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.section 
          className="courses-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          
        
         
        </motion.section>
      </motion.div>
      <Footer />
    </>
  );
};

export default Courses;