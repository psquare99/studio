"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load saved draft
  useEffect(() => {
    const savedTitle = localStorage.getItem("studio-title");
    const savedContent = localStorage.getItem("studio-content");

    if (savedTitle) {
      setTitle(savedTitle);
    }

    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // Save title
  useEffect(() => {
    localStorage.setItem("studio-title", title);
  }, [title]);

  // Save content
  useEffect(() => {
    localStorage.setItem("studio-content", content);
  }, [content]);

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