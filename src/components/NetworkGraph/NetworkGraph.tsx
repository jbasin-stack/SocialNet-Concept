import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { User, Connection } from '../../types';
import { buildGraphData } from '../../utils/graphLayout';

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
  const [dimensions, setDimensions] = useState(() => {
    const dims = {
      width: typeof window !== 'undefined' ? window.innerWidth : 800,
      height: typeof window !== 'undefined' ? window.innerHeight - HEADER_HEIGHT : 600
    };
    console.log('📐 DIMENSIONS:', dims);
    return dims;
  });

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
    const data = buildGraphData(currentUserId, users, connections);
    console.log('🔍 GRAPH DATA:', {
      nodeCount: data.nodes.length,
      linkCount: data.links.length,
      nodes: data.nodes.map(n => ({ id: n.id, name: n.name })),
      currentUserId
    });
    return data;
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

    // Custom radial force (runs every tick, not just once)
    fg.d3Force('radial', () => {
      const nodes = fg.graphData().nodes as D3NodeObject[];
      const connectedNodes = nodes.filter((n: D3NodeObject) => n.id !== currentUserId);

      nodes.forEach((node: D3NodeObject) => {
        if (node.id === currentUserId) {
          // Center node: pull towards origin with damping
          node.vx = (node.vx || 0) * 0.5 - (node.x || 0) * 0.1;
          node.vy = (node.vy || 0) * 0.5 - (node.y || 0) * 0.1;
        } else {
          // Connected nodes: pull towards ideal radial position
          const nodeIndex = connectedNodes.findIndex((n: D3NodeObject) => n.id === node.id);
          const originalNode = graphData.nodes.find(n => n.id === node.id);

          if (nodeIndex !== -1 && originalNode?.strength !== undefined) {
            const angle = (nodeIndex / connectedNodes.length) * 2 * Math.PI;
            const targetDistance = GRAPH_CONSTANTS.BASE_DISTANCE +
                                  (100 - originalNode.strength) * GRAPH_CONSTANTS.STRENGTH_MULTIPLIER;

            const targetX = targetDistance * Math.cos(angle);
            const targetY = targetDistance * Math.sin(angle);

            // Apply velocity towards target position
            const dx = targetX - (node.x || 0);
            const dy = targetY - (node.y || 0);
            const strength = GRAPH_CONSTANTS.RADIAL_CONSTRAINT_STRENGTH;

            node.vx = (node.vx || 0) + dx * strength * 0.1;
            node.vy = (node.vy || 0) + dy * strength * 0.1;
          }
        }
      });
    });

    // Stop loading after initial layout
    const timer = setTimeout(() => {
      console.log('✅ Loading complete, hiding overlay');
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

  // Link canvas rendering with strength-based opacity
  const linkCanvasObject = useCallback((link: D3LinkObject, ctx: CanvasRenderingContext2D) => {
    const start = typeof link.source === 'string' ? { x: 0, y: 0 } : link.source;
    const end = typeof link.target === 'string' ? { x: 0, y: 0 } : link.target;

    // Find original link data to get strength (temporarily disabled for testing)
    // const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    // const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    // const originalLink = graphData.links.find(l =>
    //   (l.source === sourceId && l.target === targetId) ||
    //   (l.source === targetId && l.target === sourceId)
    // );

    // Link opacity based on strength (temporarily disabled for testing)
    // const strength = originalLink?.strength || 50;
    // const opacity = Math.max(0.2, strength / 100);
    // const styles = getComputedStyle(document.documentElement);
    // const linkColorRGB = styles.getPropertyValue('--graph-link').trim();

    ctx.beginPath();
    ctx.moveTo(start.x || 0, start.y || 0);
    ctx.lineTo(end.x || 0, end.y || 0);
    ctx.strokeStyle = '#FF00FF';  // Bright magenta for visibility
    ctx.lineWidth = 3;  // Thicker
    ctx.stroke();
  }, [graphData.links]);

  // Dim non-highlighted nodes when search is active
  const nodeCanvasObjectWithDimming = useCallback((node: D3NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    // Determine if node should be dimmed
    const isSearchActive = highlightedNodeIds.length > 0;
    const isHighlighted = highlightedNodeIds.includes(node.id);
    const isDimmed = isSearchActive && !isHighlighted && node.id !== currentUserId;

    // Get computed CSS variable values
    const styles = getComputedStyle(document.documentElement);
    const centerNodeRaw = styles.getPropertyValue('--graph-center-node').trim();
    const regularNodeRaw = styles.getPropertyValue('--graph-regular-node').trim();
    // const highlightNodeRaw = styles.getPropertyValue('--graph-highlight-node').trim();  // Unused in test

    const centerNodeColor = `rgb(${centerNodeRaw})`;
    const regularNodeColor = `rgb(${regularNodeRaw})`;
    // const highlightNodeColor = `rgb(${highlightNodeRaw})`;  // Unused in test version

    // Debug log (only for center node to avoid spam)
    if (node.id === currentUserId) {
      console.log('🎨 NODE COLORS:', {
        centerRaw: centerNodeRaw,
        centerColor: centerNodeColor,
        regularRaw: regularNodeRaw,
        regularColor: regularNodeColor,
        nodePosition: { x: node.x, y: node.y },
        canvasSize: { width: ctx.canvas.width, height: ctx.canvas.height }
      });
    }

    // Determine node color (temporarily disabled for testing)
    // let nodeColor = regularNodeColor;
    // if (node.id === currentUserId) {
    //   nodeColor = centerNodeColor;
    // } else if (isHighlighted) {
    //   nodeColor = highlightNodeColor;
    // }

    // Apply dimming
    if (isDimmed) {
      ctx.globalAlpha = 0.2;
    }

    // Draw node circle - MUCH BIGGER for visibility
    const nodeSize = node.id === currentUserId ? 30 : 20;  // Increased from 6-8
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);

    // FORCE BRIGHT COLORS for testing
    if (node.id === currentUserId) {
      ctx.fillStyle = '#00FF00';  // Bright green for center
    } else {
      ctx.fillStyle = '#0000FF';  // Bright blue for others
    }
    ctx.fill();

    // Draw black border for visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw label - BIGGER
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000000';  // Black text
    ctx.font = '14px Sans-Serif';  // Bigger font
    ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + 5);

    // Reset alpha
    ctx.globalAlpha = 1;
  }, [currentUserId, highlightedNodeIds]);

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

      {/* Debug overlay - shows canvas dimensions */}
      <div className="absolute top-4 left-4 bg-black text-white p-4 rounded z-50 font-mono text-xs">
        <div>Canvas: {dimensions.width}x{dimensions.height}</div>
        <div>Nodes: {graphData.nodes.length}</div>
        <div>Links: {graphData.links.length}</div>
        <div>Loading: {isLoading ? 'YES' : 'NO'}</div>
      </div>

      {/* Force graph visualization */}
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel="name"
        linkSource="source"
        linkTarget="target"
        nodeRelSize={GRAPH_CONSTANTS.REGULAR_NODE_SIZE}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={nodeCanvasObjectWithDimming}
        linkCanvasObject={linkCanvasObject}
        d3VelocityDecay={0.4}
        d3AlphaDecay={0.0228}
        cooldownTime={GRAPH_CONSTANTS.INITIAL_COOLDOWN}
        enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        minZoom={0.5}
        maxZoom={4}
        backgroundColor="#FF0000"
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default NetworkGraph;
