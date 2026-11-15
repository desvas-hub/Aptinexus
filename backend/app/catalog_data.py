"""Bundled AptiNexus starter catalogs migrated from the frontend demo datasets.

These are seed/catalog records, not user-verified credentials or AI-generated results.
"""

CAREERS = [
    {"id": "robotics", "title": "Robotics Engineer", "category": "Robotics", "required": ["Python", "ROS", "Control Systems", "Embedded C", "CAD Design", "Computer Vision"], "why": "Your mechanical design, control and firmware work spans the full robot stack.", "learn": ["ROS 2 fundamentals", "OpenCV basics"]},
    {"id": "mechatronics", "title": "Mechatronics Engineer", "category": "Engineering", "required": ["Embedded C", "Control Systems", "CAD Design", "Circuit Design", "PLC Programming"], "why": "This role blends the mechanical, electronic and software skills you already use.", "learn": ["PLC programming basics"]},
    {"id": "auto", "title": "Automotive Software Engineer", "category": "Software", "required": ["Embedded C", "Python", "AUTOSAR", "CAN Bus", "Control Systems"], "why": "Embedded C plus control theory transfers well to vehicle software.", "learn": ["CAN bus protocol", "AUTOSAR architecture"]},
    {"id": "sim", "title": "Simulation Engineer", "category": "Engineering", "required": ["Python", "Mechanics", "FEA", "MATLAB", "CAD Design", "Engineering Mathematics"], "why": "Mechanics, maths and scripting let you build models of physical systems.", "learn": ["Finite element analysis", "MATLAB / Simulink"]},
    {"id": "auto-eng", "title": "Industrial Automation Engineer", "category": "Engineering", "required": ["PLC Programming", "Control Systems", "Circuit Design", "SCADA", "Embedded C"], "why": "Control systems and circuits are the base of factory automation.", "learn": ["PLC programming", "SCADA basics"]},
    {"id": "airobot", "title": "AI and Robotics Researcher", "category": "Research", "required": ["Python", "Machine Learning", "ROS", "Control Systems", "Engineering Mathematics"], "why": "A cross-domain option: your maths, Python and control background support research in learning-based robotics.", "learn": ["Machine learning foundations", "Reinforcement learning"]},
    {"id": "tpm", "title": "Technical Product Manager", "category": "Product", "required": ["Roadmapping", "Analytics", "Communication", "Mechanics", "Python"], "why": "Hands-on technical depth helps you lead hardware and software teams.", "learn": ["Product roadmapping", "Product analytics"]},
]

SKILLS = [
    {"name": "Python", "category": "Programming", "difficulty": "Beginner", "desc": "General-purpose language for automation, data and robotics.", "prereqs": [], "related": ["ROS", "Machine Learning", "Computer Vision"]},
    {"name": "Embedded C", "category": "Electronics", "difficulty": "Intermediate", "desc": "Firmware programming for microcontrollers.", "prereqs": ["Circuit Design"], "related": ["Control Systems", "CAN Bus"]},
    {"name": "Circuit Design", "category": "Electronics", "difficulty": "Beginner", "desc": "Designing and analysing electrical circuits.", "prereqs": [], "related": ["Embedded C", "PLC Programming"]},
    {"name": "CAD Design", "category": "Engineering", "difficulty": "Beginner", "desc": "Modelling mechanical parts and assemblies.", "prereqs": [], "related": ["FEA", "Mechanics"]},
    {"name": "Mechanics", "category": "Engineering", "difficulty": "Beginner", "desc": "Statics and dynamics of physical systems.", "prereqs": [], "related": ["FEA", "CAD Design"]},
    {"name": "Engineering Mathematics", "category": "Foundations", "difficulty": "Intermediate", "desc": "Calculus, linear algebra and differential equations.", "prereqs": [], "related": ["Control Systems", "Machine Learning"]},
    {"name": "Control Systems", "category": "Engineering", "difficulty": "Advanced", "desc": "Feedback loops and stability of dynamic systems.", "prereqs": ["Engineering Mathematics"], "related": ["ROS", "PLC Programming", "Embedded C"]},
    {"name": "ROS", "category": "Robotics", "difficulty": "Intermediate", "desc": "Middleware for building robot software.", "prereqs": ["Python", "Control Systems"], "related": ["Computer Vision"]},
    {"name": "Computer Vision", "category": "Robotics", "difficulty": "Advanced", "desc": "Extracting information from images and video.", "prereqs": ["Python"], "related": ["Machine Learning", "ROS"]},
    {"name": "Machine Learning", "category": "Data & AI", "difficulty": "Advanced", "desc": "Models that learn patterns from data.", "prereqs": ["Python", "Engineering Mathematics"], "related": ["Computer Vision"]},
    {"name": "PLC Programming", "category": "Automation", "difficulty": "Intermediate", "desc": "Programming industrial logic controllers.", "prereqs": ["Circuit Design"], "related": ["SCADA", "Control Systems"]},
    {"name": "SCADA", "category": "Automation", "difficulty": "Intermediate", "desc": "Supervisory monitoring of industrial processes.", "prereqs": ["PLC Programming"], "related": ["PLC Programming"]},
    {"name": "AUTOSAR", "category": "Automotive", "difficulty": "Advanced", "desc": "Standard software architecture for vehicle ECUs.", "prereqs": ["Embedded C"], "related": ["CAN Bus"]},
    {"name": "CAN Bus", "category": "Automotive", "difficulty": "Intermediate", "desc": "Vehicle network protocol for ECUs.", "prereqs": ["Embedded C"], "related": ["AUTOSAR"]},
    {"name": "FEA", "category": "Simulation", "difficulty": "Advanced", "desc": "Finite element analysis of structures.", "prereqs": ["Mechanics", "Engineering Mathematics"], "related": ["CAD Design", "MATLAB"]},
    {"name": "MATLAB", "category": "Simulation", "difficulty": "Intermediate", "desc": "Numerical computing and modelling.", "prereqs": ["Engineering Mathematics"], "related": ["FEA", "Control Systems"]},
    {"name": "Roadmapping", "category": "Product", "difficulty": "Beginner", "desc": "Planning product direction and priorities.", "prereqs": [], "related": ["Analytics", "Communication"]},
    {"name": "Analytics", "category": "Product", "difficulty": "Intermediate", "desc": "Using data to guide product decisions.", "prereqs": [], "related": ["Roadmapping"]},
    {"name": "Communication", "category": "Professional", "difficulty": "Beginner", "desc": "Explaining technical ideas clearly.", "prereqs": [], "related": ["Roadmapping"]},
]

