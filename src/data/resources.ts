export type ResType = 'Course' | 'Documentation' | 'Tutorial' | 'Video' | 'Book' | 'Practical project'
export interface Resource { title: string; type: ResType; skill: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; url?: string }
// Resources listed here link directly to their publisher's documentation.
export const resources: Resource[] = [
  { title: 'Official Python tutorial', type: 'Documentation', skill: 'Python', level: 'Beginner', url: 'https://docs.python.org/3/tutorial/' },
  { title: 'ROS documentation', type: 'Documentation', skill: 'ROS', level: 'Intermediate', url: 'https://docs.ros.org' },
  { title: 'OpenCV documentation', type: 'Documentation', skill: 'Computer Vision', level: 'Intermediate', url: 'https://docs.opencv.org' },
]

