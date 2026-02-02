import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { User, Connection } from '../../types';
import { buildGraphData } from '../../utils/graphLayout';
import {
  createNodeGradient,
  drawNodeShadow,
  drawStrengthRings,
  calculateNodeSize,
  calculateLinkWidth,
  getStrengthTierLabel,
  getStrengthTierColor,
  getConnectionStrength
} from '../../utils/canvasHelpers';

const HEADER_HEIGHT = 104; // Matches --header-height in index.css

// Constants for graph layout
const GRAPH_CONSTANTS = {
  LINK_DISTANCE_MAX: 150,
  CHARGE_STRENGTH: -120,           // Increased from -100 (more repulsion)
  CENTER_FORCE_STRENGTH: 0.3,      // Reduced from 0.5 (less pull to center)
  BASE_DISTANCE: 100,
  STRENGTH_MULTIPLIER: 1.5,
  CENTER_NODE_SIZE: 8,
  REGULAR_NODE_SIZE: 6,
  COLLISION_RADIUS: 12,            // Increased from 10 (prevent overlap)
  INITIAL_COOLDOWN: 1000,          // Reduced from 3000ms (faster settling)
  SETTLED_VELOCITY_THRESHOLD: 0.05, // Lowered from 0.1 (earlier stop)
  RADIAL_CONSTRAINT_STRENGTH: 0.8  // NEW: strength of radial force
};

interface NetworkGraphProps {
  currentUserId: string;
  users: User[];
  connections: Connection[];
  onNodeClick?: (userId: string) => void;
  highlightedNodeIds?: string[];
}

// Extended types for D3 node objects
interface D3NodeObject {
  id: string;
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  strength?: number;
  user: User;
}

interface D3LinkObject {
  source: string | D3NodeObject;
  target: string | D3NodeObject;
  strength: number;
}

