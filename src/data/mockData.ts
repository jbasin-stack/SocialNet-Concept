import { User, Connection } from '../types';

// Current user (center of network)
const currentUser: User = {
  id: 'user-0',
  name: 'You',
  profile: {
    bio: 'Product designer passionate about human-centered design and building meaningful connections through technology.',
    interests: ['Design', 'Photography', 'Hiking'],
    location: 'San Francisco, CA',
    funFact: 'I once hiked the entire Pacific Crest Trail!',
    industry: 'Tech'
  }
};

// Close connections (3-4 users, strength 80-100)
const closeConnections: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    profile: {
      bio: 'Frontend engineer building delightful user experiences. Coffee enthusiast and amateur photographer capturing city life.',
      interests: ['Photography', 'Coffee', 'Web Development'],
      location: 'San Francisco, CA',
      funFact: 'I have visited 30 different coffee roasters in the Bay Area!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-2',
    name: 'Marcus Johnson',
    profile: {
      bio: 'UX researcher uncovering user insights. Love running, cooking, and exploring new restaurants with friends.',
      interests: ['Running', 'Cooking', 'User Research'],
      location: 'Oakland, CA',
      funFact: 'I ran my first marathon last year in under 4 hours!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-3',
    name: 'Emily Rodriguez',
    profile: {
      bio: 'Product manager shipping features that matter. Passionate about music, travel, and building community through technology.',
      interests: ['Music', 'Travel', 'Product Strategy'],
      location: 'San Francisco, CA',
      funFact: 'I play guitar in a local indie band on weekends!',
      industry: 'Tech'
    }
  }
];

