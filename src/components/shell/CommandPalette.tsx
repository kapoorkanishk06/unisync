import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search, Home, Upload, Flame, BookOpen, Settings } from "lucide-react";
import { Sheet, SheetContent } from "../primitives/Sheet";
import { useUIStore } from "../../store/ui";
import { useNavigate } from "react-router-dom";

const commands = [
  { id: "dashboard", label: "Go to Dashboard", icon: Home, action: "/app" },
  { id: "upload", label: "Go to Upload", icon: Upload, action: "/app/upload" },
  { id: "panic", label: "Start Panic Mode", icon: Flame, action: "/app/panic" },
  { id: "subjects", label: "Go to Subjects", icon: BookOpen, action: "/app/subjects" },
  { id: "settings", label: "Go to Settings", icon: Settings, action: "/app/settings" },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (action: string) => {
    navigate(action);
    setCommandPaletteOpen(false);
    setSearch("");
  };

  return (
    <Sheet open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <SheetContent side="right" className="p-0 max-w-lg w-full">
        <Command className="rounded-lg border-none shadow-lg">
          <div className="flex items-center border-b border-border px-4 gap-2">
            <Search className="h-4 w-4 text-text-dim shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search or jump to..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-text-dim"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-dim">
              No results found.
            </Command.Empty>
            {filteredCommands.map((cmd) => (
              <Command.Item
                key={cmd.id}
                onSelect={() => handleSelect(cmd.action)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-surface-2 transition-colors"
              >
                <cmd.icon className="h-4 w-4 text-text-dim" />
                <span>{cmd.label}</span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </SheetContent>
    </Sheet>
  );
}
