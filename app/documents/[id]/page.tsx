"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  loadDocument,
  saveDocument,
} from "@/services/document-service";

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load document
  useEffect(() => {
    const document = loadDocument(id);

    if (!document) {
      return;
    }

    setTitle(document.title);
    setContent(document.content);
  }, [id]);

  // Save document
  useEffect(() => {
    const document = loadDocument(id);

    if (!document) {
      return;
    }

    saveDocument({
      ...document,
      title,
      content,
      updatedAt: new Date().toISOString(),
    });
  }, [id, title, content]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <Link
          href="/"
          className="mb-12 inline-block text-sm text-neutral-500 transition hover:text-black"
        >
          ← Workspace
        </Link>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="mt-8 w-full border-none text-7xl font-bold outline-none placeholder:text-neutral-400"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="mt-10 min-h-[600px] w-full resize-none border-none text-xl leading-8 outline-none placeholder:text-neutral-400"
        />
        
      </div>
      
    </main>
  );
  
}
export function getRecentDocuments() {
  return getDocuments().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );
}