const NetworkGraph = ({
  currentUserId,
  users,
  connections,
  onNodeClick,
  highlightedNodeIds = []
}: NetworkGraphProps) => {
  const graphRef = useRef<any>(); // ForceGraph2D doesn't export proper ref type
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - HEADER_HEIGHT : 600
  });
  const [hoveredNode, setHoveredNode] = useState<D3NodeObject | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    node: D3NodeObject;
    x: number;
    y: number;
  } | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - HEADER_HEIGHT
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize graph data transformations
  const graphData = useMemo(() => {
    setIsLoading(true);
    return buildGraphData(currentUserId, users, connections);
  }, [currentUserId, users, connections]);

  // Configure D3 forces and apply radial constraints
  useEffect(() => {
    if (!graphRef.current) return;

    const fg = graphRef.current;

    // Configure standard D3 forces
    const linkForce = fg.d3Force('link');
    const chargeForce = fg.d3Force('charge');
    const centerForce = fg.d3Force('center');

    if (linkForce) {
      linkForce.distance((link: D3LinkObject) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;

        const originalLink = graphData.links.find(l =>
          (l.source === sourceId && l.target === targetId) ||
          (l.source === targetId && l.target === sourceId)
        );

        return originalLink ? GRAPH_CONSTANTS.LINK_DISTANCE_MAX - originalLink.strength : 100;
      });
    }

    if (chargeForce) {
      chargeForce.strength(GRAPH_CONSTANTS.CHARGE_STRENGTH);
    }

    if (centerForce) {
      centerForce.strength(GRAPH_CONSTANTS.CENTER_FORCE_STRENGTH);
    }

    // Add collision force
    fg.d3Force('collide', (window as any).d3?.forceCollide?.(GRAPH_CONSTANTS.COLLISION_RADIUS));

    // REMOVED broken radial force - let D3 handle positioning naturally
    // The standard forces (link, charge, center, collide) will position nodes correctly

    // Stop loading after initial layout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [graphData, currentUserId]);

  // Handle node click
  const handleNodeClick = useCallback((node: D3NodeObject) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  // Handle node hover
  const handleNodeHover = useCallback((node: D3NodeObject | null, _previousNode: D3NodeObject | null) => {
    setHoveredNode(node);
    if (node) {
      // Get mouse position from global mouse event
      const handleMouseMove = (event: MouseEvent) => {
        setTooltipData({ node, x: event.clientX, y: event.clientY });
        window.removeEventListener('mousemove', handleMouseMove);
      };
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setTooltipData(null);
    }
  }, []);

  // Link canvas rendering with strength-based opacity, thickness, and glow
  const linkCanvasObject = useCallback((link: D3LinkObject, ctx: CanvasRenderingContext2D) => {
    const start = typeof link.source === 'string' ? { x: 0, y: 0 } : link.source;
    const end = typeof link.target === 'string' ? { x: 0, y: 0 } : link.target;

    // Get link strength for opacity
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    const originalLink = graphData.links.find(l =>
      (l.source === sourceId && l.target === targetId) ||
      (l.source === targetId && l.target === sourceId)
    );
    const strength = originalLink?.strength || 50;

    // Check if link is connected to hovered node
    const isConnectedToHovered = hoveredNode && (
      sourceId === hoveredNode.id || targetId === hoveredNode.id
    );

    // Calculate opacity and width
    let opacity = Math.max(0.2, strength / 100);
    const lineWidth = calculateLinkWidth(strength, isConnectedToHovered || false);

    // Enhance connected links on hover
    if (isConnectedToHovered) {
      opacity = 1;
    }

    const styles = getComputedStyle(document.documentElement);
    const linkColorRGB = styles.getPropertyValue('--graph-link').trim();

    // Draw glow effect for strong connections (strength >= 70) or connected to hovered
    if (strength >= 70 || isConnectedToHovered) {
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = isConnectedToHovered
        ? 'rgba(10, 132, 255, 0.6)'
        : `rgba(${linkColorRGB}, 0.4)`;
      ctx.beginPath();
      ctx.moveTo(start.x || 0, start.y || 0);
      ctx.lineTo(end.x || 0, end.y || 0);
      ctx.strokeStyle = isConnectedToHovered
        ? 'rgba(10, 132, 255, 0.8)'
        : `rgba(${linkColorRGB}, ${opacity})`;
      ctx.lineWidth = lineWidth + 1;
      ctx.stroke();
      ctx.restore();
    }

    // Draw main link
    ctx.beginPath();
    ctx.moveTo(start.x || 0, start.y || 0);
    ctx.lineTo(end.x || 0, end.y || 0);
    ctx.strokeStyle = isConnectedToHovered
      ? 'rgba(10, 132, 255, 0.9)'
      : `rgba(${linkColorRGB}, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }, [graphData.links, hoveredNode]);

  // Node rendering with gradients, shadows, rings, and hover effects
  const nodeCanvasObjectWithDimming = useCallback((node: D3NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    // Determine if node should be dimmed
    const isSearchActive = highlightedNodeIds.length > 0;
    const isHighlighted = highlightedNodeIds.includes(node.id);
    const isDimmed = isSearchActive && !isHighlighted && node.id !== currentUserId;
    const isCenterNode = node.id === currentUserId;
    const isHovered = hoveredNode?.id === node.id;

    // Get computed CSS variable values
    const styles = getComputedStyle(document.documentElement);
    const centerNodeRaw = styles.getPropertyValue('--graph-center-node').trim();
    const regularNodeRaw = styles.getPropertyValue('--graph-regular-node').trim();
    const highlightNodeRaw = styles.getPropertyValue('--graph-highlight-node').trim();

    // Determine node color RGB (for gradients)
    let nodeColorRGB = regularNodeRaw;
    if (isCenterNode) {
      nodeColorRGB = centerNodeRaw;
    } else if (isHighlighted) {
      nodeColorRGB = highlightNodeRaw;
    }

    // Apply dimming
    if (isDimmed) {
      ctx.globalAlpha = 0.2;
    }

    // Get connection strength for sizing and rings
    const strength = getConnectionStrength(node);

    // Calculate node size based on strength and hover state
    const baseSize = isCenterNode ? GRAPH_CONSTANTS.CENTER_NODE_SIZE : GRAPH_CONSTANTS.REGULAR_NODE_SIZE;
    const nodeSize = calculateNodeSize(baseSize, strength, isCenterNode, isHovered);

    // Draw shadow
    ctx.save();
    drawNodeShadow(ctx, isCenterNode, isDimmed);
    if (isHovered) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    }

    // Draw node with radial gradient
    const gradient = createNodeGradient(ctx, node.x || 0, node.y || 0, nodeSize, nodeColorRGB, isHovered);
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw white border for visibility
    ctx.shadowBlur = 0; // Clear shadow for border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 / globalScale;
    ctx.stroke();
    ctx.restore();

    // Draw strength rings (only for non-center nodes)
    if (!isCenterNode && !isDimmed) {
      drawStrengthRings(ctx, node.x || 0, node.y || 0, nodeSize, strength, isHovered);
    }

    // Draw label with shadow for readability
    ctx.save();
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = `rgb(${regularNodeRaw})`;
    ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + 2);
    ctx.restore();

    // Reset alpha
    ctx.globalAlpha = 1;
  }, [currentUserId, highlightedNodeIds, hoveredNode]);

  // Get current user for aria label
  const currentUser = users.find(u => u.id === currentUserId);

  return (
    <div
      className="w-full h-full relative"
      role="img"
      aria-label={`Network graph showing ${graphData.nodes.length - 1} connections for ${currentUser?.name || 'current user'}`}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-elevated z-modal-backdrop">
          <div className="text-center">
            <div className="text-neutral-600 text-lg mb-2 font-medium">Building network graph...</div>
            <div className="text-neutral-500 text-sm">This may take a moment</div>
          </div>
        </div>
      )}

      {/* Keyboard navigation helper (hidden, for screen readers) */}
      <div className="sr-only" role="list" aria-label="Network connections">
        {graphData.nodes.map(node => (
          <div key={node.id} role="listitem">
            <button onClick={() => handleNodeClick(node as D3NodeObject)} tabIndex={-1}>
              {node.name} - Connection strength: {node.strength || 0}
            </button>
          </div>
        ))}
      </div>

      {/* Tooltip overlay */}
      {tooltipData && (
        <div
          className="fixed z-tooltip pointer-events-none"
          style={{
            left: `${tooltipData.x + 16}px`,
            top: `${tooltipData.y + 16}px`
          }}
        >
          <div className="glass rounded-lg shadow-elevated px-3 py-2 max-w-xs">
            <div className="text-sm font-medium text-neutral-900 mb-1">
              {tooltipData.node.name}
            </div>
            {tooltipData.node.user.profile.location && (
              <div className="text-xs text-neutral-600 mb-1">
                📍 {tooltipData.node.user.profile.location}
              </div>
            )}
            {tooltipData.node.id !== currentUserId && (
              <div className={`text-xs font-medium mb-1 ${getStrengthTierColor(getConnectionStrength(tooltipData.node))}`}>
                {getStrengthTierLabel(getConnectionStrength(tooltipData.node))} Connection
              </div>
            )}
            {tooltipData.node.user.profile.interests.length > 0 && (
              <div className="text-xs text-neutral-500 line-clamp-2">
                {tooltipData.node.user.profile.interests.slice(0, 3).join(' • ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Force graph visualization */}
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel={() => ''} // Disable default tooltip (we have custom tooltip)
        linkSource="source"
        linkTarget="target"
        nodeRelSize={GRAPH_CONSTANTS.REGULAR_NODE_SIZE}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeCanvasObject={nodeCanvasObjectWithDimming}
        nodePointerAreaPaint={(node, color, ctx) => {
          // Define hover area (1.5x node radius)
          const baseSize = node.id === currentUserId ? GRAPH_CONSTANTS.CENTER_NODE_SIZE : GRAPH_CONSTANTS.REGULAR_NODE_SIZE;
          const strength = getConnectionStrength(node as D3NodeObject);
          const nodeSize = calculateNodeSize(baseSize, strength, node.id === currentUserId, false);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, nodeSize * 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }}
        linkCanvasObject={linkCanvasObject}
        d3VelocityDecay={0.4}
        d3AlphaDecay={0.0228}
        cooldownTime={GRAPH_CONSTANTS.INITIAL_COOLDOWN}
        enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        minZoom={0.5}
        maxZoom={4}
        backgroundColor={`rgb(${getComputedStyle(document.documentElement).getPropertyValue('--graph-background').trim()})`}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default NetworkGraph;
