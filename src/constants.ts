
import { Project, CategoryItem } from './types';

export const ALL_PROJECTS: Record<string, Project[]> = {
  brand: [
    {
      id: 'B1',
      title: 'Discovery & DNA',
      description: 'Uncovering the core essence and strategic positioning of the brand.',
      longDescription: 'A deep dive into market positioning, competitor landscapes, and the unique value proposition that defines the future brand trajectory.',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#3b82f6',
      services: ['Strategy', 'Research', 'Auditing']
    },
    {
      id: 'B2',
      title: 'Visual Architecture',
      description: 'Defining the logo systems, typography, and color theory.',
      longDescription: 'Crafting a cohesive visual language that scales across every touchpoint, from digital interfaces to physical environments.',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#3b82f6',
      services: ['Identity', 'Typography']
    },
    {
      id: 'B3',
      title: 'Brand Ecosystem',
      description: 'Developing guidelines for consistency and long-term equity.',
      longDescription: 'Creating robust design systems and documentation that empower internal teams to maintain brand integrity over time.',
      image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#3b82f6'
    }
  ],
  digital: [
    {
      id: 'D1',
      title: 'UX Strategy & Flow',
      description: 'Mapping the user journey through intuitive information architecture.',
      longDescription: 'Prioritizing usability and conversion through data-driven wireframing and user-centric experience design.',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#10b981',
      services: ['UX Design', 'Wireframing']
    },
    {
      id: 'D2',
      title: 'Interactive Prototyping',
      description: 'Validating high-fidelity micro-interactions and component logic.',
      longDescription: 'Building functional prototypes to test edge cases and refine the tactile feel of the digital interface before production.',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#10b981'
    },
    {
      id: 'D3',
      title: 'Modern Stack Deployment',
      description: 'Engineering scalable frontend and backend infrastructures.',
      longDescription: 'Utilizing cutting-edge frameworks to ensure lightning-fast performance, security, and cross-platform compatibility.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#10b981'
    }
  ],
  motion: [
    {
      id: 'M1',
      title: 'Temporal Storyboarding',
      description: 'Visualizing the rhythm and narrative arc of the sequence.',
      longDescription: 'Choreographing movement and timing to ensure the key message resonates with cinematic impact.',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#f59e0b',
      services: ['Direction', 'Storyboarding']
    },
    {
      id: 'M2',
      title: 'Dynamic Animation',
      description: 'Crafting fluid motion and physics-based interactions.',
      longDescription: 'Breathing life into static assets through advanced keyframing, procedural animation, and custom rigging.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#f59e0b'
    },
    {
      id: 'M3',
      title: 'Sonic Synchronisation',
      description: 'Merging sound design with visual cues for full immersion.',
      longDescription: 'Mastering the audio layer to heighten emotional impact and guide the viewer through the temporal experience.',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#f59e0b'
    }
  ],
  '3d': [
    {
      id: 'V1',
      title: 'Rixos Premium Qetaifan Island North Resort',
      description: 'Rixos Hotels, established in 2000, stands as a beacon of luxury with a global presence spanning 27 hotels. Their distinctive "All Inclusive – All Exclusive" philosophy distinguishes them from the rest.',
      longDescription: 'Defining the future of luxury hospitality through hyper-realistic 3D environmental design and complex lighting studies for the Qetaifan Island North project.',
      image: 'https://images.unsplash.com/photo-1582719478237-af1e73990ec9?auto=format&fit=crop&q=80&w=1200&h=800',
      accentColor: '#8b5cf6',
      client: 'AtkinsRéalis',
      year: '2023',
      services: ['Visualization', 'Web Design'],
      contentBlocks: [
        {
          id: 'b1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1582719478237-af1e73990ec9?auto=format&fit=crop&q=80&w=2400&h=1200'
        },
        {
          id: 'b2',
          type: 'text',
          title: 'AT A GLANCE',
          content: 'Rixos Hotels, established in 2000, stands as a beacon of luxury with a global presence spanning 27 hotels. Their distinctive "All Inclusive – All Exclusive" philosophy distinguishes them from the rest. However, a significant hurdle lies in effectively communicating the interior grandeur of their properties. How can they convey the opulence and scale to guests and stakeholders?'
        },
        {
          id: 'b3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2400&h=1200'
        },
        {
          id: 'b4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=2400&h=1200'
        },
        {
          id: 'b5',
          type: 'text',
          title: 'KEY BEHAVIOURAL INSIGHT DISCOVERED THAT SHIFTED THE CREATIVE DIRECTION',
          content: 'Rixos Hotels, established in 2000, stands as a beacon of luxury with a global presence spanning 27 hotels. Their distinctive "All Inclusive – All Exclusive" philosophy distinguishes them from the rest. However, a significant hurdle lies in effectively communicating the interior grandeur of their properties. How can they convey the opulence and scale to guests and stakeholders?'
        }
      ]
    },
    {
      id: 'V2',
      title: 'Photoreal Lookdev',
      description: 'Applying advanced material shaders and global illumination.',
      longDescription: 'Simulating real-world light physics and material properties to achieve stunning, believable visual results.',
      image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#8b5cf6'
    },
    {
      id: 'V3',
      title: 'Environment Scenography',
      description: 'Designing immersive digital worlds and atmospheres.',
      longDescription: 'Creating complete virtual ecosystems that tell a story through lighting, composition, and spatial depth.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#8b5cf6'
    }
  ],
  immersive: [
    {
      id: 'I1',
      title: 'Experiential Concept',
      description: 'Merging physical space with digital interaction.',
      longDescription: 'Imagining multi-sensory experiences that blur the lines between reality and the virtual world.',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#ef4444',
      services: ['Spatial Design', 'Concepting']
    },
    {
      id: 'I2',
      title: 'Hardware Orchestration',
      description: 'Integrating sensors, projectors, and spatial audio systems.',
      longDescription: 'Seamlessly connecting complex hardware arrays to drive responsive and real-time interactive installations.',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#ef4444'
    },
    {
      id: 'I3',
      title: 'On-Site Calibration',
      description: 'Fine-tuning interaction logic in the physical environment.',
      longDescription: 'Optimizing the installation for site-specific conditions, ensuring perfect alignment and maximum audience impact.',
      image: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&q=80&w=800&h=1200',
      accentColor: '#ef4444'
    }
  ]
};

