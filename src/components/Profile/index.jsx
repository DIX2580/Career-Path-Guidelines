import { useState, useEffect, useRef } from "react";
import { FaUser, FaIdCard, FaEnvelope, FaBirthdayCake, FaHourglass, FaVenusMars, FaUserGraduate, FaUserTie, FaEdit, FaSave, FaArrowLeft, FaCamera } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../Footer/Footer";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "dxthiripu";
  const CLOUDINARY_UPLOAD_PRESET = "profile_uploads";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("mongoToken");
        
        if (!token) {
          navigate("/"); // Redirect to login if no token exists
          return;
        }

        // Fetch user data from API
        const response = await axios.get("https://career-path-guidelines-backend.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
        
        // Set profile picture if it exists in user data
        if (response.data && response.data.profilePicture) {
          setImagePreview(response.data.profilePicture);
          console.log("Profile picture loaded:", response.data.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Format date of birth for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the image
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      console.log("Image uploaded successfully:", response.data);
      const imageUrl = response.data.secure_url;

      // Update user profile with the new image URL
      const token = localStorage.getItem("mongoToken");
      await axios.patch(
        "https://career-path-guidelines-backend.onrender.com/auth/update-profile",
        { profilePicture: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setUserData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
      
      // Ensure the image preview is updated with the new URL from Cloudinary
      setImagePreview(imageUrl);
      
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="profile-error">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back to Login</button>
      </div>
    );
  }

  // Return the profile component once data is loaded
  return (
    <main className="profile-page">
      <div className="profile-container">
        <button className="go-back-btn" onClick={handleGoBack}>
          <FaArrowLeft /> Go Back
        </button>
        
        <h1 className="profile-title">User Profile</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="profile-picture" 
                    onError={(e) => {
                      console.error("Error loading profile image");
                      e.target.onerror = null;
                      e.target.src = ""; // Set to empty to show the fallback icon
                      setImagePreview(null);
                    }}
                  />
                ) : userData?.user_type === "student" ? (
                  <FaUserGraduate className="profile-avatar-icon" />
                ) : (
                  <FaUserTie className="profile-avatar-icon" />
                )}
              </div>
              <button 
                className="upload-photo-btn" 
                onClick={triggerFileInput}
                disabled={uploading}
              >
                <FaCamera /> {uploading ? "Uploading..." : "Upload Photo"}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-name">
              <h2>{userData?.firstName} {userData?.surname}</h2>
              <span className={`profile-badge ${userData?.user_type === "student" ? "student" : "counsellor"}`}>
                {userData?.user_type === "student" ? "Student" : "Counsellor"}
              </span>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaUser />
                </div>
                <div className="field-content">
                  <label>First Name</label>
                  <p>{userData?.firstName}</p>
                </div>
              </div>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaIdCard />
                </div>
                <div className="field-content">
                  <label>Last Name</label>
                  <p>{userData?.surname}</p>
                </div>
              </div>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaEnvelope />
                </div>
                <div className="field-content">
                  <label>Email</label>
                  <p>{userData?.email}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Additional Details</h3>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaBirthdayCake />
                </div>
                <div className="field-content">
                  <label>Date of Birth</label>
                  <p>{userData?.dob ? formatDate(userData.dob) : "Not provided"}</p>
                </div>
              </div>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaHourglass />
                </div>
                <div className="field-content">
                  <label>Age</label>
                  <p>{userData?.age} years</p>
                </div>
              </div>
              
              <div className="profile-field">
                <div className="field-icon">
                  <FaVenusMars />
                </div>
                <div className="field-content">
                  <label>Gender</label>
                  <p>{userData?.gender}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn">
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Profile;