RESOURCES = [
    {"title": "Official Python tutorial", "type": "Documentation", "skill": "Python", "level": "Beginner", "url": "https://docs.python.org/3/tutorial/"},
    {"title": "Python practice exercises", "type": "Practical project", "skill": "Python", "level": "Beginner"},
    {"title": "ROS documentation", "type": "Documentation", "skill": "ROS", "level": "Intermediate", "url": "https://docs.ros.org"},
    {"title": "Beginner ROS 2 course", "type": "Course", "skill": "ROS", "level": "Intermediate"},
    {"title": "Build a simulated robot in ROS", "type": "Practical project", "skill": "ROS", "level": "Intermediate"},
    {"title": "OpenCV documentation", "type": "Documentation", "skill": "Computer Vision", "level": "Intermediate", "url": "https://docs.opencv.org"},
    {"title": "Introductory computer vision video series", "type": "Video", "skill": "Computer Vision", "level": "Intermediate"},
    {"title": "Control systems textbook", "type": "Book", "skill": "Control Systems", "level": "Advanced"},
    {"title": "PID tuning tutorial", "type": "Tutorial", "skill": "Control Systems", "level": "Intermediate"},
    {"title": "Embedded C programming book", "type": "Book", "skill": "Embedded C", "level": "Intermediate"},
    {"title": "Blink an LED on a microcontroller", "type": "Tutorial", "skill": "Embedded C", "level": "Beginner"},
    {"title": "PLC basics course", "type": "Course", "skill": "PLC Programming", "level": "Intermediate"},
    {"title": "Ladder logic tutorial", "type": "Tutorial", "skill": "PLC Programming", "level": "Beginner"},
    {"title": "Finite element analysis course", "type": "Course", "skill": "FEA", "level": "Advanced"},
    {"title": "MATLAB beginner tutorial", "type": "Tutorial", "skill": "MATLAB", "level": "Beginner"},
    {"title": "Machine learning foundations course", "type": "Course", "skill": "Machine Learning", "level": "Advanced"},
    {"title": "Train a small classifier", "type": "Practical project", "skill": "Machine Learning", "level": "Intermediate"},
    {"title": "Product roadmapping book", "type": "Book", "skill": "Roadmapping", "level": "Beginner"},
    {"title": "CAN bus explainer video", "type": "Video", "skill": "CAN Bus", "level": "Intermediate"},
]

