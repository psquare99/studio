import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "@/lib/storage/category-storage";

export async function loadCategories(
  workspaceId: string
) {
  return getCategories(workspaceId);
}

export async function loadCategory(
  id: string
) {
  return getCategory(id);
}

export async function addCategory(
  workspaceId: string,
  name: string,
  slug: string
) {
  return createCategory(
    workspaceId,
    name,
    slug
  );
}

export async function editCategory(
  category: Parameters<
    typeof updateCategory
  >[0]
) {
  return updateCategory(category);
}

export async function removeCategory(
  id: string
) {
  return deleteCategory(id);
}