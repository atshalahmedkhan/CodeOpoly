import { IProperty } from '../models/Game.js';

export function initializeBoard(): IProperty[] {
  return [
    // GO (0)
    { id: 'go', name: 'GO', position: 0, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#00FFA3', category: 'special', houses: 0, isSpecial: true, specialType: 'go' },
    
    // Brown (1, 3)
    { id: 'github-ave', name: 'GitHub Ave', position: 1, price: 60, rent: 2, rentWithHouse: [10, 30, 90, 160], rentWithHotel: 250, houseCost: 50, color: '#8B4513', category: 'frontend', houses: 0 },
    { id: 'community-chest-1', name: 'PR Card', position: 2, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#87CEEB', category: 'special', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'npm-street', name: 'NPM Street', position: 3, price: 60, rent: 4, rentWithHouse: [20, 60, 180, 320], rentWithHotel: 450, houseCost: 50, color: '#8B4513', category: 'frontend', houses: 0 },
    { id: 'income-tax', name: 'Income Tax', position: 4, price: 0, rent: 200, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FF6B6B', category: 'special', houses: 0, isSpecial: true, specialType: 'tax' },
    { id: 'reading-railroad', name: 'CI/CD Pipeline', position: 5, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'railroad', houses: 0, isRailroad: true },
    
    // Light Blue (6, 8, 9)
    { id: 'express-blvd', name: 'Express Blvd', position: 6, price: 100, rent: 6, rentWithHouse: [30, 90, 270, 400], rentWithHotel: 550, houseCost: 50, color: '#87CEEB', category: 'backend', houses: 0 },
    { id: 'chance-1', name: 'Bug Card', position: 7, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'special', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'nodejs-ave', name: 'Node.js Avenue', position: 8, price: 100, rent: 6, rentWithHouse: [30, 90, 270, 400], rentWithHotel: 550, houseCost: 50, color: '#87CEEB', category: 'backend', houses: 0 },
    { id: 'python-pkwy', name: 'Python Parkway', position: 9, price: 120, rent: 8, rentWithHouse: [40, 100, 300, 450], rentWithHotel: 600, houseCost: 50, color: '#87CEEB', category: 'backend', houses: 0 },
    
    // Jail (10)
    { id: 'jail', name: 'Debug Hell', position: 10, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FF8C00', category: 'special', houses: 0, isSpecial: true, specialType: 'jail' },
    
    // Pink (11, 13, 14)
    { id: 'aws-street', name: 'AWS Street', position: 11, price: 140, rent: 10, rentWithHouse: [50, 150, 450, 625], rentWithHotel: 750, houseCost: 100, color: '#FF69B4', category: 'cloud', houses: 0 },
    { id: 'electric-company', name: 'Electric Company', position: 12, price: 150, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFFFFF', category: 'utility', houses: 0, isUtility: true },
    { id: 'azure-ave', name: 'Azure Avenue', position: 13, price: 140, rent: 10, rentWithHouse: [50, 150, 450, 625], rentWithHotel: 750, houseCost: 100, color: '#FF69B4', category: 'cloud', houses: 0 },
    { id: 'gcp-gardens', name: 'GCP Gardens', position: 14, price: 160, rent: 12, rentWithHouse: [60, 180, 500, 700], rentWithHotel: 900, houseCost: 100, color: '#FF69B4', category: 'cloud', houses: 0 },
    { id: 'pennsylvania-railroad', name: 'Load Balancer', position: 15, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'railroad', houses: 0, isRailroad: true },
    
    // Orange (16, 18, 19)
    { id: 'docker-dock', name: 'Docker Dock', position: 16, price: 180, rent: 14, rentWithHouse: [70, 200, 550, 750], rentWithHotel: 950, houseCost: 100, color: '#FF8C00', category: 'devops', houses: 0 },
    { id: 'community-chest-2', name: 'PR Card', position: 17, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'special', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'kubernetes-pkwy', name: 'Kubernetes Pkwy', position: 18, price: 180, rent: 14, rentWithHouse: [70, 200, 550, 750], rentWithHotel: 950, houseCost: 100, color: '#FF8C00', category: 'devops', houses: 0 },
    { id: 'jenkins-lane', name: 'Jenkins Lane', position: 19, price: 200, rent: 16, rentWithHouse: [80, 220, 600, 800], rentWithHotel: 1000, houseCost: 100, color: '#FF8C00', category: 'devops', houses: 0 },
    
    // Free Parking (20)
    { id: 'free-parking', name: 'Free Parking', position: 20, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#00FF00', category: 'special', houses: 0, isSpecial: true, specialType: 'free-parking' },
    
    // Red (21, 23, 24)
    { id: 'postgres-place', name: 'PostgreSQL Place', position: 21, price: 220, rent: 18, rentWithHouse: [90, 250, 700, 875], rentWithHotel: 1050, houseCost: 150, color: '#DC143C', category: 'database', houses: 0 },
    { id: 'chance-2', name: 'Bug Card', position: 22, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'special', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'mongodb-street', name: 'MongoDB Street', position: 23, price: 220, rent: 18, rentWithHouse: [90, 250, 700, 875], rentWithHotel: 1050, houseCost: 150, color: '#DC143C', category: 'database', houses: 0 },
    { id: 'redis-road', name: 'Redis Road', position: 24, price: 240, rent: 20, rentWithHouse: [100, 300, 750, 925], rentWithHotel: 1100, houseCost: 150, color: '#DC143C', category: 'database', houses: 0 },
    { id: 'bo-railroad', name: 'CDN Network', position: 25, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'railroad', houses: 0, isRailroad: true },
    
    // Yellow (26, 27, 29)
    { id: 'react-native-ave', name: 'React Native Ave', position: 26, price: 260, rent: 22, rentWithHouse: [110, 330, 800, 975], rentWithHotel: 1150, houseCost: 150, color: '#FFD700', category: 'mobile', houses: 0 },
    { id: 'flutter-street', name: 'Flutter Street', position: 27, price: 260, rent: 22, rentWithHouse: [110, 330, 800, 975], rentWithHotel: 1150, houseCost: 150, color: '#FFD700', category: 'mobile', houses: 0 },
    { id: 'water-works', name: 'Water Works', position: 28, price: 150, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFFFFF', category: 'utility', houses: 0, isUtility: true },
    { id: 'swift-blvd', name: 'Swift Boulevard', position: 29, price: 280, rent: 24, rentWithHouse: [120, 360, 850, 1025], rentWithHotel: 1200, houseCost: 150, color: '#FFD700', category: 'mobile', houses: 0 },
    
    // Go to Jail (30)
    { id: 'go-to-jail', name: 'Go to Debug Hell', position: 30, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#8B4513', category: 'special', houses: 0, isSpecial: true, specialType: 'go-to-jail' },
    
    // Green (31, 32, 34)
    { id: 'tensorflow-terrace', name: 'TensorFlow Terrace', position: 31, price: 300, rent: 26, rentWithHouse: [130, 390, 900, 1100], rentWithHotel: 1275, houseCost: 200, color: '#228B22', category: 'ai-ml', houses: 0 },
    { id: 'pytorch-place', name: 'PyTorch Place', position: 32, price: 300, rent: 26, rentWithHouse: [130, 390, 900, 1100], rentWithHotel: 1275, houseCost: 200, color: '#228B22', category: 'ai-ml', houses: 0 },
    { id: 'community-chest-3', name: 'PR Card', position: 33, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'special', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'openai-street', name: 'OpenAI Street', position: 34, price: 320, rent: 28, rentWithHouse: [150, 450, 1000, 1200], rentWithHotel: 1400, houseCost: 200, color: '#228B22', category: 'ai-ml', houses: 0 },
    { id: 'short-line', name: 'Monitoring Stack', position: 35, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'railroad', houses: 0, isRailroad: true },
    
    // Dark Blue (37, 39)
    { id: 'chance-3', name: 'Bug Card', position: 36, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'special', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'oauth-ave', name: 'OAuth Avenue', position: 37, price: 350, rent: 35, rentWithHouse: [175, 500, 1100, 1300], rentWithHotel: 1500, houseCost: 200, color: '#00008B', category: 'security', houses: 0 },
    { id: 'luxury-tax', name: 'Luxury Tax', position: 38, price: 0, rent: 100, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FF6B6B', category: 'special', houses: 0, isSpecial: true, specialType: 'tax' },
    { id: 'jwt-blvd', name: 'JWT Boulevard', position: 39, price: 400, rent: 50, rentWithHouse: [200, 600, 1400, 1700], rentWithHotel: 2000, houseCost: 200, color: '#00008B', category: 'security', houses: 0 },
  ];
}
