// Thematic property descriptions for tooltips
export const PROPERTY_DESCRIPTIONS: Record<string, string> = {
  // Frontend Basics
  'GitHub Ave': 'A predictable state container for JavaScript apps. Version control and collaboration platform.',
  'NPM Street': 'Node Package Manager - The world\'s largest software registry for JavaScript packages.',
  'Express Blvd': 'Fast, unopinionated, minimalist web framework for Node.js. Perfect for building APIs.',
  'Node.js Avenue': 'JavaScript runtime built on Chrome\'s V8 engine. Enables server-side JavaScript execution.',
  
  // Backend & Database
  'Redis Road': 'In-memory data structure store. Used as database, cache, and message broker.',
  'DB Street': 'Database management system. Stores and retrieves structured data efficiently.',
  'SQL Place': 'Structured Query Language. Standard language for relational database management.',
  
  // Cloud & DevOps
  'CI/CD Pipeline': 'Continuous Integration/Continuous Deployment. Automates software delivery.',
  'Docker Dock': 'Containerization platform. Package applications with all dependencies.',
  'Kubernetes Kube': 'Container orchestration system. Manages containerized applications at scale.',
  
  // Mobile & Frameworks
  'Flutter Street': 'Google\'s UI toolkit for building natively compiled apps from a single codebase.',
  'React Road': 'JavaScript library for building user interfaces. Component-based and declarative.',
  'Vue Avenue': 'Progressive JavaScript framework for building user interfaces.',
  'Native Ave': 'Platform-specific mobile development. Native performance and access to device APIs.',
  
  // AI & Machine Learning
  'TensorFlow Terrace': 'Open-source machine learning framework. Build and deploy ML models.',
  'PyTorch Place': 'Deep learning framework with dynamic computation graphs.',
  
  // Utilities & Special
  'Water Works': 'Essential utility service. Provides clean water infrastructure.',
  'Electric Company': 'Power generation and distribution. Critical infrastructure service.',
  
  // Special Spaces
  'GO': 'Start your coding journey! Collect $200 when you pass.',
  'Jail': 'Debug Hell - Fix your bugs before continuing.',
  'Free Parking': 'Take a break. No rent to pay here.',
  'Go to Jail': 'Critical bug detected! Go directly to Debug Hell.',
  'Income Tax': 'Pay your technical debt. 10% or $200, whichever is higher.',
  'Luxury Tax': 'Premium tools tax. Pay $75.',
  'Chance': 'Draw a chance card. Random coding events await!',
  'PR Card': 'Pull Request Card - Code review and merge opportunities.',
  'Bug Card': 'Bug Card - Unexpected errors and debugging challenges.',
};

// Get description for a property
export const getPropertyDescription = (propertyName: string): string => {
  return PROPERTY_DESCRIPTIONS[propertyName] || `${propertyName} - A valuable coding property in the tech ecosystem.`;
};

