import { User } from '../types';

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Sage',
  'Avery', 'Blake', 'Cameron', 'Dakota', 'Eden', 'Finley', 'Harper', 'Hayden'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez',
  'Davis', 'Rodriguez', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson'
];

const INTERESTS_POOL = [
  'Photography', 'Hiking', 'Cooking', 'Reading', 'Music', 'Travel',
  'Gaming', 'Fitness', 'Art', 'Technology', 'Writing', 'Dancing',
  'Cycling', 'Swimming', 'Yoga', 'Meditation', 'Gardening', 'Coffee'
];

const LOCATIONS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
];

const INDUSTRIES = [
  'Tech', 'Healthcare', 'Finance', 'Creative', 'Education',
  'Marketing', 'Retail', 'Manufacturing', 'Hospitality', 'Media'
];

const BIO_TEMPLATES = [
  'Building innovative solutions and connecting with like-minded professionals.',
  'Passionate about creating meaningful experiences through my work.',
  'Explorer of ideas, connector of people, maker of things.',
  'Dedicated professional focused on growth and collaboration.',
  'Lifelong learner sharing knowledge and building community.'
];

const FUN_FACTS = [
  'I once backpacked through 15 countries in one year!',
  'I can solve a Rubik\'s cube in under 2 minutes.',
  'I have a collection of over 100 vinyl records.',
  'I volunteer at the local animal shelter every weekend.',
  'I speak three languages fluently!'
];

export function generateUser(id: string): User {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  // Generate 2-4 random interests
  const interestCount = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...INTERESTS_POOL].sort(() => 0.5 - Math.random());
  const interests = shuffled.slice(0, interestCount);

  return {
    id,
    name: `${firstName} ${lastName}`,
    profile: {
      bio: BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)],
      interests,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      funFact: FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)],
      industry: INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]
    }
  };
}

export function getNextUserId(existingUsers: User[]): string {
  const maxId = existingUsers.reduce((max, user) => {
    const match = user.id.match(/user-(\d+)/);
    if (match) {
      return Math.max(max, parseInt(match[1], 10));
    }
    return max;
  }, -1);

  return `user-${maxId + 1}`;
}
