import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Document } from "@/lib/models/document";

import {
  isAuthenticated,
} from "@/lib/auth";

import {
  publishDocument,
  deletePublishedDocument,
} from "@/services/publishing-service";

import {
  loadDocument,
  updateDocument,
} from "@/services/document-service";

async function requireAuthentication() {
  const cookieStore =
    await cookies();

  const sessionToken =
    cookieStore.get(
      "workshop_session",
    )?.value;

  return isAuthenticated(
    sessionToken,
  );
}

export async function DELETE(
  request: Request,
) {
  try {
    const authenticated =
      await requireAuthentication();

    if (!authenticated) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
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
          error:
            "Document ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const document =
      await loadDocument(incomingDocument.id);

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Document not found.",
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
        error:
          "Failed to delete publication.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const authenticated =
      await requireAuthentication();

    if (!authenticated) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
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
          error:
            "Document ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const document =
      await loadDocument(incomingDocument.id);

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Document not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * A document can be published when it has never been
     * published before (draft) or when it is already published
     * or has been modified since its last publish. It must NOT
     * be unpublished here — that is the DELETE handler's job.
     * The previous version of this handler incorrectly called
     * deletePublishedDocument() and rejected "modified" documents
     * during publish, which broke the Update flow entirely.
     */
    if (
      document.status !== "draft" &&
      document.status !== "published" &&
      document.status !== "modified"
    ) {
      return NextResponse.json(
        {
          error:
            "Document must be a draft, published, or modified document to be published.",
        },
        {
          status: 400,
        },
      );
    }

    const { publicationPath, publishedSlug } =
      await publishDocument(document);

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
        error:
          "Failed to publish document.",
      },
      {
        status: 500,
      },
    );
  }
}