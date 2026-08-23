import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/media/media-service";

async function requireAuthentication() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("workshop_session")?.value;

  return isAuthenticated(sessionToken);
}

export async function POST(request: Request) {
  try {
    if (!(await requireAuthentication())) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const alt = formData.get("alt");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "An image file is required." },
        { status: 400 },
      );
    }

    const asset = await uploadImage(
      file,
      typeof alt === "string" ? alt.trim() : "",
    );

    return NextResponse.json({ asset });
  } catch (error) {
    console.error("Image upload failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image.",
      },
      { status: 500 },
    );
  }
}