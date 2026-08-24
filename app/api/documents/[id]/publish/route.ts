import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Document } from "@/lib/models/document";

import { isAuthenticated } from "@/lib/auth";

import {
  publishDocument,
  deletePublishedDocument,
} from "@/services/publishing-service";

import {
  loadDocument,
  updateDocument,
} from "@/services/document-service";

async function requireAuthentication() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    "workshop_session",
  )?.value;

  return isAuthenticated(sessionToken);
}

export async function DELETE(request: Request) {
  try {
    const authenticated = await requireAuthentication();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const incomingDocument =
      (await request.json()) as Document;

    if (!incomingDocument.id) {
      return NextResponse.json(
        {
          error: "Document ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const document = await loadDocument(
      incomingDocument.id,
    );

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      document.status !== "published" &&
      document.status !== "modified"
    ) {
      return NextResponse.json({
        success: true,
        unpublished: false,
      });
    }

    await deletePublishedDocument(document);

    return NextResponse.json({
      success: true,
      unpublished: true,
    });
  } catch (error) {
    console.error(
      "Deletion failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to delete publication.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await requireAuthentication();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const incomingDocument =
      (await request.json()) as Document;

    if (!incomingDocument.id) {
      return NextResponse.json(
        {
          error: "Document ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    // Always use the persisted document state.
    // The client payload is used only to identify the document.
    const document = await loadDocument(
      incomingDocument.id,
    );

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    // A published document becomes "modified" when edited.
    // Both states are valid for republishing.
    if (
      document.status !== "published" &&
      document.status !== "modified"
    ) {
      return NextResponse.json(
        {
          error:
            "Only published or modified documents can be published.",
        },
        {
          status: 400,
        },
      );
    }

    // publishDocument handles the complete publication lifecycle:
    // - PUT the desired/new slug
    // - DELETE the previous published slug when changed
    // - return the successfully published slug
    const {
      publicationPath,
      publishedSlug,
    } = await publishDocument(document);

    // Persist the publication identity only after GitHub
    // publication has succeeded.
    await updateDocument({
      ...document,
      status: "published",
      publishedSlug,
    });

    return NextResponse.json({
      success: true,
      publicationPath,
    });
  } catch (error) {
    console.error(
      "Publishing failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to publish document.",
      },
      {
        status: 500,
      },
    );
  }
}