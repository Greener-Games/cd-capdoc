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
        imageUrl
        accentColor
        category
      }
      markets {
        id
        title
        subtitle
        image
        color
        projects {
          id
        }
      }
      regions {
        id
        title
        subtitle
        image
        color
        projects {
          id
        }
      }
      capabilities {
        id
        title
        subtitle
        image
        color
        projects {
          id
        }
      }
    }
  `;

  try {
    const data = await client.request<any>(query);

    // Map projects back to the categories based on IDs
    const projectMap = new Map(data.projects.map((p: any) => [p.id, p]));

    const mapCategoryItems = (items: any[]) => {
      return items.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        image: item.image,
        color: item.color,
        projects: item.projects.map((p: any) => projectMap.get(p.id)).filter(Boolean) as Project[]
      })) as CategoryItem[];
    };

    return {
      projects: data.projects as Project[],
      markets: mapCategoryItems(data.markets),
      regions: mapCategoryItems(data.regions),
      capabilities: mapCategoryItems(data.capabilities),
    };
  } catch (error) {
    console.error('Error fetching data from Hygraph:', error);
    return null;
  }
};
