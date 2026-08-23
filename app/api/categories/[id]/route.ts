import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Category } from "@/lib/models/category";

import { isAuthenticated } from "@/lib/auth";

import {
  editCategory,
  removeCategory,
} from "@/services/category-service";

async function requireAuthentication() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("workshop_session")?.value;

  return isAuthenticated(sessionToken);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAuthentication())) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const category = (await request.json()) as Category;

    if (!category.id || category.id !== id) {
      return NextResponse.json(
        { error: "Category ID mismatch." },
        { status: 400 },
      );
    }

    const updated = await editCategory(category);

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Updating category failed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await requireAuthentication())) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const { id } = await params;

    await removeCategory(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deleting category failed:", error);

    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 },
    );
  }
}
