import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { isAuthenticated } from "@/lib/auth";

import {
  loadCategories,
  addCategory,
} from "@/services/category-service";

async function requireAuthentication() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("workshop_session")?.value;

  return isAuthenticated(sessionToken);
}

export async function GET(request: Request) {
  try {
    if (!(await requireAuthentication())) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const workspaceId = new URL(request.url).searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required." },
        { status: 400 },
      );
    }

    const categories = await loadCategories(workspaceId);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Loading categories failed:", error);

    return NextResponse.json(
      { error: "Failed to load categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAuthentication())) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      workspaceId?: string;
      name?: string;
      slug?: string;
    };

    if (!body.workspaceId || !body.name || !body.slug) {
      return NextResponse.json(
        { error: "workspaceId, name and slug are required." },
        { status: 400 },
      );
    }

    const category = await addCategory(
      body.workspaceId,
      body.name,
      body.slug,
    );

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Category creation failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category." },
      { status: 500 },
    );
  }
}
