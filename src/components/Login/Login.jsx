import { useEffect, useState, useCallback, useContext, useRef } from "react";
import Tilt from "react-parallax-tilt";
import { Link, useNavigate } from "react-router-dom";
import meeting2 from "../../assets/meeting.webp";
import hide from "../../assets/hide.png";
import show from "../../assets/show.png";
import "./Login.css";
import { FaEnvelope, FaKey } from "react-icons/fa";
import validate from "../../common/validation";
import Footer from "../Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { ThemeContext } from "../../App";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../action/action";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

// API URL constants
const API_BASE_URL = "https://career-path-guidelines-backend.onrender.com";

// Helper function to authenticate user with MongoDB backend
const authenticateWithBackend = async (email, password) => {
  try {
    // Regular email/password login
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    return response.data;
  } catch (error) {
    console.error("MongoDB authentication error:", error);
    throw error;
  }
};

// Animated Background Component
const AnimatedBackground = ({ children }) => {
  const geometricBackgroundRef = useCallback((node) => {
    if (node !== null) {
      // Clear any existing shapes
      node.innerHTML = '';
      
      // Create shapes
      const shapeTypes = ['square', 'circle', 'triangle', 'rectangle'];
      
      for (let i = 0; i < 40; i++) {
        const shape = document.createElement('div');
        const shapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.className = `shape ${shapeClass}`;
        
        // Random positions
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random animation properties
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;
        
        // Apply styles
        shape.style.left = `${posX}%`;
        shape.style.top = `${posY}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        
        node.appendChild(shape);
      }
    }
  }, []);
  
  const particlesContainerRef = useCallback((node) => {
    if (node !== null) {
      // Clear any existing particles
      node.innerHTML = '';
      
      // Create particles
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positions
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random animation properties
        const delay = Math.random() * 8;
        const duration = Math.random() * 4 + 4;
        
        // Apply styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        node.appendChild(particle);
      }
    }
  }, []);
  
  // Add mouse interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach(shape => {
        const speed = 0.05;
        const shapeX = parseFloat(shape.style.left);
        const shapeY = parseFloat(shape.style.top);
        
        // Check for valid numbers to prevent NaN errors
        if (!isNaN(shapeX) && !isNaN(shapeY)) {
          shape.style.left = `${shapeX + (x - 0.5) * speed}%`;
          shape.style.top = `${shapeY + (y - 0.5) * speed}%`;
        }
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="animated-background-wrapper">
      <div className="geometric-background" ref={geometricBackgroundRef}></div>
      <div className="particles" ref={particlesContainerRef}></div>
      <div className="gradient-overlay"></div>
      
      {/* Content container */}
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default function Login() {
  const [error, setError] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);
  
  // Proper ref implementation
  const formRef = useRef(null);

  // Function for handling inputs
  const handleLoginInfo = useCallback(
    (e) => {
      const { name, value } = e.target;
      let errObj = {};

      // Validate based on input name
      if (name === "password") {
        errObj = validate.loginPassword(value);
      } else if (name === "email") {
        errObj = validate.email(value);
      }

      // Update loginInfo and error state
      setLoginInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError((prev) => ({
        ...prev,
        ...errObj,
      }));
      
      // Check if the form is valid after input changes
      const updatedLoginInfo = { ...loginInfo, [name]: value };
      const isValid = updatedLoginInfo.email && updatedLoginInfo.password && 
                      !errObj.emailError && !error.passwordError;
      setIsFormValidated(isValid);
    },
    [error, loginInfo]
  );

  const passwordToggle = useCallback(() => {
    setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem("mongoToken");
      const login = localStorage.getItem("login");
      
      if (token && login === "true") {
        try {
          // Verify token with backend
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data) {
            // Store user data
            localStorage.setItem("mongoUser", JSON.stringify(response.data));
            
            // Update Redux store
            dispatch(loginSuccess(response.data));
            
            // Redirect after successful verification
            navigate("/dashboard");
          }
        } catch (error) {
          // Token invalid or expired, clear localStorage
          localStorage.removeItem("mongoToken");
          localStorage.removeItem("mongoUser");
          localStorage.removeItem("login");
          localStorage.removeItem("userUid");
          console.error("Session verification failed:", error);
        }
      }
    };
    
    checkExistingSession();
  }, [navigate, dispatch]);

  // Email/Password Sign In handler
  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Check form validity
    if (!loginInfo.email || !loginInfo.password) {
      toast.error("Please enter both email and password.", {
        className: "toast-message",
      });
      setIsLoading(false);
      return;
    }
    
    // Check for validation errors
    if (error.emailError || error.passwordError) {
      toast.error("Please fix validation errors before submitting.", {
        className: "toast-message",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // MongoDB Authentication
      const authData = await authenticateWithBackend(
        loginInfo.email, 
        loginInfo.password
      );
      
      // Store the JWT token and user from MongoDB backend
      if (authData.token) {
        localStorage.setItem("mongoToken", authData.token);
        localStorage.setItem("mongoUser", JSON.stringify(authData.user));
        localStorage.setItem("login", "true");
        localStorage.setItem("userUid", authData.user._id);
        
        // Update Redux store
        dispatch(loginSuccess(authData.user));
        
        // Success notification
        toast.success("Login successful! Redirecting to dashboard...", {
          className: "toast-message",
        });
        
        // Redirect to dashboard after a brief delay to show the toast
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      // Handle different error types
      if (err.response && err.response.status === 401) {
        toast.error("Incorrect email or password!", {
          className: "toast-message",
        });
      } else if (err.response && err.response.status === 404) {
        toast.error("This email is not registered", {
          className: "toast-message",
        });
      } else {
        console.error("Sign-in error", err);
        toast.error(err.response?.data?.message || "Login failed. Please try again!", {
          className: "toast-message",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [error, loginInfo, dispatch, navigate, isLoading]);

  // Guest Login handler
  const handleGuestLogin = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Try backend guest login
      const response = await axios.get(`${API_BASE_URL}/auth/guest-login`);
      
      if (response.data && response.data.token) {
        // Save MongoDB token and user data
        localStorage.setItem("mongoToken", response.data.token);
        localStorage.setItem("mongoUser", JSON.stringify(response.data.user));
        localStorage.setItem("login", "true");
        localStorage.setItem("userUid", response.data.user._id);
        
        // Update Redux store with guest user data
        dispatch(loginSuccess(response.data.user));
        
        // Success notification
        toast.success("Guest login successful! Redirecting to dashboard...", {
          className: "toast-message",
        });
        
        // Redirect to dashboard after a brief delay to show the toast
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Guest login error:", err);
      toast.error("Guest login failed. Please try again!", {
        className: "toast-message",
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, dispatch, isLoading]);

  const { theme } = useContext(ThemeContext);

  return (
    <div className="app-container">
      <AnimatedBackground>
        <main>
          <Navbar isLoginPage={true} />
          <div className="login-container">
            <div className="parent">
              {/* This is the right side of the login page */}
              <ToastContainer position="top-right" autoClose={3000} />
              <div className="right">
                <h1 className="counsellor"></h1>
                <div className="sign-in">Log in to your account</div>

                {/* Login form */}
                <form className="form" onSubmit={handleSignIn} ref={formRef}>
                  <div>
                    <label htmlFor="email">Email</label>
                    <div className="iconContainer">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={handleLoginInfo}
                        value={loginInfo.email}
                        placeholder="Enter your email"
                        required
                        className={`${error.emailError ? "inputField" : ""}`}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                      <FaEnvelope className="icons" />
                    </div>

                    {error.emailError && (
                      <p className="errorShow">{error.emailError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <div className="password-input">
                      <div className="iconContainer">
                        <input
                          id="password"
                          name="password"
                          type={passwordType}
                          onChange={handleLoginInfo}
                          value={loginInfo.password}
                          required
                          placeholder="Enter your password"
                          className={`${error.passwordError ? "inputField" : ""}`}
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                        <FaKey className="icons" />
                        <div onClick={passwordToggle} className="toggle-button">
                          <img
                            height={20}
                            width={20}
                            src={passwordType === "password" ? hide : show}
                            alt="password-toggle"
                          />
                        </div>
                      </div>
                      {error.passwordError && (
                        <p className="errorShow">{error.passwordError}</p>
                      )}
                    </div>
                  </div>
                  <div className="remember-me">
                    <input type="checkbox" id="remember-me" />
                    <label htmlFor="remember-me"> Remember me</label>
                  </div>
                  <button 
                    className="login_btn" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="btn">
                  <Link to="/forgotpassword" className="forgot-password">
                    Forgot Your password?
                  </Link>
                </div>
                <div className="dont-have-account">
                  <Link to="/signup" className="forgot-password">
                    Don't have an account?
                  </Link>
                </div>
                <div className="Guest-Login">
                  <button 
                    onClick={handleGuestLogin} 
                    className="forgot-password" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? "Connecting..." : "Guest Login"}
                  </button>
                </div>
                <div className="get-app">
                  {/* App download links (commented out) */}
                </div>
              </div>
              {/* This is the left side of the login page */}
              <div className="left">
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                  <img src={meeting2} alt="meeting" />
                </Tilt>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </AnimatedBackground>
    </div>
  );
}