// Medium connections (5-6 users, strength 40-79)
const mediumConnections: User[] = [
  {
    id: 'user-4',
    name: 'David Kim',
    profile: {
      bio: 'Data scientist exploring patterns in complex systems. Tennis player and board game enthusiast.',
      interests: ['Data Science', 'Tennis', 'Board Games'],
      location: 'Seattle, WA',
      funFact: 'I own over 50 board games and host game nights monthly!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-5',
    name: 'Lisa Patel',
    profile: {
      bio: 'Healthcare administrator improving patient experiences. Yoga instructor and wellness advocate in my free time.',
      interests: ['Healthcare', 'Yoga', 'Wellness'],
      location: 'Austin, TX',
      funFact: 'I teach free yoga classes at a community center every Sunday!',
      industry: 'Healthcare'
    }
  },
  {
    id: 'user-6',
    name: 'James Wilson',
    profile: {
      bio: 'Software architect designing scalable systems. Love hiking, reading sci-fi, and tinkering with smart home tech.',
      interests: ['Hiking', 'Reading', 'Smart Home'],
      location: 'Denver, CO',
      funFact: 'My home is fully automated - even my coffee brews itself!',
      industry: 'Tech'
    }
  },
  {
    id: 'user-7',
    name: 'Aisha Mohammed',
    profile: {
      bio: 'Financial analyst helping startups grow. Marathon runner and volunteer mentor for aspiring entrepreneurs.',
      interests: ['Finance', 'Running', 'Mentorship'],
      location: 'New York, NY',
      funFact: 'I have completed marathons on all 7 continents!',
      industry: 'Finance'
    }
  },
  {
    id: 'user-8',
    name: 'Carlos Gomez',
    profile: {
      bio: 'Creative director crafting brand stories. Film buff, street photographer, and weekend DJ spinning vinyl.',
      interests: ['Design', 'Film', 'Music'],
      location: 'Los Angeles, CA',
      funFact: 'I collect vintage cameras and have over 20 in my collection!',
      industry: 'Creative'
    }
  }
];

// Distant connections (6-10 users, strength 10-39)
const distantConnections: User[] = [
  {
    id: 'user-9',
    name: 'Nina Petrov',
    profile: {
      bio: 'Teacher inspiring the next generation. Love gardening, painting, and exploring local farmers markets.',
      interests: ['Education', 'Gardening', 'Art'],
      location: 'Portland, OR',
      funFact: 'I grow all my own vegetables in my backyard garden!',
      industry: 'Education'
    }
  },
  {
    id: 'user-10',
    name: 'Ryan O\'Brien',
    profile: {
      bio: 'Sales manager connecting people with solutions. Golfer, wine enthusiast, and aspiring sommelier.',
      interests: ['Golf', 'Wine', 'Networking'],
      location: 'Chicago, IL',
      funFact: 'I have tasted wines from over 15 different countries!',
      industry: 'Retail'
    }
  },
  {
    id: 'user-11',
    name: 'Priya Sharma',
    profile: {
      bio: 'Biotech researcher working on sustainable solutions. Cyclist, baker, and environmental activist.',
      interests: ['Science', 'Cycling', 'Baking'],
      location: 'Boston, MA',
      funFact: 'I bake sourdough bread and share it with my neighbors weekly!',
      industry: 'Healthcare'
    }
  },
  {
    id: 'user-12',
    name: 'Tom Anderson',
    profile: {
      bio: 'Mechanical engineer building the future of transportation. Rock climber and camping enthusiast.',
      interests: ['Engineering', 'Climbing', 'Camping'],
      location: 'Detroit, MI',
      funFact: 'I have climbed every major rock face in Yosemite!',
      industry: 'Manufacturing'
    }
  },
  {
    id: 'user-13',
    name: 'Maya Lee',
    profile: {
      bio: 'Journalist telling stories that matter. Podcast host, avid reader, and language learner studying Mandarin.',
      interests: ['Writing', 'Podcasts', 'Languages'],
      location: 'Washington, DC',
      funFact: 'I speak 4 languages and am learning my fifth!',
      industry: 'Media'
    }
  },
  {
    id: 'user-14',
    name: 'Alex Turner',
    profile: {
      bio: 'Chef creating fusion cuisine experiences. Forager, homebrewer, and culinary adventurer.',
      interests: ['Cooking', 'Brewing', 'Foraging'],
      location: 'Nashville, TN',
      funFact: 'I brew my own beer and have won local competitions!',
      industry: 'Hospitality'
    }
  },
  {
    id: 'user-15',
    name: 'Zoe Martin',
    profile: {
      bio: 'Graphic designer bringing ideas to life. Illustrator, skateboarder, and vintage fashion collector.',
      interests: ['Design', 'Skateboarding', 'Fashion'],
      location: 'Miami, FL',
      funFact: 'I design custom skateboard decks in my spare time!',
      industry: 'Creative'
    }
  },
  {
    id: 'user-16',
    name: 'Hassan Ali',
    profile: {
      bio: 'Architect designing sustainable spaces. Urban explorer, photographer, and history buff.',
      interests: ['Architecture', 'Photography', 'History'],
      location: 'Philadelphia, PA',
      funFact: 'I have photographed over 100 historical buildings in Philly!',
      industry: 'Architecture'
    }
  },
  {
    id: 'user-17',
    name: 'Rachel Green',
    profile: {
      bio: 'Marketing strategist driving brand growth. Podcast addict, yoga practitioner, and plant parent to 25 houseplants.',
      interests: ['Marketing', 'Yoga', 'Plants'],
      location: 'Atlanta, GA',
      funFact: 'I have named all 25 of my houseplants and talk to them daily!',
      industry: 'Marketing'
    }
  },
  {
    id: 'user-18',
    name: 'Kevin Tanaka',
    profile: {
      bio: 'Environmental scientist studying climate patterns. Surfer, birdwatcher, and advocate for ocean conservation.',
      interests: ['Science', 'Surfing', 'Conservation'],
      location: 'San Diego, CA',
      funFact: 'I have surfed in three different oceans on four continents!',
      industry: 'Environmental'
    }
  },
  {
    id: 'user-19',
    name: 'Sofia Morales',
    profile: {
      bio: 'Event coordinator creating memorable experiences. Dancer, foodie, and weekend volunteer at animal shelters.',
      interests: ['Events', 'Dancing', 'Animals'],
      location: 'Phoenix, AZ',
      funFact: 'I have fostered over 20 rescue dogs in the past three years!',
      industry: 'Hospitality'
    }
  }
];

export const allUsers: User[] = [
  currentUser,
  ...closeConnections,
  ...mediumConnections,
  ...distantConnections
];

// Connection matrix
export const connections: Connection[] = [
  // Close connections (80-100 strength)
  { userId1: 'user-0', userId2: 'user-1', strength: 95, interactionCount: 47, lastInteraction: new Date('2026-01-28') },
  { userId1: 'user-0', userId2: 'user-2', strength: 88, interactionCount: 38, lastInteraction: new Date('2026-01-30') },
  { userId1: 'user-0', userId2: 'user-3', strength: 92, interactionCount: 42, lastInteraction: new Date('2026-01-29') },

  // Medium connections (40-79 strength)
  { userId1: 'user-0', userId2: 'user-4', strength: 65, interactionCount: 22, lastInteraction: new Date('2026-01-25') },
  { userId1: 'user-0', userId2: 'user-5', strength: 58, interactionCount: 18, lastInteraction: new Date('2026-01-20') },
  { userId1: 'user-0', userId2: 'user-6', strength: 71, interactionCount: 25, lastInteraction: new Date('2026-01-27') },
  { userId1: 'user-0', userId2: 'user-7', strength: 54, interactionCount: 16, lastInteraction: new Date('2026-01-15') },
  { userId1: 'user-0', userId2: 'user-8', strength: 62, interactionCount: 20, lastInteraction: new Date('2026-01-22') },

  // Distant connections (10-39 strength)
  { userId1: 'user-0', userId2: 'user-9', strength: 28, interactionCount: 8, lastInteraction: new Date('2025-12-10') },
  { userId1: 'user-0', userId2: 'user-10', strength: 15, interactionCount: 4, lastInteraction: new Date('2025-11-20') },
  { userId1: 'user-0', userId2: 'user-11', strength: 32, interactionCount: 10, lastInteraction: new Date('2026-01-05') },
  { userId1: 'user-0', userId2: 'user-12', strength: 22, interactionCount: 6, lastInteraction: new Date('2025-12-28') },
  { userId1: 'user-0', userId2: 'user-13', strength: 18, interactionCount: 5, lastInteraction: new Date('2025-11-15') },
  { userId1: 'user-0', userId2: 'user-14', strength: 35, interactionCount: 11, lastInteraction: new Date('2026-01-10') },
  { userId1: 'user-0', userId2: 'user-15', strength: 25, interactionCount: 7, lastInteraction: new Date('2025-12-15') },
  { userId1: 'user-0', userId2: 'user-16', strength: 30, interactionCount: 9, lastInteraction: new Date('2026-01-08') },
  { userId1: 'user-0', userId2: 'user-17', strength: 20, interactionCount: 6, lastInteraction: new Date('2025-12-01') },
  { userId1: 'user-0', userId2: 'user-18', strength: 12, interactionCount: 3, lastInteraction: new Date('2025-10-15') },
  { userId1: 'user-0', userId2: 'user-19', strength: 27, interactionCount: 8, lastInteraction: new Date('2025-12-20') },
];

export const CURRENT_USER_ID = 'user-0';
