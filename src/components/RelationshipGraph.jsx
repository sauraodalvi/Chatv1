import { useState, useEffect, useRef } from "react";
import { Users, Info, X, Heart, Shield, Zap } from "lucide-react";

/**
 * RelationshipGraph component
 * 
 * Visualizes character relationships as a graph with nodes (characters)
 * and edges (relationships) with different colors and thicknesses
 * based on relationship attributes.
 */
const RelationshipGraph = ({
  relationships = [],
  characters = [],
  onClose,
  onSelectRelationship,
}) => {
  const canvasRef = useRef(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [hoveredRelationship, setHoveredRelationship] = useState(null);
  const [relationshipDetails, setRelationshipDetails] = useState({});
  const [viewMode, setViewMode] = useState("affinity"); // affinity, trust, tension
  
  // Calculate node positions when relationships or characters change
  useEffect(() => {
    if (!relationships.length || !characters.length) return;
    
    // Process relationships to ensure they match characters
    const validRelationships = relationships.filter(rel => 
      rel.characters && 
      rel.characters.length === 2 && 
      characters.some(c => c.name === rel.characters[0]) && 
      characters.some(c => c.name === rel.characters[1])
    );
    
    // Create relationship details lookup
    const details = {};
    validRelationships.forEach(rel => {
      const key = rel.characters.sort().join('_&_');
      details[key] = rel;
    });
    
    setRelationshipDetails(details);
    
    // Draw the graph
    drawGraph();
  }, [relationships, characters, viewMode]);
  
  // Redraw when selected relationship changes
  useEffect(() => {
    drawGraph();
  }, [selectedRelationship, hoveredRelationship]);
  
  // Draw the relationship graph
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate node positions in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const nodePositions = {};
    characters.forEach((character, index) => {
      const angle = (index / characters.length) * Math.PI * 2;
      nodePositions[character.name] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle
      };
    });
    
    // Draw edges (relationships)
    Object.values(relationshipDetails).forEach(relationship => {
      const [char1, char2] = relationship.characters;
      const pos1 = nodePositions[char1];
      const pos2 = nodePositions[char2];
      
      if (!pos1 || !pos2) return;
      
      // Determine edge color and thickness based on relationship and view mode
      const { color, thickness } = getEdgeStyle(relationship, viewMode);
      
      // Check if this relationship is selected or hovered
      const isSelected = selectedRelationship && 
        selectedRelationship.characters.includes(char1) && 
        selectedRelationship.characters.includes(char2);
      
      const isHovered = hoveredRelationship && 
        hoveredRelationship.characters.includes(char1) && 
        hoveredRelationship.characters.includes(char2);
      
      // Draw edge
      ctx.beginPath();
      ctx.moveTo(pos1.x, pos1.y);
      ctx.lineTo(pos2.x, pos2.y);
      ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#f0f0f0' : color;
      ctx.lineWidth = isSelected ? thickness + 2 : isHovered ? thickness + 1 : thickness;
      
      // Add glow effect for selected/hovered relationships
      if (isSelected || isHovered) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw relationship value if selected or hovered
      if (isSelected || isHovered) {
        const midX = (pos1.x + pos2.x) / 2;
        const midY = (pos1.y + pos2.y) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let valueText = '';
        if (viewMode === 'affinity') {
          valueText = `${relationship.affinity > 0 ? '+' : ''}${relationship.affinity}`;
        } else if (viewMode === 'trust') {
          valueText = `${relationship.trust > 0 ? '+' : ''}${relationship.trust}`;
        } else if (viewMode === 'tension') {
          valueText = `${relationship.tension}`;
        }
        
        // Draw background for text
        const textWidth = ctx.measureText(valueText).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(midX - textWidth/2 - 5, midY - 10, textWidth + 10, 20);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillText(valueText, midX, midY);
      }
    });
    
    // Draw nodes (characters)
    characters.forEach(character => {
      const pos = nodePositions[character.name];
      if (!pos) return;
      
      // Draw character node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b'; // Dark background
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw character initial
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character.name.charAt(0), pos.x, pos.y);
      
      // Draw character name
      ctx.font = '12px sans-serif';
      ctx.fillText(character.name, pos.x, pos.y + 40);
    });
  };
  
  // Get edge style based on relationship and view mode
  const getEdgeStyle = (relationship, mode) => {
    let color = '#64748b'; // Default gray
    let thickness = 2;     // Default thickness
    
    if (mode === 'affinity') {
      const affinity = relationship.affinity || 0;
      
      if (affinity > 0) {
        // Positive affinity - green to bright green
        color = affinity > 5 ? '#22c55e' : '#4ade80';
        thickness = 1 + Math.abs(affinity) / 2;
      } else if (affinity < 0) {
        // Negative affinity - red to bright red
        color = affinity < -5 ? '#ef4444' : '#f87171';
        thickness = 1 + Math.abs(affinity) / 2;
      }
    } else if (mode === 'trust') {
      const trust = relationship.trust || 0;
      
      if (trust > 0) {
        // Positive trust - blue to bright blue
        color = trust > 5 ? '#3b82f6' : '#60a5fa';
        thickness = 1 + Math.abs(trust) / 2;
      } else if (trust < 0) {
        // Negative trust - purple to bright purple
        color = trust < -5 ? '#a855f7' : '#c084fc';
        thickness = 1 + Math.abs(trust) / 2;
      }
    } else if (mode === 'tension') {
      const tension = relationship.tension || 0;
      
      if (tension > 0) {
        // Tension - yellow to orange to red
        if (tension > 7) {
          color = '#ef4444'; // Red
        } else if (tension > 3) {
          color = '#f97316'; // Orange
        } else {
          color = '#eab308'; // Yellow
        }
        thickness = 1 + tension / 2;
      }
    }
    
    return { color, thickness };
  };
  
  // Handle canvas click to select relationships
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate node positions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const nodePositions = {};
    characters.forEach((character, index) => {
      const angle = (index / characters.length) * Math.PI * 2;
      nodePositions[character.name] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    // Check if click is near any edge
    let closestEdge = null;
    let minDistance = 20; // Minimum distance to detect edge click
    
    Object.values(relationshipDetails).forEach(relationship => {
      const [char1, char2] = relationship.characters;
      const pos1 = nodePositions[char1];
      const pos2 = nodePositions[char2];
      
      if (!pos1 || !pos2) return;
      
      // Calculate distance from point to line segment
      const distance = distanceToLineSegment(x, y, pos1.x, pos1.y, pos2.x, pos2.y);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestEdge = relationship;
      }
    });
    
    if (closestEdge) {
      setSelectedRelationship(closestEdge);
      if (onSelectRelationship) {
        onSelectRelationship(closestEdge);
      }
    } else {
      setSelectedRelationship(null);
    }
  };
  
  // Handle canvas mouse move for hover effects
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate node positions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const nodePositions = {};
    characters.forEach((character, index) => {
      const angle = (index / characters.length) * Math.PI * 2;
      nodePositions[character.name] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    // Check if mouse is near any edge
    let closestEdge = null;
    let minDistance = 15; // Minimum distance to detect hover
    
    Object.values(relationshipDetails).forEach(relationship => {
      const [char1, char2] = relationship.characters;
      const pos1 = nodePositions[char1];
      const pos2 = nodePositions[char2];
      
      if (!pos1 || !pos2) return;
      
      // Calculate distance from point to line segment
      const distance = distanceToLineSegment(x, y, pos1.x, pos1.y, pos2.x, pos2.y);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestEdge = relationship;
      }
    });
    
    setHoveredRelationship(closestEdge);
  };
  
  // Calculate distance from point to line segment
  const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-bold">Character Relationships</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 border-b flex items-center justify-center space-x-4">
          <button
            onClick={() => setViewMode("affinity")}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === "affinity" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-sm">Affinity</span>
          </button>
          
          <button
            onClick={() => setViewMode("trust")}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === "trust" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">Trust</span>
          </button>
          
          <button
            onClick={() => setViewMode("tension")}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === "tension" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-sm">Tension</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border text-xs">
            <div className="flex items-center mb-1">
              <Info className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">
                {viewMode === "affinity" 
                  ? "How characters feel about each other" 
                  : viewMode === "trust" 
                  ? "How much characters trust each other" 
                  : "Level of tension between characters"}
              </span>
            </div>
            
            {viewMode === "affinity" && (
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#22c55e] mr-1"></div>
                  <span>Strong Positive</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#ef4444] mr-1"></div>
                  <span>Strong Negative</span>
                </div>
              </div>
            )}
            
            {viewMode === "trust" && (
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#3b82f6] mr-1"></div>
                  <span>High Trust</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#a855f7] mr-1"></div>
                  <span>Low Trust</span>
                </div>
              </div>
            )}
            
            {viewMode === "tension" && (
              <div className="grid grid-cols-3 gap-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#eab308] mr-1"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#f97316] mr-1"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-2 bg-[#ef4444] mr-1"></div>
                  <span>High</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Selected relationship details */}
        {selectedRelationship && (
          <div className="p-4 border-t">
            <h3 className="font-medium mb-2">
              {selectedRelationship.characters[0]} & {selectedRelationship.characters[1]}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Affinity:</span>
                <span className={selectedRelationship.affinity > 0 ? "text-green-500" : 
                                selectedRelationship.affinity < 0 ? "text-red-500" : ""}>
                  {selectedRelationship.affinity > 0 ? "+" : ""}{selectedRelationship.affinity}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Trust:</span>
                <span className={selectedRelationship.trust > 0 ? "text-blue-500" : 
                                selectedRelationship.trust < 0 ? "text-purple-500" : ""}>
                  {selectedRelationship.trust > 0 ? "+" : ""}{selectedRelationship.trust}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Tension:</span>
                <span className={selectedRelationship.tension > 7 ? "text-red-500" : 
                                selectedRelationship.tension > 3 ? "text-orange-500" : 
                                selectedRelationship.tension > 0 ? "text-yellow-500" : ""}>
                  {selectedRelationship.tension}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipGraph;
