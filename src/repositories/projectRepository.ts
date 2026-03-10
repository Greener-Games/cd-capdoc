import { fetchHygraphData } from '../services/hygraph';
import { FLAT_PROJECTS, MARKET_DATA, REGION_DATA, CAPABILITY_DATA } from '../constants';
import { Project, CategoryItem } from '../types';

export interface RepositoryData {
  projects: Project[];
  markets: CategoryItem[];
  regions: CategoryItem[];
  capabilities: CategoryItem[];
}

class ProjectRepository {
  private remoteData: RepositoryData | null = null;

  async getData(useLocal: boolean = false): Promise<RepositoryData> {
    if (useLocal) {
      return this.getLocalData();
    }

    if (this.remoteData) {
      return this.remoteData;
    }

    const fetched = await fetchHygraphData();
    if (fetched) {
      this.remoteData = {
        projects: fetched.projects,
        markets: fetched.markets,
        regions: fetched.regions,
        capabilities: fetched.capabilities
      };
      return this.remoteData;
    }

    return this.getLocalData();
  }

  private getLocalData(): RepositoryData {
    return {
      projects: FLAT_PROJECTS,
      markets: MARKET_DATA,
      regions: REGION_DATA,
      capabilities: CAPABILITY_DATA
    };
  }
}

export const projectRepository = new ProjectRepository();
