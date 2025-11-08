import { Property } from '@/types/game';

export const boardProperties: Property[] = [
  // Go
  { id: 'go', name: 'GO', position: 0, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  
  // Brown properties (Easy Arrays)
  { id: 'mediterranean', name: 'Mediterranean Avenue', position: 1, price: 60, rent: 2, rentWithHouse: 10, rentWithHotel: 30, houseCost: 50, hotelCost: 50, category: 'arrays', color: '#8B4513', houses: 0 },
  { id: 'baltic', name: 'Baltic Avenue', position: 3, price: 60, rent: 4, rentWithHouse: 20, rentWithHotel: 60, houseCost: 50, hotelCost: 50, category: 'arrays', color: '#8B4513', houses: 0 },
  
  // Light Blue (Easy Strings)
  { id: 'oriental', name: 'Oriental Avenue', position: 6, price: 100, rent: 6, rentWithHouse: 30, rentWithHotel: 90, houseCost: 50, hotelCost: 50, category: 'strings', color: '#87CEEB', houses: 0 },
  { id: 'vermont', name: 'Vermont Avenue', position: 8, price: 100, rent: 6, rentWithHouse: 30, rentWithHotel: 90, houseCost: 50, hotelCost: 50, category: 'strings', color: '#87CEEB', houses: 0 },
  { id: 'connecticut', name: 'Connecticut Avenue', position: 9, price: 120, rent: 8, rentWithHouse: 40, rentWithHotel: 100, houseCost: 50, hotelCost: 50, category: 'strings', color: '#87CEEB', houses: 0 },
  
  // Pink (Medium DP)
  { id: 'st-charles', name: 'St. Charles Place', position: 11, price: 140, rent: 10, rentWithHouse: 50, rentWithHotel: 150, houseCost: 100, hotelCost: 100, category: 'dp', color: '#FF69B4', houses: 0 },
  { id: 'states', name: 'States Avenue', position: 13, price: 140, rent: 10, rentWithHouse: 50, rentWithHotel: 150, houseCost: 100, hotelCost: 100, category: 'dp', color: '#FF69B4', houses: 0 },
  { id: 'virginia', name: 'Virginia Avenue', position: 14, price: 160, rent: 12, rentWithHouse: 60, rentWithHotel: 180, houseCost: 100, hotelCost: 100, category: 'dp', color: '#FF69B4', houses: 0 },
  
  // Orange (Medium Arrays)
  { id: 'st-james', name: 'St. James Place', position: 16, price: 180, rent: 14, rentWithHouse: 70, rentWithHotel: 200, houseCost: 100, hotelCost: 100, category: 'arrays', color: '#FF8C00', houses: 0 },
  { id: 'tennessee', name: 'Tennessee Avenue', position: 18, price: 180, rent: 14, rentWithHouse: 70, rentWithHotel: 200, houseCost: 100, hotelCost: 100, category: 'arrays', color: '#FF8C00', houses: 0 },
  { id: 'new-york', name: 'New York Avenue', position: 19, price: 200, rent: 16, rentWithHouse: 80, rentWithHotel: 220, houseCost: 100, hotelCost: 100, category: 'arrays', color: '#FF8C00', houses: 0 },
  
  // Red (Hard DP)
  { id: 'kentucky', name: 'Kentucky Avenue', position: 21, price: 220, rent: 18, rentWithHouse: 90, rentWithHotel: 250, houseCost: 150, hotelCost: 150, category: 'dp', color: '#DC143C', houses: 0 },
  { id: 'indiana', name: 'Indiana Avenue', position: 23, price: 220, rent: 18, rentWithHouse: 90, rentWithHotel: 250, houseCost: 150, hotelCost: 150, category: 'dp', color: '#DC143C', houses: 0 },
  { id: 'illinois', name: 'Illinois Avenue', position: 24, price: 240, rent: 20, rentWithHouse: 100, rentWithHotel: 300, houseCost: 150, hotelCost: 150, category: 'dp', color: '#DC143C', houses: 0 },
  
  // Yellow (Hard Graphs)
  { id: 'atlantic', name: 'Atlantic Avenue', position: 26, price: 260, rent: 22, rentWithHouse: 110, rentWithHotel: 330, houseCost: 150, hotelCost: 150, category: 'graphs', color: '#FFD700', houses: 0 },
  { id: 'ventnor', name: 'Ventnor Avenue', position: 27, price: 260, rent: 22, rentWithHouse: 110, rentWithHotel: 330, houseCost: 150, hotelCost: 150, category: 'graphs', color: '#FFD700', houses: 0 },
  { id: 'marvin', name: 'Marvin Gardens', position: 29, price: 280, rent: 24, rentWithHouse: 120, rentWithHotel: 360, houseCost: 150, hotelCost: 150, category: 'graphs', color: '#FFD700', houses: 0 },
  
  // Green (Hard Trees)
  { id: 'pacific', name: 'Pacific Avenue', position: 31, price: 300, rent: 26, rentWithHouse: 130, rentWithHotel: 390, houseCost: 200, hotelCost: 200, category: 'trees', color: '#228B22', houses: 0 },
  { id: 'north-carolina', name: 'North Carolina Avenue', position: 32, price: 300, rent: 26, rentWithHouse: 130, rentWithHotel: 390, houseCost: 200, hotelCost: 200, category: 'trees', color: '#228B22', houses: 0 },
  { id: 'pennsylvania', name: 'Pennsylvania Avenue', position: 34, price: 320, rent: 28, rentWithHouse: 150, rentWithHotel: 450, houseCost: 200, hotelCost: 200, category: 'trees', color: '#228B22', houses: 0 },
  
  // Dark Blue (Hard System Design)
  { id: 'park-place', name: 'Park Place', position: 37, price: 350, rent: 35, rentWithHouse: 175, rentWithHotel: 500, houseCost: 200, hotelCost: 200, category: 'system-design', color: '#00008B', houses: 0 },
  { id: 'boardwalk', name: 'Boardwalk', position: 39, price: 400, rent: 50, rentWithHouse: 200, rentWithHotel: 600, houseCost: 200, hotelCost: 200, category: 'system-design', color: '#00008B', houses: 0 },
  
  // Railroads (System Design)
  { id: 'reading-rr', name: 'Reading Railroad', position: 5, price: 200, rent: 25, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'system-design', color: '#000000', houses: 0, isRailroad: true },
  { id: 'pennsylvania-rr', name: 'Pennsylvania Railroad', position: 15, price: 200, rent: 25, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'system-design', color: '#000000', houses: 0, isRailroad: true },
  { id: 'bno-rr', name: 'B&O Railroad', position: 25, price: 200, rent: 25, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'system-design', color: '#000000', houses: 0, isRailroad: true },
  { id: 'short-line', name: 'Short Line', position: 35, price: 200, rent: 25, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'system-design', color: '#000000', houses: 0, isRailroad: true },
  
  // Utilities (SQL)
  { id: 'electric', name: 'Electric Company', position: 12, price: 150, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'sql', color: '#FFFFFF', houses: 0, isUtility: true },
  { id: 'water', name: 'Water Works', position: 28, price: 150, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'sql', color: '#FFFFFF', houses: 0, isUtility: true },
  
  // Special spaces
  { id: 'jail', name: 'Jail / Debug Hell', position: 10, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'free-parking', name: 'Free Parking', position: 20, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'go-to-jail', name: 'Go To Jail', position: 30, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'chance', name: 'Chance', position: 7, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'community-chest', name: 'Community Chest', position: 2, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'income-tax', name: 'Income Tax', position: 4, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
  { id: 'luxury-tax', name: 'Luxury Tax', position: 38, price: 0, rent: 0, rentWithHouse: 0, rentWithHotel: 0, houseCost: 0, hotelCost: 0, category: 'arrays', color: 'transparent', houses: 0 },
];

export function getPropertyAtPosition(position: number): Property | undefined {
  return boardProperties.find(p => p.position === position);
}

export function getAllProperties(): Property[] {
  return boardProperties.filter(p => p.price > 0); // Exclude special spaces
}

