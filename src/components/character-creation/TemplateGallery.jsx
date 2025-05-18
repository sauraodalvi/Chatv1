import { useState } from "react";
import {
  Sword,
  Rocket,
  Clock,
  User,
  Zap,
  Map,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";

/**
 * Gallery of character templates to jumpstart character creation
 */
const TemplateGallery = ({ templates, onSelectTemplate, onSkip }) => {
  const [activeCategory, setActiveCategory] = useState("fantasy");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get the icon component for a category
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "fantasy":
        return <Sword className="h-5 w-5" />;
      case "scifi":
        return <Rocket className="h-5 w-5" />;
      case "historical":
        return <Clock className="h-5 w-5" />;
      case "superhero":
        return <Zap className="h-5 w-5" />;
      case "adventure":
        return <Map className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };
  
  // Filter templates based on search term
  const filteredTemplates = searchTerm
    ? Object.values(templates.templates)
        .flat()
        .filter(
          (template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : templates.templates[activeCategory] || [];
  
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
        />
      </div>
      
      {/* Category tabs - only show if not searching */}
      {!searchTerm && (
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {templates.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-2 rounded-md flex items-center whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {getCategoryIcon(category.id)}
              <span className="ml-2">{category.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create from scratch card - always show this */}
        <div className="border rounded-lg overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">Create from Scratch</h3>
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Start with a blank slate and build your character step by step
            </p>
            <button
              onClick={onSkip}
              className="mt-4 w-full py-2 bg-secondary hover:bg-secondary/80 rounded-md flex items-center justify-center"
            >
              <span className="text-sm">Start Creating</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Template cards */}
        {filteredTemplates.map((template, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{template.name}</h3>
                {getCategoryIcon(template.type)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {template.type} • {template.mood}
              </p>
              <p className="text-sm mt-2 line-clamp-3">{template.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-1">
                <div className="text-xs">
                  <span className="block text-muted-foreground">Analytical</span>
                  <span>{template.personality.analytical}/10</span>
                </div>
                <div className="text-xs">
                  <span className="block text-muted-foreground">Emotional</span>
                  <span>{template.personality.emotional}/10</span>
                </div>
                <div className="text-xs">
                  <span className="block text-muted-foreground">Confidence</span>
                  <span>{template.personality.confidence}/10</span>
                </div>
              </div>
              <button
                onClick={() => onSelectTemplate(template)}
                className="mt-4 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md flex items-center justify-center"
              >
                <span className="text-sm">Use Template</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* No results message */}
      {filteredTemplates.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No templates found matching "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-primary text-sm"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
