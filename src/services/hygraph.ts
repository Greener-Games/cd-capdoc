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
          overrideURL
        }
        accentColor
        client
        year
        services
        contentBlocks {
          ... on ImageBlock {
            id
            url {
              url
              overrideURL
            }
            alt
          }
          ... on TextBlock {
            id
            title
            content
          }
          ... on VideoBlock {
            id
            url
            poster {
              url
              overrideURL
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
          overrideURL
        }
        color
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
          overrideURL
        }
        color
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
          overrideURL
        }
        color
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
      return asset.overrideURL || asset.url || '';
    };

    // Map projects back to the categories based on IDs and resolve asset URLs
    const projects = data.projects.map((p: any) => ({
      ...p,
      imageUrl: resolveAssetUrl(p.imageUrl),
      contentBlocks: p.contentBlocks?.map((block: any) => {
        if (block.__typename === 'ImageBlock') {
          return { ...block, url: resolveAssetUrl(block.url) };
        }
        if (block.__typename === 'VideoBlock') {
          return { ...block, poster: resolveAssetUrl(block.poster) };
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
        color: item.color,
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
