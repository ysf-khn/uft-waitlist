import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Add to Google Sheet
    await addToWaitlist(email);

    return NextResponse.json(
      { message: "Successfully added to waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json(
      { error: "Failed to add to waitlist. Please try again." },
      { status: 500 }
    );
  }
}
