export type BlogCategory =
  | "Studio Journal"
  | "Inspiration & Faith"
  | "Live Events"
  | "Art Guides";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  author?: string;
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "the-meaning-behind-poiema",
    title: "The Meaning Behind 'Poiema': God's Work of Art in Progress",
    excerpt:
      "Exploring Ephesians 2:10 and the spiritual foundation of my artist identity—how every brushstroke reminds us that we are masterpieces being shaped with intention.",
    category: "Inspiration & Faith",
    date: "March 24, 2026",
    readTime: "4 min read",
    image: "/headers/header-home.webp",
    author: "Alexandra Robles",
    content: [
      "When people ask about the origin of 'Alexpoeima', the answer lies in an ancient Greek word that shifted my entire perspective on creativity: Poiema (POY-EMA). In Ephesians 2:10, Paul writes: 'For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.' In the original Greek text, 'handiwork' or 'masterpiece' is Poiema.",
      "The English word 'poem' comes directly from this root. Think of that: we are not an afterthought or an accidental stroke on the canvas. We are a living, breathing poem crafted by the Creator.",
      "Growing up, drawing and painting became my sanctuary—a tool for emotional connection, identity, and inner peace in challenging times. Whenever I sit before an empty canvas with palette knife and acrylics, I am reminded that beauty takes time, layers, and patience. Some layers are vibrant; others are dark and foundational. Yet every single layer serves a divine purpose.",
      "My prayer for every collector who welcomes an Alexpoeima piece into their home is that it serves as a daily visual reminder: you are loved, you are intentional, and you are a masterpiece in progress.",
    ],
  },
  {
    id: "2",
    slug: "capturing-timeless-moments-live-wedding-painting",
    title: "Behind the Easel: The Magic of Live Wedding & Event Painting",
    excerpt:
      "What it feels like to paint live during vows and celebrations, preserving memories in vivid pigment while guests watch the canvas unfold.",
    category: "Live Events",
    date: "March 12, 2026",
    readTime: "5 min read",
    image: "/headers/header-liveevvents.webp",
    author: "Alexandra Robles",
    content: [
      "There is an extraordinary energy in the air during a wedding celebration. The nervous excitement before the ceremony, the joy of the first kiss, and the celebration that follows on the dance floor. While photographers capture frozen fractions of a second, a live painting captures the atmosphere, romance, and emotion in textured acrylic.",
      "When I arrive at an event, I set up early to block in the architectural setting, lighting, and ambient colors. As guests arrive and the ceremony begins, I focus on capturing the couple's likeness, posture, and the unique intimacy of the moment.",
      "One of the greatest joys of live event painting is guest engagement. Throughout the evening, guests stop by the easel, watch the layers evolve, and chat about the creative process. It transforms art from a static object into an immersive entertainment experience.",
      "After the event concludes, the painting returns to my studio for 2 to 3 weeks of fine refinement, varnish sealing, and meticulous drying before being delivered ready to hang in the couple's new home.",
    ],
  },
  {
    id: "3",
    slug: "acrylic-layering-and-texture",
    title: "Palette, Light & Texture: My Studio Acrylic Process",
    excerpt:
      "A deep dive into why acrylic is my medium of choice, building dimensional layers, and creating works that shift beautifully under natural light.",
    category: "Studio Journal",
    date: "February 28, 2026",
    readTime: "6 min read",
    image: "/headers/header-finearts.webp",
    author: "Alexandra Robles",
    content: [
      "Many art lovers wonder why I specialize primarily in acrylic rather than traditional oils. Acrylics offer an extraordinary versatility: they dry with rich, vibrant pigment retention and allow for rapid layering of glazes, impasto textures, and gold undertones.",
      "In my studio, every piece begins with a deliberate tonal underpainting. This foundational wash dictates how ambient light bounces through subsequent translucent layers. From there, I build up texture using heavy-body acrylics, palette knives, and custom bristle brushes.",
      "Light is the final collaborator in every artwork. When you position an original canvas in a room, the appearance changes as morning dawn transitions into warm afternoon glow and evening lamplight. Designing art that breathes and responds to its environment is what makes original canvas collecting so rewarding.",
    ],
  },
  {
    id: "4",
    slug: "how-to-choose-artwork-size",
    title: "How to Choose the Perfect Canvas Size for Your Space",
    excerpt:
      "A practical collector's guide to scale, wall proportions, eye-level placement, and selecting statement pieces versus accent arrangements.",
    category: "Art Guides",
    date: "February 14, 2026",
    readTime: "4 min read",
    image: "/headers/header-discover.webp",
    author: "Alexandra Robles",
    content: [
      "One of the most frequent questions collectors ask is: 'How do I know what canvas size will look best on my wall?' The general rule of interior design is that artwork should span between 60% and 75% of available wall space when hung above furniture like sofas, beds, or console tables.",
      "For cozy reading nooks or single portrait subjects, a 30 × 40 cm (12\" × 16\") or 40 × 50 cm (18\" × 24\") canvas brings warmth without overwhelming the room.",
      "For open-concept living rooms, entry foyers, or master bedrooms, a 50 × 60 cm (24\" × 36\") or grand 60 × 80 cm (36\" × 48\") statement piece anchors the architectural lines and establishes an inspiring focal point.",
      "If you have unique wall dimensions or custom architectural niches, custom-tailored commission dimensions allow you to achieve seamless aesthetic balance.",
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = INITIAL_BLOG_POSTS;

export const BLOG_CATEGORIES: readonly ["All", ...BlogCategory[]] = [
  "All",
  "Studio Journal",
  "Inspiration & Faith",
  "Live Events",
  "Art Guides",
] as const;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug || post.id === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== currentSlug && post.id !== currentSlug).slice(0, limit);
}
