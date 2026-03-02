
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  accentColor: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  SELECTOR = 'SELECTOR',
  TIMELINE = 'TIMELINE',
  PROJECT_TIMELINE = 'PROJECT_TIMELINE',
  DETAIL = 'DETAIL',
  DEVELOPER = 'DEVELOPER',
  FAVOURITES = 'FAVOURITES',
  SEARCH = 'SEARCH'
}

export enum CategoryType {
  CAPABILITY = 'CAPABILITY',
  MARKET = 'MARKET',
  REGION = 'REGION'
}
