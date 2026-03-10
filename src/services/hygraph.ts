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

    // Helper to resolve the correct URL from an Asset object with optional optimization
    const resolveAssetUrl = (asset: any, width?: number) => {
      if (!asset) return '';
      if (asset.overrideUrl) return asset.overrideUrl;
      if (!asset.url) return '';
      
      if (width) {
        return `${asset.url}?width=${width}&quality=80&format=webp`;
      }
      return asset.url;
    };

    const extractPlainText = (raw: any): string => {
      if (!raw || !raw.children) return '';
      return raw.children
          .map((node: any) => {
            if (node.text) return node.text;
            if (node.children) return extractPlainText(node);
            return '';
          })
          .join('\n');
    };

    // Map projects back to the categories based on IDs and resolve asset URLs/nested objects
    const projects = data.projects.map((p: any) => ({
      ...p,
      image: resolveAssetUrl(p.imageUrl, 1200),
      accentColor: p.accentColor?.hex || null, // Extract hex from color object
      contentBlocks: p.contentBlocks?.map((block: any) => {
        const type = block.__typename?.replace('Block', '').toLowerCase();

        // Handle ImageBlock (now uses 'asset' field)
        if (block.asset) {
          return {
            ...block,
            type,
            url: resolveAssetUrl(block.asset, 1600)
          };
        }
        // Handle TextBlock
        if (type === 'text') {
          return {
            ...block,
            type,
            leftContent: block.leftContent || null,
            rightContent: block.rightContent || null
          };
        }
        // Handle VideoBlock (now uses 'videoUrl')
        if (block.videoUrl || block.poster) {
          return {
            ...block,
            url: block.videoUrl, // Map videoUrl back to 'url' for UI consistency if needed
            type,
            poster: resolveAssetUrl(block.poster, 1600)
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
        image: resolveAssetUrl(item.image, 800),
        color: item.color?.hex || null, // Extract hex from color object
        accentColor: item.color?.hex || null,
        projectIds: item.projects.map((p: any) => p.id)
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