export const FLAT_PROJECTS: Project[] = Object.values(ALL_PROJECTS).flat();

const getIds = (projects: Project[]) => projects.map(p => p.id);

// Map Markets to existing Projects/Categories with fixed, reliable images
export const MARKET_DATA: CategoryItem[] = [
  { 
    id: 'transportation', 
    title: 'Transportation', 
    subtitle: 'High-speed infrastructure & future mobility', 
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#3b82f6',
    accentColor: '#3b82f6',
    projectIds: getIds(ALL_PROJECTS.digital) 
  },
  { 
    id: 'water', 
    title: 'Water', 
    subtitle: 'Strategic hydro-engineering & management', 
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#06b6d4', 
    accentColor: '#06b6d4',
    projectIds: getIds(ALL_PROJECTS['3d']) 
  },
  { 
    id: 'nuclear', 
    title: 'Nuclear', 
    subtitle: 'Zero-carbon energy & secure facilities', 
    image: 'https://images.unsplash.com/photo-1585909665970-21c5bc4f58d3?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#10b981', 
    accentColor: '#10b981',
    projectIds: getIds(ALL_PROJECTS.immersive) 
  },
  { 
    id: 'renewables', 
    title: 'Power & Renewables', 
    subtitle: 'Sustainable networks & solar integration', 
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#84cc16', 
    accentColor: '#84cc16',
    projectIds: getIds(ALL_PROJECTS.brand) 
  },
  { 
    id: 'defence', 
    title: 'Defence', 
    subtitle: 'Tactical security & aerospace systems', 
    image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#475569', 
    accentColor: '#475569',
    projectIds: getIds(ALL_PROJECTS.motion) 
  },
  { 
    id: 'industrial', 
    title: 'Industrial', 
    subtitle: 'Advanced manufacturing & robotic systems', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#ea580c', 
    accentColor: '#ea580c',
    projectIds: [...getIds(ALL_PROJECTS.brand.slice(0, 1)), ...getIds(ALL_PROJECTS.digital.slice(1, 2))] 
  }
];

