"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory, createSkill, deleteSkill, createTeam, deleteTeam } from "@/actions/skills";
import Button from "@/components/ui/Button";
import { Trash2, Plus, Lock, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill { id: string; name: string; description: string | null; isBuiltIn: boolean; }
interface Category { id: string; name: string; description: string | null; isBuiltIn: boolean; skills: Skill[]; }
interface Team { id: string; name: string; }

type Tab = "skills" | "teams";

export default function SettingsClient({ categories, teams }: { categories: Category[]; teams: Team[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("skills");

  // Skill category state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);

  // Team state
  const [newTeamName, setNewTeamName] = useState("");
  const [addingTeam, setAddingTeam] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    const fd = new FormData();
    fd.set("name", newCategoryName.trim());
    try { await createCategory(fd); setNewCategoryName(""); setShowCategoryInput(false); router.refresh(); }
    finally { setAddingCategory(false); }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Delete category "${name}" and all its skills?`)) return;
    try { await deleteCategory(id); setSelectedCategoryId(null); router.refresh(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Cannot delete"); }
  }

  async function handleAddSkill() {
    if (!newSkillName.trim() || !selectedCategoryId) return;
    setAddingSkill(true);
    const fd = new FormData();
    fd.set("name", newSkillName.trim());
    fd.set("categoryId", selectedCategoryId);
    try { await createSkill(fd); setNewSkillName(""); setShowSkillInput(false); router.refresh(); }
    finally { setAddingSkill(false); }
  }

  async function handleDeleteSkill(id: string, name: string) {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try { await deleteSkill(id); router.refresh(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Cannot delete"); }
  }

  async function handleAddTeam() {
    if (!newTeamName.trim()) return;
    setAddingTeam(true);
    try { await createTeam(newTeamName.trim()); setNewTeamName(""); setShowTeamInput(false); router.refresh(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Team name already exists"); }
    finally { setAddingTeam(false); }
  }

  async function handleDeleteTeam(id: string, name: string) {
    if (!confirm(`Remove team "${name}"? Employees assigned to this team will keep the team name.`)) return;
    try { await deleteTeam(id); router.refresh(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Cannot delete"); }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("skills")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors",
            tab === "skills" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
        >
          Skill Categories
        </button>
        <button
          onClick={() => setTab("teams")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5",
            tab === "teams" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
        >
          <Users className="w-3.5 h-3.5" />
          Teams
          <span className="text-xs text-gray-400 ml-0.5">{teams.length}</span>
        </button>
      </div>

      {/* Skill Categories tab */}
      {tab === "skills" && (
        <div className="flex gap-6 flex-1">
          {/* Categories panel */}
          <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Categories</h3>
              <button onClick={() => setShowCategoryInput((s) => !s)} className="text-orange-600 hover:text-orange-800">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {showCategoryInput && (
              <div className="mb-3 flex gap-1">
                <input autoFocus type="text" value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Category name"
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                <button onClick={handleAddCategory} disabled={addingCategory || !newCategoryName.trim()}
                  className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 disabled:opacity-50">Add</button>
              </div>
            )}
            <ul className="space-y-1 flex-1">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => setSelectedCategoryId(cat.id)}
                    className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group",
                      selectedCategoryId === cat.id ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50")}>
                    <span className="flex items-center gap-1.5 truncate">
                      {cat.isBuiltIn && <Lock className="w-3 h-3 text-gray-300 flex-shrink-0" />}
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">{cat.skills.length}</span>
                      {!cat.isBuiltIn && (
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all ml-1">
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
                  <button onClick={() => setShowSkillInput((s) => !s)}
                    className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-800">
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
                {showSkillInput && (
                  <div className="mb-4 flex gap-2">
                    <input autoFocus type="text" value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      placeholder="Skill name"
                      className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    <button onClick={handleAddSkill} disabled={addingSkill || !newSkillName.trim()}
                      className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 disabled:opacity-50">Add</button>
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
                        <button onClick={() => handleDeleteSkill(skill.id, skill.name)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
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
      )}

      {/* Teams tab */}
      {tab === "teams" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Teams</h3>
              <p className="text-xs text-gray-400 mt-0.5">Used in the Add/Edit Member form</p>
            </div>
            <button onClick={() => setShowTeamInput((s) => !s)} className="text-orange-600 hover:text-orange-800">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showTeamInput && (
            <div className="mb-4 flex gap-2">
              <input autoFocus type="text" value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
                placeholder="Team name"
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500" />
              <button onClick={handleAddTeam} disabled={addingTeam || !newTeamName.trim()}
                className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 disabled:opacity-50">Add</button>
            </div>
          )}

          {teams.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4 text-center">No teams yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {teams.map((team) => (
                <li key={team.id} className="flex items-center justify-between py-2.5 group">
                  <span className="text-sm text-gray-800">{team.name}</span>
                  <button onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
