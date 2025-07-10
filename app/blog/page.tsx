import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Unfetter",
  description:
    "Read articles about quitting porn addiction, building healthy habits, and reclaiming your life. Expert insights and practical strategies for recovery.",
  openGraph: {
    title: "Blog - Unfetter",
    description:
      "Expert articles on overcoming porn addiction and building a healthier life",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/"
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
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Expert insights and practical strategies for overcoming addiction and
          building a better life.
        </p>
      </header>

      {/* Blog Posts Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-400 mb-4">
              No posts yet
            </h2>
            <p className="text-gray-500">Check back soon for new articles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <article className="group bg-black border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-200 h-full flex flex-col">
                  {/* Date */}
                  <div className="flex items-center justify-between mb-4">
                    <time
                      dateTime={post.date}
                      className="text-sm text-gray-500"
                    >
                      {format(new Date(post.date), "MMM d")}
                    </time>
                    {post.readingTime && (
                      <span className="text-sm text-gray-500">
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-[#FFB300] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  {post.author && (
                    <div className="flex items-center mt-auto pt-4 border-t border-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FFB300] to-[#FFC933] rounded-full flex items-center justify-center text-black text-sm font-semibold mr-3">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm text-gray-400">
                        {post.author}
                      </span>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Start Your Recovery Journey?
          </h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our waitlist to get early access to Unfetter&apos;s
            comprehensive system for overcoming porn addiction and building
            lasting freedom.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-[#FFB300] text-black px-6 py-3 rounded-lg hover:bg-[#FFC933] transition-colors font-medium"
          >
            Join Waitlist
          </Link>
        </div>
      </main>
    </div>
  );
}
