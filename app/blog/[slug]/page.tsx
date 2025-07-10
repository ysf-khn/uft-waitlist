import { getPostData, getPostSlugs } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: "Post Not Found - Unfetter",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - Unfetter Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Blog
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-gray-500">Recovery Guide</span>
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author and Meta */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {post.author && (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFB300] to-[#FFC933] rounded-full flex items-center justify-center text-black text-sm font-semibold mr-3">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{post.author}</div>
                  <div className="text-sm text-gray-500">Recovery Expert</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {post.readingTime} min read
            </div>
            <time dateTime={post.date}>
              {format(new Date(post.date), "MMMM d, yyyy")}
            </time>
          </div>

          {/* Subtitle/Excerpt */}
          <div className="mt-8 max-w-3xl mx-auto">
            <p className="text-xl text-gray-400 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div
            className="blog-content text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Take the Next Step</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ready to break free from porn addiction? Join our waitlist to get
              early access to Unfetter&apos;s comprehensive recovery system.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-[#FFB300] text-black px-8 py-4 rounded-lg hover:bg-[#FFC933] transition-colors font-medium text-lg"
            >
              Join Waitlist
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </footer>
      </article>

      {/* Related/Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </nav>
    </div>
  );
}
