
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

export type RichTextContent = {
  html: string;
};

export interface TextBlock extends BaseBlock {
  type: 'text';
  title?: string;
  leftContent?: string | RichTextContent;
  rightContent?: string | RichTextContent;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  poster?: string;
}

export interface PageMetadata {
  left?: string[];
  right?: string[];
}

export type ContentBlock = ImageBlock | TextBlock | VideoBlock;

export interface BaseCardProps {
  id: string;
  title: string;
  image: string;
  color: string;
  index: number;
  isDragging: boolean;
}

export interface Project extends BaseCardProps {
  description: string;
  accentColor: string; // Mapping color to accentColor for Projects
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