ASSESSMENTS = [
    {"id": "py", "title": "Python basics", "skill": "Python", "questions": [
        {"q": "What does len([1, 2, 3]) return?", "options": ["2", "3", "4", "An error"], "answer": 1},
        {"q": "Which creates an empty dictionary?", "options": ["[]", "{}", "()", "set()"], "answer": 1},
        {"q": "What does range(3) produce?", "options": ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "1, 2"], "answer": 0},
        {"q": "Which keyword defines a function?", "options": ["func", "def", "function", "lambda"], "answer": 1},
    ]},
    {"id": "ec", "title": "Embedded C", "skill": "Embedded C", "questions": [
        {"q": "Which qualifier marks a variable that can change outside normal program flow?", "options": ["const", "static", "volatile", "register"], "answer": 2},
        {"q": "How large is a uint8_t?", "options": ["1 byte", "2 bytes", "4 bytes", "8 bytes"], "answer": 0},
        {"q": "Which statement sets bit 3 of register R?", "options": ["R |= (1 << 3);", "R &= (1 << 3);", "R ^= 3;", "R = ~3;"], "answer": 0},
        {"q": "An interrupt service routine should generally be…", "options": ["long and blocking", "short and fast", "recursive", "full of printf calls"], "answer": 1},
    ]},
    {"id": "cs", "title": "Control systems", "skill": "Control Systems", "questions": [
        {"q": "Negative feedback generally…", "options": ["reduces error", "always increases error", "removes the need for sensors", "needs no controller"], "answer": 0},
        {"q": "In a PID controller, the I term…", "options": ["predicts future error", "accumulates past error", "is proportional to error", "filters noise"], "answer": 1},
        {"q": "A stable system’s step response…", "options": ["grows without bound", "settles to a finite value", "oscillates with growing size", "is undefined"], "answer": 1},
        {"q": "A transfer function relates…", "options": ["output to input in the Laplace domain", "time to frequency only", "voltage to current only", "memory to CPU"], "answer": 0},
    ]},
]

GRAPH_NODES = [
    {"id": "python", "label": "Python", "cat": "skill", "status": "Practised", "desc": "General-purpose language used for automation, data and robotics."},
    {"id": "cad", "label": "CAD Design", "cat": "skill", "status": "Demonstrated", "desc": "Modelling mechanical parts and assemblies."},
    {"id": "embc", "label": "Embedded C", "cat": "skill", "status": "Practised", "desc": "Firmware programming for microcontrollers."},
    {"id": "control", "label": "Control Systems", "cat": "skill", "status": "Claimed", "desc": "Feedback loops and stability of dynamic systems."},
    {"id": "ros", "label": "ROS", "cat": "skill", "status": "Claimed", "desc": "Robot Operating System middleware for robot software."},
    {"id": "cv", "label": "Computer Vision", "cat": "skill", "status": "Claimed", "desc": "Extracting information from images and video."},
    {"id": "mech", "label": "Engineering Mechanics", "cat": "subject", "desc": "Statics and dynamics from your degree."},
    {"id": "math", "label": "Engineering Mathematics", "cat": "subject", "desc": "Calculus, linear algebra and differential equations."},
    {"id": "circuits", "label": "Circuit Theory", "cat": "subject", "desc": "Analysis of electrical circuits."},
    {"id": "rover", "label": "Line-following Rover", "cat": "project", "desc": "Arduino rover with PID steering."},
    {"id": "arm", "label": "3-DOF Robotic Arm", "cat": "project", "desc": "Designed, printed and programmed a small arm."},
    {"id": "intern", "label": "Manufacturing Internship", "cat": "experience", "desc": "Six weeks on a CNC and assembly line."},
    {"id": "pycert", "label": "Python Course Certificate", "cat": "certification", "desc": "Self-reported completion certificate. Not independently verified."},
    {"id": "robotics", "label": "Robotics Engineer", "cat": "career", "desc": "Designs and programs robots."},
    {"id": "mechatronics", "label": "Mechatronics Engineer", "cat": "career", "desc": "Integrates mechanics, electronics and software."},
    {"id": "sim", "label": "Simulation Engineer", "cat": "career", "desc": "Builds models to predict system behaviour."},
    {"id": "tpm", "label": "Technical Product Manager", "cat": "career", "desc": "Guides technical products from idea to launch."},
]

GRAPH_EDGES = [
    ["python", "cv"], ["python", "ros"], ["embc", "control"], ["cad", "mech"],
    ["control", "math"], ["circuits", "embc"], ["rover", "embc"], ["rover", "control"],
    ["arm", "cad"], ["arm", "python"], ["arm", "ros"], ["intern", "cad"],
    ["pycert", "python"], ["robotics", "ros"], ["robotics", "python"],
    ["robotics", "control"], ["robotics", "cv"], ["mechatronics", "embc"],
    ["mechatronics", "control"], ["mechatronics", "cad"], ["sim", "python"],
    ["sim", "math"], ["tpm", "intern"], ["ros", "control"],
]
