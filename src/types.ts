
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
  image: string;
  accentColor: string;
  client?: string;
  year?: string;
  services?: string[];
  contentBlocks?: ContentBlock[];
}

export enum ViewState {
  LANDING = 'LANDING',
  SELECTOR = 'SELECTOR',
  PROJECT_LIST = 'PROJECT_LIST',
  DETAIL = 'DETAIL',
  CURATOR = 'CURATOR',
  CURATED = 'CURATED',
  ABOUT = 'ABOUT'
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  accentColor: string;
  projectIds: string[];
}

export enum CategoryType {
  CAPABILITY = 'CAPABILITY',
  MARKET = 'MARKET',
  REGION = 'REGION'
}
