import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Document } from "@/lib/models/document";

import { isAuthenticated } from "@/lib/auth";

import {
  loadDocument,
  saveDocument,
  removeDocument,
} from "@/services/document-service";

async function requireAuthentication() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("workshop_session")?.value;

  return isAuthenticated(sessionToken);
}

export async function GET(
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

    const document = await loadDocument(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Loading document failed:", error);

    return NextResponse.json(
      { error: "Failed to load document." },
      { status: 500 },
    );
  }
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
    const document = (await request.json()) as Document;

    if (!document.id || document.id !== id) {
      return NextResponse.json(
        { error: "Document ID mismatch." },
        { status: 400 },
      );
    }

    await saveDocument(document);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Saving document failed:", error);

    return NextResponse.json(
      { error: "Failed to save document." },
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

    await removeDocument(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deleting document failed:", error);

    return NextResponse.json(
      { error: "Failed to delete document." },
      { status: 500 },
    );
  }
}
