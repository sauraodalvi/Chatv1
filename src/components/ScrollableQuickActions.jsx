import {
  useState,
  useRef,
  useEffect,
  Children,
  isValidElement,
  useMemo,
} from "react";
import {
  Sword,
  MessageCircle,
  Compass,
  Sparkles,
  Zap,
  Info,
  Lightbulb,
  Shield,
  Flame,
  Star,
} from "lucide-react";
import Chip from "./ui/Chip";

/**
 * Tabbed quick actions component with improved UX and context-awareness
 *
 * @param {Object} props - Component props
 * @param {Array} props.children - Child elements (action buttons)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.enableCategories - Whether to enable action categorization
 * @param {Object} props.activeCharacter - The currently active character (optional)
 * @param {string} props.narrativePhase - The current narrative phase (optional)
 * @returns {JSX.Element} - Tabbed quick actions component
 */
const ScrollableQuickActions = ({
  children,
  className = "",
  enableCategories = false,
  activeCharacter = null,
  narrativePhase = "introduction",
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [categorizedChildren, setCategorizedChildren] = useState({});
  const [prioritizedActions, setPrioritizedActions] = useState({});
  const contentRef = useRef(null);

  // Category icon mapping
  const categoryIcons = {
    all: Sparkles,
    combat: Sword,
    social: MessageCircle,
    exploration: Compass,
    info: Info,
    character: Star,
    scenario: Lightbulb,
    narrative: Zap,
    defense: Shield,
    magic: Flame,
  };

  // Category color mapping
  const categoryColors = {
    all: "bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 text-foreground",
    combat: "bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400",
    social:
      "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400",
    exploration:
      "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    info: "bg-gray-500/20 hover:bg-gray-500/30 text-gray-600 dark:text-gray-400",
    character:
      "bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400",
    scenario:
      "bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400",
    narrative:
      "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    defense: "bg-sky-500/20 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400",
    magic:
      "bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400",
  };

  // Detect and organize categories from children
  useEffect(() => {
    console.log("ScrollableQuickActions useEffect running with:", {
      enableCategories,
      childrenCount: children
        ? Array.isArray(children)
          ? children.length
          : "single child"
        : "no children",
      activeCharacter: activeCharacter ? activeCharacter.name : "none",
      narrativePhase,
    });

    if (enableCategories && children) {
      try {
        const detectedCategories = new Set(["all"]);
        const categorized = { all: [] };
        const prioritized = { all: [] }; // Initialize 'all' category upfront

        console.log("Processing children in ScrollableQuickActions");

        Children.forEach(children, (child) => {
          if (isValidElement(child)) {
            try {
              // Extract category from props
              let category = child.props.category || "all";
              let priority = child.props.priority || 0;

              console.log(
                `Processing child with category: ${category}, priority: ${priority}`
              );

              // Add to categories list
              detectedCategories.add(category);

              // Add to categorized children
              if (!categorized[category]) {
                categorized[category] = [];
                prioritized[category] = [];
              }

              // Store with priority information
              const actionWithPriority = {
                element: child,
                priority: priority,
                // Increase priority for actions that match character type or narrative phase
                contextBoost: getContextPriorityBoost(
                  child,
                  activeCharacter,
                  narrativePhase
                ),
              };

              categorized[category].push(child);
              prioritized[category].push(actionWithPriority);

              // Also add to 'all' category
              if (category !== "all") {
                // Double-check that 'all' categories exist
                if (!categorized.all) {
                  console.warn("categorized.all was undefined, creating it");
                  categorized.all = [];
                }
                if (!prioritized.all) {
                  console.warn("prioritized.all was undefined, creating it");
                  prioritized.all = [];
                }

                categorized.all.push(child);
                prioritized.all.push(actionWithPriority);
              }
            } catch (error) {
              console.error(
                "Error processing child in ScrollableQuickActions:",
                error
              );
            }
          }
        });

        console.log(
          "Finished processing children. Categories:",
          Array.from(detectedCategories)
        );
      } catch (error) {
        console.error("Error in ScrollableQuickActions useEffect:", error);
      }

      // Sort prioritized actions by priority (higher first)
      try {
        Object.keys(prioritized).forEach((category) => {
          if (Array.isArray(prioritized[category])) {
            prioritized[category].sort(
              (a, b) =>
                b.priority + b.contextBoost - (a.priority + a.contextBoost)
            );
          } else {
            console.warn(
              `prioritized[${category}] is not an array, initializing it`
            );
            prioritized[category] = [];
          }
        });

        console.log("Setting state with processed categories and actions");
        setCategories(Array.from(detectedCategories));
        setCategorizedChildren(categorized);
        setPrioritizedActions(prioritized);
        console.log("State updated successfully");
      } catch (error) {
        console.error(
          "Error sorting or setting state in ScrollableQuickActions:",
          error
        );
      }
    }
  }, [children, enableCategories, activeCharacter, narrativePhase]);

  // Calculate context-based priority boost
  const getContextPriorityBoost = (child, character, phase) => {
    if (!child || !child.props) return 0;

    let boost = 0;
    const actionText = child.props.children?.toString().toLowerCase() || "";
    const category = child.props.category || "all";

    // Boost based on character type if available
    if (character) {
      // Character type specific boosts
      if (
        character.type === "warrior" &&
        (category === "combat" ||
          actionText.includes("attack") ||
          actionText.includes("defend"))
      ) {
        boost += 3;
      } else if (
        character.type === "mage" &&
        (category === "magic" ||
          actionText.includes("spell") ||
          actionText.includes("magic"))
      ) {
        boost += 3;
      } else if (
        character.type === "rogue" &&
        (category === "exploration" ||
          actionText.includes("sneak") ||
          actionText.includes("steal"))
      ) {
        boost += 3;
      } else if (
        character.type === "diplomat" &&
        (category === "social" ||
          actionText.includes("talk") ||
          actionText.includes("persuade"))
      ) {
        boost += 3;
      }

      // Boost based on character traits if available
      if (character.traits) {
        character.traits.forEach((trait) => {
          if (actionText.includes(trait.toLowerCase())) {
            boost += 2;
          }
        });
      }
    }

    // Boost based on narrative phase
    if (
      phase === "introduction" &&
      (category === "social" ||
        actionText.includes("introduce") ||
        actionText.includes("greet"))
    ) {
      boost += 2;
    } else if (
      phase === "rising" &&
      (category === "exploration" ||
        actionText.includes("investigate") ||
        actionText.includes("search"))
    ) {
      boost += 2;
    } else if (
      phase === "climax" &&
      (category === "combat" ||
        actionText.includes("fight") ||
        actionText.includes("confront"))
    ) {
      boost += 2;
    } else if (
      phase === "resolution" &&
      (category === "social" ||
        actionText.includes("conclude") ||
        actionText.includes("reflect"))
    ) {
      boost += 2;
    }

    return boost;
  };

  // Get the children to display based on active category
  const getDisplayedChildren = () => {
    try {
      if (
        enableCategories &&
        prioritizedActions &&
        prioritizedActions[activeCategory] &&
        Array.isArray(prioritizedActions[activeCategory])
      ) {
        // Return the elements in priority order
        return prioritizedActions[activeCategory]
          .filter((item) => item && item.element) // Filter out any undefined items
          .map((item) => item.element);
      }

      // If we can't use prioritized actions, return children directly
      return children || []; // Ensure we always return an array
    } catch (error) {
      console.error("Error in getDisplayedChildren:", error);
      return children || []; // Return children or empty array as fallback
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    // Convert camelCase or snake_case to Title Case with spaces
    return category
      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || Sparkles;
    return <IconComponent className="h-4 w-4" />;
  };

  // Get color class for category
  const getCategoryColorClass = (category) => {
    return categoryColors[category] || categoryColors.all;
  };

  // Memoize displayed children to avoid unnecessary re-renders
  const displayedChildren = useMemo(() => {
    try {
      return getDisplayedChildren();
    } catch (error) {
      console.error("Error in displayedChildren useMemo:", error);
      return []; // Return empty array as fallback
    }
  }, [activeCategory, prioritizedActions, children, enableCategories]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Compact horizontal layout for both categories and actions */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-2">
          {/* Category chips - only shown if categories are enabled and there are multiple categories */}
          {enableCategories && categories.length > 1 && (
            <>
              {categories.map((category) => {
                const isActive = category === activeCategory;
                const IconComponent = categoryIcons[category] || Sparkles;

                return (
                  <Chip
                    key={category}
                    variant={category}
                    size="sm"
                    selected={isActive}
                    icon={<IconComponent className="h-3.5 w-3.5" />}
                    onClick={() => {
                      setActiveCategory(category);
                    }}
                    className="min-h-[32px] shrink-0"
                    aria-selected={isActive}
                    role="tab"
                  >
                    <span className="capitalize">
                      {getCategoryDisplayName(category)}
                    </span>
                  </Chip>
                );
              })}
              <div className="h-6 border-r border-secondary/30 mx-1"></div>
            </>
          )}

          {/* Actions container - horizontal scrolling layout */}
          <div
            ref={contentRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {Array.isArray(displayedChildren) ? (
              displayedChildren.map((child, index) => {
                try {
                  // Check if this action is "recommended" based on context
                  const isPrioritized =
                    prioritizedActions &&
                    prioritizedActions[activeCategory] &&
                    Array.isArray(prioritizedActions[activeCategory]) &&
                    prioritizedActions[activeCategory][index] &&
                    prioritizedActions[activeCategory][index].contextBoost > 0;

                  // Extract properties from the child to create a Chip
                  if (isValidElement(child)) {
                    const {
                      children: childContent,
                      onClick,
                      category = "default",
                    } = child.props;

                    return (
                      <Chip
                        key={index}
                        variant={category}
                        size="sm"
                        onClick={onClick}
                        className={`${
                          isPrioritized ? "scale-105 shadow-sm" : ""
                        } relative whitespace-nowrap`}
                      >
                        {/* Recommended indicator */}
                        {isPrioritized && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        )}
                        {childContent}
                      </Chip>
                    );
                  }
                  return child;
                } catch (error) {
                  console.error(
                    `Error rendering child at index ${index}:`,
                    error
                  );
                  return null; // Return null for this item if there's an error
                }
              })
            ) : (
              <div className="text-center text-muted-foreground p-2">
                No quick actions available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableQuickActions;
