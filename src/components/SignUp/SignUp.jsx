import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaBirthdayCake,
  FaHourglass,
  FaVenusMars,
  FaGraduationCap,
  FaUserTie,
} from "react-icons/fa";
import meeting2 from "../../assets/meeting2.png";
import "./Signup.css";
import axios from "axios";
import validate from "../../common/validation";
import Footer from "../Footer/Footer";
import { Switch } from "antd";
import { ThemeContext } from "../../App";

const SignUpForm = () => {
  // Input fields state value
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    surname: "",
    dob: "",
    gender: "",
    age: null,
    "user-type": "",
  });
  const [error, setError] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [registerInformation, setRegisterInformation] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //password toggle
  const passwordToggle = useCallback(() => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else setPasswordType("password");
  });
  
  const confirmPasswordToggle = useCallback(() => {
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
    } else setConfirmPasswordType("password");
  });

  // Functions for handling inputs
  const handleUserInfo = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => {
      return { ...prev, [name]: value };
    });

    if (name !== "user-type" && name !== "gender") {
      const errObj = validate[name](value);
      setError((prev) => {
        return { ...prev, ...errObj };
      });
    }

    if (name === "dob") {
      let calculateAge = ageCalculator(e.target.value);
      calculateAge === null ? (calculateAge = "") : null;
      setUserInfo((prev) => {
        return { ...prev, age: calculateAge };
      });
    }
  });

  const handleRegisterInformation = useCallback((e) => {
    const { name, value } = e.target;
    setRegisterInformation((prev) => {
      return { ...prev, [name]: value };
    });

    let errObj = validate[name](value);
    if (name === "confirmPassword") {
      errObj = validate.confirmPassword(value, registerInformation.password);
    }
    setError((prev) => {
      return { ...prev, ...errObj };
    });
  });

  function generateUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // MongoDB function to write user data and authenticate
  async function registerUserWithMongoDB(userInfo, email, password) {
    try {
      const userId = generateUUID();
      
      const userData = {
        id: userId,
        firstName: userInfo.firstName,
        surname: userInfo.surname,
        email: email,
        password: password,
        dob: new Date(userInfo.dob).toISOString(),
        gender: userInfo.gender,
        age: userInfo.age,
        user_type: userInfo["user-type"]
      };

      // Make API call to your backend registration endpoint
      const response = await axios.post(
        "https://career-path-guidelines-backend.onrender.com/api/auth/register", 
        userData
      );

      // Store JWT token and user data
      if (response.status === 201) {
        localStorage.setItem("mongoToken", response.data.token);
        localStorage.setItem("mongoUser", JSON.stringify(response.data.user));
        localStorage.setItem("userUid", userId);
      }
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  let navigate = useNavigate();

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    let submitable = true;

    Object.values(error).forEach((err) => {
      if (err !== false) {
        submitable = false;
        return;
      }
    });

    if (submitable) {
      setIsLoading(true);
      try {
        // Register user with MongoDB
        await registerUserWithMongoDB(
          userInfo,
          registerInformation.email,
          registerInformation.password
        );
        
        // Navigate to home page after successful registration
        navigate("/");
      } catch (err) {
        // Handle errors
        if (err.response && err.response.data) {
          alert(err.response.data.message || "Registration failed");
        } else {
          alert(err.message || "Something went wrong. Please try again later.");
        }
        console.error("Registration error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please fill all Fields with Valid Data.");
    }
  });

  const ageCalculator = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const birthMonth = birthDate.getMonth();
    const currentMonth = currentDate.getMonth();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 1) {
      age = null;
    }
    return age;
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  // Theme toggle function
  const handleThemeChange = () => {
    toggleTheme(); 
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <main>
      <div className="signup-container">
        <div className="parent">
          <div className="right">
            <h1 className="counsellor">Counsellor
            <span>&nbsp;&nbsp;&nbsp;&nbsp;<Switch 
            style={{ backgroundColor: theme === "dark" ? "#000000" : ""}} 
            onChange={handleThemeChange} 
            checked={theme === "dark"} 
            checkedChildren="Dark Mode" 
            unCheckedChildren="Light Mode" 
          /></span>
            </h1>
            <div className="signuptxt">Create a new account</div>
            <div className="signuptxt2">It's quick and easy.</div>

            <form className="form-container" onSubmit={handleRegister}>
              <div className="name">
                <div className="iconContainer">
                  <input
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleUserInfo}
                    placeholder="First Name"
                    className={`firstname-text  ${
                      error.firstNameError && "inputField"
                    }`}
                    required
                  />
                  <FaUser className="icons" />
                  {error.firstName && error.firstNameError && (
                    <p className="errorShow">{error.firstNameError}</p>
                  )}
                </div>

                <div className="iconContainer">
                  <input
                    type="text"
                    name="surname"
                    value={userInfo.surname}
                    onChange={handleUserInfo}
                    placeholder="Last Name"
                    className={`surname-text  ${
                      error.surnameError && "inputField"
                    }`}
                    required
                  />
                  <FaIdCard className="icons" />
                  {error.surname && error.surnameError && (
                    <p className="errorShow">{error.surnameError}</p>
                  )}
                </div>
              </div>

              <div className="iconContainer">
                <input
                  type="email"
                  name="email"
                  value={registerInformation.email}
                  onChange={handleRegisterInformation}
                  required
                  placeholder="Email"
                  className={error.emailError && "inputField"}
                />
                <FaEnvelope className="icons" />
                {error.email && error.emailError && (
                  <p className="errorShow">{error.emailError}</p>
                )}
              </div>

              <div className="password-input">
                <div className="iconContainer">
                  <input
                    type={passwordType}
                    name="password"
                    value={registerInformation.password}
                    onChange={handleRegisterInformation}
                    placeholder="Password"
                    className={`password-text  ${
                      error.passwordError && "inputField"
                    }`}
                    required
                  />
                  <FaLock className="icons" />
                  {passwordType === "password" ? (
                    <FaEyeSlash
                      className="toggle-button1"
                      onClick={passwordToggle}
                    />
                  ) : (
                    <FaEye
                      className="toggle-button1"
                      onClick={passwordToggle}
                    />
                  )}
                </div>
                {error.password && error.passwordError && (
                  <p className="errorShow">{error.passwordError}</p>
                )}
              </div>

              <div className="password-input">
                <div className="iconContainer">
                  <input
                    type={confirmPasswordType}
                    name="confirmPassword"
                    value={registerInformation.confirmPassword}
                    onChange={handleRegisterInformation}
                    required
                    placeholder="Confirm Password"
                    className={`password-text  ${
                      error.confirmPasswordError && "inputField"
                    }`}
                  />
                  <FaCheckCircle className="icons" />
                  {confirmPasswordType === "password" ? (
                    <FaEyeSlash
                      className="toggle-button1"
                      onClick={confirmPasswordToggle}
                    />
                  ) : (
                    <FaEye
                      className="toggle-button1"
                      onClick={confirmPasswordToggle}
                    />
                  )}
                  {error.confirmPassword && error.confirmPasswordError && (
                    <p className="errorShow">{error.confirmPasswordError}</p>
                  )}
                </div>
              </div>

              <div className="twoFields">
                <div>
                  <label htmlFor="date-of-birth">Date of birth</label>
                  <div className="iconContainer">
                    <input
                      type="date"
                      value={userInfo.dob}
                      name="dob"
                      onChange={handleUserInfo}
                      required
                    />
                    <FaBirthdayCake className="icons" />
                  </div>
                </div>
                <div>
                  <label htmlFor="age">Your Age</label>
                  <div className="iconContainer">
                    <input
                      type="text"
                      value={userInfo.age}
                      name="age"
                      placeholder="Auto Generated"
                      readOnly
                    />
                    <FaHourglass className="icons" />
                  </div>
                </div>
              </div>
              {error.dob && error.dobError && (
                <p className="errorShow">{error.dobError}</p>
              )}

              <div className="iconContainer">
                <select
                  type="gender"
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleUserInfo}
                  required
                  className=""
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <FaVenusMars className="icons" />
              </div>

              <label htmlFor="student-or-counsellor">
                Are you Student or Counsellor ?{" "}
              </label>
              <div className="name soc">
                <div className="iconContainer">
                  <span htmlFor="student-option">
                    Student
                    <input
                      type="radio"
                      className="student-option"
                      name="user-type"
                      value="student"
                      id="student-option"
                      onChange={handleUserInfo}
                      required
                    />
                  </span>
                  <FaGraduationCap
                    className="icons"
                    style={{ fontSize: "20px" }}
                  />
                </div>

                <div className="iconContainer">
                  <span htmlFor="counsellor-option">
                    Counsellor
                    <input
                      type="radio"
                      className="counsellor-option"
                      name="user-type"
                      value="counsellor"
                      id="counsellor-option"
                      onChange={handleUserInfo}
                      required
                    />
                  </span>
                  <FaUserTie className="icons" />
                </div>
              </div>
              <div className="btn">
                <button 
                  className="submit-button" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
                <div className="already-account">
                  <Link to="/">Already have an account?</Link>
                </div>
              </div>
            </form>
          </div>
          <div className="left">
            <img src={meeting2} alt="meeting" />
            <p className="left-text">Still Confused with College Choice?</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default SignUpForm;