"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory, createSkill, deleteSkill } from "@/actions/skills";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Trash2, Plus, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  description: string | null;
  isBuiltIn: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  isBuiltIn: boolean;
  skills: Skill[];
}

export default function SettingsClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    const fd = new FormData();
    fd.set("name", newCategoryName.trim());
    try {
      await createCategory(fd);
      setNewCategoryName("");
      setShowCategoryInput(false);
      router.refresh();
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Delete category "${name}" and all its skills? This cannot be undone.`)) return;
    try {
      await deleteCategory(id);
      setSelectedCategoryId(null);
      router.refresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Cannot delete this category");
    }
  }

  async function handleAddSkill() {
    if (!newSkillName.trim() || !selectedCategoryId) return;
    setAddingSkill(true);
    const fd = new FormData();
    fd.set("name", newSkillName.trim());
    fd.set("categoryId", selectedCategoryId);
    try {
      await createSkill(fd);
      setNewSkillName("");
      setShowSkillInput(false);
      router.refresh();
    } finally {
      setAddingSkill(false);
    }
  }

  async function handleDeleteSkill(id: string, name: string) {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteSkill(id);
      router.refresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Cannot delete this skill");
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Categories panel */}
      <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Categories</h3>
          <button
            onClick={() => setShowCategoryInput((s) => !s)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showCategoryInput && (
          <div className="mb-3 flex gap-1">
            <input
              autoFocus
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="Category name"
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddCategory}
              disabled={addingCategory || !newCategoryName.trim()}
              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}

        <ul className="space-y-1 flex-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group",
                  selectedCategoryId === cat.id
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span className="flex items-center gap-1.5 truncate">
                  {cat.isBuiltIn && <Lock className="w-3 h-3 text-gray-300 flex-shrink-0" />}
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{cat.skills.length}</span>
                  {!cat.isBuiltIn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id, cat.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills panel */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
        {!selectedCategory ? (
          <p className="text-gray-400 text-sm">Select a category to manage its skills</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{selectedCategory.name}</h3>
                <p className="text-xs text-gray-400">{selectedCategory.skills.length} skills</p>
              </div>
              <button
                onClick={() => setShowSkillInput((s) => !s)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>

            {showSkillInput && (
              <div className="mb-4 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Skill name"
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={addingSkill || !newSkillName.trim()}
                  className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            )}

            <ul className="divide-y divide-gray-100">
              {selectedCategory.skills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between py-2.5 group">
                  <span className="flex items-center gap-2 text-sm text-gray-800">
                    {skill.isBuiltIn && <Lock className="w-3 h-3 text-gray-300" />}
                    {skill.name}
                  </span>
                  {!skill.isBuiltIn && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id, skill.name)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
