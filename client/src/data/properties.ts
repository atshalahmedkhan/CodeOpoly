export interface Property {
  id: string;
  name: string;
  cost: number;
  baseRent: number;
  rent: number[]; // [base, 1 house, 2 houses, 3 houses, 4 houses, hotel]
  group: 'frontend' | 'backend' | 'cloud' | 'devops' | 'database' | 'mobile' | 'ai' | 'security';
  position: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  houseCost?: number;
  isSpecial?: boolean;
  specialType?: 'go' | 'jail' | 'free-parking' | 'go-to-jail' | 'chance' | 'community-chest' | 'tax';
  ownerId?: string; // Owner player ID
  houses?: number; // Number of houses (0-5, 5 = hotel)
}

export const PROPERTIES: Property[] = [
  // Position 0: GO
  {
    id: 'go',
    name: 'GO',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'frontend',
    position: 0,
    difficulty: 'easy',
    color: '#00FFA3',
    isSpecial: true,
    specialType: 'go',
  },
  
  // Brown Group (Frontend Basics) - Positions 1-2
  {
    id: 'github-ave',
    name: 'GitHub Ave',
    cost: 60,
    baseRent: 2,
    rent: [2, 10, 30, 90, 160, 250],
    group: 'frontend',
    position: 1,
    difficulty: 'easy',
    color: '#8B4513',
    houseCost: 50,
  },
  {
    id: 'npm-street',
    name: 'NPM Street',
    cost: 60,
    baseRent: 4,
    rent: [4, 20, 60, 180, 320, 450],
    group: 'frontend',
    position: 2,
    difficulty: 'easy',
    color: '#8B4513',
    houseCost: 50,
  },
  
  // Position 3: Community Chest
  {
    id: 'community-chest-1',
    name: 'PR Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'frontend',
    position: 3,
    difficulty: 'easy',
    color: '#87CEEB',
    isSpecial: true,
    specialType: 'community-chest',
  },
  
  // Light Blue Group (Backend) - Positions 4-6
  {
    id: 'express-boulevard',
    name: 'Express Blvd',
    cost: 100,
    baseRent: 6,
    rent: [6, 30, 90, 270, 400, 550],
    group: 'backend',
    position: 4,
    difficulty: 'easy',
    color: '#87CEEB',
    houseCost: 50,
  },
  {
    id: 'nodejs-avenue',
    name: 'Node.js Avenue',
    cost: 100,
    baseRent: 6,
    rent: [6, 30, 90, 270, 400, 550],
    group: 'backend',
    position: 5,
    difficulty: 'easy',
    color: '#87CEEB',
    houseCost: 50,
  },
  {
    id: 'python-parkway',
    name: 'Python Parkway',
    cost: 120,
    baseRent: 8,
    rent: [8, 40, 100, 300, 450, 600],
    group: 'backend',
    position: 6,
    difficulty: 'easy',
    color: '#87CEEB',
    houseCost: 50,
  },
  
  // Position 7: Chance
  {
    id: 'chance-1',
    name: 'Bug Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'backend',
    position: 7,
    difficulty: 'easy',
    color: '#FF69B4',
    isSpecial: true,
    specialType: 'chance',
  },
  
  // Pink Group (Cloud) - Positions 8-10
  {
    id: 'aws-street',
    name: 'AWS Street',
    cost: 140,
    baseRent: 10,
    rent: [10, 50, 150, 450, 625, 750],
    group: 'cloud',
    position: 8,
    difficulty: 'medium',
    color: '#FF69B4',
    houseCost: 100,
  },
  {
    id: 'azure-avenue',
    name: 'Azure Avenue',
    cost: 140,
    baseRent: 10,
    rent: [10, 50, 150, 450, 625, 750],
    group: 'cloud',
    position: 9,
    difficulty: 'medium',
    color: '#FF69B4',
    houseCost: 100,
  },
  
  // Position 10: Jail / Debug Hell
  {
    id: 'jail',
    name: 'Debug Hell',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'cloud',
    position: 10,
    difficulty: 'medium',
    color: '#FF8C00',
    isSpecial: true,
    specialType: 'jail',
  },
  
  // Orange Group (DevOps) - Positions 11-13
  {
    id: 'docker-dock',
    name: 'Docker Dock',
    cost: 160,
    baseRent: 12,
    rent: [12, 60, 180, 500, 700, 900],
    group: 'devops',
    position: 11,
    difficulty: 'medium',
    color: '#FF8C00',
    houseCost: 100,
  },
  {
    id: 'kubernetes-parkway',
    name: 'Kubernetes Pkwy',
    cost: 180,
    baseRent: 14,
    rent: [14, 70, 200, 550, 750, 950],
    group: 'devops',
    position: 12,
    difficulty: 'medium',
    color: '#FF8C00',
    houseCost: 100,
  },
  {
    id: 'jenkins-lane',
    name: 'Jenkins Lane',
    cost: 180,
    baseRent: 14,
    rent: [14, 70, 200, 550, 750, 950],
    group: 'devops',
    position: 13,
    difficulty: 'medium',
    color: '#FF8C00',
    houseCost: 100,
  },
  
  // Position 14: Community Chest
  {
    id: 'community-chest-2',
    name: 'PR Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'devops',
    position: 14,
    difficulty: 'medium',
    color: '#DC143C',
    isSpecial: true,
    specialType: 'community-chest',
  },
  
  // Red Group (Database) - Positions 15-17
  {
    id: 'postgres-place',
    name: 'PostgreSQL Place',
    cost: 200,
    baseRent: 16,
    rent: [16, 80, 220, 600, 800, 1000],
    group: 'database',
    position: 15,
    difficulty: 'medium',
    color: '#DC143C',
    houseCost: 100,
  },
  {
    id: 'mongodb-street',
    name: 'MongoDB Street',
    cost: 220,
    baseRent: 18,
    rent: [18, 90, 250, 700, 875, 1050],
    group: 'database',
    position: 16,
    difficulty: 'medium',
    color: '#DC143C',
    houseCost: 150,
  },
  {
    id: 'redis-road',
    name: 'Redis Road',
    cost: 220,
    baseRent: 18,
    rent: [18, 90, 250, 700, 875, 1050],
    group: 'database',
    position: 17,
    difficulty: 'medium',
    color: '#DC143C',
    houseCost: 150,
  },
  
  // Position 18: Chance
  {
    id: 'chance-2',
    name: 'Bug Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'database',
    position: 18,
    difficulty: 'medium',
    color: '#FFD700',
    isSpecial: true,
    specialType: 'chance',
  },
  
  // Yellow Group (Mobile) - Positions 19-21
  {
    id: 'react-native-ave',
    name: 'React Native Ave',
    cost: 240,
    baseRent: 20,
    rent: [20, 100, 300, 750, 925, 1100],
    group: 'mobile',
    position: 19,
    difficulty: 'medium',
    color: '#FFD700',
    houseCost: 150,
  },
  {
    id: 'flutter-street',
    name: 'Flutter Street',
    cost: 260,
    baseRent: 22,
    rent: [22, 110, 330, 800, 975, 1150],
    group: 'mobile',
    position: 20,
    difficulty: 'medium',
    color: '#FFD700',
    houseCost: 150,
  },
  {
    id: 'swift-boulevard',
    name: 'Swift Boulevard',
    cost: 260,
    baseRent: 22,
    rent: [22, 110, 330, 800, 975, 1150],
    group: 'mobile',
    position: 21,
    difficulty: 'medium',
    color: '#FFD700',
    houseCost: 150,
  },
  
  // Position 22: Free Parking
  {
    id: 'free-parking',
    name: 'Free Parking',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'mobile',
    position: 22,
    difficulty: 'medium',
    color: '#228B22',
    isSpecial: true,
    specialType: 'free-parking',
  },
  
  // Green Group (AI/ML) - Positions 23-25
  {
    id: 'tensorflow-terrace',
    name: 'TensorFlow Terrace',
    cost: 280,
    baseRent: 24,
    rent: [24, 120, 360, 850, 1025, 1200],
    group: 'ai',
    position: 23,
    difficulty: 'hard',
    color: '#228B22',
    houseCost: 150,
  },
  {
    id: 'pytorch-place',
    name: 'PyTorch Place',
    cost: 300,
    baseRent: 26,
    rent: [26, 130, 390, 900, 1100, 1275],
    group: 'ai',
    position: 24,
    difficulty: 'hard',
    color: '#228B22',
    houseCost: 200,
  },
  {
    id: 'openai-street',
    name: 'OpenAI Street',
    cost: 300,
    baseRent: 26,
    rent: [26, 130, 390, 900, 1100, 1275],
    group: 'ai',
    position: 25,
    difficulty: 'hard',
    color: '#228B22',
    houseCost: 200,
  },
  
  // Position 26: Chance
  {
    id: 'chance-3',
    name: 'Bug Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'ai',
    position: 26,
    difficulty: 'hard',
    color: '#00008B',
    isSpecial: true,
    specialType: 'chance',
  },
  
  // Dark Blue Group (Security) - Positions 27-29
  {
    id: 'oauth-avenue',
    name: 'OAuth Avenue',
    cost: 320,
    baseRent: 28,
    rent: [28, 150, 450, 1000, 1200, 1400],
    group: 'security',
    position: 27,
    difficulty: 'hard',
    color: '#00008B',
    houseCost: 200,
  },
  {
    id: 'jwt-boulevard',
    name: 'JWT Boulevard',
    cost: 350,
    baseRent: 35,
    rent: [35, 175, 500, 1100, 1300, 1500],
    group: 'security',
    position: 28,
    difficulty: 'hard',
    color: '#00008B',
    houseCost: 200,
  },
  
  // Position 29: Go to Jail
  {
    id: 'go-to-jail',
    name: 'Go to Debug Hell',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'security',
    position: 29,
    difficulty: 'hard',
    color: '#00008B',
    isSpecial: true,
    specialType: 'go-to-jail',
  },
  
  // Position 30: Community Chest
  {
    id: 'community-chest-3',
    name: 'PR Card',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'security',
    position: 30,
    difficulty: 'hard',
    color: '#8B4513',
    isSpecial: true,
    specialType: 'community-chest',
  },
  
  // Utilities (Railroads equivalent) - Positions 5, 15, 25, 35
  {
    id: 'ci-cd-pipeline',
    name: 'CI/CD Pipeline',
    cost: 200,
    baseRent: 25,
    rent: [25, 50, 100, 200],
    group: 'devops',
    position: 5,
    difficulty: 'medium',
    color: '#000000',
    isSpecial: true,
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    cost: 200,
    baseRent: 25,
    rent: [25, 50, 100, 200],
    group: 'cloud',
    position: 15,
    difficulty: 'medium',
    color: '#000000',
    isSpecial: true,
  },
  {
    id: 'cdn-network',
    name: 'CDN Network',
    cost: 200,
    baseRent: 25,
    rent: [25, 50, 100, 200],
    group: 'cloud',
    position: 25,
    difficulty: 'medium',
    color: '#000000',
    isSpecial: true,
  },
  {
    id: 'monitoring-stack',
    name: 'Monitoring Stack',
    cost: 200,
    baseRent: 25,
    rent: [25, 50, 100, 200],
    group: 'devops',
    position: 35,
    difficulty: 'medium',
    color: '#000000',
    isSpecial: true,
  },
  
  // Tax Spaces
  {
    id: 'code-review-tax',
    name: 'Code Review Tax',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'frontend',
    position: 4,
    difficulty: 'easy',
    color: '#FFFFFF',
    isSpecial: true,
    specialType: 'tax',
  },
  {
    id: 'tech-debt-tax',
    name: 'Tech Debt Tax',
    cost: 0,
    baseRent: 0,
    rent: [0],
    group: 'backend',
    position: 38,
    difficulty: 'hard',
    color: '#FFFFFF',
    isSpecial: true,
    specialType: 'tax',
  },
];

// Helper to get property by position
export const getPropertyByPosition = (position: number): Property | undefined => {
  return PROPERTIES.find(p => p.position === position);
};

// Helper to get properties by group
export const getPropertiesByGroup = (group: Property['group']): Property[] => {
  return PROPERTIES.filter(p => p.group === group && !p.isSpecial);
};

// Helper to get all regular properties (non-special)
export const getRegularProperties = (): Property[] => {
  return PROPERTIES.filter(p => !p.isSpecial);
};

