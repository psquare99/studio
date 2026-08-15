"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import {
  addCategory,
  editCategory,
  loadCategories,
  removeCategory,
} from "@/services/category-service";

import type { Category } from "@/lib/models/category";

const WORKSPACE_ID =
  "the-long-way-home";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editName, setEditName] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
  async function load() {
    const workspaceCategories =
      await loadCategories(
        WORKSPACE_ID
      );

    setCategories(
      workspaceCategories
    );
  }

  load();
}, []);

  const editingCategory =
    useMemo(
      () =>
        categories.find(
          (category) =>
            category.id ===
            editingId
        ),
      [
        categories,
        editingId,
      ]
    );

  async function handleCreate(
  event: React.FormEvent
) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Give the category a name first."
      );
      return;
    }

    const slug =
      createSlug(
        trimmedName
      );

    if (!slug) {
      setError(
        "That name cannot be used as a category."
      );
      return;
    }

    const duplicate =
      categories.some(
        (category) =>
          category.slug === slug
      );

    if (duplicate) {
      setError(
        "That category already exists."
      );
      return;
    }

    const category =
  await addCategory(
    WORKSPACE_ID,
    trimmedName,
    slug
  );

    setCategories(
      (current) => [
        ...current,
        category,
      ]
    );

    setName("");
    setError("");
  }

  function startEditing(
    category: Category
  ) {
    setEditingId(
      category.id
    );

    setEditName(
      category.name
    );

    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
    setError("");
  }

  async function saveEdit(
  category: Category
) {
    const trimmedName =
      editName.trim();

    if (!trimmedName) {
      setError(
        "A category needs a name."
      );
      return;
    }

    const slug =
      createSlug(
        trimmedName
      );

    const duplicate =
      categories.some(
        (item) =>
          item.id !==
            category.id &&
          item.slug === slug
      );

    if (duplicate) {
      setError(
        "That category already exists."
      );
      return;
    }

    const updatedCategory: Category =
      {
        ...category,
        name: trimmedName,
        slug,
      };

    await editCategory(
  updatedCategory
);

    setCategories(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            category.id
              ? updatedCategory
              : item
        )
    );

    cancelEditing();
  }

  async function handleDelete(
  category: Category
) {
    const confirmed =
      window.confirm(
        `Delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    await removeCategory(
  category.id
);

    setCategories(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            category.id
        )
    );

    if (
      editingId ===
      category.id
    ) {
      cancelEditing();
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-8 py-16">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-neutral-500 transition hover:text-black"
            >
              ← Studio
            </Link>

            <h1 className="mt-6 text-5xl font-bold tracking-tight">
              Categories
            </h1>

            <p className="mt-3 text-lg text-neutral-500">
              Organize the things you publish.
            </p>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8">
          <h2 className="text-lg font-semibold">
            New category
          </h2>

          <form
            onSubmit={
              handleCreate
            }
            className="mt-5 flex gap-3"
          >
            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="e.g. Photography"
              className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-neutral-900"
            />

            <button
              type="submit"
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              + Create
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-neutral-200 bg-white">
            {categories.length ===
            0 ? (
              <div className="p-8 text-center text-neutral-500">
                No categories yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {categories.map(
                  (category) => (
                    <div
                      key={
                        category.id
                      }
                      className="flex items-center justify-between gap-6 p-6"
                    >
                      {editingId ===
                      category.id ? (
                        <div className="flex flex-1 gap-3">
                          <input
                            value={
                              editName
                            }
                            onChange={(
                              event
                            ) =>
                              setEditName(
                                event
                                  .target
                                  .value
                              )
                            }
                            autoFocus
                            className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 outline-none focus:border-neutral-900"
                          />

                          <button
                            onClick={() =>
                              saveEdit(
                                category
                              )
                            }
                            className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
                          >
                            Save
                          </button>

                          <button
                            onClick={
                              cancelEditing
                            }
                            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium text-neutral-900">
                              {
                                category.name
                              }
                            </p>

                            <p className="mt-1 text-sm text-neutral-400">
                              {
                                category.slug
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                startEditing(
                                  category
                                )
                              }
                              className="rounded-xl px-4 py-2 text-sm text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  category
                                )
                              }
                              className="rounded-xl px-4 py-2 text-sm text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {editingCategory && (
          <p className="mt-4 text-sm text-neutral-400">
            Editing{" "}
            {editingCategory.name}
          </p>
        )}
      </div>
    </main>
  );
}