// Map Regions to existing Projects/Categories with evocative geographic imagery
export const REGION_DATA: CategoryItem[] = [
  { 
    id: 'uk', 
    title: 'UK', 
    subtitle: 'European operations and HQ systems', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#ef4444', 
    accentColor: '#ef4444',
    projectIds: getIds(ALL_PROJECTS.brand) 
  },
  { 
    id: 'me', 
    title: 'Middle East', 
    subtitle: 'Gulf region flagship developments', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#fbbf24', 
    accentColor: '#fbbf24',
    projectIds: getIds(ALL_PROJECTS['3d']) 
  },
  { 
    id: 'aus', 
    title: 'Australia', 
    subtitle: 'APAC infrastructure and mining', 
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#1e40af', 
    accentColor: '#1e40af',
    projectIds: getIds(ALL_PROJECTS.digital) 
  },
  { 
    id: 'can', 
    title: 'Canada', 
    subtitle: 'North American resource engineering', 
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#dc2626', 
    accentColor: '#dc2626',
    projectIds: getIds(ALL_PROJECTS.motion) 
  }
];

// Map Capabilities to existing high-end digital craftsmanship assets
export const CAPABILITY_DATA: CategoryItem[] = [
  { 
    id: 'brand', 
    title: 'Brand & Visual Design', 
    subtitle: 'Strategic identity and visual systems', 
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#3b82f6', 
    accentColor: '#3b82f6',
    projectIds: getIds(ALL_PROJECTS.brand) 
  },
  { 
    id: 'digital', 
    title: 'Digital Experience & Web Development', 
    subtitle: 'High-performance interactive ecosystems', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#10b981', 
    accentColor: '#10b981',
    projectIds: getIds(ALL_PROJECTS.digital) 
  },
  { 
    id: 'motion', 
    title: 'Motion & Dynamic Media', 
    subtitle: 'Cinematic narratives and fluid motion', 
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#f59e0b', 
    accentColor: '#f59e0b',
    projectIds: getIds(ALL_PROJECTS.motion) 
  },
  { 
    id: '3d', 
    title: '3D & Visualisation', 
    subtitle: 'Photorealistic rendering and spatial design', 
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#8b5cf6', 
    accentColor: '#8b5cf6',
    projectIds: getIds(ALL_PROJECTS['3d']) 
  },
  { 
    id: 'immersive', 
    title: 'Immersive & Experiential', 
    subtitle: 'Multi-sensory digital installations', 
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800&h=1200', 
    color: '#ef4444', 
    accentColor: '#ef4444',
    projectIds: getIds(ALL_PROJECTS.immersive) 
  }
];

export const MILESTONES = [
  { date: 'Q1 2026', event: 'Strategy Lock', detail: 'Finalization of creative direction and core architectural pillars.' },
  { date: 'Q2 2026', event: 'Prototyping', detail: 'Validation of interactive logic and visual aesthetics.' },
  { date: 'Q3 2026', event: 'Production', detail: 'High-fidelity asset development and system integration.' },
  { date: 'Q4 2026', event: 'Deployment', detail: 'Final rollout across global digital and physical touchpoints.' },
];

export const LIFECYCLE_MILESTONES = [
  { event: 'Phase 01: Audit' },
  { event: 'Phase 02: Strategy' },
  { event: 'Phase 03: Design' },
  { event: 'Phase 04: Build' },
  { event: 'Phase 05: Validation' },
  { event: 'Phase 06: Rollout' },
];
