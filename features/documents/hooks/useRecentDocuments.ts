"use client";

import { useEffect, useState } from "react";

import { Document } from "@/lib/models/document";
import { loadRecentDocuments } from "@/services/document-service";

export function useRecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

 useEffect(() => {
  async function load() {
    const recentDocuments =
      await loadRecentDocuments();

    setDocuments(recentDocuments);
  }

  load();
}, []);

  return documents;
}