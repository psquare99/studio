import { Category } from "@/lib/models/category";
import { supabase } from "@/lib/supabase";

const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  {
    workspaceId: "the-long-way-home",
    name: "Dev Logs",
    slug: "dev-logs",
  },
  {
    workspaceId: "the-long-way-home",
    name: "Reflections",
    slug: "reflections",
  },
  {
    workspaceId: "the-long-way-home",
    name: "Books",
    slug: "books",
  },
  {
    workspaceId: "the-long-way-home",
    name: "Travel",
    slug: "travel",
  },
  {
    workspaceId: "the-long-way-home",
    name: "Projects",
    slug: "projects",
  },
];

function fromRow(row: {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
}): Category {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    slug: row.slug,
  };
}

export async function getCategories(
  workspaceId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, workspace_id, name, slug")
    .eq("workspace_id", workspaceId)
    .order("name");

  if (error) {
    throw new Error(
      `Failed to load categories: ${error.message}`
    );
  }

  return (data ?? []).map(fromRow);
}

export async function getCategory(
  id: string
): Promise<Category | undefined> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, workspace_id, name, slug")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load category: ${error.message}`
    );
  }

  return data ? fromRow(data) : undefined;
}

export async function createCategory(
  workspaceId: string,
  name: string,
  slug: string
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      workspace_id: workspaceId,
      name,
      slug,
    })
    .select("id, workspace_id, name, slug")
    .single();

  if (error) {
    throw new Error(
      `Failed to create category: ${error.message}`
    );
  }

  return fromRow(data);
}

export async function updateCategory(
  updated: Category
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      workspace_id: updated.workspaceId,
      name: updated.name,
      slug: updated.slug,
    })
    .eq("id", updated.id)
    .select("id, workspace_id, name, slug")
    .single();

  if (error) {
    throw new Error(
      `Failed to update category: ${error.message}`
    );
  }

  return fromRow(data);
}

export async function deleteCategory(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete category: ${error.message}`
    );
  }
}

export async function seedDefaultCategories(
  workspaceId: string
): Promise<void> {
  const existing =
    await getCategories(workspaceId);

  if (existing.length > 0) {
    return;
  }

  const defaults =
    DEFAULT_CATEGORIES.map(
      (category) => ({
        workspace_id: workspaceId,
        name: category.name,
        slug: category.slug,
      })
    );

  const { error } = await supabase
    .from("categories")
    .insert(defaults);

  if (error) {
    throw new Error(
      `Failed to seed categories: ${error.message}`
    );
  }
}