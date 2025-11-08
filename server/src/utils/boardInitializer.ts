import { IProperty } from '../models/Game.js';

export function initializeBoard(): IProperty[] {
  return [
    // GO
    { id: 'go', name: 'GO', position: 0, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#00FF00', category: 'arrays', houses: 0, isSpecial: true, specialType: 'go' },
    
    // Brown properties (Easy Arrays)
    { id: 'mediterranean', name: 'Mediterranean Avenue', position: 1, price: 60, rent: 2, rentWithHouse: [10, 30, 90, 160], rentWithHotel: 250, houseCost: 50, color: '#8B4513', category: 'arrays', houses: 0 },
    { id: 'baltic', name: 'Baltic Avenue', position: 3, price: 60, rent: 4, rentWithHouse: [20, 60, 180, 320], rentWithHotel: 450, houseCost: 50, color: '#8B4513', category: 'arrays', houses: 0 },
    
    // Light Blue (Easy Strings)
    { id: 'oriental', name: 'Oriental Avenue', position: 6, price: 100, rent: 6, rentWithHouse: [30, 90, 270, 400], rentWithHotel: 550, houseCost: 50, color: '#87CEEB', category: 'strings', houses: 0 },
    { id: 'vermont', name: 'Vermont Avenue', position: 8, price: 100, rent: 6, rentWithHouse: [30, 90, 270, 400], rentWithHotel: 550, houseCost: 50, color: '#87CEEB', category: 'strings', houses: 0 },
    { id: 'connecticut', name: 'Connecticut Avenue', position: 9, price: 120, rent: 8, rentWithHouse: [40, 100, 300, 450], rentWithHotel: 600, houseCost: 50, color: '#87CEEB', category: 'strings', houses: 0 },
    
    // Pink (Medium DP)
    { id: 'st-charles', name: 'St. Charles Place', position: 11, price: 140, rent: 10, rentWithHouse: [50, 150, 450, 625], rentWithHotel: 750, houseCost: 100, color: '#FF69B4', category: 'dp', houses: 0 },
    { id: 'states', name: 'States Avenue', position: 13, price: 140, rent: 10, rentWithHouse: [50, 150, 450, 625], rentWithHotel: 750, houseCost: 100, color: '#FF69B4', category: 'dp', houses: 0 },
    { id: 'virginia', name: 'Virginia Avenue', position: 14, price: 160, rent: 12, rentWithHouse: [60, 180, 500, 700], rentWithHotel: 900, houseCost: 100, color: '#FF69B4', category: 'dp', houses: 0 },
    
    // Orange (Medium Arrays)
    { id: 'st-james', name: 'St. James Place', position: 16, price: 180, rent: 14, rentWithHouse: [70, 200, 550, 750], rentWithHotel: 950, houseCost: 100, color: '#FF8C00', category: 'arrays', houses: 0 },
    { id: 'tennessee', name: 'Tennessee Avenue', position: 18, price: 180, rent: 14, rentWithHouse: [70, 200, 550, 750], rentWithHotel: 950, houseCost: 100, color: '#FF8C00', category: 'arrays', houses: 0 },
    { id: 'new-york', name: 'New York Avenue', position: 19, price: 200, rent: 16, rentWithHouse: [80, 220, 600, 800], rentWithHotel: 1000, houseCost: 100, color: '#FF8C00', category: 'arrays', houses: 0 },
    
    // Red (Hard DP)
    { id: 'kentucky', name: 'Kentucky Avenue', position: 21, price: 220, rent: 18, rentWithHouse: [90, 250, 700, 875], rentWithHotel: 1050, houseCost: 150, color: '#DC143C', category: 'dp', houses: 0 },
    { id: 'indiana', name: 'Indiana Avenue', position: 23, price: 220, rent: 18, rentWithHouse: [90, 250, 700, 875], rentWithHotel: 1050, houseCost: 150, color: '#DC143C', category: 'dp', houses: 0 },
    { id: 'illinois', name: 'Illinois Avenue', position: 24, price: 240, rent: 20, rentWithHouse: [100, 300, 750, 925], rentWithHotel: 1100, houseCost: 150, color: '#DC143C', category: 'dp', houses: 0 },
    
    // Yellow (Hard Graphs)
    { id: 'atlantic', name: 'Atlantic Avenue', position: 26, price: 260, rent: 22, rentWithHouse: [110, 330, 800, 975], rentWithHotel: 1150, houseCost: 150, color: '#FFD700', category: 'graphs', houses: 0 },
    { id: 'ventnor', name: 'Ventnor Avenue', position: 27, price: 260, rent: 22, rentWithHouse: [110, 330, 800, 975], rentWithHotel: 1150, houseCost: 150, color: '#FFD700', category: 'graphs', houses: 0 },
    { id: 'marvin', name: 'Marvin Gardens', position: 29, price: 280, rent: 24, rentWithHouse: [120, 360, 850, 1025], rentWithHotel: 1200, houseCost: 150, color: '#FFD700', category: 'graphs', houses: 0 },
    
    // Green (Hard Trees)
    { id: 'pacific', name: 'Pacific Avenue', position: 31, price: 300, rent: 26, rentWithHouse: [130, 390, 900, 1100], rentWithHotel: 1275, houseCost: 200, color: '#228B22', category: 'trees', houses: 0 },
    { id: 'north-carolina', name: 'North Carolina Avenue', position: 32, price: 300, rent: 26, rentWithHouse: [130, 390, 900, 1100], rentWithHotel: 1275, houseCost: 200, color: '#228B22', category: 'trees', houses: 0 },
    { id: 'pennsylvania', name: 'Pennsylvania Avenue', position: 34, price: 320, rent: 28, rentWithHouse: [150, 450, 1000, 1200], rentWithHotel: 1400, houseCost: 200, color: '#228B22', category: 'trees', houses: 0 },
    
    // Dark Blue (Hard System Design)
    { id: 'park-place', name: 'Park Place', position: 37, price: 350, rent: 35, rentWithHouse: [175, 500, 1100, 1300], rentWithHotel: 1500, houseCost: 200, color: '#00008B', category: 'system-design', houses: 0 },
    { id: 'boardwalk', name: 'Boardwalk', position: 39, price: 400, rent: 50, rentWithHouse: [200, 600, 1400, 1700], rentWithHotel: 2000, houseCost: 200, color: '#00008B', category: 'system-design', houses: 0 },
    
    // Railroads (System Design)
    { id: 'reading-rr', name: 'Reading Railroad', position: 5, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'system-design', houses: 0, isRailroad: true },
    { id: 'pennsylvania-rr', name: 'Pennsylvania Railroad', position: 15, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'system-design', houses: 0, isRailroad: true },
    { id: 'bno-rr', name: 'B&O Railroad', position: 25, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'system-design', houses: 0, isRailroad: true },
    { id: 'short-line', name: 'Short Line', position: 35, price: 200, rent: 25, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#000000', category: 'system-design', houses: 0, isRailroad: true },
    
    // Utilities (SQL)
    { id: 'electric', name: 'Electric Company', position: 12, price: 150, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFFFFF', category: 'sql', houses: 0, isUtility: true },
    { id: 'water', name: 'Water Works', position: 28, price: 150, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFFFFF', category: 'sql', houses: 0, isUtility: true },
    
    // Special spaces
    { id: 'community-chest-1', name: 'Community Chest', position: 2, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'income-tax', name: 'Income Tax', position: 4, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FF6B6B', category: 'arrays', houses: 0, isSpecial: true },
    { id: 'chance-1', name: 'Chance', position: 7, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'jail', name: 'Jail', position: 10, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#8B4513', category: 'arrays', houses: 0, isSpecial: true, specialType: 'jail' },
    { id: 'community-chest-2', name: 'Community Chest', position: 17, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'free-parking', name: 'Free Parking', position: 20, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#00FF00', category: 'arrays', houses: 0, isSpecial: true, specialType: 'free-parking' },
    { id: 'chance-2', name: 'Chance', position: 22, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'go-to-jail', name: 'Go To Jail', position: 30, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#8B4513', category: 'arrays', houses: 0, isSpecial: true, specialType: 'go-to-jail' },
    { id: 'community-chest-3', name: 'Community Chest', position: 33, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'community-chest' },
    { id: 'chance-3', name: 'Chance', position: 36, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FFD700', category: 'arrays', houses: 0, isSpecial: true, specialType: 'chance' },
    { id: 'luxury-tax', name: 'Luxury Tax', position: 38, price: 0, rent: 0, rentWithHouse: [], rentWithHotel: 0, houseCost: 0, color: '#FF6B6B', category: 'arrays', houses: 0, isSpecial: true },
  ];
}

