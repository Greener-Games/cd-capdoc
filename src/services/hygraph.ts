import { GraphQLClient, gql } from 'graphql-request';
import { Project, CategoryItem } from '../types';

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
      projects {
        id
        title
        description
        longDescription
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
            content {
              raw
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
        subtitle
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
        subtitle
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
        subtitle
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

    // Helper to resolve the correct URL from an Asset object
    const resolveAssetUrl = (asset: any) => {
      if (!asset) return '';
      // Matching 'overrideUrl' from your new query
      return asset.overrideUrl || asset.url || '';
    };

    // Map projects back to the categories based on IDs and resolve asset URLs/nested objects
    const projects = data.projects.map((p: any) => ({
      ...p,
      imageUrl: resolveAssetUrl(p.imageUrl),
      accentColor: p.accentColor?.hex || null, // Extract hex from color object
      contentBlocks: p.contentBlocks?.map((block: any) => {
        // Handle ImageBlock (now uses 'asset' field)
        if (block.asset) {
          return {
            ...block,
            url: resolveAssetUrl(block.asset)
          };
        }
        // Handle TextBlock (now uses 'content.raw')
        if (block.content?.raw) {
          return {
            ...block,
            content: block.content.raw
          };
        }
        // Handle VideoBlock (now uses 'videoUrl')
        if (block.videoUrl || block.poster) {
          return {
            ...block,
            url: block.videoUrl, // Map videoUrl back to 'url' for UI consistency if needed
            poster: resolveAssetUrl(block.poster)
          };
        }
        return block;
      })
    }));

    const projectMap = new Map(projects.map((p: any) => [p.id, p]));

    const mapCategoryItems = (items: any[]) => {
      return items.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        image: resolveAssetUrl(item.image),
        color: item.color?.hex || null, // Extract hex from color object
        projects: item.projects.map((p: any) => projectMap.get(p.id)).filter(Boolean) as Project[]
      })) as CategoryItem[];
    };

    return {
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