import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { isAuthenticated } from "@/lib/auth";

import {
  createNewDocument,
  loadRecentDocuments,
} from "@/services/document-service";

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

    const contentTypeId = new URL(request.url).searchParams.get("contentTypeId");

    const documents = await loadRecentDocuments();

    return NextResponse.json({
      documents: contentTypeId
        ? documents.filter(
            (document) => document.contentTypeId === contentTypeId,
          )
        : documents,
    });
  } catch (error) {
    console.error("Loading documents failed:", error);

    return NextResponse.json(
      { error: "Failed to load documents." },
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
      contentTypeId?: string;
    };

    if (!body.workspaceId || !body.contentTypeId) {
      return NextResponse.json(
        { error: "workspaceId and contentTypeId are required." },
        { status: 400 },
      );
    }

    const document = await createNewDocument(
      body.workspaceId,
      body.contentTypeId,
    );

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Document creation failed:", error);

    return NextResponse.json(
      { error: "Failed to create document." },
      { status: 500 },
    );
  }
}
