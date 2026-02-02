import type { D3NodeObject } from '../types';

/**
 * Creates a radial gradient for node rendering with glow effect
 */
export function createNodeGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colorRGB: string,
  isHovered: boolean = false
): CanvasGradient {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  if (isHovered) {
    // Brighter gradient for hover state
    gradient.addColorStop(0, `rgba(255, 255, 255, 1)`); // White center highlight
    gradient.addColorStop(0.3, `rgb(${colorRGB})`); // Transition to color
    gradient.addColorStop(0.7, `rgba(${colorRGB}, 0.9)`); // Solid color
    gradient.addColorStop(1, `rgba(${colorRGB}, 0.4)`); // Glow edge
  } else {
    // Normal gradient
    gradient.addColorStop(0, `rgb(${colorRGB})`); // Solid center
    gradient.addColorStop(0.6, `rgba(${colorRGB}, 0.9)`); // Mostly solid
    gradient.addColorStop(1, `rgba(${colorRGB}, 0.3)`); // Glow edge
  }

  return gradient;
}

/**
 * Configures and draws drop shadow for nodes
 */
export function drawNodeShadow(
  ctx: CanvasRenderingContext2D,
  isCenterNode: boolean,
  isDimmed: boolean
): void {
  if (isDimmed) {
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  } else if (isCenterNode) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  } else {
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  }
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
}

/**
 * Draws strength tier indicator rings around nodes
 */
export function drawStrengthRings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  strength: number,
  isHovered: boolean = false
): void {
  // Save context
  ctx.save();

  // Clear shadow for rings
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  const ringColor = strength >= 80 ? 'rgba(10, 132, 255, 0.6)' : 'rgba(156, 163, 175, 0.4)';
  const ringWidth = 1.5;
  const ringGap = 2;

  if (strength >= 80) {
    // Close connections: Double ring
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = ringWidth;

    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, radius + ringGap + ringWidth, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(x, y, radius + ringGap + ringWidth * 2.5, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (strength >= 40) {
    // Medium connections: Single ring
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = ringWidth;

    ctx.beginPath();
    ctx.arc(x, y, radius + ringGap, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Hover pulse ring
  if (isHovered) {
    ctx.strokeStyle = 'rgba(10, 132, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius + ringGap + 6, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Restore context
  ctx.restore();
}

/**
 * Calculates node size based on connection strength
 */
export function calculateNodeSize(
  baseSize: number,
  strength: number,
  isCenterNode: boolean,
  isHovered: boolean = false
): number {
  if (isCenterNode) {
    return baseSize;
  }

  let size = baseSize;

  // Size scaling by strength
  if (strength >= 80) {
    size *= 1.15; // 15% larger for close connections
  } else if (strength < 40) {
    size *= 0.85; // 15% smaller for distant connections
  }

  // Hover scaling
  if (isHovered) {
    size *= 1.3; // 30% larger on hover
  }

  return size;
}

/**
 * Calculates link width based on connection strength
 */
export function calculateLinkWidth(strength: number, isConnectedToHovered: boolean = false): number {
  const baseWidth = 1;
  const maxWidth = 3;

  let width = baseWidth + ((strength / 100) * (maxWidth - baseWidth));

  // Enhance connected links on hover
  if (isConnectedToHovered) {
    width *= 1.8;
  }

  return width;
}

/**
 * Returns strength tier label
 */
export function getStrengthTierLabel(strength: number): string {
  if (strength >= 80) return 'Close';
  if (strength >= 40) return 'Medium';
  return 'Distant';
}

/**
 * Returns Tailwind color class for strength tier
 */
export function getStrengthTierColor(strength: number): string {
  if (strength >= 80) return 'text-blue-400';
  if (strength >= 40) return 'text-gray-400';
  return 'text-gray-500';
}

/**
 * Helper to get connection strength from node
 */
export function getConnectionStrength(node: D3NodeObject): number {
  // If node has connection data, use it
  if (node.connectionStrength !== undefined) {
    return node.connectionStrength;
  }

  // Try strength property as fallback
  if (node.strength !== undefined) {
    return node.strength;
  }

  // Default fallback
  return 50;
}
