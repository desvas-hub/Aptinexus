export type ResType = 'Course' | 'Documentation' | 'Tutorial' | 'Video' | 'Book' | 'Practical project'
export interface Resource { title: string; type: ResType; skill: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; url?: string }
// Generic sample entries. Only entries with a url are verified real pages (official documentation).
export const resources: Resource[] = [
  { title: 'Official Python tutorial', type: 'Documentation', skill: 'Python', level: 'Beginner', url: 'https://docs.python.org/3/tutorial/' },
  { title: 'Python practice exercises', type: 'Practical project', skill: 'Python', level: 'Beginner' },
  { title: 'ROS documentation', type: 'Documentation', skill: 'ROS', level: 'Intermediate', url: 'https://docs.ros.org' },
  { title: 'Beginner ROS 2 course', type: 'Course', skill: 'ROS', level: 'Intermediate' },
  { title: 'Build a simulated robot in ROS', type: 'Practical project', skill: 'ROS', level: 'Intermediate' },
  { title: 'OpenCV documentation', type: 'Documentation', skill: 'Computer Vision', level: 'Intermediate', url: 'https://docs.opencv.org' },
  { title: 'Introductory computer vision video series', type: 'Video', skill: 'Computer Vision', level: 'Intermediate' },
  { title: 'Control systems textbook', type: 'Book', skill: 'Control Systems', level: 'Advanced' },
  { title: 'PID tuning tutorial', type: 'Tutorial', skill: 'Control Systems', level: 'Intermediate' },
  { title: 'Embedded C programming book', type: 'Book', skill: 'Embedded C', level: 'Intermediate' },
  { title: 'Blink an LED on a microcontroller', type: 'Tutorial', skill: 'Embedded C', level: 'Beginner' },
  { title: 'PLC basics course', type: 'Course', skill: 'PLC Programming', level: 'Intermediate' },
  { title: 'Ladder logic tutorial', type: 'Tutorial', skill: 'PLC Programming', level: 'Beginner' },
  { title: 'Finite element analysis course', type: 'Course', skill: 'FEA', level: 'Advanced' },
  { title: 'MATLAB beginner tutorial', type: 'Tutorial', skill: 'MATLAB', level: 'Beginner' },
  { title: 'Machine learning foundations course', type: 'Course', skill: 'Machine Learning', level: 'Advanced' },
  { title: 'Train a small classifier', type: 'Practical project', skill: 'Machine Learning', level: 'Intermediate' },
  { title: 'Product roadmapping book', type: 'Book', skill: 'Roadmapping', level: 'Beginner' },
  { title: 'CAN bus explainer video', type: 'Video', skill: 'CAN Bus', level: 'Intermediate' },
]
