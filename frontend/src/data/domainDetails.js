export const DOMAIN_DETAILS_MAP = {
  brain: {
    subtitle: 'Build the intelligence of tomorrow.',
    longDesc: 'Master neural networks, machine learning, generative AI, and data engineering. Work on real-world AI products with industry mentors and land roles at top AI-first companies.',
    durationText: '9 months. Industry-ready.',
    stats: {
      package: '₹14 LPA',
      partners: '180+',
      projects: '24',
      placement: '92%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Foundations', desc: 'Python, statistics, linear algebra, SQL & data wrangling.' },
      { months: 'MONTH 2-4', title: 'Machine Learning', desc: 'Build & deploy 6 ML models across regression, classification & clustering.' },
      { months: 'MONTH 5-6', title: 'Deep Learning', desc: 'Computer vision, NLP and transformer architectures from scratch.' },
      { months: 'MONTH 7-8', title: 'GenAI & LLMs', desc: 'Build agentic apps with RAG, fine-tune LLMs, deploy to production.' },
      { months: 'MONTH 8-9', title: 'Capstone & Placement', desc: 'Industry capstone, interview prep, mock interviews & offers.' }
    ],
    curriculum: [
      { title: 'Python for ML', skills: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'] },
      { title: 'Machine Learning', skills: ['Supervised', 'Unsupervised', 'Ensembles', 'XGBoost'] },
      { title: 'Deep Learning', skills: ['CNN', 'RNN', 'Transformers', 'PyTorch'] },
      { title: 'Generative AI', skills: ['LLMs', 'RAG', 'Fine-tuning', 'Agents'] },
      { title: 'MLOps', skills: ['Docker', 'MLflow', 'Vertex AI', 'Monitoring'] },
      { title: 'Data Engineering', skills: ['Airflow', 'Spark', 'Snowflake', 'Pipelines'] }
    ],
    projects: [
      { title: 'AI Resume Analyzer', desc: 'LLM-powered resume scoring with job-fit suggestions.', tags: ['GPT-4', 'Resume', 'OpenAI'] },
      { title: 'Medical Image Diagnosis', desc: 'CNN for X-ray classification deployed on cloud.', tags: ['PyTorch', 'Vertex AI'] },
      { title: 'Sales Forecasting Engine', desc: 'Time-series model with live BI dashboard.', tags: ['Prophet', 'Snowflake', 'Looker'] },
      { title: 'Conversational Agent', desc: 'Multi-tool agent with memory & RAG over docs.', tags: ['LangGraph', 'Cohere'] }
    ],
    mentors: [
      { name: 'Dr. Arjun Mehta', role: 'Principal AI Scientist', company: 'Google', exp: '12 YRS EXPERIENCE', initial: 'AM' },
      { name: 'Priya Iyer', role: 'Sr. ML Engineer', company: 'Microsoft', exp: '8 YRS EXPERIENCE', initial: 'PI' },
      { name: 'Rohan Kapoor', role: 'Founder', company: 'GenAI Startup', exp: '10 YRS EXPERIENCE', initial: 'RK' },
      { name: 'Sneha Rao', role: 'Data Science Lead', company: 'Flipkart', exp: '6 YRS EXPERIENCE', initial: 'SR' }
    ],
    salaryInsights: [
      { role: 'Data Analyst', salary: '₹6 - 10 LPA', exp: '0-2 yrs' },
      { role: 'ML Engineer', salary: '₹12 - 22 LPA', exp: '2-4 yrs' },
      { role: 'AI Engineer', salary: '₹18 - 35 LPA', exp: '3-5 yrs' },
      { role: 'Principal AI', salary: '₹40 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['TensorFlow Developer', 'AWS ML Specialty', 'Azure AI Engineer', 'Hadescore AI Pro'],
    hiringPartners: ['Google', 'Microsoft', 'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'Paytm', 'Meesho']
  },
  shield: {
    subtitle: 'Defend the digital frontier.',
    longDesc: 'Master ethical hacking, incident response, network defense, and digital forensics. Protect enterprise systems against active security threats.',
    durationText: '8 months. Industry-ready.',
    stats: {
      package: '₹12 LPA',
      partners: '120+',
      projects: '18',
      placement: '94%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Security Foundations', desc: 'Networking, Linux, virtualization, and basic scripting.' },
      { months: 'MONTH 2-4', title: 'Ethical Hacking', desc: 'Penetration testing, web app security, vulnerability assessments.' },
      { months: 'MONTH 5-6', title: 'Defense Operations', desc: 'SOC, SIEM monitoring, threat intelligence, and firewall configuration.' },
      { months: 'MONTH 7-8', title: 'Incident Response', desc: 'Forensics, malware analysis, crisis management, and disaster recovery.' }
    ],
    curriculum: [
      { title: 'Network Security', skills: ['Wireshark', 'Firewalls', 'VPNs', 'Cryptography'] },
      { title: 'Pentesting', skills: ['Kali Linux', 'Nmap', 'Metasploit', 'Burp Suite'] },
      { title: 'SOC Operations', skills: ['Splunk', 'Wazuh', 'Log Analysis', 'Incident Handling'] },
      { title: 'Cloud Security', skills: ['AWS IAM', 'Sentinel', 'IAM Policies', 'Compliance'] },
      { title: 'Malware Analysis', skills: ['Reverse Engineering', 'Ghidra', 'Sandbox Analysis'] },
      { title: 'DevSecOps', skills: ['CI/CD Security', 'SonarQube', 'Container Hardening'] }
    ],
    projects: [
      { title: 'Custom SIEM Dashboard', desc: 'Centralized logging & real-time threat detection parser.', tags: ['Python', 'Splunk', 'Elastic'] },
      { title: 'AWS Cloud Sandbox Hardening', desc: 'Automating IAM policies and threat response triggers.', tags: ['Terraform', 'AWS'] },
      { title: 'Ransomware Simulation', desc: 'Analyzing and reversing mock ransomware payloads.', tags: ['C++', 'Ghidra', 'Sandbox'] },
      { title: 'Web PenTest Suite', desc: 'Scanner for OWASP Top 10 vulnerabilities.', tags: ['Go', 'Docker', 'React'] }
    ],
    mentors: [
      { name: 'Kabir Sen', role: 'Director of Security', company: 'CrowdStrike', exp: '14 YRS EXPERIENCE', initial: 'KS' },
      { name: 'Aisha Vance', role: 'Lead PenTester', company: 'FireEye', exp: '9 YRS EXPERIENCE', initial: 'AV' },
      { name: 'Devendra Singh', role: 'CISO Advisory', company: 'Deloitte', exp: '11 YRS EXPERIENCE', initial: 'DS' },
      { name: 'Lily Carter', role: 'Threat Intel Analyst', company: 'Mandiant', exp: '7 YRS EXPERIENCE', initial: 'LC' }
    ],
    salaryInsights: [
      { role: 'Security Analyst', salary: '₹5 - 9 LPA', exp: '0-2 yrs' },
      { role: 'Penetration Tester', salary: '₹10 - 18 LPA', exp: '2-4 yrs' },
      { role: 'Security Architect', salary: '₹16 - 28 LPA', exp: '4-6 yrs' },
      { role: 'Director of Security', salary: '₹35 LPA+', exp: '8+ yrs' }
    ],
    certifications: ['Certified Ethical Hacker (CEH)', 'CompTIA Security+', 'CISSP', 'OSCP'],
    hiringPartners: ['CrowdStrike', 'FireEye', 'Deloitte', 'Mandiant', 'TCS', 'Infosys', 'Accenture', 'PwC']
  },
  code: {
    subtitle: 'Ship products. End to end.',
    longDesc: 'Build high-scale user interfaces, cloud architectures, database designs, and system integrations. Master the modern software stack.',
    durationText: '7 months. Industry-ready.',
    stats: {
      package: '₹10 LPA',
      partners: '250+',
      projects: '30',
      placement: '96%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Frontend Engineering', desc: 'HTML5, CSS3, JavaScript ES6, and modern React development.' },
      { months: 'MONTH 3-4', title: 'Backend Architecture', desc: 'Node.js, Express, RESTful APIs, database design, and ORMs.' },
      { months: 'MONTH 5-6', title: 'System Scale', desc: 'WebSockets, caching with Redis, system design, and Docker containerization.' },
      { months: 'MONTH 6-7', title: 'Cloud Deployment', desc: 'CI/CD pipelines, AWS/GCP hosting, monitoring, and final capstone project.' }
    ],
    curriculum: [
      { title: 'UI Development', skills: ['HTML5', 'CSS3', 'React', 'TailwindCSS', 'TypeScript'] },
      { title: 'Backend Logic', skills: ['Node.js', 'Express', 'Python', 'FastAPI', 'Django'] },
      { title: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'] },
      { title: 'DevOps', skills: ['Docker', 'Kubernetes', 'CI/CD Actions', 'AWS'] },
      { title: 'System Design', skills: ['Caching', 'Load Balancers', 'Microservices', 'Scale'] },
      { title: 'Testing & QA', skills: ['Jest', 'Cypress', 'Integration Testing', 'Postman'] }
    ],
    projects: [
      { title: 'Real-time Collab Whiteboard', desc: 'Dynamic document sync engine with low latency.', tags: ['Socket.io', 'React', 'Node.js'] },
      { title: 'E-Commerce Microservices', desc: 'Scalable shopping system with payment processor.', tags: ['Docker', 'Redis', 'Stripe', 'Go'] },
      { title: 'High-Scale REST API', desc: 'Data pipeline feeding millions of daily active users.', tags: ['FastAPI', 'PostgreSQL', 'AWS'] },
      { title: 'Developer Portfolio Hub', desc: 'Showcase portal optimized for speed and SEO.', tags: ['Next.js', 'Vercel', 'TailwindCSS'] }
    ],
    mentors: [
      { name: 'Vikram Roy', role: 'Staff Engineer', company: 'Netflix', exp: '10 YRS EXPERIENCE', initial: 'VR' },
      { name: 'Maya Patel', role: 'Director of Engineering', company: 'Razorpay', exp: '12 YRS EXPERIENCE', initial: 'MP' },
      { name: 'Sarah Jenkins', role: 'Senior Architect', company: 'Stripe', exp: '8 YRS EXPERIENCE', initial: 'SJ' },
      { name: 'Nitin Kumar', role: 'Lead Fullstack Dev', company: 'Zerodha', exp: '7 YRS EXPERIENCE', initial: 'NK' }
    ],
    salaryInsights: [
      { role: 'Frontend Developer', salary: '₹5 - 8 LPA', exp: '0-2 yrs' },
      { role: 'Backend Developer', salary: '₹6 - 10 LPA', exp: '0-2 yrs' },
      { role: 'Fullstack Engineer', salary: '₹11 - 20 LPA', exp: '2-4 yrs' },
      { role: 'Staff Software Engineer', salary: '₹28 LPA+', exp: '6+ yrs' }
    ],
    certifications: ['AWS Developer Associate', 'MongoDB Developer Cert', 'Red Hat Specialist', 'Hadescore Fullstack Pro'],
    hiringPartners: ['Netflix', 'Razorpay', 'Stripe', 'Zerodha', 'CRED', 'Swiggy', 'Flipkart', 'Paytm']
  },
  gear: {
    subtitle: 'Engineer machines that think.',
    longDesc: 'Integrate mechanical hardware, embedded circuits, control theories, and autonomous path-planning algorithms. Build future robots.',
    durationText: '9 months. Industry-ready.',
    stats: {
      package: '₹11 LPA',
      partners: '80+',
      projects: '12',
      placement: '89%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Electronics & CAD', desc: 'Circuit design, microcontrollers, Arduino, and 3D CAD modeling in SolidWorks.' },
      { months: 'MONTH 3-5', title: 'Embedded Systems & C++', desc: 'Real-time kernels, firmware, actuator controls, and SPI/I2C communication.' },
      { months: 'MONTH 6-7', title: 'Kinematics & ROS', desc: 'Robot operating system, coordinate systems, robot arm manipulation, and simulators.' },
      { months: 'MONTH 8-9', title: 'Autonomy & Navigation', desc: 'Computer vision, path planning, LiDAR navigation, and industrial automation capstone.' }
    ],
    curriculum: [
      { title: 'CAD & Simulation', skills: ['SolidWorks', 'Fusion 360', 'MATLAB', 'Gazebo'] },
      { title: 'Firmware Programming', skills: ['C++', 'Embedded C', 'Arduino', 'ESP32'] },
      { title: 'Robot Operating System', skills: ['ROS2', 'Gazebo', 'RViz', 'Path Planning'] },
      { title: 'Control Systems', skills: ['PID Loop', 'State-Space', 'Actuators', 'Servo Controls'] },
      { title: 'Sensor Integration', skills: ['LiDAR', 'IMU', 'Ultrasonic', 'Computer Vision'] },
      { title: 'Industrial Automation', skills: ['PLCs', 'SCADA', 'Robotic Arm Scripting'] }
    ],
    projects: [
      { title: 'Warehouse AMR Prototype', desc: 'Autonomous mobile robot navigation using LiDAR.', tags: ['ROS2', 'C++', 'SLAM'] },
      { title: '4-DOF Robotic Arm', desc: 'Inverse kinematics design and automated picking scripting.', tags: ['SolidWorks', 'Arduino', 'Python'] },
      { title: 'Quadruped Walking Gait', desc: 'Multi-legged balance and stride stability algorithm.', tags: ['MATLAB', 'ESP32', 'PID'] },
      { title: 'Smart Sorting Belt', desc: 'Computer vision sorting mechanism based on color and shape.', tags: ['OpenCV', 'PLC', 'Python'] }
    ],
    mentors: [
      { name: 'Dr. Hans Miller', role: 'Robotics Researcher', company: 'KUKA', exp: '15 YRS EXPERIENCE', initial: 'HM' },
      { name: 'Priyesh Nair', role: 'Lead Firmware Engineer', company: 'Tesla', exp: '9 YRS EXPERIENCE', initial: 'PN' },
      { name: 'Emily Stone', role: 'Mechatronics Designer', company: 'Boston Dynamics', exp: '10 YRS EXPERIENCE', initial: 'ES' },
      { name: 'Ananya Das', role: 'Automation Specialist', company: 'Siemens', exp: '8 YRS EXPERIENCE', initial: 'AD' }
    ],
    salaryInsights: [
      { role: 'Embedded Developer', salary: '₹5 - 9 LPA', exp: '0-2 yrs' },
      { role: 'Robotics Engineer', salary: '₹10 - 18 LPA', exp: '2-4 yrs' },
      { role: 'Controls Engineer', salary: '₹12 - 20 LPA', exp: '3-5 yrs' },
      { role: 'Principal Robotics Architect', salary: '₹30 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['Certified SolidWorks Professional', 'ROS2 Advanced Developer', 'PLC Automation Engineer', 'Hadescore Robotics Pro'],
    hiringPartners: ['Tesla', 'Siemens', 'ideaForge', 'Honeywell', 'KUKA', 'Bosch', 'L&T', 'ABB']
  },
  flight: {
    subtitle: 'Pilot the skies. Map the world.',
    longDesc: 'Learn UAV aerodynamics, flight controllers, autonomous waypoint navigation, and aerial photogrammetry for drone missions.',
    durationText: '6 months. Industry-ready.',
    stats: {
      package: '₹9 LPA',
      partners: '60+',
      projects: '10',
      placement: '91%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Drone Aerodynamics', desc: 'UAV design, motor-propeller physics, battery profiles, and safety checklists.' },
      { months: 'MONTH 3-4', title: 'Avionics & Assembly', desc: 'Assembling quadcopters, soldering ESCs, flight controller tuning, and telemetry.' },
      { months: 'MONTH 5-6', title: 'Flight Planning & GIS', desc: 'Autonomous waypoints with ArduPilot, GIS mapping, and photogrammetry modeling.' }
    ],
    curriculum: [
      { title: 'Aerodynamics', skills: ['Fluid Mechanics', 'UAV Configs', 'Lift-Drag Metrics'] },
      { title: 'Avionics', skills: ['ESCs', 'Telemetry', 'GPS Modules', 'Pixhawk', 'Betaflight'] },
      { title: 'Autonomous Navigation', skills: ['ArduPilot', 'Mission Planner', 'Waypoint Navigation'] },
      { title: 'Aerial Photogrammetry', skills: ['Pix4D', 'QGIS', '3D Elevation Modeling', 'Orthomosaics'] },
      { title: 'Remote Piloting', skills: ['DGCA Regulations', 'Simulator Flights', 'Manual Controls'] },
      { title: 'Payload Systems', skills: ['Multispectral Cameras', 'Thermal Sensors', 'Gimbals'] }
    ],
    projects: [
      { title: 'Smart Agriculture Survey', desc: 'Analyzing crop health indexes using multispectral imagery.', tags: ['Pix4D', 'QGIS'] },
      { title: 'Real-time Object Tracking', desc: 'Implementing computer vision for autonomous vehicle chasing.', tags: ['Python', 'ROS2', 'OpenCV'] },
      { title: 'Custom Quadcopter Build', desc: 'High-end carbon-fiber drone calibrated for search-rescue.', tags: ['Pixhawk', 'Telemetry'] },
      { title: 'Photogrammetric City Map', desc: 'Reconstructing a high-resolution 3D digital twin of a campus.', tags: ['DroneDeploy', 'GIS'] }
    ],
    mentors: [
      { name: 'Capt. Rohit Sharma', role: 'UAV Flight Inspector', company: 'DGCA Advisor', exp: '11 YRS EXPERIENCE', initial: 'RS' },
      { name: 'Michael Vance', role: 'Lead Engineer', company: 'DJI Enterprise', exp: '10 YRS EXPERIENCE', initial: 'MV' },
      { name: 'Tanvi Shah', role: 'GIS Mapping Specialist', company: 'Esri', exp: '8 YRS EXPERIENCE', initial: 'TS' },
      { name: 'John Smith', role: 'Drone System Designer', company: 'ideaForge', exp: '7 YRS EXPERIENCE', initial: 'JS' }
    ],
    salaryInsights: [
      { role: 'GIS Analyst', salary: '₹4 - 7 LPA', exp: '0-2 yrs' },
      { role: 'Drone Pilot', salary: '₹5 - 9 LPA', exp: '0-2 yrs' },
      { role: 'UAV Design Engineer', salary: '₹9 - 16 LPA', exp: '2-4 yrs' },
      { role: 'Principal Drone Architect', salary: '₹25 LPA+', exp: '6+ yrs' }
    ],
    certifications: ['DGCA Certified Remote Pilot', 'Pix4D Photogrammetry Cert', 'QGIS Expert', 'Hadescore Drone Pro'],
    hiringPartners: ['ideaForge', 'DJI Enterprise', 'Garuda Aerospace', 'Aarav Unmanned Systems', 'Esri', 'Mahindra', 'Tata Advanced', 'Asteria']
  },
  biotech: {
    subtitle: 'Decode life. Engineer the future.',
    longDesc: 'Blend cellular biology with computation. Master bioinformatics, molecular docking, gene expression analysis, and clinical trials pipeline.',
    durationText: '8 months. Industry-ready.',
    stats: {
      package: '₹9.5 LPA',
      partners: '90+',
      projects: '14',
      placement: '88%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Biotech Basics', desc: 'Cell biology, genetics, molecular structures, and lab protocols.' },
      { months: 'MONTH 3-4', title: 'Computational Bio', desc: 'Python for DNA sequencing, alignment tools, and NCBI data retrieval.' },
      { months: 'MONTH 5-6', title: 'Drug Discovery', desc: 'Molecular docking, protein-ligand interactions, and computer-aided drug design.' },
      { months: 'MONTH 7-8', title: 'Bioprocessing & Compliance', desc: 'Bioreactor sizing, GMP compliance, clinical trial phases, and regulatory filings.' }
    ],
    curriculum: [
      { title: 'Bioinformatics', skills: ['DNA Sequencing', 'BLAST', 'FASTA', 'Biopython'] },
      { title: 'Molecular Modeling', skills: ['PyMOL', 'AutoDock', 'ChemDraw', 'Protein Folding'] },
      { title: 'Genomics & Proteomics', skills: ['RNA-Seq', 'Microarray', 'CRISPR Design', 'Sequence Alignment'] },
      { title: 'Bioprocess Engineering', skills: ['Bioreactors', 'Downstream Processing', 'Scale-up'] },
      { title: 'Regulatory Affairs', skills: ['FDA Pathways', 'GMP Standards', 'Clinical Trials', 'Patents'] },
      { title: 'Lab Analytics', skills: ['HPLC', 'PCR', 'Gel Electrophoresis', 'Data Modeling'] }
    ],
    projects: [
      { title: 'COVID Protease Inhibitor', desc: 'Docking antiviral compounds onto targeted proteins.', tags: ['AutoDock', 'PyMOL'] },
      { title: 'Genomic Variant Classifier', desc: 'Identifying genetic markers for hereditary illnesses.', tags: ['Python', 'Biopython', 'ML'] },
      { title: 'CRISPR Guide RNA Designer', desc: 'Algorithm proposing high-efficiency gRNA matches.', tags: ['Go', 'Bio-API'] },
      { title: 'Bioreactor Scale-up Model', desc: 'Simulation predicting yield outcomes under adjusted feeds.', tags: ['MATLAB', 'Simulink'] }
    ],
    mentors: [
      { name: 'Dr. Clara DuPont', role: 'Research Lead', company: 'Biocon', exp: '13 YRS EXPERIENCE', initial: 'CD' },
      { name: 'Dr. Suresh Prasad', role: 'Bioinformatics Scientist', company: 'Novartis', exp: '10 YRS EXPERIENCE', initial: 'SP' },
      { name: 'Alan Turing Jr.', role: 'Genomic Data Engineer', company: 'Broad Institute', exp: '7 YRS EXPERIENCE', initial: 'AT' },
      { name: 'Sophia Martinez', role: 'Regulatory Director', company: 'Roche', exp: '12 YRS EXPERIENCE', initial: 'SM' }
    ],
    salaryInsights: [
      { role: 'Lab Associate', salary: '₹4 - 7 LPA', exp: '0-2 yrs' },
      { role: 'Bioinformatician', salary: '₹8 - 14 LPA', exp: '2-4 yrs' },
      { role: 'Biotech Research Scientist', salary: '₹12 - 22 LPA', exp: '3-5 yrs' },
      { role: 'Chief Bio-Scientist', salary: '₹32 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['Biopython Specialist', 'CRISPR Tech Certified', 'FDA GMP Lead Auditor', 'Hadescore Biotech Pro'],
    hiringPartners: ['Biocon', 'Novartis', 'Roche', 'Dr. Reddy\'s', 'Cipla', 'Pfizer', 'Syngene', 'Thermo Fisher']
  },
  wrench: {
    subtitle: 'Design what the world is built from.',
    longDesc: 'Master product engineering, drafting, FEA simulation, structural analysis, thermal management, and precision manufacturing systems.',
    durationText: '7 months. Industry-ready.',
    stats: {
      package: '₹8 LPA',
      partners: '110+',
      projects: '16',
      placement: '90%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: '3D CAD Modeling', desc: 'Mastering parametric design, assembly structures, and geometric dimensioning & tolerancing (GD&T).' },
      { months: 'MONTH 3-4', title: 'FEA Simulation', desc: 'Stress-strain calculations, loading bounds, safety margins, and mesh parameters.' },
      { months: 'MONTH 5-6', title: 'Thermal & CFD', desc: 'Fluid dynamics, heat convection models, cooling fins, and thermal throttling simulations.' },
      { months: 'MONTH 6-7', title: 'DFMA & Prototyping', desc: 'Design for manufacturing, CNC programming, 3D printing parameters, and material selection.' }
    ],
    curriculum: [
      { title: 'CAD Drafting', skills: ['SolidWorks', 'CATIA', 'GD&T Standards', 'Assembly Design'] },
      { title: 'Finite Element Analysis', skills: ['ANSYS', 'Stress Analysis', 'Fatigue Modeling'] },
      { title: 'Fluid Dynamics', skills: ['Fluent', 'Convection', 'Heat Exchangers', 'Turbulence'] },
      { title: 'Manufacturing', skills: ['CNC', 'G-code', 'Mold Design', 'Stamping'] },
      { title: 'Material Selection', skills: ['CES Selector', 'Composites', 'Polymers', 'Metals'] },
      { title: 'Product Lifecycle', skills: ['Teamcenter', 'BOM Tracking', 'Version Controls'] }
    ],
    projects: [
      { title: 'Heat Sink Optimization', desc: 'Designing CPU cooling fin structures for maximum heat dispersal.', tags: ['ANSYS', 'CFD'] },
      { title: 'Suspension Wishbone FEA', desc: 'Minimizing mass of a vehicle wishbone while preserving stress limits.', tags: ['SolidWorks', 'ANSYS'] },
      { title: 'Precision Injection Mold', desc: 'Creating split-core molds for high-tolerance consumer devices.', tags: ['CATIA', 'DFMA'] },
      { title: 'Automated Assembly Line', desc: 'Scripting robot kinematics paths for high-speed assembly.', tags: ['MATLAB', 'CNC'] }
    ],
    mentors: [
      { name: 'Harold Carter', role: 'Automotive Designer', company: 'Tata Motors', exp: '16 YRS EXPERIENCE', initial: 'HC' },
      { name: 'Rajesh Kumar', role: 'FEA Specialist', company: 'L&T', exp: '10 YRS EXPERIENCE', initial: 'RK' },
      { name: 'Emma Watson', role: 'CFD Engineer', company: 'Rolls-Royce', exp: '9 YRS EXPERIENCE', initial: 'EW' },
      { name: 'David Miller', role: 'Production Manager', company: 'Bosch', exp: '11 YRS EXPERIENCE', initial: 'DM' }
    ],
    salaryInsights: [
      { role: 'CAD Designer', salary: '₹4 - 7 LPA', exp: '0-2 yrs' },
      { role: 'FEA Analyst', salary: '₹7 - 12 LPA', exp: '2-4 yrs' },
      { role: 'Product Development Engineer', salary: '₹10 - 18 LPA', exp: '3-5 yrs' },
      { role: 'Principal Mechanical Architect', salary: '₹26 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['Certified SolidWorks Expert', 'ANSYS FEA Professional', 'GD&T Specialist', 'Hadescore Mechanical Pro'],
    hiringPartners: ['Tata Motors', 'Bosch', 'L&T', 'GE Aviation', 'Caterpillar', 'Maruti Suzuki', 'Mahindra', 'Godrej']
  },
  building: {
    subtitle: 'Build the cities of tomorrow.',
    longDesc: 'Learn Building Information Modeling (BIM), structural engineering, highway layout design, smart grid structures, and urban sustainability metrics.',
    durationText: '7 months. Industry-ready.',
    stats: {
      package: '₹7.5 LPA',
      partners: '95+',
      projects: '14',
      placement: '93%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'Civil Drafting & BIM', desc: 'Structural layouts in AutoCAD and 3D architectural modeling in Revit.' },
      { months: 'MONTH 3-4', title: 'Structural Analysis', desc: 'Beam stress limits, column buckling, wind/seismic factors, and steel-concrete calculations.' },
      { months: 'MONTH 5-6', title: 'Smart Infrastructure', desc: 'IoT sensors for bridge health, smart water networks, and traffic flow models.' },
      { months: 'MONTH 6-7', title: 'Project Costing', desc: 'BOM costing, construction safety, scheduling with Primavera, and environmental impact assessment.' }
    ],
    curriculum: [
      { title: 'Civil Drafting', skills: ['AutoCAD', 'Revit', 'BIM Coordination', 'Spatial Zoning'] },
      { title: 'Structural Engineering', skills: ['STAAD.Pro', 'Structural Analysis', 'Concrete Design'] },
      { title: 'Transportation', skills: ['MX Road', 'Highway Layout', 'Drainage Planning'] },
      { title: 'Smart Infrastructure', skills: ['IoT Sensing', 'Smart Waste Systems', 'Power Grids'] },
      { title: 'Construction Mgmt', skills: ['Primavera P6', 'Cost Estimating', 'Safety Laws'] },
      { title: 'Geotechnical Eng', skills: ['Soil Mechanics', 'Foundation Design', 'Surveying'] }
    ],
    projects: [
      { title: 'Bridge Health Monitor', desc: 'Setting up real-time strain-gauge IoT dashboards.', tags: ['Python', 'Arduino', 'ESP32'] },
      { title: '15-Storey Tower Design', desc: 'STAAD analysis under active wind and seismic loads.', tags: ['STAAD.Pro', 'Revit'] },
      { title: 'Smart Water Grid Model', desc: 'Simulating automated pressure release valves for leakage management.', tags: ['MATLAB', 'QGIS'] },
      { title: 'Expressway Alignment', desc: 'Profiling curve radii and grading specifications.', tags: ['MX Road', 'Civil 3D'] }
    ],
    mentors: [
      { name: 'Dr. Arun Kumar', role: 'Structural Consultant', company: 'L&T Infra', exp: '14 YRS EXPERIENCE', initial: 'AK' },
      { name: 'Monica Green', role: 'Urban Planner', company: 'Smart City Mission', exp: '11 YRS EXPERIENCE', initial: 'MG' },
      { name: 'James Patel', role: 'BIM Director', company: 'AECOM', exp: '9 YRS EXPERIENCE', initial: 'JP' },
      { name: 'Robert Chen', role: 'Geotechnical Lead', company: 'Jacobs', exp: '12 YRS EXPERIENCE', initial: 'RC' }
    ],
    salaryInsights: [
      { role: 'Site Engineer', salary: '₹4 - 6 LPA', exp: '0-2 yrs' },
      { role: 'Structural Analyst', salary: '₹7 - 11 LPA', exp: '2-4 yrs' },
      { role: 'BIM Coordinator', salary: '₹9 - 15 LPA', exp: '3-5 yrs' },
      { role: 'Chief Infrastructure Architect', salary: '₹24 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['Autodesk Certified Professional', 'Primavera P6 Specialist', 'STAAD.Pro Analyst', 'Hadescore Civil Pro'],
    hiringPartners: ['L&T Construction', 'AECOM', 'Jacobs', 'Tata Projects', 'HCP Design', 'Afcons', 'DLF', 'Sobha']
  },
  cpu: {
    subtitle: 'Connect everything. Sense anything.',
    longDesc: 'Design embedded networks, microcontrollers, sensor nodes, edge computing frameworks, MQTT queues, and predictive maintenance algorithms.',
    durationText: '6 months. Industry-ready.',
    stats: {
      package: '₹10 LPA',
      partners: '100+',
      projects: '15',
      placement: '91%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'IoT Hardware', desc: 'Microcontrollers, sensors, GPIOs, SPI/I2C protocols, and firmware in ESP32/Arduino.' },
      { months: 'MONTH 3-4', title: 'Edge & Cloud', desc: 'MQTT brokers, RESTful device commands, Node-RED, and cloud services in AWS IoT Core.' },
      { months: 'MONTH 5-6', title: 'Industrial Analytics', desc: 'Modbus/OPC-UA protocols, dashboard displays, and AI models for predictive maintenance.' }
    ],
    curriculum: [
      { title: 'Embedded Systems', skills: ['Arduino', 'ESP32', 'FreeRTOS', 'GPIO Scripting'] },
      { title: 'Networking Protocols', skills: ['MQTT', 'CoAP', 'HTTP', 'Modbus', 'LoRaWAN'] },
      { title: 'IoT Cloud', skills: ['AWS IoT Core', 'Node-RED', 'InfluxDB', 'Grafana'] },
      { title: 'Industrial Protocols', skills: ['OPC-UA', 'SCADA Integration', 'PLC Connectivity'] },
      { title: 'Predictive Analytics', skills: ['Machine Learning', 'Anomaly Detection', 'Regression'] },
      { title: 'Edge Computing', skills: ['Raspberry Pi', 'MicroPython', 'Local Gateways'] }
    ],
    projects: [
      { title: 'Factory Vibration Analyzer', desc: 'Anomalous motor frequency classifier predicting failure.', tags: ['Python', 'Scikit-learn', 'Grafana'] },
      { title: 'LoRaWAN Weather Station', desc: 'Long-range low-power sensor array transmitting telemetry.', tags: ['ESP32', 'LoRa'] },
      { title: 'Smart Building HVAC Core', desc: 'Automated temperature management using cloud overrides.', tags: ['Node-RED', 'AWS IoT'] },
      { title: 'OPC-UA SCADA Bridge', desc: 'Syncing PLC register statuses to cloud telemetry dashboards.', tags: ['Python', 'OPC-UA'] }
    ],
    mentors: [
      { name: 'Srinivas Murthy', role: 'IoT Consultant', company: 'Rockwell Automation', exp: '13 YRS EXPERIENCE', initial: 'SM' },
      { name: 'Alice Cooper', role: 'Edge Data Specialist', company: 'Siemens', exp: '9 YRS EXPERIENCE', initial: 'AC' },
      { name: 'Kevin Durant', role: 'Firmware Architect', company: 'ARM', exp: '10 YRS EXPERIENCE', initial: 'KD' },
      { name: 'Lisa Simpson', role: 'Industrial IoT Director', company: 'GE Digital', exp: '8 YRS EXPERIENCE', initial: 'LS' }
    ],
    salaryInsights: [
      { role: 'IoT Developer', salary: '₹5 - 9 LPA', exp: '0-2 yrs' },
      { role: 'Embedded IoT Engineer', salary: '₹9 - 15 LPA', exp: '2-4 yrs' },
      { role: 'Solutions Architect (IIoT)', salary: '₹14 - 24 LPA', exp: '3-5 yrs' },
      { role: 'Chief IoT Officer', salary: '₹35 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['AWS IoT Core Specialist', 'Certified PLC Programmer', 'ARM Accredited Engineer', 'Hadescore IoT Pro'],
    hiringPartners: ['Rockwell Automation', 'Siemens', 'GE Digital', 'Schneider', 'ABB', 'Intel', 'Honeywell', 'ARM']
  },
  bolt: {
    subtitle: 'Power the electric revolution.',
    longDesc: 'Master battery chemistry, Battery Management Systems (BMS), motor controllers, regen braking, high-power charging systems, and electric powertrains.',
    durationText: '8 months. Industry-ready.',
    stats: {
      package: '₹11.5 LPA',
      partners: '90+',
      projects: '16',
      placement: '94%'
    },
    timeline: [
      { months: 'MONTH 1-2', title: 'EV Fundamentals', desc: 'Powertrain mechanics, electrical equations, thermal properties, and high-voltage safety rules.' },
      { months: 'MONTH 3-4', title: 'Battery & BMS Design', desc: 'Cell balancing, SOC estimation, thermal runaway protection, and CAN bus telemetry.' },
      { months: 'MONTH 5-6', title: 'Motor Control & Inverters', desc: 'AC induction / PMSM motors, regenerative braking design, and inverter control loops.' },
      { months: 'MONTH 7-8', title: 'Charging & Powertrain', desc: 'DC fast chargers, grid integration, and final powertrain capstone design.' }
    ],
    curriculum: [
      { title: 'Battery Packs', skills: ['Lithium-Ion', 'Thermal Management', 'Cell Sizing', 'Safety'] },
      { title: 'Battery Management', skills: ['SOC/SOH Algorithms', 'Cell Balancing', 'CAN Bus'] },
      { title: 'Electric Motors', skills: ['PMSM Control', 'Vector Control', 'Regen Control Loops'] },
      { title: 'Power Electronics', skills: ['Inverters', 'Converters', 'Gate Drivers', 'IGBTs'] },
      { title: 'Charging Infrastructure', skills: ['CCS Standards', 'AC/DC Chargers', 'Smart Charging Grids'] },
      { title: 'Vehicle Integration', skills: ['Powertrain Calibration', 'Wiring Harness Design', 'Simulation'] }
    ],
    projects: [
      { title: 'Battery Pack BMS', desc: 'Passive cell-balancing firmware with CAN telemetry output.', tags: ['C++', 'ESP32', 'CAN'] },
      { title: 'PMSM Motor Control Loop', desc: 'Vector control simulation adjusting motor velocity.', tags: ['MATLAB', 'Simulink'] },
      { title: 'Smart Charging Planner', desc: 'Scheduling EV charging based on tariff rates and grid load.', tags: ['Python', 'Node-RED'] },
      { title: 'Powertrain Heat Exchanger', desc: 'Sizing radiator configurations for high-speed runs.', tags: ['SolidWorks', 'Fluent CFD'] }
    ],
    mentors: [
      { name: 'Dr. Ramesh Kumar', role: 'Director of Batteries', company: 'Ola Electric', exp: '15 YRS EXPERIENCE', initial: 'RK' },
      { name: 'Nicole Tesla', role: 'Powertrain Lead', company: 'Tesla Motors', exp: '10 YRS EXPERIENCE', initial: 'NT' },
      { name: 'Vivek Oberoi', role: 'EV Integration Consultant', company: 'Ather Energy', exp: '8 YRS EXPERIENCE', initial: 'VO' },
      { name: 'Sandra Bullock', role: 'Charging Infrastructure Manager', company: 'ABB', exp: '9 YRS EXPERIENCE', initial: 'SB' }
    ],
    salaryInsights: [
      { role: 'EV Powertrain Tester', salary: '₹5 - 8 LPA', exp: '0-2 yrs' },
      { role: 'BMS Engineer', salary: '₹9 - 16 LPA', exp: '2-4 yrs' },
      { role: 'Powertrain Design Engineer', salary: '₹12 - 22 LPA', exp: '3-5 yrs' },
      { role: 'Chief EV Architect', salary: '₹35 LPA+', exp: '7+ yrs' }
    ],
    certifications: ['Certified EV Powertrain Engineer', 'MATLAB BMS Modeler', 'CAN Bus Specialist', 'Hadescore EV Pro'],
    hiringPartners: ['Tesla Motors', 'Ola Electric', 'Ather Energy', 'TVS Motor', 'ABB', 'Tata Motors', 'Mahindra Electric', 'Bosch']
  }
};
