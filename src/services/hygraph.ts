import { GraphQLClient, gql } from 'graphql-request';
import { Project, CategoryItem, AboutPage } from '../types';

const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT;

let client: GraphQLClient | null = null;

if (endpoint) {
  client = new GraphQLClient(endpoint);
}

// 1. Fragment for reusable project fields to keep queries clean
const PROJECT_FIELDS = gql`
  fragment ProjectFields on Project {
    id
    title
    description
    imageUrl {
      url
      overrideUrl
    }
    accentColor {
      hex
    }
    client
    year
    services
    contentBlocks (first: 50) {
      __typename
      ... on ImageBlock {
        id
        asset {
          url
          overrideUrl
        }
      }
      ... on TextBlock {
        id
        title
        leftContent {
          html
        }
        rightContent {
          html
        }
      }
      ... on VideoBlock {
        id
        videoUrl
        poster {
          url
          overrideUrl
        }
      }
    }
  }
`;

// 2. Fragments for Categories
const MARKET_FIELDS = gql`
  fragment MarketFields on Market {
    id
    title
    image { url overrideUrl }
    color { hex }
    projects(first: 100) { id }
  }
`;

const REGION_FIELDS = gql`
  fragment RegionFields on Region {
    id
    title
    image { url overrideUrl }
    color { hex }
    projects(first: 100) { id }
  }
`;

const CAPABILITY_FIELDS = gql`
  fragment CapabilityFields on Capability {
    id
    title
    image { url overrideUrl }
    color { hex }
    projects(first: 100) { id }
  }
`;

// 3. Query for the initial bulk data (About, Categories, and first page of Projects)
const GET_ALL_DATA = gql`
  ${PROJECT_FIELDS}
  ${MARKET_FIELDS}
  ${REGION_FIELDS}
  ${CAPABILITY_FIELDS}
  query GetAllData($first: Int!, $after: String) {
    aboutPages(first: 1) {
      title
      description
      services
      client
      year
      contentBlocks {
        __typename
        ... on ImageBlock { id, asset { url overrideUrl } }
        ... on TextBlock { id, title, leftContent { html } rightContent { html } }
        ... on VideoBlock { id, videoUrl, poster { url overrideUrl } }
      }
    }
    projectsConnection(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProjectFields
        }
      }
    }
    markets(first: 100) {
      ...MarketFields
    }
    regions(first: 100) {
      ...RegionFields
    }
    capabilities(first: 100) {
      ...CapabilityFields
    }
  }
`;

// 4. Query for subsequent project pages
const GET_MORE_PROJECTS = gql`
  ${PROJECT_FIELDS}
  query GetMoreProjects($first: Int!, $after: String!) {
    projectsConnection(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProjectFields
        }
      }
    }
  }
`;

export const fetchHygraphData = async () => {
  if (!client) {
    console.warn('VITE_HYGRAPH_ENDPOINT is not set. Cannot fetch data from Hygraph.');
    return null;
  }

  try {
    const PAGE_SIZE = 100;
    let allProjects: any[] = [];
    
    // Fetch initial page
    const initialData = await client.request<any>(GET_ALL_DATA, { 
      first: PAGE_SIZE 
    });

    // Add first batch
    allProjects = initialData.projectsConnection.edges.map((e: any) => e.node);
    let { hasNextPage, endCursor } = initialData.projectsConnection.pageInfo;

    // 4. Iteratively fetch remaining pages if they exist
    while (hasNextPage) {
      const nextPageData = await client.request<any>(GET_MORE_PROJECTS, {
        first: PAGE_SIZE,
        after: endCursor
      });

      allProjects = [...allProjects, ...nextPageData.projectsConnection.edges.map((e: any) => e.node)];
      hasNextPage = nextPageData.projectsConnection.pageInfo.hasNextPage;
      endCursor = nextPageData.projectsConnection.pageInfo.endCursor;
    }

    // --- Mapping Logic (Unchanged but adapted to the new loop output) ---

    const resolveAssetUrl = (asset: any) => {
      if (!asset) return '';
      if (asset.overrideUrl) return asset.overrideUrl;
      return asset.url || '';
    };

    const mapContentBlocks = (blocks: any[]) => {
      return blocks?.map((block: any) => {
        const type = block.__typename?.replace('Block', '').toLowerCase();
        if (block.asset) return { ...block, type, url: resolveAssetUrl(block.asset) };
        if (type === 'text') return { ...block, type, leftContent: block.leftContent || null, rightContent: block.rightContent || null };
        if (block.videoUrl || block.poster) return { ...block, url: block.videoUrl, type, poster: resolveAssetUrl(block.poster) };
        return block;
      });
    };

    const projects = allProjects.map((p: any) => ({
      ...p,
      image: resolveAssetUrl(p.imageUrl),
      accentColor: p.accentColor?.hex || null,
      contentBlocks: mapContentBlocks(p.contentBlocks)
    }));

    const aboutPage = initialData.aboutPages?.[0] ? {
      ...initialData.aboutPages[0],
      contentBlocks: mapContentBlocks(initialData.aboutPages[0].contentBlocks)
    } : null;

    const mapCategoryItems = (items: any[]) => {
      return items.map(item => ({
        id: item.id,
        title: item.title,
        image: resolveAssetUrl(item.image),
        color: item.color?.hex || null,
        accentColor: item.color?.hex || null,
        projectIds: item.projects.map((p: any) => p.id)
      })) as CategoryItem[];
    };

    return {
      aboutPage: aboutPage as AboutPage | null,
      projects: projects as Project[],
      markets: mapCategoryItems(initialData.markets),
      regions: mapCategoryItems(initialData.regions),
      capabilities: mapCategoryItems(initialData.capabilities),
    };
  } catch (error) {
    console.error('Error fetching data from Hygraph:', error);
    return null;
  }
};
