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
    *   `imageUrl` (Asset) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*
    *   `accentColor` (Color or Single line text for hex code e.g. `#3b82f6`)
    *   `client` (Single line text - optional)
    *   `year` (Single line text - optional)
    *   `services` (List of single line text - optional)
    *   `contentBlocks` (Modular Components - allowed components: ImageBlock, TextBlock, VideoBlock)

### Dynamic Content Blocks (Modular Components)

To support the dynamic detail view layout (alternating full-bleed images, multi-column text, etc.), you need to create the following Modular Component blocks in Hygraph and allow them in the `contentBlocks` field of the `Project` model:

#### ImageBlock
*   **Fields:**
    *   `url` (Asset) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*
    *   `alt` (Single line text - optional)

#### TextBlock
*   **Fields:**
    *   `title` (Single line text - optional)
    *   `content` (Rich Text or Multi line text)

#### VideoBlock
*   **Fields:**
    *   `url` (Single line text for external video URL like Vimeo/YouTube)
    *   `poster` (Asset for placeholder image - optional) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*

### 2. Market
*   **API ID:** `Market`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `image` (Asset) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

### 3. Region
*   **API ID:** `Region`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `image` (Asset) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

### 4. Capability
*   **API ID:** `Capability`
*   **Fields:**
    *   `id` (Single line text, **Required**, **Unique**)
    *   `title` (Single line text, **Required**)
    *   `image` (Asset) - *Note: Our app will look for an `overrideURL` field on this asset first, and fall back to the Hygraph `url` if not provided.*
    *   `color` (Color or Single line text for hex code)
*   **Relations:**
    *   `projects` (Reference to `Project` model, Multiple references allowed)

### 5. AboutPage
*   **API ID:** `AboutPage`
*   **Fields:**
    *   `title` (Single line text, **Required**)
    *   `description` (Multi line text)
    *   `services` (List of single line text - will appear in the left metadata column)
    *   `client` (Single line text - will appear in the right metadata column)
    *   `year` (Single line text - will appear in the right metadata column)
    *   `contentBlocks` (Modular Components - allowed components: ImageBlock, TextBlock, VideoBlock)

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