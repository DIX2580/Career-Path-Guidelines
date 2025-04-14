  import { useEffect, useState, useCallback, useContext } from "react";
  import { useNavigate, Link, useLocation } from "react-router-dom";
  import { motion, AnimatePresence } from "framer-motion";
  import Logo from "../../assets/logo.webp";
  import { ThemeContext } from "../../App";
  import { toast } from "react-toastify";
  import "./Navbar.css";
  import axios from "axios";

  // API URL constants
  const API_BASE_URL = "https://career-path-guidelines-backend.onrender.com/api";

  // Navbar Component
  const Navbar = ({ isLoginPage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [login, setLogin] = useState(localStorage.getItem("login") === "true");

    // If isLoginPage is not explicitly provided, check the current path
    const isLoginPagePath = isLoginPage || location.pathname === "/login";

    useEffect(() => {
      const checkLoginStatus = () => {
        const loginStatus = localStorage.getItem("login") === "true";
        setLogin(loginStatus);
        
        if (loginStatus) {
          const userData = JSON.parse(localStorage.getItem("mongoUser") || "null");
          setUser(userData);
        } else {
          setUser(null);
        }
      };
      
      // Check immediately on component mount
      checkLoginStatus();
      
      // Set up interval to check periodically
      const intervalId = setInterval(checkLoginStatus, 1000);
      
      return () => clearInterval(intervalId);
    }, []);

    const handleSignOut = useCallback(() => {
      try {
        // Clear all authentication data
        localStorage.removeItem("mongoToken");
        localStorage.removeItem("mongoUser");
        localStorage.removeItem("login");
        localStorage.removeItem("userUid");
        
        setUser(null);
        navigate("/");
        
        toast.success("Logged out successfully", {
          className: "toast-message",
        });
      } catch (err) {
        toast.error("Error signing out", {
          className: "toast-message",
        });
      }
    }, [navigate]);

    const toggleMenu = useCallback(() => {
      setMenuOpen((prev) => !prev);
    }, []);

    const handleKeyPress = useCallback(
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          toggleMenu();
        }
      },
      [toggleMenu]
    );

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (menuOpen && !e.target.closest('.navbar-container') && !e.target.closest('.mobile-menu')) {
          setMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    return (
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`navbar ${isScrolled ? "scrolled" : ""} ${
          theme === "dark" ? "dark-mode" : ""
        }`}
      >
        <div className="navbar-container">
          <LogoSection login={login} />
          
          {/* Desktop Menu - Show navigation only if not on login page */}
          {!isLoginPagePath && (
            <div className="desktop-menu">
              <DesktopMenu user={user} handleSignOut={handleSignOut} />
            </div>
          )}

          <div className="navbar-right">
            <motion.button
              whileHover={{ scale: 1.1, rotate: theme === "dark" ? 180 : 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>
            
            {/* Mobile Menu Button - Only show if not on login page */}
            {!isLoginPagePath && (
              <HamburgerButton
                toggleMenu={toggleMenu}
                menuOpen={menuOpen}
                handleKeyPress={handleKeyPress}
              />
            )}
          </div>
        </div>
        
        {/* Mobile Menu - Only show if not on login page */}
        <AnimatePresence>
          {menuOpen && !isLoginPagePath && (
            <MobileMenu
              user={user}
              handleSignOut={handleSignOut}
              theme={theme}
              toggleTheme={toggleTheme}
              closeMenu={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Backdrop for mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="menu-backdrop"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.nav>
    );
  };

  const LogoSection = ({ login }) => (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="logo-section"
    >
      <Link to={login ? "/dashboard" : "/"} className="logo-link">
        <motion.img 
          src={Logo} 
          width={50} 
          height={50} 
          alt="Logo" 
          className="logo-image"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </Link>
    </motion.div>
  );

  const DesktopMenu = ({ user, handleSignOut }) => {
    const menuItems = [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Top Universities", href: "/topuniversities" },
      { name: "Paths", href: "/Paths" },
      { name: "Courses", href: "/courses" },
      { name: "Career Support", href: "/careersupport" },
    ];

    return (
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <NavItem key={index} href={item.href} name={item.name} delay={index * 0.05} />
        ))}
        
        {user ? (
          <>
            <NavItem onClick={handleSignOut} name="Log Out" delay={menuItems.length * 0.05} />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (menuItems.length + 1) * 0.05, duration: 0.3 }}
              className="profile-button-container"
            >
              <Link to="/profile" className="profile-button">
                <span>Profile</span>
                <motion.div className="profile-icon">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="user-avatar" />
                  ) : (
                    <span className="user-initial">{user.firstName ? user.firstName.charAt(0) : 'U'}</span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          </>
        ) : (
          <NavItem href="/" name="Login" delay={menuItems.length * 0.05} />
        )}
      </div>
    );
  };

  const NavItem = ({ href, name, onClick, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="nav-item-container"
    >
      {onClick ? (
        <a
          onClick={onClick}
          className="nav-item"
        >
          {name}
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            className="nav-item-underline"
          />
        </a>
      ) : (
        <Link
          to={href}
          className="nav-item"
        >
          {name}
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            className="nav-item-underline"
          />
        </Link>
      )}
    </motion.div>
  );

  const HamburgerButton = ({ toggleMenu, menuOpen, handleKeyPress }) => (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className="hamburger-container"
    >
      <button
        onClick={toggleMenu}
        onKeyDown={handleKeyPress}
        aria-label="Toggle menu"
        className={`hamburger-button ${menuOpen ? "active" : ""}`}
      >
        <div className="hamburger-icon">
          <motion.div
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hamburger-line"
          />
          <motion.div
            animate={menuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="hamburger-line"
          />
          <motion.div
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hamburger-line"
          />
        </div>
      </button>
    </motion.div>
  );

  const MobileMenu = ({ user, handleSignOut, theme, toggleTheme, closeMenu }) => {
    const menuItems = [
      { name: "Dashboard", href: "/dashboard", icon: "📊" },
      { name: "Top Universities", href: "/topuniversities", icon: "🏛️" },
      { name: "Paths", href: "/Paths", icon: "🛣️" },
      { name: "Courses", href: "/courses", icon: "📚" },
      { name: "Career Support", href: "/careersupport", icon: "💼" },
    ];

    const menuVariants = {
      initial: { opacity: 0, x: "100%" },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          staggerChildren: 0.05,
          when: "beforeChildren"
        }
      },
      exit: { 
        opacity: 0, 
        x: "100%",
        transition: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
          staggerChildren: 0.05,
          staggerDirection: -1,
          when: "afterChildren"
        }
      }
    };

    const itemVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    };

    return (
      <motion.div
        variants={menuVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mobile-menu"
      >
        <div className="mobile-menu-header">
          <h2 className="mobile-menu-title">Menu</h2>
          <button onClick={closeMenu} className="close-menu-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mobile-menu-container">
          <div className="mobile-menu-items">
          {user && (
              <motion.div variants={itemVariants} className="mobile-menu-user-section">
                <Link to="/profile" className="mobile-user-profile" onClick={closeMenu}>
                  <div className="mobile-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="user-avatar" />
                    ) : (
                      <span className="user-initial">{user.firstName ? user.firstName.charAt(0) : 'U'}</span>
                    )}
                  </div>
                  <div className="mobile-user-info">
                    <p className="mobile-user-name">{user.firstName} {user.lastName}</p>
                    <p className="mobile-user-email">{user.email}</p>
                  </div>
                </Link>
              </motion.div>
            )}

            {menuItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link 
                  to={item.href} 
                  className="mobile-menu-item" 
                  onClick={closeMenu}
                >
                  <span className="menu-item-icon">{item.icon}</span>
                  <span className="menu-item-text">{item.name}</span>
                </Link>
              </motion.div>
            ))}
            
            {user ? (
              <motion.div variants={itemVariants}>
                <button 
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }} 
                  className="mobile-menu-item logout-button"
                >
                  <span className="menu-item-icon">🚪</span>
                  <span className="menu-item-text">Log Out</span>
                </button>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <Link to="/" className="mobile-menu-item" onClick={closeMenu}>
                  <span className="menu-item-icon">🔑</span>
                  <span className="menu-item-text">Login</span>
                </Link>
              </motion.div>
            )}
          </div>
          
          <motion.div variants={itemVariants} className="mobile-theme-toggle">
            <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
            <button 
              onClick={toggleTheme}
              className="mobile-theme-button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  export default Navbar;