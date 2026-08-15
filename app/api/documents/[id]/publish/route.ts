import { NextResponse } from "next/server";

import type { Document } from "@/lib/models/document";

import {
  publishDocument,
} from "@/services/publishing-service";

import {
  deletePublishedDocument,
} from "@/services/publishing-service";

export async function DELETE(
  request: Request
) {
  try {
    const document =
      (await request.json()) as Document;

    if (!document.id) {
      return NextResponse.json(
        {
          error:
            "Document ID is required.",
        },
        {
          status: 400,
        }
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

    await deletePublishedDocument(
  document
);

    return NextResponse.json({
      success: true,
      unpublished: true,
    });
  } catch (error) {
    console.error(
      "Deletion failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete publication.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const document =
      (await request.json()) as Document;

    if (!document.id) {
      return NextResponse.json(
        {
          error:
            "Document ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      document.status !== "published"
    ) {
      return NextResponse.json(
        {
          error:
            "Document must be marked as published.",
        },
        {
          status: 400,
        }
      );
    }

    const publicationPath =
  await publishDocument(document);

    return NextResponse.json({
      success: true,
      publicationPath,
    });
  } catch (error) {
  console.error(
    "Publishing failed:",
    error
  );

  return NextResponse.json(
      {
        error:
          "Failed to publish document.",
      },
      {
        status: 500,
      }
    );
  }
}