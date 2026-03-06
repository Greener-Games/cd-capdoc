
export type BlockType = 'image' | 'text' | 'video';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  title?: string;
  content: string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  poster?: string;
}

export type ContentBlock = ImageBlock | TextBlock | VideoBlock;

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  accentColor: string;
  client?: string;
  year?: string;
  services?: string[];
  contentBlocks?: ContentBlock[];
}

export enum ViewState {
  LANDING = 'LANDING',
  SELECTOR = 'SELECTOR',
  TIMELINE = 'TIMELINE',
  PROJECT_TIMELINE = 'PROJECT_TIMELINE',
  DETAIL = 'DETAIL',
  CURATOR = 'CURATOR',
  FAVOURITES = 'FAVOURITES',
  SEARCH = 'SEARCH'
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  accentColor: string;
  projects: Project[];
}

export enum CategoryType {
  CAPABILITY = 'CAPABILITY',
  MARKET = 'MARKET',
  REGION = 'REGION'
}
