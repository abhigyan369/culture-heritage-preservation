const mongoose = require('mongoose');
const HeritageSite = require('../models/HeritageSite');
require('dotenv').config();

const heritageSites = [
  {
    name: "Brihadeeswarar Temple",
    description: "A magnificent Hindu temple dedicated to Lord Shiva, built during the Chola dynasty. Known for its architectural brilliance and towering vimana.",
    category: "temple",
    location: {
      address: "Thanjavur, Tamil Nadu, India",
      city: "Thanjavur",
      state: "Tamil Nadu",
      country: "India",
      coordinates: {
        latitude: 10.7850,
        longitude: 79.1315
      }
    },
    history: {
      established: "1010 AD",
      historicalSignificance: "The Brihadeeswarar Temple, also known as Peruvudaiyar Kovil, is one of the largest South Indian temples and an exemplary example of Tamil architecture. The temple was built by Emperor Rajaraja Chola I and completed in 1010 AD. The temple is part of the UNESCO World Heritage Site known as the 'Great Living Chola Temples'.",
      architecture: "Dravidian architecture with a massive 66-meter high vimana (tower above the sanctum sanctorum), which is one of the tallest in the world.",
      culturalImportance: "Important pilgrimage site for Shaivites and a masterpiece of Chola dynasty architecture and engineering."
    },
    images: [
      { url: "https://picsum.photos/seed/brihadeeswarar1/800/600.jpg", isPrimary: true },
      { url: "https://picsum.photos/seed/brihadeeswarar2/800/600.jpg" },
      { url: "https://picsum.photos/seed/brihadeeswarar3/800/600.jpg" }
    ],
    visitorInfo: {
      visitingHours: {
        opening: "6:00 AM",
        closing: "8:00 PM"
      },
      entryFee: {
        adults: 50,
        foreigners: 500,
        currency: "INR"
      },
      bestTimeToVisit: "October to March",
      estimatedDuration: "2-3 hours"
    },
    tags: ["unesco", "chola-architecture", "shiva-temple", "tamil-nadu"],
    status: "active",
    verified: true
  },
  {
    name: "Hampi Ruins",
    description: "The ancient ruins of the Vijayanagara Empire, spread across a vast area with stunning temples, palaces, and market streets.",
    category: "archaeological_site",
    location: {
      address: "Hampi, Karnataka, India",
      city: "Hampi",
      state: "Karnataka",
      country: "India",
      coordinates: {
        latitude: 15.3350,
        longitude: 76.4620
      }
    },
    history: {
      established: "14th-16th century",
      historicalSignificance: "Hampi was the capital of the Vijayanagara Empire from 1336 to 1565. The city was one of the largest and wealthiest cities of its time, attracting traders from around the world. After the Battle of Talikota in 1565, the city was pillaged and abandoned, leaving behind the magnificent ruins we see today.",
      architecture: "Vijayanagara architectural style with intricate carvings, massive structures, and advanced urban planning.",
      culturalImportance: "UNESCO World Heritage Site representing the pinnacle of South Indian empire architecture and urban development."
    },
    images: [
      { url: "https://picsum.photos/seed/hampi1/800/600.jpg", isPrimary: true },
      { url: "https://picsum.photos/seed/hampi2/800/600.jpg" },
      { url: "https://picsum.photos/seed/hampi3/800/600.jpg" }
    ],
    visitorInfo: {
      visitingHours: {
        opening: "6:00 AM",
        closing: "6:00 PM"
      },
      entryFee: {
        adults: 40,
        foreigners: 600,
        currency: "INR"
      },
      bestTimeToVisit: "November to February",
      estimatedDuration: "2-3 days"
    },
    tags: ["unesco", "vijayanagara", "ruins", "karnataka"],
    status: "active",
    verified: true
  },
  {
    name: "Taj Mahal",
    description: "An ivory-white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal.",
    category: "monument",
    location: {
      address: "Agra, Uttar Pradesh, India",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      coordinates: {
        latitude: 27.1751,
        longitude: 78.0421
      }
    },
    history: {
      established: "1632-1653",
      historicalSignificance: "The Taj Mahal was commissioned by Mughal Emperor Shah Jahan in 1632 as a mausoleum for his favorite wife Mumtaz Mahal, who died during childbirth. The construction took over 20 years and involved more than 20,000 artisans from across the Mughal Empire and Central Asia.",
      architecture: "Mughal architecture with Persian and Islamic influences, featuring intricate marble inlay work and calligraphy.",
      culturalImportance: "Symbol of eternal love and one of the most recognized monuments in the world, designated as one of the New Seven Wonders of the World."
    },
    images: [
      { url: "https://picsum.photos/seed/tajmahal1/800/600.jpg", isPrimary: true },
      { url: "https://picsum.photos/seed/tajmahal2/800/600.jpg" },
      { url: "https://picsum.photos/seed/tajmahal3/800/600.jpg" }
    ],
    visitorInfo: {
      visitingHours: {
        opening: "Sunrise",
        closing: "Sunset",
        closedDays: ["Friday"]
      },
      entryFee: {
        adults: 50,
        foreigners: 1100,
        currency: "INR"
      },
      bestTimeToVisit: "October to March",
      estimatedDuration: "3-4 hours"
    },
    tags: ["unesco", "mughal-architecture", "mausoleum", "wonder-of-world"],
    status: "active",
    verified: true
  },
  {
    name: "Ajanta Caves",
    description: "Ancient Buddhist rock-cut cave monuments featuring exquisite paintings and sculptures depicting the life of Buddha.",
    category: "other",
    location: {
      address: "Aurangabad, Maharashtra, India",
      city: "Aurangabad",
      state: "Maharashtra",
      country: "India",
      coordinates: {
        latitude: 20.5531,
        longitude: 75.7029
      }
    },
    history: {
      established: "2nd century BCE - 5th century CE",
      historicalSignificance: "The Ajanta Caves consist of 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE. The caves include paintings and rock-cut sculptures considered among the finest surviving examples of ancient Indian art. The caves were abandoned in the 5th century and remained hidden until their rediscovery in 1819 by a British officer.",
      architecture: "Rock-cut cave architecture with intricate murals and sculptures depicting Buddhist themes and Jataka tales.",
      culturalImportance: "Masterpieces of Buddhist religious art and one of the greatest examples of ancient Indian painting tradition."
    },
    images: [
      { url: "https://picsum.photos/seed/ajanta1/800/600.jpg", isPrimary: true },
      { url: "https://picsum.photos/seed/ajanta2/800/600.jpg" },
      { url: "https://picsum.photos/seed/ajanta3/800/600.jpg" }
    ],
    visitorInfo: {
      visitingHours: {
        opening: "9:00 AM",
        closing: "5:30 PM",
        closedDays: ["Monday"]
      },
      entryFee: {
        adults: 40,
        foreigners: 600,
        currency: "INR"
      },
      bestTimeToVisit: "October to March",
      estimatedDuration: "1-2 days"
    },
    tags: ["unesco", "buddhist", "cave-paintings", "ancient-art"],
    status: "active",
    verified: true
  },
  {
    name: "Mahabalipuram Shore Temple",
    description: "A structural temple built with granite blocks overlooking the Bay of Bengal, showcasing Dravidian architecture.",
    category: "temple",
    location: {
      address: "Mahabalipuram, Tamil Nadu, India",
      city: "Mahabalipuram",
      state: "Tamil Nadu",
      country: "India",
      coordinates: {
        latitude: 12.6098,
        longitude: 80.1978
      }
    },
    history: {
      established: "7th-8th century",
      historicalSignificance: "The Shore Temple was built during the reign of the Pallava king Narasimhavarman II in the early 8th century. It's one of the oldest structural stone temples of South India and has been designated as a UNESCO World Heritage Site since 1984 as part of the 'Group of Monuments at Mahabalipuram'.",
      architecture: "Pallava dynasty architecture built with granite blocks, featuring intricate carvings and sculptures.",
      culturalImportance: "One of the earliest structural stone temples of South India, representing the pinnacle of Pallava architectural achievement."
    },
    images: [
      { url: "https://picsum.photos/seed/mahabalipuram1/800/600.jpg", isPrimary: true },
      { url: "https://picsum.photos/seed/mahabalipuram2/800/600.jpg" },
      { url: "https://picsum.photos/seed/mahabalipuram3/800/600.jpg" }
    ],
    visitorInfo: {
      visitingHours: {
        opening: "6:00 AM",
        closing: "6:00 PM"
      },
      entryFee: {
        adults: 40,
        foreigners: 600,
        currency: "INR"
      },
      bestTimeToVisit: "November to February",
      estimatedDuration: "2-3 hours"
    },
    tags: ["unesco", "pallava-architecture", "shore-temple", "bay-of-bengal"],
    status: "active",
    verified: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing heritage sites
    await HeritageSite.deleteMany({});
    console.log('Cleared existing heritage sites');

    // Insert new heritage sites
    await HeritageSite.insertMany(heritageSites);
    console.log('Seeded heritage sites successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
