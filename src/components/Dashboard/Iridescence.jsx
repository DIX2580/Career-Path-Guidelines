import { useEffect, useRef, useState } from "react";
import "./Iridescence.css";
import "./DropdownStyle.css";
import { useNavigate } from "react-router-dom";

export default function Iridescence() {
  const navigate = useNavigate();
  const ctnDom = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedSector, setSelectedSector] = useState('');
  const [dreamJob, setDreamJob] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPaths, setFilteredPaths] = useState([]);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  const classOptions = ["5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th","B.Tech","Bsc","BE","BCA","BA","BFA","B.Des","BJMC",
    "BBA","Bcom","BMS","MBBS","BDS","BPharma","BPT","BSC Nursing","LLB","BSW","Diploma","Foreign Engineering Degree","BHM","BTTM",];
  const sectorOptions = ["Private Sector", "Public Sector", "Other", "Don't Know"];
  
  const privatePaths = [
   "DevOps Engineering",
"Full-Stack Development",
"UI/UX Design",
"Information Technology (IT)",
"Computer Science Engineering",
"Data Science",
"Software Engineering",
"Artificial Intelligence & Machine Learning",
"Cyber Security",
"Cloud Computing",
"Networking",
"Embedded Systems",
"Internet of Things (IoT)",
"Electronics and Communication Engineering",
"Electrical Engineering",
"Mechanical Engineering",
"Civil Engineering",
"Automobile Engineering",
"Aerospace Engineering",
"Biotechnology Engineering",
"Biomedical Engineering",
"Robotics Engineering",
"Mechatronics Engineering",
"Instrumentation Engineering",
"Industrial and Production Engineering",
"Petroleum Engineering",
"Agricultural Engineering",
"Renewable Energy Engineering",
"Structural Engineering",
"Environmental Engineering",
"Marine Engineering",
"Mining Engineering",
"Chemical Engineering",
"Textile Engineering",
"Food Technology",
"Nanotechnology",
"Geotechnical Engineering",
"Telecommunication Engineering",
"Railway Engineering",
"Metallurgical Engineering",
"Power Systems Engineering",
"Automation Engineering",
"HVAC Engineering (Heating, Ventilation, and Air Conditioning)",
"Construction Management",
"Project Management in Engineering",
"Bioinformatics",
"Artificial Neural Networks",
"Quantum Computing",
"Ethical Hacking",
"Blockchain Development",
"Game Development",
"Augmented Reality (AR) & Virtual Reality (VR)",
"Big Data Analytics",
"Mobile App Development",
"Computer Vision Engineering",
"Natural Language Processing (NLP)",
"Digital Marketing",
"SEO & SEM Specialist",
"Social Media Management",
"Content Writing & Copywriting",
"Business Intelligence",
"Product Management",
"Quality Assurance & Testing",
"Technical Writing",
"System Administration",
"Enterprise Resource Planning (ERP)",
"Human-Computer Interaction (HCI)",
"GIS (Geographic Information Systems)",
"Bioengineering",
"Genetic Engineering",
"Medical Imaging & Radiology",
"Pharmaceutical Engineering",
"Material Science Engineering",
"Optical Engineering",
"Satellite & Space Systems Engineering",
"Autonomous Vehicle Engineering",
"Wireless Communication Engineering",
"Control Systems Engineering",
"Reliability Engineering",
"Thermal Engineering",
"Marine Biology & Ocean Engineering",
"Agronomy & Soil Science",
"Sustainable Energy Management",
"Hydrology & Water Resources Engineering",
"Urban Planning & Smart Cities Development",
"Fire & Safety Engineering",
"Energy Management & Auditing",
"Supply Chain & Logistics Engineering",
"Industrial Automation & Robotics",
"Acoustic Engineering",
"Biomechanics Engineering",
"Packaging Engineering",
"Sports Engineering",
"Textile & Fashion Technology",
"Metaverse Development",
"Health Informatics",
"Cyber Forensics",
"Risk & Compliance Management",
"Virtual Production & Animation",
"3D Printing & Additive Manufacturing",
"Human Factors & Ergonomics",
"Cloud Security & Compliance",
"IT Governance & Compliance",
"Edge Computing",
"Digital Twin Technology",
"Electro-Optics Engineering"
  ];
  
  const publicPaths = [
    "IES (Indian Engineering Services)",
    "IAS (Indian Administrative Service)",
    "IPS (Indian Police Service)",
    "IFS (Indian Foreign Service)",
    "IRS (Indian Revenue Service)",
    "IAAS (Indian Audit and Accounts Service)",
    "IRTS (Indian Railway Traffic Service)",
    "PCS (Provincial Civil Services)",
    "SDM (Sub-Divisional Magistrate)",
    "BDO (Block Development Officer)",
    "Tehsildar",
    "JE (Junior Engineer)",
    "AE (Assistant Engineer)",
    "Scientist (ISRO, DRDO, BARC)",
    "Bank PO (Probationary Officer)",
    "RBI Grade B Officer",
    "PSU Engineer",
    "Air Force Officer",
    "Army Officer",
    "Assistant Professor",
    "Judicial Magistrate",
    "RPF (Railway Protection Force) Officer",
    "KVS Teacher",
    "Loco Pilot",
    "SIDBI Officer",
    "Navy Officer",
    "Income Tax Officer",
    "NABARD Officer",
    "Railway Engineering Services",
    "Public Prosecutor"
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSelectedClass(query);
    setFilteredClasses(query ? classOptions.filter((className) => className.toLowerCase().includes(query.toLowerCase())) : []);
  };

  const handleSearchPaths = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    let PathsToFilter = [];
    if (selectedSector === "Private Sector") {
      PathsToFilter = privatePaths;
    } else if (selectedSector === "Public Sector") {
      PathsToFilter = publicPaths;
    } else {
      PathsToFilter = [...privatePaths, ...publicPaths];
    }
    
    const filtered = PathsToFilter.filter((job) => 
      job.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPaths(filtered);
  };

  const handlePathselection = (job) => {
    setDreamJob(job);
    setSearchQuery(job);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    // Don't toggle if clicking on the search input
    if (e.target === searchInputRef.current) {
      return;
    }
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Initialize available Paths based on selected sector
    let availablePaths = [];
    if (selectedSector === "Private Sector") {
      availablePaths = privatePaths;
    } else if (selectedSector === "Public Sector") {
      availablePaths = publicPaths;
    } else if (selectedSector) {
      availablePaths = [...privatePaths, ...publicPaths];
    }
    
    if (searchQuery) {
      setFilteredPaths(
        availablePaths.filter(job => 
          job.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPaths(availablePaths);
    }
  }, [selectedSector, searchQuery]);

  const handleSeePathsClick = () => {
    // Store the data in localStorage before navigation
    const userData = {
      currentClass: selectedClass,
      sector: selectedSector,
      dreamJob: dreamJob || searchQuery
    };
    
    localStorage.setItem('userCareerData', JSON.stringify(userData));
    
    // Navigate to Paths page
    navigate('/Paths');
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    setDreamJob('');
    setSearchQuery('');
    setFilteredPaths([]);
    setStep(3);
  };

  const handleSubmitDreamJob = () => {
    // Move to the results summary screen
    setStep(4);
  };

  return (
    <div ref={ctnDom} className="relative rounded-2xl iridescence-container bg-gradient-to-br from-blue-200 to-purple-200">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 p-4 backdrop-blur-md bg-white/30">
      {step === 1 ? (
  <>
    <h2 className="text-black boxcurrentclass boxp text-2xl font-bold bg-blue-500">Enter your current class :-</h2>
    
    <div 
      ref={dropdownRef} 
      className={`dropdown-select wide ${isClassDropdownOpen ? 'open' : ''}`} 
      onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
    >
      <span className="current">{selectedClass || "Select your class"}</span>
      <div className="list">
        <div className="dd-search" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <input 
            type="text" 
            className="dd-searchbox" 
            placeholder="Search class..."
            value={selectedClass}
            onChange={handleSearch}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <ul style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}>
          {(filteredClasses.length > 0 ? filteredClasses : classOptions).map((className) => (
            <li 
              key={className} 
              className={`option ${className === selectedClass ? 'selected' : ''}`}
              data-value={className}
              onClick={() => { 
                setSelectedClass(className);
                
                setFilteredClasses([]);
                setIsClassDropdownOpen(false);
              }}
            >
              {className}
            </li>
          ))}
        </ul>
      </div>
    </div>
    
    <button 
      className={`cancel hover:bg-green-600 text-white sector py-2 px-6 rounded-lg ${!selectedClass ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={() => setStep(2)}
      disabled={!selectedClass}
    >
      Submit
    </button>
  </>
) : step === 2 ? (
  <>
    <h2 className="boxcurrentclass text-black text-2xl font-bold bg-blue-500">Which sector is your goal ?</h2>
    <div className="grid grid-cols-2 gap-4">
      {sectorOptions.map((sector) => (
        <button key={sector} className="sector bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md" onClick={() => handleSectorSelect(sector)}>
          {sector}
        </button>
      ))}
    </div>
    <button className="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded-md mt-4" onClick={() => setStep(1)}>
      Back
    </button>
  </>
        ) : step === 3 ? (
          <>
            <h2 className="boxcurrentclass text-black text-2xl font-bold bg-blue-500">What is your dream job or career goal?</h2>
            
            <div ref={dropdownRef} className={`dropdown-select wide ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
              <span className="current">{dreamJob || searchQuery || "Select your dream job"}</span>
              <div className="list">
                <div className="dd-search">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    className="dd-searchbox" 
                    placeholder="Search Paths..."
                    value={searchQuery}
                    onChange={handleSearchPaths}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <ul>
                  {filteredPaths.map((job) => (
                    <li 
                      key={job} 
                      className={`option ${job === dreamJob ? 'selected' : ''}`}
                      data-value={job}
                      onClick={() => handlePathselection(job)}
                    >
                      {job}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              className={`cancel hover:bg-green-600 text-white sector py-2 px-6 rounded-lg mt-4 ${!dreamJob && !searchQuery ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSubmitDreamJob}
              disabled={!dreamJob && !searchQuery}
            >
              Submit
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded-md mt-2" onClick={() => setStep(2)}>
              Back
            </button>
          </>
        ) : (
          <>
            <h2 className="boxcurrentclass text-black text-2xl font-bold bg-blue-500">Submitted details :-</h2>
            
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="career-summary-box">
                <div className="summary-content">
                  <h3 className="field-label">Current Class:</h3>
                  <div className="value-container">
                    <p className="field-value">{selectedClass}</p>
                  </div>
                  
                  <h3 className="field-label">Preferred Sector:</h3>
                  <div className="value-container">
                    <p className="field-value">{selectedSector}</p>
                  </div>
                  
                  <h3 className="field-label">Dream Job:</h3>
                  <div className="value-container">
                    <p className="field-value">{dreamJob || searchQuery}</p>
                  </div>
                </div>
              </div>
              
              <button 
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white sector py-3 px-6 rounded-lg font-bold text-lg ${
                  !selectedClass || !selectedSector || (!dreamJob && !searchQuery) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSeePathsClick}
                disabled={!selectedClass || !selectedSector || (!dreamJob && !searchQuery)}>
                See Paths Now
              </button> 
            </div>
            
            <button className="bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded-md mt-4" onClick={() => setStep(3)}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}