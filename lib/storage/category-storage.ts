import { Category } from "@/lib/models/category";

const STORAGE_KEY = "studio-categories";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "dev-logs",
    workspaceId: "the-long-way-home",
    name: "Dev Logs",
    slug: "dev-logs",
  },
  {
    id: "reflections",
    workspaceId: "the-long-way-home",
    name: "Reflections",
    slug: "reflections",
  },
  {
    id: "books",
    workspaceId: "the-long-way-home",
    name: "Books",
    slug: "books",
  },
  {
    id: "travel",
    workspaceId: "the-long-way-home",
    name: "Travel",
    slug: "travel",
  },
  {
    id: "projects",
    workspaceId: "the-long-way-home",
    name: "Projects",
    slug: "projects",
  },
];

function readCategories(): Category[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_CATEGORIES)
    );

    return [
      ...DEFAULT_CATEGORIES,
    ];
  }

  return JSON.parse(data) as Category[];
}

function saveCategories(
  categories: Category[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(categories)
  );
}

export function getCategories(
  workspaceId: string
): Category[] {
  return readCategories().filter(
    (category) =>
      category.workspaceId === workspaceId
  );
}

export function getCategory(
  id: string
): Category | undefined {
  return readCategories().find(
    (category) => category.id === id
  );
}

export function createCategory(
  workspaceId: string,
  name: string,
  slug: string
): Category {
  const categories =
    readCategories();

  const category: Category = {
    id: crypto.randomUUID(),
    workspaceId,
    name,
    slug,
  };

  categories.push(category);

  saveCategories(categories);

  return category;
}

export function updateCategory(
  updated: Category
): Category {
  const categories =
    readCategories();

  const updatedCategories =
    categories.map((category) =>
      category.id === updated.id
        ? updated
        : category
    );

  saveCategories(
    updatedCategories
  );

  return updated;
}

export function deleteCategory(
  id: string
) {
  const categories =
    readCategories();

  const remaining =
    categories.filter(
      (category) =>
        category.id !== id
    );

  saveCategories(remaining);
}