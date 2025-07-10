import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

// TypeScript interfaces for type safety
export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  content: string;
  readingTime?: number;
}

export interface PostMatter {
  title: string;
  date: string;
  excerpt: string;
  author?: string;
}

// Get all post slugs for static generation
export function getAllPostSlugs(): { slug: string }[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        slug: name.replace(/\.md$/, ""),
      }));
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

// Get all posts with basic data (for listing page)
export function getAllPosts(): Omit<PostData, "content">[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);
        const frontmatter = matterResult.data as PostMatter;

        // Calculate reading time (approximate)
        const readingTime = calculateReadingTime(matterResult.content);

        return {
          slug,
          title: frontmatter.title,
          date: frontmatter.date,
          excerpt: frontmatter.excerpt,
          author: frontmatter.author,
          readingTime,
        };
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

// Get post data by slug (for individual post pages)
export async function getPostData(slug: string): Promise<PostData | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as PostMatter;

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Calculate reading time
    const readingTime = calculateReadingTime(matterResult.content);

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt,
      author: frontmatter.author,
      content: contentHtml,
      readingTime,
    };
  } catch (error) {
    console.error(`Error getting post data for slug ${slug}:`, error);
    return null;
  }
}

// Calculate estimated reading time in minutes
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Get post slugs for generateStaticParams (App Router)
export async function getPostSlugs(): Promise<string[]> {
  const slugs = getAllPostSlugs();
  return slugs.map((item) => item.slug);
}

// Get recent posts (for homepage or sidebar)
export function getRecentPosts(limit: number = 3): Omit<PostData, "content">[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// Search posts by title or excerpt
export function searchPosts(query: string): Omit<PostData, "content">[] {
  const allPosts = getAllPosts();
  const lowercaseQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery)
  );
}

// Get posts by author
export function getPostsByAuthor(author: string): Omit<PostData, "content">[] {
  const allPosts = getAllPosts();
  return allPosts.filter(
    (post) => post.author?.toLowerCase() === author.toLowerCase()
  );
}

// Validate post data structure
export function validatePostData(data: unknown): data is PostMatter {
  return (
    data !== null &&
    typeof data === "object" &&
    typeof (data as Record<string, unknown>).title === "string" &&
    typeof (data as Record<string, unknown>).date === "string" &&
    typeof (data as Record<string, unknown>).excerpt === "string" &&
    ((data as Record<string, unknown>).author === undefined ||
      typeof (data as Record<string, unknown>).author === "string")
  );
}
