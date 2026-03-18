import { GraphQLClient, gql } from 'graphql-request';
import { Project, CategoryItem, AboutPage } from '../types';
import { ImageOptimizer } from './imageOptimizer';

const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT;

let client: GraphQLClient | null = null;

if (endpoint) {
  client = new GraphQLClient(endpoint);
}

export const fetchHygraphData = async () => {
  if (!client) {
    console.warn('VITE_HYGRAPH_ENDPOINT is not set. Cannot fetch data from Hygraph.');
    return null;
  }

  const query = gql`
    query GetAllData {
      aboutPages(first: 1) {
        title
        description
        services
        client
        year
        contentBlocks {
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
      projects {
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
        contentBlocks {
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
      markets {
        id
        title
        image {
          url
          overrideUrl
        }
        color {
          hex
        }
        projects {
          id
        }
      }
      regions {
        id
        title
        image {
          url
          overrideUrl
        }
        color {
          hex
        }
        projects {
          id
        }
      }
      capabilities {
        id
        title
        image {
          url
          overrideUrl
        }
        color {
          hex
        }
        projects {
          id
        }
      }
    }
  `;

  try {
    const data = await client.request<any>(query);

    // Helper to resolve asset URL. We keep the raw URL here
    // because the UI components (Cards/Blocks) now handle optimization
    // via ImageOptimizer and ImageCacheService.
    const resolveAssetUrl = (asset: any) => {
      if (!asset) return '';
      if (asset.overrideUrl) return asset.overrideUrl;
      return asset.url || '';
    };

    const mapContentBlocks = (blocks: any[]) => {
      return blocks?.map((block: any) => {
        const type = block.__typename?.replace('Block', '').toLowerCase();

        if (block.asset) {
          return {
            ...block,
            type,
            url: resolveAssetUrl(block.asset)
          };
        }
        if (type === 'text') {
          return {
            ...block,
            type,
            leftContent: block.leftContent || null,
            rightContent: block.rightContent || null
          };
        }
        if (block.videoUrl || block.poster) {
          return {
            ...block,
            url: block.videoUrl,
            type,
            poster: resolveAssetUrl(block.poster)
          };
        }
        return block;
      });
    };

    const projects = data.projects.map((p: any) => ({
      ...p,
      image: resolveAssetUrl(p.imageUrl),
      accentColor: p.accentColor?.hex || null,
      contentBlocks: mapContentBlocks(p.contentBlocks)
    }));

    const aboutPage = data.aboutPages?.[0] ? {
      ...data.aboutPages[0],
      contentBlocks: mapContentBlocks(data.aboutPages[0].contentBlocks)
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
      markets: mapCategoryItems(data.markets),
      regions: mapCategoryItems(data.regions),
      capabilities: mapCategoryItems(data.capabilities),
    };
  } catch (error) {
    console.error('Error fetching data from Hygraph:', error);
    return null;
  }
};
