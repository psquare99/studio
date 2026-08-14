import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "@/lib/storage/category-storage";

export function loadCategories(
  workspaceId: string
) {
  return getCategories(
    workspaceId
  );
}

export function loadCategory(
  id: string
) {
  return getCategory(id);
}

export function addCategory(
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

export function editCategory(
  category: Parameters<
    typeof updateCategory
  >[0]
) {
  return updateCategory(
    category
  );
}

export function removeCategory(
  id: string
) {
  deleteCategory(id);
}