import fs from "fs";
import path from "path";
import { BlogPost, BlogCategory, INITIAL_BLOG_POSTS } from "./blog";

export function readLocalPostsServer(): BlogPost[] {
  try {
    const postsDir = path.join(process.cwd(), "data/posts");
    if (!fs.existsSync(postsDir)) {
      return [];
    }

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
    return files.map((fileName) => {
      const fullPath = path.join(postsDir, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = JSON.parse(raw);

      let contentArray: string[] = [];
      if (Array.isArray(parsed.content)) {
        contentArray = parsed.content;
      } else if (typeof parsed.content === "string") {
        contentArray = parsed.content
          .split(/\n\s*\n/)
          .map((p: string) => p.trim())
          .filter(Boolean);
      }

      return {
        id: parsed.id || parsed.slug || fileName.replace(/\.json$/, ""),
        slug: parsed.slug || fileName.replace(/\.json$/, ""),
        title: parsed.title || "Untitled Post",
        excerpt: parsed.excerpt || "",
        category: (parsed.category as BlogCategory) || "Studio Journal",
        date: parsed.date || new Date().toISOString().split("T")[0],
        readTime: parsed.readTime || "4 min read",
        image: parsed.image || "/headers/header-home.webp",
        author: parsed.author || "Alexandra Robles",
        content: contentArray.length > 0 ? contentArray : [parsed.excerpt || ""],
      };
    });
  } catch (err) {
    console.error("Error reading local posts server:", err);
    return [];
  }
}

export function getAllBlogPostsServer(): BlogPost[] {
  const localPosts = readLocalPostsServer();
  
  const localSlugs = new Set(localPosts.map((p) => p.slug));
  const remainingInitial = INITIAL_BLOG_POSTS.filter((p) => !localSlugs.has(p.slug));
  
  return [...localPosts, ...remainingInitial];
}

export function getBlogPostBySlugServer(slug: string): BlogPost | undefined {
  const posts = getAllBlogPostsServer();
  return posts.find((post) => post.slug === slug || post.id === slug);
}

export function getRelatedBlogPostsServer(currentSlug: string, limit = 3): BlogPost[] {
  const posts = getAllBlogPostsServer();
  return posts.filter((post) => post.slug !== currentSlug && post.id !== currentSlug).slice(0, limit);
}
