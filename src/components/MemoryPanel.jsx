import { useState, useEffect } from "react";
import {
  Brain,
  Star,
  Clock,
  User,
  X,
  Plus,
  Search,
  Filter,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Info,
  MessageSquare,
  Sparkles,
  Heart,
  Lightbulb,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  Smile,
  Edit,
} from "lucide-react";

/**
 * Memory Panel component for displaying and managing memories
 */
const MemoryPanel = ({
  memories = [],
  onCreateMemory,
  onDeleteMemory,
  onUpdateMemory,
  onImportMemories,
  onExportMemories,
  onClearMemories,
  onClose,
  onUseMemory,
  currentContext = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("importance");
  const [newMemoryContent, setNewMemoryContent] = useState("");
  const [newMemoryImportance, setNewMemoryImportance] = useState(8);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [filteredMemories, setFilteredMemories] = useState([]);

  // Filter and sort memories when dependencies change
  useEffect(() => {
    let result = [...memories];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (memory) =>
          memory.content.toLowerCase().includes(lowerSearch) ||
          (memory.speaker && memory.speaker.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply type filter
    if (filter !== "all") {
      result = result.filter((memory) => memory.type === filter);
    }

    // Apply sorting
    if (sortBy === "recency") {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === "access") {
      result.sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0));
    } else {
      // Default: sort by importance
      result.sort((a, b) => b.importance - a.importance);
    }

    setFilteredMemories(result);
  }, [memories, searchTerm, filter, sortBy]);

  // Handle creating a new memory
  const handleCreateMemory = () => {
    if (!newMemoryContent.trim()) return;

    onCreateMemory(newMemoryContent, "User", "manual", newMemoryImportance);

    // Reset form
    setNewMemoryContent("");
    setNewMemoryImportance(8);
    setShowAddMemory(false);
  };

  // Handle importing memories from file
  const handleImportMemories = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        onImportMemories(content);
      } catch (error) {
        console.error("Failed to import memories:", error);
        alert("Failed to import memories. Please check the file format.");
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = null;
  };

  // Get icon for memory type
  const getMemoryTypeIcon = (type) => {
    switch (type) {
      case "personal":
        return <User className="h-4 w-4 text-blue-500" />;
      case "preferences":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "relationships":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "events":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "feelings":
        return <Smile className="h-4 w-4 text-yellow-500" />;
      case "beliefs":
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case "important":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "summary":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "manual":
        return <Edit className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return date.toLocaleDateString();
    } else if (diffDay > 0) {
      return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-bold">Memory System</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md border ${
                showFilters ? "border-primary bg-primary/10" : "border-input"
              }`}
              title="Show filters"
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowAddMemory(!showAddMemory)}
              className={`p-2 rounded-md border ${
                showAddMemory ? "border-primary bg-primary/10" : "border-input"
              }`}
              title="Add memory"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mb-4 p-3 border rounded-md bg-background/50">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setFilter("personal")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "personal"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/10 hover:bg-blue-500/20"
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setFilter("preferences")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "preferences"
                      ? "bg-pink-500 text-white"
                      : "bg-pink-500/10 hover:bg-pink-500/20"
                  }`}
                >
                  Preferences
                </button>
                <button
                  onClick={() => setFilter("important")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "important"
                      ? "bg-red-500 text-white"
                      : "bg-red-500/10 hover:bg-red-500/20"
                  }`}
                >
                  Important
                </button>
                <button
                  onClick={() => setFilter("summary")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "summary"
                      ? "bg-green-500 text-white"
                      : "bg-green-500/10 hover:bg-green-500/20"
                  }`}
                >
                  Summaries
                </button>
                <button
                  onClick={() => setFilter("manual")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "manual"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 hover:bg-primary/20"
                  }`}
                >
                  Manual
                </button>
              </div>

              <div className="flex gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Sort by
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSortBy("importance")}
                      className={`px-2 py-1 text-xs rounded-md ${
                        sortBy === "importance"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <Star className="h-3 w-3 inline mr-1" />
                      Importance
                    </button>
                    <button
                      onClick={() => setSortBy("recency")}
                      className={`px-2 py-1 text-xs rounded-md ${
                        sortBy === "recency"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <Clock className="h-3 w-3 inline mr-1" />
                      Recency
                    </button>
                    <button
                      onClick={() => setSortBy("access")}
                      className={`px-2 py-1 text-xs rounded-md ${
                        sortBy === "access"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <RefreshCw className="h-3 w-3 inline mr-1" />
                      Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add memory form */}
          {showAddMemory && (
            <div className="mb-4 p-3 border rounded-md bg-background/50">
              <h3 className="text-sm font-medium mb-2">Add New Memory</h3>
              <textarea
                value={newMemoryContent}
                onChange={(e) => setNewMemoryContent(e.target.value)}
                placeholder="Enter memory content..."
                className="w-full p-2 border rounded-md bg-background min-h-[80px] mb-3"
              />

              <div className="flex items-center justify-between mb-3">
                <label className="text-sm">Importance:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newMemoryImportance}
                    onChange={(e) =>
                      setNewMemoryImportance(parseInt(e.target.value))
                    }
                    className="w-32"
                  />
                  <span className="text-sm font-medium">
                    {newMemoryImportance}/10
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddMemory(false)}
                  className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMemory}
                  className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!newMemoryContent.trim()}
                >
                  Save Memory
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Memory list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filter !== "all"
                  ? "No memories match your search or filters"
                  : "No memories stored yet"}
              </p>
              <button
                onClick={() => setShowAddMemory(true)}
                className="mt-4 text-primary text-sm flex items-center gap-1 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Add your first memory
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="border rounded-md p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {getMemoryTypeIcon(memory.type)}
                      <span className="text-xs text-muted-foreground ml-1 capitalize">
                        {memory.type}
                      </span>
                      {memory.speaker && (
                        <span className="text-xs bg-secondary px-1.5 py-0.5 rounded ml-2">
                          {memory.speaker}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs ml-0.5">
                          {memory.importance}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteMemory(memory.id)}
                        className="text-muted-foreground hover:text-red-500 ml-2"
                        title="Delete memory"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm mb-2">{memory.content}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span title={new Date(memory.timestamp).toLocaleString()}>
                      {formatRelativeTime(memory.timestamp)}
                    </span>

                    {onUseMemory && (
                      <button
                        onClick={() => onUseMemory(memory)}
                        className="text-primary hover:text-primary/80 text-xs flex items-center"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Use in chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with import/export/clear buttons */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {memories.length} {memories.length === 1 ? "memory" : "memories"}{" "}
            stored
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              id="import-memories"
              className="hidden"
              accept=".json"
              onChange={handleImportMemories}
            />
            <label
              htmlFor="import-memories"
              className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 cursor-pointer flex items-center"
            >
              <Upload className="h-3 w-3 mr-1" />
              Import
            </label>

            <button
              onClick={onExportMemories}
              className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 flex items-center"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </button>

            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all memories? This cannot be undone."
                  )
                ) {
                  onClearMemories();
                }
              }}
              className="px-2 py-1 text-xs rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;
