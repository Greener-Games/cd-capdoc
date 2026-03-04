# Hygraph Setup Guide

This document outlines the necessary setup in Hygraph to power the application's dynamic content.

## Schema Models

You need to create the following models in your Hygraph project:

### 1. Project
*   **API ID:** `Project`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `description` (Multi line text)
    *   `longDescription` (Multi line text)
    *   `imageUrl` (Asset or Single line text for URL)
    *   `accentColor` (Color or Single line text for hex code e.g. `#3b82f6`)
    *   `category` (Single line text - optional, used to denote if it is brand, digital, motion, 3d, immersive)
    *   `client` (Single line text - optional)
    *   `year` (Single line text - optional)
    *   `services` (List of single line text - optional)
    *   `contentBlocks` (Modular Components - allowed components: ImageBlock, TextBlock, VideoBlock)

### Dynamic Content Blocks (Modular Components)

To support the dynamic detail view layout (alternating full-bleed images, multi-column text, etc.), you need to create the following Modular Component blocks in Hygraph and allow them in the `contentBlocks` field of the `Project` model:

#### ImageBlock
*   **Fields:**
    *   `url` (Asset or Single line text)
    *   `alt` (Single line text - optional)

#### TextBlock
*   **Fields:**
    *   `title` (Single line text - optional)
    *   `content` (Multi line text)

#### VideoBlock
*   **Fields:**
    *   `url` (Asset or Single line text for MP4 URL)
    *   `poster` (Asset or Single line text for poster image - optional)

### 2. Market
*   **API ID:** `Market`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `subtitle` (Single line text)
    *   `image` (Asset or Single line text for URL)
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

### 3. Region
*   **API ID:** `Region`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `subtitle` (Single line text)
    *   `image` (Asset or Single line text for URL)
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

### 4. Capability
*   **API ID:** `Capability`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `subtitle` (Single line text)
    *   `image` (Asset or Single line text for URL)
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

---

## Environment Variables

Once you have created the models and added some content, you need to publish it and get the Content API endpoint.

1.  Go to **Project Settings** > **API Access** in Hygraph.
2.  Copy the **Content API** URL (make sure it's the High Performance endpoint if available).
3.  Ensure the Public Content API has read access to the published content.
4.  In your local project, create a `.env.local` file at the root.
5.  Add the endpoint to the file:

```env
VITE_HYGRAPH_ENDPOINT=your_hygraph_content_api_endpoint_here
```

## Running the app

You can use the **Local Data** toggle in the bottom right corner of the application to switch between the hardcoded mock data and the data fetched from your Hygraph instance. By default, it uses the local data.