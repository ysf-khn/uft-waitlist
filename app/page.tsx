"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail(""); // Clear the form
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] relative">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#FFB300]">
            Unfetter
          </Link>
          <Link
            href="/blog"
            className="text-[#F5F5F5] hover:text-[#FFB300] transition-colors font-medium"
          >
            Blog
          </Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile: iPhone Mockup First - Much Bigger */}
        <div className="flex-1 flex items-center justify-center p-4 lg:hidden order-1 pt-20">
          <div className="w-full max-w-[300px] flex justify-center">
            <Image
              src="/unfetter.svg"
              alt="Unfetter App iPhone Mockup"
              width={300}
              height={600}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Left Column: Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16 order-2 lg:order-1 pt-20 lg:pt-16">
          <div className="max-w-xl w-full space-y-8 pb-16 lg:pb-8">
            {/* Headline */}
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              The Tab is Closed. The Self-Loathing Begins. You Know This
              <span className="text-[#FFB300]"> Feeling.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg lg:text-xl leading-relaxed opacity-90">
              It&apos;s 2 AM. You&apos;re scrolling through the curated lives of
              OF models, feeding on a dopamine drip that leaves you emptier than
              before. You call it &apos;winding down,&apos; but it&apos;s a slow
              surrender. You&apos;re trading your ambition for pixels, your
              energy for a fleeting chemical high, and your potential for a
              fantasy that actively despises your success. This isn&apos;t just
              a bad habit. It&apos;s a slow-acting poison to your masculine
              core.
            </p>

            {/* Solution Text */}
            <div className="space-y-6">
              <p className="text-xl lg:text-2xl leading-relaxed font-semibold text-[#FFB300]">
                You are not broken. You are untrained.
              </p>

              <p className="text-base lg:text-lg leading-relaxed">
                Unfetter is not another &apos;feel-good&apos; app. It is a
                forge. A strategic training ground designed to help you reclaim
                that stolen energy. Led by Marcus, your AI coach, you will learn
                to master the urges, not just endure them. You will dismantle
                the cycle and build a life that requires no escape.
              </p>

              {/* CTA Prompt */}
              <p className="text-lg lg:text-xl font-semibold text-[#FFB300]">
                The war against mediocrity has begun. The waiting list is open
                to the first wave of warriors. Enlistment is free. Complacency
                will cost you everything.
              </p>
            </div>

            {/* Blog Link */}
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#FFB300] mb-2">
                Learn the Science Behind Recovery
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Discover expert insights and practical strategies for overcoming
                addiction
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center text-[#FFB300] hover:text-[#FFC933] transition-colors font-medium"
              >
                Read Our Blog
                <svg
                  className="w-4 h-4 ml-1"
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

            {/* Main Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-[#F5F5F5] placeholder-gray-400 focus:outline-none focus:border-[#FFB300] focus:ring-2 focus:ring-[#FFB300] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading || isSubmitted}
                className="w-full bg-[#FFB300] text-[#121212] px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#FFC933] hover:scale-[1.02] transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading
                  ? "ENLISTING..."
                  : isSubmitted
                  ? "✓ ENLISTED!"
                  : "ENLIST NOW"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: iPhone Mockup (Desktop Only) - Sticky & Prominent */}
        <div className="hidden lg:flex flex-1 items-start justify-center p-8 order-1 lg:order-2 bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
          <div className="w-full max-w-[1000px] sticky top-[5vh]">
            <div className="relative h-[90vh] flex items-center justify-center">
              {/* Subtle glow effect behind the phone */}
              <div className="absolute inset-0 bg-[#FFB300] opacity-5 blur-3xl rounded-full"></div>
              <Image
                src="/unfetter.svg"
                alt="Unfetter App iPhone Mockup"
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                width={800}
                height={1600}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
