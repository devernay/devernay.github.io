/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/analysis.js":
/*!*******************************!*\
  !*** ./public/js/analysis.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculatePSNRForImages: () => (/* binding */ calculatePSNRForImages)
/* harmony export */ });
/**
 * Analysis utilities for the Image Comparison Element.
 * This module provides functions for calculating image quality metrics
 * and performing pixel-level comparisons between images.
 *
 * This version is adapted for the web component and doesn't rely on global state.
 */
/**
 * Calculates the Peak Signal-to-Noise Ratio (PSNR) between two images.
 *
 * PSNR is a quality metric that measures the similarity between two images.
 * Higher values indicate more similar images. The calculation takes into account
 * the current position and offset of both images, and only compares the
 * overlapping regions.
 *
 * @param imageAData - Pixel data for image A
 * @param imageBData - Pixel data for image B
 * @param imageA - Image A element (for dimensions)
 * @param imageB - Image B element (for dimensions)
 * @param offsetAX - X offset for image A
 * @param offsetAY - Y offset for image A
 * @param offsetBX - X offset for image B
 * @param offsetBY - Y offset for image B
 * @param scale - Current scale factor
 * @returns PSNR value as a formatted string, or "N/A" if calculation fails
 */
function calculatePSNRForImages(imageAData, imageBData, imageA, imageB, offsetAX, offsetAY, offsetBX, offsetBY, scale) {
    // Check if we have both images and their data
    if (!imageAData || !imageBData || !imageA || !imageB) {
        return "PSNR: N/A";
    }
    // Calculate the overlapping region between the two images
    const overlapInfo = calculateImageOverlap(imageA.width, imageA.height, offsetAX, offsetAY, imageB.width, imageB.height, offsetBX, offsetBY, scale);
    if (!overlapInfo || overlapInfo.width <= 0 || overlapInfo.height <= 0) {
        return "PSNR: No overlap";
    }
    // Calculate MSE (Mean Squared Error) over the overlapping region
    let mse = 0;
    let pixelCount = 0;
    for (let y = 0; y < overlapInfo.height; y++) {
        for (let x = 0; x < overlapInfo.width; x++) {
            // Calculate pixel positions in each image
            const aX = Math.floor(overlapInfo.aStartX + x);
            const aY = Math.floor(overlapInfo.aStartY + y);
            const bX = Math.floor(overlapInfo.bStartX + x);
            const bY = Math.floor(overlapInfo.bStartY + y);
            // Check bounds
            if (aX >= 0 && aX < imageA.width && aY >= 0 && aY < imageA.height &&
                bX >= 0 && bX < imageB.width && bY >= 0 && bY < imageB.height) {
                // Get pixel indices
                const aIndex = (aY * imageA.width + aX) * 4;
                const bIndex = (bY * imageB.width + bX) * 4;
                // Calculate squared differences for RGB channels
                const rDiff = imageAData.data[aIndex] - imageBData.data[bIndex];
                const gDiff = imageAData.data[aIndex + 1] - imageBData.data[bIndex + 1];
                const bDiff = imageAData.data[aIndex + 2] - imageBData.data[bIndex + 2];
                mse += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
                pixelCount++;
            }
        }
    }
    if (pixelCount === 0) {
        return "PSNR: No valid pixels";
    }
    // Calculate average MSE
    mse = mse / (pixelCount * 3); // Divide by 3 for RGB channels
    if (mse === 0) {
        return "PSNR: ∞ (identical)";
    }
    // Calculate PSNR: 20 * log10(MAX_I) - 10 * log10(MSE)
    // where MAX_I is the maximum possible pixel value (255 for 8-bit)
    const psnr = 20 * Math.log10(255) - 10 * Math.log10(mse);
    return `PSNR: ${psnr.toFixed(2)} dB`;
}
/**
 * Calculates the overlapping region between two images given their positions and offsets.
 *
 * @param aWidth - Width of image A
 * @param aHeight - Height of image A
 * @param aOffsetX - X offset of image A
 * @param aOffsetY - Y offset of image A
 * @param bWidth - Width of image B
 * @param bHeight - Height of image B
 * @param bOffsetX - X offset of image B
 * @param bOffsetY - Y offset of image B
 * @param scale - Current scale factor
 * @returns Overlap information or null if no overlap
 */
function calculateImageOverlap(aWidth, aHeight, aOffsetX, aOffsetY, bWidth, bHeight, bOffsetX, bOffsetY, scale) {
    // Convert offsets from screen coordinates to image coordinates
    const aImageOffsetX = aOffsetX / scale;
    const aImageOffsetY = aOffsetY / scale;
    const bImageOffsetX = bOffsetX / scale;
    const bImageOffsetY = bOffsetY / scale;
    // Calculate the bounds of each image in a common coordinate system
    const aLeft = aImageOffsetX;
    const aTop = aImageOffsetY;
    const aRight = aLeft + aWidth;
    const aBottom = aTop + aHeight;
    const bLeft = bImageOffsetX;
    const bTop = bImageOffsetY;
    const bRight = bLeft + bWidth;
    const bBottom = bTop + bHeight;
    // Calculate overlap bounds
    const overlapLeft = Math.max(aLeft, bLeft);
    const overlapTop = Math.max(aTop, bTop);
    const overlapRight = Math.min(aRight, bRight);
    const overlapBottom = Math.min(aBottom, bBottom);
    // Check if there's actually an overlap
    if (overlapLeft >= overlapRight || overlapTop >= overlapBottom) {
        return null;
    }
    return {
        width: overlapRight - overlapLeft,
        height: overlapBottom - overlapTop,
        aStartX: overlapLeft - aLeft,
        aStartY: overlapTop - aTop,
        bStartX: overlapLeft - bLeft,
        bStartY: overlapTop - bTop
    };
}
//# sourceMappingURL=analysis.js.map

/***/ }),

/***/ "./public/js/coordinates.js":
/*!**********************************!*\
  !*** ./public/js/coordinates.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasToImageCoords: () => (/* binding */ canvasToImageCoords),
/* harmony export */   getWipePositionInCanvasCoords: () => (/* binding */ getWipePositionInCanvasCoords)
/* harmony export */ });
/**
 * Coordinate conversion utilities for the Image Comparison Element.
 * This module provides functions for converting between image and canvas coordinates,
 * taking into account the current pan, zoom, and individual image offsets.
 *
 * This version is adapted for the web component and takes state as a parameter
 * instead of relying on global state.
 */
/**
 * Converts image coordinates to canvas coordinates.
 * This takes into account the current pan and zoom settings.
 *
 * @param imageX - X coordinate in image space
 * @param imageY - Y coordinate in image space
 * @param imageType - Which image's coordinate system to use ('A' or 'B')
 * @param state - Component state containing scale and offset information
 * @returns The corresponding coordinates in canvas space
 */
function imageToCanvasCoords(imageX, imageY, imageType = 'A', state) {
    const offsetX = imageType === 'A' ? state.offsetAX : state.offsetBX;
    const offsetY = imageType === 'A' ? state.offsetAY : state.offsetBY;
    return {
        x: imageX * state.scale + state.offsetX + offsetX,
        y: imageY * state.scale + state.offsetY + offsetY
    };
}
/**
 * Converts canvas coordinates to image coordinates.
 * This takes into account the current pan and zoom settings.
 *
 * @param canvasX - X coordinate in canvas space
 * @param canvasY - Y coordinate in canvas space
 * @param imageType - Which image's coordinate system to use ('A' or 'B')
 * @param state - Component state containing scale and offset information
 * @returns The corresponding coordinates in image space
 */
function canvasToImageCoords(canvasX, canvasY, imageType = 'A', state) {
    const offsetX = imageType === 'A' ? state.offsetAX : state.offsetBX;
    const offsetY = imageType === 'A' ? state.offsetAY : state.offsetBY;
    return {
        x: (canvasX - state.offsetX - offsetX) / state.scale,
        y: (canvasY - state.offsetY - offsetY) / state.scale
    };
}
/**
 * Gets the wipe position in canvas coordinates.
 * Converts the wipe position from image A coordinates to canvas coordinates.
 *
 * @param state - Component state containing wipe position and transformation info
 * @returns The wipe position in canvas coordinates
 */
function getWipePositionInCanvasCoords(state) {
    return imageToCanvasCoords(state.wipePositionInImageACoords.x, state.wipePositionInImageACoords.y, 'A', state);
}
//# sourceMappingURL=coordinates.js.map

/***/ }),

/***/ "./public/js/drawing.js":
/*!******************************!*\
  !*** ./public/js/drawing.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWipeClippingPath: () => (/* binding */ createWipeClippingPath),
/* harmony export */   draw: () => (/* binding */ draw),
/* harmony export */   drawCheckerboard: () => (/* binding */ drawCheckerboard),
/* harmony export */   drawSingleImage: () => (/* binding */ drawSingleImage),
/* harmony export */   drawWipeLine: () => (/* binding */ drawWipeLine),
/* harmony export */   renderCompositeContent: () => (/* binding */ renderCompositeContent)
/* harmony export */ });
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coordinates */ "./public/js/coordinates.js");
/* harmony import */ var _ui_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-constants */ "./public/js/ui-constants.js");
/**
 * Drawing utilities for the Image Comparison Element.
 * This module provides all the rendering functionality including image drawing,
 * composite modes, wipe interface, and UI elements.
 *
 * This version is adapted for the web component and takes state as a parameter
 * instead of relying on global state. It matches the original single version
 * clipping and composite algorithms exactly.
 */


/**
 * Main drawing function that renders the entire canvas based on current state.
 * This is the primary entry point for all rendering operations.
 *
 * @param state - Component state containing all rendering parameters
 * @param drawUI - Whether to draw UI elements (handles, wipe line) - defaults to true
 */
function draw(state, drawUI = true) {
    if (!state.ctx || !state.canvas)
        return;
    // Clear the canvas with black background
    state.ctx.fillStyle = 'black';
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    // Draw checkerboard background if enabled
    if (state.isCheckerboard) {
        // Keep checkerboard fixed to canvas like the single version
        // No offset needed - pattern stays fixed regardless of pan/zoom
        // Use configurable square size from component state
        const squareSize = state.checkerboardSquareSize || 10;
        drawCheckerboard(state.ctx, state.canvas.width, state.canvas.height, 0, 0, squareSize);
    }
    // Determine what to draw based on current mode and loaded images
    if (!state.imageALoaded && !state.imageBLoaded) {
        // No images loaded - help screen will be shown by the component
        return;
    }
    // Choose rendering method based on current settings
    if (state.isWipeEnabled && state.imageALoaded && state.imageBLoaded) {
        // Draw wipe interface
        drawWipeView(state, drawUI);
    }
    else {
        // Draw single image or composite without wipe
        drawSingleView(state);
    }
}
/**
 * Creates a checkerboard pattern that can be used as a fill style.
 * This is more efficient than drawing individual squares and matches the single version.
 *
 * @param ctx - The canvas rendering context to create the pattern for
 * @param squareSize - Size of each square in the checkerboard (default: 10)
 * @param color1 - First color of the checkerboard (default: black)
 * @param color2 - Second color of the checkerboard (default: grey)
 * @returns A CanvasPattern object that can be used as fillStyle
 */
function createCheckerboardPattern(ctx, squareSize = 10, color1 = 'black', color2 = '#808080' // grey50 to match single version
) {
    // Create a small canvas for the pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = squareSize * 2;
    patternCanvas.height = squareSize * 2;
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx)
        return null;
    // Draw the pattern - fill entire area with first color
    patternCtx.fillStyle = color1;
    patternCtx.fillRect(0, 0, squareSize * 2, squareSize * 2);
    // Draw alternating squares with second color
    patternCtx.fillStyle = color2;
    patternCtx.fillRect(0, 0, squareSize, squareSize);
    patternCtx.fillRect(squareSize, squareSize, squareSize, squareSize);
    // Create and return the pattern
    return ctx.createPattern(patternCanvas, 'repeat');
}
// Use a WeakMap to store pattern maps by context, with each map storing patterns by square size
// WeakMap allows the patterns to be garbage collected when the context is no longer used
const checkerboardPatterns = new WeakMap();
/**
 * Draws a checkerboard pattern background using efficient pattern-based rendering.
 * This matches the implementation in the single version for consistency.
 * Used to indicate transparency or as a neutral background.
 *
 * @param ctx - Canvas rendering context
 * @param width - Canvas width
 * @param height - Canvas height
 * @param offsetX - Optional X offset for pattern alignment (default: 0)
 * @param offsetY - Optional Y offset for pattern alignment (default: 0)
 * @param squareSize - Size of checkerboard squares in pixels (default: 10)
 */
function drawCheckerboard(ctx, width, height, offsetX = 0, offsetY = 0, squareSize = 10) {
    // Create a unique key for this context and square size combination
    const patternKey = `${squareSize}`;
    let patternMap = checkerboardPatterns.get(ctx);
    if (!patternMap) {
        patternMap = new Map();
        checkerboardPatterns.set(ctx, patternMap);
    }
    let pattern = patternMap.get(patternKey);
    if (!pattern) {
        // Create a new pattern for this context and square size
        const newPattern = createCheckerboardPattern(ctx, squareSize);
        if (!newPattern)
            return; // Exit if pattern creation failed
        pattern = newPattern;
        // Store the pattern for future use with this context and square size
        patternMap.set(patternKey, pattern);
    }
    // Save the current context state
    ctx.save();
    // Set the pattern as fill style
    ctx.fillStyle = pattern;
    const patternSize = squareSize * 2;
    // Apply the offset for pattern alignment (if any)
    if (offsetX !== 0 || offsetY !== 0) {
        // Use pattern size (2 * squareSize) for proper alignment
        ctx.translate(-offsetX % patternSize, -offsetY % patternSize);
    }
    // Fill the entire canvas with the pattern.
    // Add patternSize in case an offset was applied.
    ctx.fillRect(0, 0, width + patternSize, height + patternSize);
    // Restore the context state
    ctx.restore();
}
/**
 * Draws a single view (no wipe interface).
 * This handles all composite modes when wipe is disabled.
 *
 * @param state - Component state
 */
function drawSingleView(state) {
    if (!state.ctx || !state.canvas)
        return;
    switch (state.compositeMode) {
        case 'A':
            if (state.imageALoaded && state.imageA) {
                drawSingleImage(state, 'A');
            }
            break;
        case 'B':
            if (state.imageBLoaded && state.imageB) {
                drawSingleImage(state, 'B');
            }
            break;
        case 'Under':
            // Draw A first, then B with alpha blending
            if (state.imageALoaded && state.imageA) {
                drawSingleImage(state, 'A');
            }
            if (state.imageBLoaded && state.imageB) {
                state.ctx.globalAlpha = 0.5;
                drawSingleImage(state, 'B');
                state.ctx.globalAlpha = 1.0;
            }
            break;
        case 'OnionSkin':
            // Draw A first, then B with additive blending
            if (state.imageALoaded && state.imageA) {
                drawSingleImage(state, 'A');
            }
            if (state.imageBLoaded && state.imageB) {
                state.ctx.globalAlpha = 0.5;
                const originalCompositeOp = state.ctx.globalCompositeOperation;
                state.ctx.globalCompositeOperation = 'lighter';
                drawSingleImage(state, 'B');
                state.ctx.globalCompositeOperation = originalCompositeOp;
                state.ctx.globalAlpha = 1.0;
            }
            break;
        case 'Diff':
        case 'InvDiff':
            if (state.imageALoaded && state.imageBLoaded && state.imageA && state.imageB) {
                drawDifferenceComposite(state, state.compositeMode === 'InvDiff', 1.0);
            }
            break;
    }
}
/**
 * Draws the wipe view with both images and wipe interface.
 * This uses the correct clipping approach: no clipping for A side,
 * proper geometric clipping for composite side.
 *
 * @param state - Component state
 * @param drawUI - Whether to draw UI elements (handles, wipe line)
 */
function drawWipeView(state, drawUI = true) {
    if (!state.ctx || !state.canvas || !state.imageALoaded || !state.imageBLoaded)
        return;
    const canvasWidth = state.canvas.width;
    const canvasHeight = state.canvas.height;
    // Calculate the wipe line
    const wipePos = (0,_coordinates__WEBPACK_IMPORTED_MODULE_0__.getWipePositionInCanvasCoords)(state);
    const wipeAngleRad = state.isSimpleWipe ? 0 : state.wipeAngle * (Math.PI / 180);
    // STEP 1: Draw image A as the base layer for the entire canvas (no clipping)
    drawSingleImage(state, 'A');
    // STEP 2: Create clipping path for the composite side and draw composite
    state.ctx.save();
    // Create clipping path that represents the composite side of the wipe line
    // This is a half-plane defined by the wipe line
    createWipeClippingPath(state.ctx, wipePos, wipeAngleRad, canvasWidth, canvasHeight, state);
    // Apply the clipping path
    state.ctx.clip();
    // STEP 3: Draw the composite in the clipped region using offscreen canvas
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (offscreenCtx) {
        // Use effective alpha - for simple wipe always use 1.0, for full wipe use slider value
        const effectiveAlpha = state.isSimpleWipe ? 1.0 : state.wipeAlpha;
        // Create temporary state for offscreen rendering
        const offscreenState = {
            ...state,
            ctx: offscreenCtx,
            canvas: offscreenCanvas
        };
        // Render composite content to offscreen canvas
        renderCompositeContent(offscreenState, effectiveAlpha);
        // Draw the offscreen canvas to the main canvas (in the clipped region)
        state.ctx.globalAlpha = 1.0;
        state.ctx.drawImage(offscreenCanvas, 0, 0);
    }
    // Restore the context state after clipping
    state.ctx.restore();
    // Draw the wipe line and UI elements only if requested
    if (drawUI) {
        // Draw the wipe line
        drawWipeLine(state.ctx, wipePos, state.wipeAngle);
        // Draw wipe UI elements - always draw translation handle, additional handles only for full wipe
        drawWipeUIElements(state.ctx, wipePos, state.wipeAngle, state);
    }
}
/**
 * Creates a clipping path for the composite side of the wipe line.
 * Clips the image B rectangle with the wipe line to get the correct polygon.
 * Result can be: full rectangle, pentagon (cut corner), trapezoid, or triangle.
 *
 * @param ctx - Canvas rendering context
 * @param wipePos - Wipe position in canvas coordinates
 * @param wipeAngleRad - Wipe angle in radians
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
 * @param state - Component state (needed for image B bounds)
 */
function createWipeClippingPath(ctx, wipePos, wipeAngleRad, canvasWidth, canvasHeight, state) {
    if (!state.imageB)
        return;
    // Calculate image B rectangle in canvas coordinates
    const imageBWidth = state.imageB.width * state.scale;
    const imageBHeight = state.imageB.height * state.scale;
    const imageBX = state.offsetX + state.offsetBX;
    const imageBY = state.offsetY + state.offsetBY;
    // Define the four corners of image B rectangle
    const rectCorners = [
        { x: imageBX, y: imageBY }, // top-left
        { x: imageBX + imageBWidth, y: imageBY }, // top-right
        { x: imageBX + imageBWidth, y: imageBY + imageBHeight }, // bottom-right
        { x: imageBX, y: imageBY + imageBHeight } // bottom-left
    ];
    // Calculate wipe line normal vector (pointing to composite side)
    const normalX = Math.cos(wipeAngleRad);
    const normalY = Math.sin(wipeAngleRad);
    // Classify each corner: is it on the composite side of the wipe line?
    const cornerSides = rectCorners.map(corner => {
        const dx = corner.x - wipePos.x;
        const dy = corner.y - wipePos.y;
        const dotProduct = dx * normalX + dy * normalY;
        return {
            corner,
            onCompositeSide: dotProduct > 0,
            distance: dotProduct
        };
    });
    // Get corners on composite side
    const compositeCorners = cornerSides.filter(c => c.onCompositeSide).map(c => c.corner);
    // If no corners are on composite side, no clipping needed (empty region)
    if (compositeCorners.length === 0) {
        // Create empty clipping path
        ctx.beginPath();
        ctx.rect(0, 0, 0, 0);
        return;
    }
    // If all corners are on composite side, use the full rectangle
    if (compositeCorners.length === 4) {
        ctx.beginPath();
        ctx.moveTo(rectCorners[0].x, rectCorners[0].y);
        ctx.lineTo(rectCorners[1].x, rectCorners[1].y);
        ctx.lineTo(rectCorners[2].x, rectCorners[2].y);
        ctx.lineTo(rectCorners[3].x, rectCorners[3].y);
        ctx.closePath();
        return;
    }
    // We need to find intersections of the wipe line with rectangle edges
    const intersections = [];
    // Calculate wipe line direction vector
    const lineX = -Math.sin(wipeAngleRad);
    const lineY = Math.cos(wipeAngleRad);
    // Check intersection with each rectangle edge
    const edges = [
        // Top edge: from top-left to top-right
        { start: rectCorners[0], end: rectCorners[1] },
        // Right edge: from top-right to bottom-right
        { start: rectCorners[1], end: rectCorners[2] },
        // Bottom edge: from bottom-right to bottom-left
        { start: rectCorners[2], end: rectCorners[3] },
        // Left edge: from bottom-left to top-left
        { start: rectCorners[3], end: rectCorners[0] }
    ];
    for (const edge of edges) {
        const intersection = findLineIntersection(wipePos.x, wipePos.y, wipePos.x + lineX, wipePos.y + lineY, edge.start.x, edge.start.y, edge.end.x, edge.end.y);
        if (intersection &&
            intersection.x >= Math.min(edge.start.x, edge.end.x) - 1e-6 &&
            intersection.x <= Math.max(edge.start.x, edge.end.x) + 1e-6 &&
            intersection.y >= Math.min(edge.start.y, edge.end.y) - 1e-6 &&
            intersection.y <= Math.max(edge.start.y, edge.end.y) + 1e-6) {
            intersections.push(intersection);
        }
    }
    // Remove duplicate intersections
    const uniqueIntersections = [];
    for (const intersection of intersections) {
        const isDuplicate = uniqueIntersections.some(existing => Math.abs(existing.x - intersection.x) < 1e-6 &&
            Math.abs(existing.y - intersection.y) < 1e-6);
        if (!isDuplicate) {
            uniqueIntersections.push(intersection);
        }
    }
    // Create the clipping polygon
    ctx.beginPath();
    if (uniqueIntersections.length >= 2) {
        // Build the polygon by combining composite corners and intersections
        // We need to traverse the rectangle boundary and include the right points
        const allPoints = [];
        // Add composite corners
        for (const corner of compositeCorners) {
            allPoints.push({ ...corner, type: 'corner' });
        }
        // Add intersections
        for (const intersection of uniqueIntersections) {
            allPoints.push({ ...intersection, type: 'intersection' });
        }
        // Sort points to form a proper polygon
        // For simplicity, we'll use a different approach: trace the rectangle boundary
        const polygonPoints = [];
        // Start from first composite corner and trace boundary
        if (compositeCorners.length > 0) {
            // Add all composite corners
            polygonPoints.push(...compositeCorners);
            // Add intersections
            polygonPoints.push(...uniqueIntersections);
            // Sort points by angle from centroid to create proper polygon
            const centroidX = polygonPoints.reduce((sum, p) => sum + p.x, 0) / polygonPoints.length;
            const centroidY = polygonPoints.reduce((sum, p) => sum + p.y, 0) / polygonPoints.length;
            polygonPoints.sort((a, b) => {
                const angleA = Math.atan2(a.y - centroidY, a.x - centroidX);
                const angleB = Math.atan2(b.y - centroidY, b.x - centroidX);
                return angleA - angleB;
            });
        }
        // Draw the polygon
        if (polygonPoints.length > 0) {
            ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
            for (let i = 1; i < polygonPoints.length; i++) {
                ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
            }
            ctx.closePath();
        }
    }
    else {
        // Fallback: just use composite corners if we can't find intersections
        if (compositeCorners.length > 0) {
            ctx.moveTo(compositeCorners[0].x, compositeCorners[0].y);
            for (let i = 1; i < compositeCorners.length; i++) {
                ctx.lineTo(compositeCorners[i].x, compositeCorners[i].y);
            }
            ctx.closePath();
        }
    }
}
/**
 * Finds the intersection point of two lines defined by two points each.
 * Returns null if lines are parallel or don't intersect.
 */
function findLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 1e-10) {
        return null; // Lines are parallel
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
    };
}
/**
 * Renders composite content based on the current mode.
 * This matches the original renderCompositeContent function.
 *
 * @param state - Component state (can be offscreen)
 * @param alpha - Alpha value for blending
 */
function renderCompositeContent(state, alpha) {
    if (!state.ctx)
        return;
    switch (state.compositeMode) {
        case 'Under':
            // Draw A first, then B with alpha blending
            drawSingleImage(state, 'A');
            state.ctx.globalAlpha = alpha;
            drawSingleImage(state, 'B');
            state.ctx.globalAlpha = 1.0;
            break;
        case 'OnionSkin': {
            // Draw A first, then B with additive blending
            drawSingleImage(state, 'A');
            state.ctx.globalAlpha = alpha;
            const originalCompositeOp = state.ctx.globalCompositeOperation;
            state.ctx.globalCompositeOperation = 'lighter';
            drawSingleImage(state, 'B');
            state.ctx.globalCompositeOperation = originalCompositeOp;
            state.ctx.globalAlpha = 1.0;
            break;
        }
        case 'A':
            drawSingleImage(state, 'A');
            break;
        case 'B':
            drawSingleImage(state, 'B');
            break;
        case 'Diff':
        case 'InvDiff':
            drawDifferenceComposite(state, state.compositeMode === 'InvDiff', alpha);
            break;
    }
}
/**
 * Draws a single image (A or B) to the canvas.
 *
 * @param state - Component state
 * @param imageType - Which image to draw ('A' or 'B')
 */
function drawSingleImage(state, imageType) {
    if (!state.ctx)
        return;
    const image = imageType === 'A' ? state.imageA : state.imageB;
    const mipMaps = imageType === 'A' ? state.imageAMipMaps : state.imageBMipMaps;
    const offsetX = imageType === 'A' ? state.offsetAX : state.offsetBX;
    const offsetY = imageType === 'A' ? state.offsetAY : state.offsetBY;
    if (!image)
        return;
    // Calculate image position
    const imageX = state.offsetX + offsetX;
    const imageY = state.offsetY + offsetY;
    const imageWidth = image.width * state.scale;
    const imageHeight = image.height * state.scale;
    // Use mip-maps if available for better quality
    if (mipMaps && mipMaps.length > 0) {
        renderImageWithMipMaps(state.ctx, image, mipMaps, imageX, imageY, imageWidth, imageHeight, state.scale);
    }
    else {
        // Fallback to direct rendering
        // Use nearest neighbor interpolation when zoomed in (scale >= 1)
        // Use bilinear interpolation when zoomed out (scale < 1)
        state.ctx.imageSmoothingEnabled = state.scale < 1;
        state.ctx.drawImage(image, 0, 0, image.width, image.height, imageX, imageY, imageWidth, imageHeight);
    }
}
/**
 * Renders an image with mip-mapping for better quality at different zoom levels.
 *
 * @param ctx - Canvas rendering context
 * @param originalImage - Original full-resolution image
 * @param mipMaps - Mip-map pyramid
 * @param destX - Destination X coordinate
 * @param destY - Destination Y coordinate
 * @param destWidth - Destination width
 * @param destHeight - Destination height
 * @param scale - Current scale factor
 */
function renderImageWithMipMaps(ctx, originalImage, mipMaps, destX, destY, destWidth, destHeight, scale) {
    // Select appropriate mip level based on scale
    let mipLevel = 0;
    let currentScale = scale;
    while (currentScale < 0.5 && mipLevel < mipMaps.length - 1) {
        currentScale *= 2;
        mipLevel++;
    }
    const imageToUse = mipLevel === 0 ? originalImage : mipMaps[mipLevel - 1];
    // Use nearest neighbor interpolation when zoomed in (scale >= 1)
    // Use bilinear interpolation when zoomed out (scale < 1)
    ctx.imageSmoothingEnabled = scale < 1;
    ctx.drawImage(imageToUse, 0, 0, imageToUse.width, imageToUse.height, destX, destY, destWidth, destHeight);
}
/**
 * Draws the wipe line itself.
 * Centers the line segment on the projection of canvas center onto the wipe line.
 *
 * @param ctx - Canvas rendering context
 * @param wipePos - Wipe position in canvas coordinates (not used for centering)
 * @param wipeAngleDeg - Wipe angle in degrees
 */
function drawWipeLine(ctx, wipePos, wipeAngleDeg) {
    ctx.save();
    // Set styles for the wipe line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    // Calculate canvas center
    const canvasCenterX = ctx.canvas.width / 2;
    const canvasCenterY = ctx.canvas.height / 2;
    // Convert angle to radians and calculate wipe line direction vector
    const wipeAngleRad = wipeAngleDeg * (Math.PI / 180);
    const lineX = -Math.sin(wipeAngleRad);
    const lineY = Math.cos(wipeAngleRad);
    // Project canvas center onto the wipe line
    // Vector from wipe position to canvas center
    const toCenterX = canvasCenterX - wipePos.x;
    const toCenterY = canvasCenterY - wipePos.y;
    // Project this vector onto the wipe line direction
    const projectionLength = toCenterX * lineX + toCenterY * lineY;
    // Find the projection point on the wipe line
    const projectionX = wipePos.x + projectionLength * lineX;
    const projectionY = wipePos.y + projectionLength * lineY;
    // Calculate line endpoints centered on the projection point
    // Use a length that ensures the line extends across the entire canvas
    const lineLength = Math.max(ctx.canvas.width, ctx.canvas.height) * 2;
    const x1 = projectionX - lineX * lineLength;
    const y1 = projectionY - lineY * lineLength;
    const x2 = projectionX + lineX * lineLength;
    const y2 = projectionY + lineY * lineLength;
    // Draw the wipe line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}
/**
 * Draws the wipe UI elements (handles and controls).
 *
 * @param ctx - Canvas rendering context
 * @param wipePos - Wipe position in canvas coordinates
 * @param wipeAngleDeg - Wipe angle in degrees
 * @param state - Component state
 */
function drawWipeUIElements(ctx, wipePos, wipeAngleDeg, state) {
    ctx.save();
    // Set styles for UI elements - match original exactly
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;
    ctx.fillStyle = 'white';
    // Draw translation handle (center dot)
    ctx.beginPath();
    ctx.arc(wipePos.x, wipePos.y, _ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.TRANSLATION_HANDLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // If using the full wipe interface (not simple wipe), draw additional controls
    if (!state.isSimpleWipe) {
        // Calculate rotation handle position
        const rotHandlePos = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_1__.calculateRotationHandlePosition)(wipePos, wipeAngleDeg);
        // Draw line to rotation handle
        ctx.beginPath();
        ctx.moveTo(wipePos.x, wipePos.y);
        ctx.lineTo(rotHandlePos.x, rotHandlePos.y);
        ctx.stroke();
        // Draw rotation handle
        ctx.beginPath();
        ctx.arc(rotHandlePos.x, rotHandlePos.y, _ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.ROTATION_HANDLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Draw alpha arc - match original arc extent
        const wipeAngleRad = wipeAngleDeg * (Math.PI / 180);
        const startAngle = wipeAngleRad - (_ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.ALPHA_ARC_START_ANGLE * Math.PI / 180);
        const endAngle = wipeAngleRad - (_ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(wipePos.x, wipePos.y, _ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.ALPHA_ARC_RADIUS, startAngle, endAngle);
        ctx.stroke();
        // Calculate alpha slider position
        const alphaSliderPos = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_1__.calculateAlphaSliderPosition)(wipePos, wipeAngleDeg, state.wipeAlpha);
        // Draw alpha slider
        ctx.beginPath();
        ctx.arc(alphaSliderPos.x, alphaSliderPos.y, _ui_constants__WEBPACK_IMPORTED_MODULE_1__.UI_CONSTANTS.ALPHA_HANDLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}
/**
 * Draws difference composite between two images.
 *
 * @param state - Component state
 * @param inverted - Whether to invert the difference
 * @param alpha - Alpha value for blending (0-1)
 */
function drawDifferenceComposite(state, inverted, alpha = 1.0) {
    if (!state.ctx || !state.imageA || !state.imageB)
        return;
    // Create an offscreen canvas for the difference calculation
    const offCanvas = document.createElement('canvas');
    offCanvas.width = state.canvas.width;
    offCanvas.height = state.canvas.height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx)
        return;
    if (inverted) {
        // Fill with white for inverted difference
        offCtx.fillStyle = 'white';
        offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    }
    // Draw image B
    drawSingleImage({ ...state, ctx: offCtx, canvas: offCanvas }, 'B');
    // Set difference blend mode
    offCtx.globalCompositeOperation = 'difference';
    // Draw image A
    drawSingleImage({ ...state, ctx: offCtx, canvas: offCanvas }, 'A');
    if (inverted) {
        // Invert the difference
        offCtx.globalCompositeOperation = 'difference';
        offCtx.fillStyle = 'white';
        offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    }
    // Draw the result to the main canvas with alpha
    state.ctx.globalAlpha = alpha;
    state.ctx.drawImage(offCanvas, 0, 0);
    state.ctx.globalAlpha = 1.0; // Reset alpha
}
//# sourceMappingURL=drawing.js.map

/***/ }),

/***/ "./public/js/magnifier.js":
/*!********************************!*\
  !*** ./public/js/magnifier.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateMagnifier: () => (/* binding */ updateMagnifier)
/* harmony export */ });
/* harmony import */ var _drawing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawing */ "./public/js/drawing.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coordinates */ "./public/js/coordinates.js");
/**
 * Magnifier functionality for the Image Comparison Element.
 * This module provides configurable zoom magnification functionality that shows
 * a detailed view of the area around the mouse cursor.
 */


/**
 * Updates the magnifier position and content.
 *
 * @param magnifierContainer - The container element for the magnifier
 * @param magnifierCanvas - The canvas element for rendering the magnified content
 * @param x - X coordinate of the mouse pointer in canvas coordinates
 * @param y - Y coordinate of the mouse pointer in canvas coordinates
 * @param state - Element state
 */
function updateMagnifier(magnifierContainer, magnifierCanvas, x, y, state) {
    // Use configurable magnifier properties from state (with fallbacks for backward compatibility)
    const magnifierRadius = state.magnifierRadius || 200;
    const zoom = state.magnifierZoomFactor || 8;
    const borderSize = state.magnifierBorderSize || 2;
    // Skip magnifier update if zoom factor is <= 0 (disabled)
    if (zoom <= 0)
        return;
    // Position magnifier container - center it on the mouse position, accounting for border
    magnifierContainer.style.left = `${x - magnifierRadius - borderSize}px`;
    magnifierContainer.style.top = `${y - magnifierRadius - borderSize}px`;
    // Ensure the magnifier canvas has the correct size (diameter = radius * 2)
    const magnifierDiameter = magnifierRadius * 2;
    if (magnifierCanvas.width !== magnifierDiameter || magnifierCanvas.height !== magnifierDiameter) {
        magnifierCanvas.width = magnifierDiameter;
        magnifierCanvas.height = magnifierDiameter;
    }
    // Get the 2D rendering context for the magnifier canvas
    const magCtx = magnifierCanvas.getContext('2d');
    if (!magCtx)
        return;
    // Clear previous content and set default black background
    magCtx.fillStyle = 'black';
    magCtx.fillRect(0, 0, magnifierDiameter, magnifierDiameter);
    // Create a circular clipping path for the magnifier content
    magCtx.save();
    magCtx.beginPath();
    magCtx.arc(magnifierRadius, magnifierRadius, magnifierRadius, 0, Math.PI * 2);
    magCtx.clip();
    // Calculate the world coordinates that should be at the center of the magnifier
    // This is the key to proper magnifier centering
    const worldX = (x - state.offsetX) / state.scale;
    const worldY = (y - state.offsetY) / state.scale;
    // Calculate the offset needed to center the world coordinates in the magnifier
    const magnifierOffsetX = magnifierRadius - worldX * state.scale * zoom;
    const magnifierOffsetY = magnifierRadius - worldY * state.scale * zoom;
    // Draw checkerboard background if enabled
    if (state.isCheckerboard) {
        // Calculate offset to make magnifier checkerboard align with main canvas pattern
        // The magnifier should show the checkerboard as if we're looking at the main canvas
        // through a magnifying glass - the pattern should be continuous
        // The mouse position (x, y) represents where we're looking on the main canvas
        // The magnifier shows this area zoomed in, so the checkerboard pattern should
        // align as if this area was extracted from the main canvas
        const offsetX = x - magnifierRadius;
        const offsetY = y - magnifierRadius;
        // Use configurable square size from component state
        const squareSize = state.checkerboardSquareSize || 10;
        (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.drawCheckerboard)(magCtx, magnifierDiameter, magnifierDiameter, offsetX, offsetY, squareSize);
    }
    // Create a temporary state for magnifier rendering with adjusted offsets
    const magnifierState = {
        canvas: magnifierCanvas,
        ctx: magCtx,
        imageA: state.imageA,
        imageB: state.imageB,
        imageAData: state.imageAData,
        imageBData: state.imageBData,
        imageAMipMaps: state.imageAMipMaps,
        imageBMipMaps: state.imageBMipMaps,
        imageALoaded: state.imageALoaded,
        imageBLoaded: state.imageBLoaded,
        scale: state.scale * zoom,
        offsetX: magnifierOffsetX,
        offsetY: magnifierOffsetY,
        offsetAX: state.offsetAX * zoom,
        offsetAY: state.offsetAY * zoom,
        offsetBX: state.offsetBX * zoom,
        offsetBY: state.offsetBY * zoom,
        wipePositionInImageACoords: state.wipePositionInImageACoords,
        wipeAngle: state.wipeAngle,
        wipeAlpha: state.wipeAlpha,
        isWipeEnabled: state.isWipeEnabled,
        isSimpleWipe: state.isSimpleWipe,
        isCheckerboard: state.isCheckerboard,
        compositeMode: state.compositeMode,
        showHelp: state.showHelp,
        magnifierRadius: state.magnifierRadius,
        magnifierZoomFactor: state.magnifierZoomFactor
    };
    // Render the appropriate content based on the current mode
    if (state.compositeMode === 'A') {
        // Show only image A
        if (state.imageA && state.imageALoaded) {
            (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.drawSingleImage)(magnifierState, 'A');
        }
    }
    else if (state.compositeMode === 'B') {
        // Show only image B
        if (state.imageB && state.imageBLoaded) {
            (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.drawSingleImage)(magnifierState, 'B');
        }
    }
    else {
        // Composite modes (Under, OnionSkin, Diff, InvDiff)
        if (state.isWipeEnabled) {
            // Apply wipe effect using the same logic as the main drawing function
            const wipeCanvasCoords = (0,_coordinates__WEBPACK_IMPORTED_MODULE_1__.getWipePositionInCanvasCoords)(magnifierState);
            // STEP 1: Draw image A as the base layer (no clipping)
            if (state.imageA && state.imageALoaded) {
                (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.drawSingleImage)(magnifierState, 'A');
            }
            // STEP 2: Create clipping path for the composite side and draw composite
            magCtx.save();
            // Create clipping path that represents the composite side of the wipe line
            (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.createWipeClippingPath)(magCtx, wipeCanvasCoords, state.wipeAngle * Math.PI / 180, magnifierDiameter, magnifierDiameter, magnifierState);
            // Apply the clipping path
            magCtx.clip();
            // STEP 3: Draw the composite in the clipped region
            if (state.imageA && state.imageALoaded && state.imageB && state.imageBLoaded) {
                // Use effective alpha - for simple wipe always use 1.0, for full wipe use slider value
                const effectiveAlpha = state.isSimpleWipe ? 1.0 : state.wipeAlpha;
                // Create temporary state for composite rendering with effective alpha
                const compositeState = {
                    ...magnifierState,
                    wipeAlpha: effectiveAlpha
                };
                (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.renderCompositeContent)(compositeState, effectiveAlpha);
            }
            magCtx.restore();
            // STEP 4: Draw wipe line
            (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.drawWipeLine)(magCtx, wipeCanvasCoords, state.wipeAngle * Math.PI / 180);
        }
        else {
            // No wipe - render composite content directly
            if (state.imageA && state.imageALoaded && state.imageB && state.imageBLoaded) {
                (0,_drawing__WEBPACK_IMPORTED_MODULE_0__.renderCompositeContent)(magnifierState, state.wipeAlpha);
            }
        }
    }
    // Restore the context to remove the clipping path
    magCtx.restore();
    // Draw crosshair in the center of the magnifier
    magCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    magCtx.lineWidth = 1;
    // Horizontal line
    magCtx.beginPath();
    magCtx.moveTo(0, magnifierRadius);
    magCtx.lineTo(magnifierDiameter, magnifierRadius);
    magCtx.stroke();
    // Vertical line
    magCtx.beginPath();
    magCtx.moveTo(magnifierRadius, 0);
    magCtx.lineTo(magnifierRadius, magnifierDiameter);
    magCtx.stroke();
}
//# sourceMappingURL=magnifier.js.map

/***/ }),

/***/ "./public/js/mip-mapping.js":
/*!**********************************!*\
  !*** ./public/js/mip-mapping.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMipMaps: () => (/* binding */ createMipMaps)
/* harmony export */ });
/**
 * Creates a mip-map pyramid for an image to improve rendering quality at different zoom levels.
 *
 * Mip-mapping is a technique that pre-generates multiple versions of an image at different
 * resolutions. Each level in the pyramid is half the size of the previous level. This allows
 * for better quality rendering when zoomed out, as the appropriate resolution can be selected
 * based on the current zoom level.
 *
 * @param image - The original image to create mip-maps from
 * @returns A promise that resolves to an array of images forming the mip-map pyramid
 */
function createMipMaps(image) {
    return new Promise((resolve) => {
        // Start with the original image as level 0
        const mipMaps = [image];
        // Track the current dimensions
        let width = image.width;
        let height = image.height;
        // If the image is very small, don't create mip-maps
        if (width < 4 || height < 4) {
            resolve(mipMaps);
            return;
        }
        /**
         * Recursive function to create the next mip level
         * Each level is half the size of the previous level
         *
         * @returns void
         */
        const createNextLevel = () => {
            // Stop if we've reached a very small size
            if (width <= 1 && height <= 1) {
                resolve(mipMaps);
                return;
            }
            // Calculate next mip level size (half size)
            width = Math.max(1, Math.floor(width / 2));
            height = Math.max(1, Math.floor(height / 2));
            // Create a temporary canvas for downsampling
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            // Handle case where canvas context couldn't be created
            if (!ctx) {
                resolve(mipMaps);
                return;
            }
            // Use bilinear interpolation for better quality downsampling
            ctx.imageSmoothingEnabled = true;
            // Draw the previous level image at half size
            ctx.drawImage(mipMaps[mipMaps.length - 1], 0, 0, width, height);
            // Convert canvas to image
            const img = new Image();
            // When the image loads, add it to the pyramid and continue
            img.onload = () => {
                mipMaps.push(img);
                createNextLevel(); // Create next level recursively
            };
            // Set the image source to the canvas data
            img.src = canvas.toDataURL();
        };
        // Start creating mip levels
        createNextLevel();
    });
}
//# sourceMappingURL=mip-mapping.js.map

/***/ }),

/***/ "./public/js/ui-constants.js":
/*!***********************************!*\
  !*** ./public/js/ui-constants.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UI_CONSTANTS: () => (/* binding */ UI_CONSTANTS),
/* harmony export */   calculateAlphaSliderPosition: () => (/* binding */ calculateAlphaSliderPosition),
/* harmony export */   calculateRotationHandlePosition: () => (/* binding */ calculateRotationHandlePosition)
/* harmony export */ });
/**
 * UI element constants for wipe interface.
 * Contains all the sizing and positioning constants used for drawing UI elements.
 */
const UI_CONSTANTS = {
    // Handle radii
    TRANSLATION_HANDLE_RADIUS: 6,
    ROTATION_HANDLE_RADIUS: 4,
    ALPHA_HANDLE_RADIUS: 4,
    // Distances and positions
    ROTATION_HANDLE_DISTANCE: 60,
    ALPHA_ARC_RADIUS: 40,
    // Alpha arc angles (in degrees)
    ALPHA_ARC_START_ANGLE: 70,
    ALPHA_ARC_END_ANGLE: 20,
};
/**
 * Calculates the position of the rotation handle based on wipe position and angle.
 *
 * @param wipePos - The center position of the wipe effect
 * @param wipeAngleDeg - The rotation angle of the wipe in degrees
 * @returns Position coordinates for the rotation handle
 */
function calculateRotationHandlePosition(wipePos, wipeAngleDeg) {
    const wipeAngleRad = wipeAngleDeg * (Math.PI / 180);
    return {
        x: wipePos.x + Math.cos(wipeAngleRad) * UI_CONSTANTS.ROTATION_HANDLE_DISTANCE,
        y: wipePos.y + Math.sin(wipeAngleRad) * UI_CONSTANTS.ROTATION_HANDLE_DISTANCE
    };
}
/**
 * Calculates the position of the alpha slider handle based on wipe position, angle and alpha value.
 *
 * @param wipePos - The center position of the wipe effect
 * @param wipeAngleDeg - The rotation angle of the wipe in degrees
 * @param wipeAlpha - The alpha/opacity value between 0 and 1
 * @returns Position coordinates for the alpha slider handle
 */
function calculateAlphaSliderPosition(wipePos, wipeAngleDeg, wipeAlpha) {
    const wipeAngleRad = wipeAngleDeg * (Math.PI / 180);
    const alphaAngle = wipeAngleRad - ((UI_CONSTANTS.ALPHA_ARC_END_ANGLE + (1 - wipeAlpha) * (UI_CONSTANTS.ALPHA_ARC_START_ANGLE - UI_CONSTANTS.ALPHA_ARC_END_ANGLE)) * Math.PI / 180);
    return {
        x: wipePos.x + Math.cos(alphaAngle) * UI_CONSTANTS.ALPHA_ARC_RADIUS,
        y: wipePos.y + Math.sin(alphaAngle) * UI_CONSTANTS.ALPHA_ARC_RADIUS
    };
}
//# sourceMappingURL=ui-constants.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************************************!*\
  !*** ./public/js/image-comparison-element.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageComparisonElement: () => (/* binding */ ImageComparisonElement)
/* harmony export */ });
/* harmony import */ var _mip_mapping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mip-mapping */ "./public/js/mip-mapping.js");
/* harmony import */ var _analysis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./analysis */ "./public/js/analysis.js");
/* harmony import */ var _coordinates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./coordinates */ "./public/js/coordinates.js");
/* harmony import */ var _drawing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drawing */ "./public/js/drawing.js");
/* harmony import */ var _magnifier__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./magnifier */ "./public/js/magnifier.js");
/* harmony import */ var _ui_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui-constants */ "./public/js/ui-constants.js");
/**
 * Image Comparison Element
 *
 * A custom HTML element that provides image comparison functionality with wipe interface,
 * multiple composite modes, and interactive controls. This component encapsulates all
 * the functionality of the original single-page application into a reusable element
 * that can be embedded multiple times on any web page.
 *
 * @example
 * ```html
 * <image-comparison
 *   image-a="path/to/imageA.jpg"
 *   image-b="path/to/imageB.jpg"
 *   display-mode="Under"
 *   wipe-mode="simple">
 * </image-comparison>
 * ```
 */






/**
 * Custom HTML element for image comparison functionality.
 *
 * This element provides a complete image comparison interface with support for:
 * - Multiple composite modes (Under, OnionSkin, Diff, InvDiff, A, B)
 * - Interactive wipe interface (simple and full modes)
 * - Zoom and pan functionality
 * - Magnifier with 8x zoom
 * - Keyboard shortcuts
 * - Drag and drop image loading
 * - PSNR calculation
 *
 * The component maintains its own isolated state and can be used multiple times
 * on the same page without interference.
 */
class ImageComparisonElement extends HTMLElement {
    /**
     * Constructor - initializes the web component
     */
    constructor() {
        super();
        // Element state - mirrors the original global state structure but isolated per instance
        this.state = {
            /** The main canvas element */
            canvas: null,
            /** The 2D rendering context of the canvas */
            ctx: null,
            /** The first image (A) to compare */
            imageA: null,
            /** The second image (B) to compare */
            imageB: null,
            /** Pixel data for image A */
            imageAData: null,
            /** Pixel data for image B */
            imageBData: null,
            /** Mip-map pyramid for image A for efficient rendering at different zoom levels */
            imageAMipMaps: null,
            /** Mip-map pyramid for image B for efficient rendering at different zoom levels */
            imageBMipMaps: null,
            /** Whether image A has been loaded successfully */
            imageALoaded: false,
            /** Whether image B has been loaded successfully */
            imageBLoaded: false,
            /** Current zoom scale factor */
            scale: 1,
            /** Global X offset for both images */
            offsetX: 0,
            /** Global Y offset for both images */
            offsetY: 0,
            /** Additional X offset specific to image A */
            offsetAX: 0,
            /** Additional Y offset specific to image A */
            offsetAY: 0,
            /** Additional X offset specific to image B */
            offsetBX: 0,
            /** Additional Y offset specific to image B */
            offsetBY: 0,
            /** Whether the wipe interface is enabled */
            isWipeEnabled: true,
            /** Whether to use the simple vertical wipe (true) or the full wipe interface (false) */
            isSimpleWipe: false,
            /** Angle of the wipe line in degrees */
            wipeAngle: 0,
            /** Position of the wipe line center in image A coordinates */
            wipePositionInImageACoords: { x: 0, y: 0 },
            /** Alpha blending value for the wipe interface (0-1) */
            wipeAlpha: 1,
            /** Whether to show the checkerboard background */
            isCheckerboard: false,
            /** Current composite mode for blending images */
            compositeMode: 'Under',
            /** Whether to show the help screen */
            showHelp: true,
            /** Radius of the magnifier in pixels (default: 200) */
            magnifierRadius: 200,
            /** Zoom factor for the magnifier (default: 8) */
            magnifierZoomFactor: 8,
            /** Border size of the magnifier in pixels (default: 2) */
            magnifierBorderSize: 2,
            /** Size of checkerboard squares in pixels (default: 10) */
            checkerboardSquareSize: 10
        };
        // Additional component-specific state not in the original global state
        /** Previous wipe angle, stored when switching to simple wipe mode or other modes */
        this.previousWipeAngle = 0;
        /** Previous wipe alpha, stored when switching to simple wipe mode or other modes */
        this.previousWipeAlpha = 1;
        /** Previous composite mode, stored when switching to A or B mode */
        this.lastCompositeMode = 'Under';
        // Interaction state variables (from original index.ts)
        /** Whether the user is currently dragging */
        this.isDragging = false;
        /** X coordinate where dragging started */
        this.dragStartX = 0;
        /** Y coordinate where dragging started */
        this.dragStartY = 0;
        /** Last recorded mouse X position */
        this.lastMouseX = 0;
        /** Last recorded mouse Y position */
        this.lastMouseY = 0;
        /** Whether the magnifier is currently visible */
        this.showMagnifier = false;
        /** Which handle is currently being dragged (null if none) */
        this.activeHandle = null;
        /** Whether help was manually toggled (vs auto-shown) */
        this.manuallyToggledHelp = false;
        /** Which side of the wipe is being dragged when shift is held */
        this.dragSide = null;
        /** Accumulated movement for pixel-perfect positioning */
        this.accumulatedDX = 0;
        /** Accumulated movement for pixel-perfect positioning */
        this.accumulatedDY = 0;
        // Create shadow DOM for complete encapsulation
        this.shadow = this.attachShadow({ mode: 'open' });
        // Create the component structure
        this.createComponentStructure();
        // Initialize the component
        this.initialize();
    }
    /**
     * Defines which attributes to observe for changes.
     * When these attributes change, attributeChangedCallback will be called.
     */
    static get observedAttributes() {
        return [
            'image-a',
            'image-b',
            'display-mode',
            'wipe-mode',
            'wipe-position-x',
            'wipe-position-y',
            'wipe-angle',
            'wipe-alpha',
            'magnifier-radius',
            'magnifier-zoom-factor',
            'magnifier-border-size',
            'checkerboard-square-size'
        ];
    }
    /**
     * Called when the element is connected to the DOM.
     * Sets up initial state and event listeners.
     */
    connectedCallback() {
        // Process initial attributes
        this.processAttributes();
        // Set initial canvas size
        this.updateCanvasSize();
        // Add resize observer to handle container size changes
        const resizeObserver = new ResizeObserver(() => {
            this.updateCanvasSize();
        });
        resizeObserver.observe(this);
        // Show help screen initially if no images are loaded
        this.updateHelpScreenVisibility();
    }
    /**
     * Helper method to get image-specific DOM elements and state properties.
     *
     * This method provides a centralized way to access all DOM elements and state
     * properties associated with a specific image (A or B), eliminating repetitive
     * conditional logic throughout the component. It returns a comprehensive object
     * containing all image-related references:
     *
     * **State Properties:**
     * - **isLoaded**: Boolean indicating whether the image is currently loaded
     * - **image**: The HTMLImageElement containing the loaded image data
     * - **imageData**: The ImageData object for pixel-level access and analysis
     *
     * **DOM Elements:**
     * - **coordsRgbaElement**: Span element displaying coordinates and RGBA values
     * - **filenameElement**: Span element showing the loaded image filename
     * - **uploadElement**: Div element representing the upload box UI
     * - **fileInputElement**: Hidden input element for file selection
     *
     * **Usage Pattern:**
     * This method eliminates the need for repetitive conditional statements like:
     * ```typescript
     * const element = imageType === 'A' ? this.elementA : this.elementB;
     * ```
     *
     * Instead, it provides a clean destructuring pattern:
     * ```typescript
     * const { isLoaded, image, coordsRgbaElement } = this.getImageElements(imageType);
     * ```
     *
     * **Type Safety:**
     * The method maintains type safety by using the ImageType parameter to
     * determine which set of elements to return, ensuring consistent access
     * patterns across the component.
     *
     * Factorized to reduce code duplication in image-related operations and
     * provide a consistent interface for accessing image-specific resources.
     *
     * @param imageType - The image identifier ('A' or 'B') to get elements for
     * @returns Object containing all DOM elements and state properties for the specified image
     *
     * @example
     * ```typescript
     * // Get all elements for image A
     * const { isLoaded, image, coordsRgbaElement } = this.getImageElements('A');
     *
     * // Use in conditional logic
     * if (isLoaded && image) {
     *     coordsRgbaElement.textContent = `[${x},${y}]=(${r},${g},${b},${a})`;
     * }
     * ```
     *
     * @see {@link updateImageInfo} - Primary consumer of this method
     */
    getImageElements(imageType) {
        // Determine if we're working with image A or B
        const isImageA = imageType === 'A';
        // Return object with all image-specific elements and state properties
        return {
            // State properties for the specified image
            isLoaded: isImageA ? this.state.imageALoaded : this.state.imageBLoaded,
            image: isImageA ? this.state.imageA : this.state.imageB,
            imageData: isImageA ? this.state.imageAData : this.state.imageBData,
            // DOM elements for the specified image
            coordsRgbaElement: isImageA ? this.coordsRgbaA : this.coordsRgbaB,
            filenameElement: isImageA ? this.filenameA : this.filenameB,
            uploadElement: isImageA ? this.uploadA : this.uploadB,
            fileInputElement: isImageA ? this.fileInputA : this.fileInputB
        };
    }
    /**
     * Helper method to parse and set numeric attribute values with validation.
     *
     * This method provides centralized handling for all numeric attributes in the
     * web component, eliminating code duplication and ensuring consistent parsing
     * and validation behavior. It implements a comprehensive attribute processing
     * workflow:
     *
     * **Input Validation:**
     * - Performs null/undefined checks to handle missing attribute values
     * - Uses parseFloat for robust numeric parsing that handles various formats
     * - Validates parsed values using isNaN to reject invalid numeric inputs
     * - Provides early return for invalid inputs to prevent error propagation
     *
     * **Attribute Processing:**
     * - Maps attribute names to their corresponding setter methods
     * - Maintains type safety through proper method delegation
     * - Supports all numeric configuration attributes of the component
     *
     * **Supported Attributes:**
     * - **wipe-position-x**: X coordinate for wipe line positioning
     * - **wipe-position-y**: Y coordinate for wipe line positioning
     * - **wipe-angle**: Rotation angle for wipe line in degrees
     * - **wipe-alpha**: Alpha blending factor (0-1) for wipe operations
     * - **magnifier-radius**: Radius of the magnification circle in pixels
     * - **magnifier-zoom-factor**: Zoom multiplier for magnification (0 to disable)
     *
     * **Error Handling:**
     * The method gracefully handles invalid inputs by returning early without
     * throwing exceptions, ensuring robust component behavior even with malformed
     * attribute values.
     *
     * Factorized to reduce code duplication in attributeChangedCallback and
     * provide consistent numeric attribute processing across the component.
     *
     * @param name - The name of the numeric attribute to process
     * @param value - The string value of the attribute to parse and apply
     *
     * @example
     * ```typescript
     * // Called internally during attribute change processing
     * this.setNumericAttribute('magnifier-radius', '150');
     * this.setNumericAttribute('wipe-alpha', '0.5');
     * this.setNumericAttribute('wipe-angle', '45');
     * ```
     *
     * @see {@link attributeChangedCallback} - Uses this method for numeric attribute processing
     */
    setNumericAttribute(name, value) {
        // Early return for null or undefined values
        if (!value)
            return;
        // Parse the string value to a floating-point number
        const numValue = parseFloat(value);
        // Validate the parsed number and return early if invalid
        if (isNaN(numValue))
            return;
        // Delegate to the appropriate setter method based on attribute name
        switch (name) {
            case 'wipe-position-x':
                this.setWipePositionX(numValue);
                break;
            case 'wipe-position-y':
                this.setWipePositionY(numValue);
                break;
            case 'wipe-angle':
                this.setWipeAngle(numValue);
                break;
            case 'wipe-alpha':
                this.setWipeAlpha(numValue);
                break;
            case 'magnifier-radius':
                this.setMagnifierRadius(numValue);
                break;
            case 'magnifier-zoom-factor':
                this.setMagnifierZoomFactor(numValue);
                break;
            case 'magnifier-border-size':
                this.setMagnifierBorderSize(numValue);
                break;
            case 'checkerboard-square-size':
                this.setCheckerboardSquareSize(numValue);
                break;
        }
    }
    /**
     * Called when observed attributes change.
     * Updates the component state based on attribute changes.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        switch (name) {
            case 'image-a':
                if (newValue)
                    this.loadImage(newValue, 'A');
                break;
            case 'image-b':
                if (newValue)
                    this.loadImage(newValue, 'B');
                break;
            case 'display-mode':
                if (newValue)
                    this.setDisplayMode(newValue);
                break;
            case 'wipe-mode':
                this.setWipeMode(newValue === 'simple');
                break;
            case 'wipe-position-x':
            case 'wipe-position-y':
            case 'wipe-angle':
            case 'wipe-alpha':
            case 'magnifier-radius':
            case 'magnifier-zoom-factor':
            case 'magnifier-border-size':
            case 'checkerboard-square-size':
                this.setNumericAttribute(name, newValue);
                break;
        }
    }
    /**
     * Creates the component structure in the shadow DOM.
     * This replicates the exact HTML structure from the original index.html
     * but encapsulated within the shadow DOM for isolation.
     */
    createComponentStructure() {
        // Add styles to shadow DOM - copied and adapted from original styles.css
        const style = document.createElement('style');
        style.textContent = this.getComponentStyles();
        this.shadow.appendChild(style);
        // Create the exact same structure as the original HTML
        const container = document.createElement('div');
        container.className = 'image-comparison-container';
        container.innerHTML = `
            <div id="canvas-container">
                <canvas id="imageCanvas"></canvas>
                <div id="magnifier-container" class="hidden">
                    <canvas id="magnifierCanvas"></canvas>
                </div>
                <div id="drag-message"></div>
                <div id="help-screen">
                    <h1>Image Comparison Element</h1>
                    <p>Upload images by clicking on the A or B boxes in the bottom banner</p>
                    <p>or drag and drop image files anywhere in the application:</p>
                    <ul>
                        <li>Drag and drop a single image anywhere (except B box): loads as image A</li>
                        <li>Drag and drop multiple images anywhere: loads first as A, second as B</li>
                        <li>Drag and drop directly onto A or B boxes: loads to that specific slot</li>
                    </ul>
                    <p>Use mouse wheel to zoom, click and drag to move both images.</p>
                    <p>Use Shift+click and drag to move only one image (A or B).</p>
                    <p>Press "v" for simple wipe, "w" for full wipe interface.</p>
                    <p>Press "u", "o", "d", "i" to change composite modes.</p>
                    <p>Press "a" to show only image A, "b" to show only image B.</p>
                    <p>Press "c" to toggle checkerboard background.</p>
                    <p>Press "r" to reset view (position, zoom, wipe settings).</p>
                    <p>Press "h" or "?" to toggle this help screen.</p>
                    <p id="magnifier-help">Hold Ctrl to show magnifying glass at mouse pointer position.</p>
                </div>
            </div>
            <div id="bottom-banner">
                <div class="banner-section">
                    <div id="upload-container">
                        <div id="upload-a" class="upload-box">
                            <span>A: </span>
                            <span id="filename-a">No file</span>
                            <span id="coords-rgba-a"></span>
                            <input type="file" id="file-a" accept="image/*" style="display:none">
                        </div>
                        <div id="upload-b" class="upload-box">
                            <span>B: </span>
                            <span id="filename-b">No file</span>
                            <span id="coords-rgba-b"></span>
                            <input type="file" id="file-b" accept="image/*" style="display:none">
                        </div>
                    </div>
                </div>
                <div class="banner-section">
                    <div id="psnr-info">PSNR: -</div>
                </div>
                <div class="banner-section">
                    <div id="mode-container">
                        <span>Mode: </span>
                        <span id="mode-info">Under</span>
                    </div>
                </div>
                <div class="banner-section">
                    <div id="help-info">Help: press "h"</div>
                </div>
            </div>
        `;
        this.shadow.appendChild(container);
    }
    /**
     * Returns the CSS styles for the component.
     * These styles are adapted from the original styles.css but scoped to the component.
     */
    getComponentStyles() {
        return `
            :host {
                display: block;
                width: 100%;
                height: 100%;
                min-height: 400px;
                font-family: Arial, sans-serif;
                color: #fff;
                background-color: #333;
                position: relative;
                overflow: hidden;
            }
            
            .image-comparison-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                position: relative;
            }
            
            #canvas-container {
                flex: 1;
                position: relative;
                overflow: hidden;
            }
            
            #imageCanvas {
                width: 100%;
                height: 100%;
                display: block;
                background-color: black;
                cursor: move;
            }
            
            #magnifier-container {
                position: absolute;
                width: var(--magnifier-diameter, 400px);
                height: var(--magnifier-diameter, 400px);
                border-radius: 50%;
                overflow: hidden;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                border: 2px solid white;
                cursor: none;
                will-change: transform;
                transform: translateZ(0);
                backface-visibility: hidden;
                z-index: 1000;
                background-color: black;
            }
            
            #magnifierCanvas {
                width: 100%;
                height: 100%;
                display: block;
            }
            
            .hidden {
                display: none;
            }
            
            #drag-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-size: 18px;
                z-index: 1000;
                pointer-events: none;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.3);
                max-width: 80%;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            #help-screen {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 40px;
                background-color: rgba(0, 0, 0, 0.6);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 100;
                text-align: center;
                padding: 15px;
                box-sizing: border-box;
                overflow-y: auto;
            }
            
            #help-screen h1 {
                font-size: 18px;
                margin-bottom: 15px;
                margin-top: 0;
            }
            
            #help-screen p {
                font-size: 12px;
                margin: 3px 0;
                max-width: 90%;
                line-height: 1.3;
            }
            
            #help-screen ul {
                text-align: left;
                max-width: 90%;
                font-size: 12px;
                margin: 8px 0;
                padding-left: 20px;
                line-height: 1.3;
            }
            
            #help-screen li {
                margin: 2px 0;
            }
            
            #magnifier-help {
                font-size: 12px;
                margin: 8px 0 3px 0;
                max-width: 90%;
                line-height: 1.3;
            }
            
            #bottom-banner {
                height: 40px;
                background-color: #222;
                display: flex;
                align-items: center;
                padding: 0 10px;
                box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.3);
                font-size: 12px;
            }
            
            .banner-section {
                margin-right: 10px;
                display: flex;
                align-items: center;
            }
            
            #upload-container {
                display: flex;
            }
            
            .upload-box {
                background-color: #555;
                padding: 5px 10px;
                margin-right: 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: background-color 0.2s;
                white-space: nowrap;
                font-size: 12px;
                min-width: 150px;
                flex-shrink: 0;
            }
            
            .upload-box:hover {
                background-color: #777;
            }
            
            .info-section {
                font-size: 12px;
                color: #fff;
            }
            
            #image-a-info, #image-b-info {
                margin-right: 5px;
            }
        `;
    }
    /**
     * Initialize the component after DOM structure is created.
     * Sets up DOM references, canvas context, and event listeners.
     */
    initialize() {
        // Get references to DOM elements within shadow DOM
        this.initDomReferences();
        // Initialize the canvas and context
        this.initCanvas();
        // Set up event listeners
        this.setupEventListeners();
    }
    /**
     * Initialize references to DOM elements within the shadow DOM.
     * This allows us to interact with the encapsulated elements.
     */
    initDomReferences() {
        this.state.canvas = this.shadow.getElementById('imageCanvas');
        this.magnifierContainer = this.shadow.getElementById('magnifier-container');
        this.magnifierCanvas = this.shadow.getElementById('magnifierCanvas');
        this.dragMessage = this.shadow.getElementById('drag-message');
        this.uploadA = this.shadow.getElementById('upload-a');
        this.uploadB = this.shadow.getElementById('upload-b');
        this.fileInputA = this.shadow.getElementById('file-a');
        this.fileInputB = this.shadow.getElementById('file-b');
        this.filenameA = this.shadow.getElementById('filename-a');
        this.filenameB = this.shadow.getElementById('filename-b');
        this.coordsRgbaA = this.shadow.getElementById('coords-rgba-a');
        this.coordsRgbaB = this.shadow.getElementById('coords-rgba-b');
        this.psnrInfo = this.shadow.getElementById('psnr-info');
        this.modeInfo = this.shadow.getElementById('mode-info');
        this.helpScreen = this.shadow.getElementById('help-screen');
        this.magnifierHelp = this.shadow.getElementById('magnifier-help');
    }
    /**
     * Initialize canvas and set up the rendering context.
     * This sets up the canvas for drawing operations.
     */
    initCanvas() {
        if (!this.state.canvas) {
            console.error('Canvas element not found');
            return;
        }
        // Get the 2D rendering context with alpha disabled for better performance
        this.state.ctx = this.state.canvas.getContext('2d', { alpha: false });
        if (!this.state.ctx) {
            console.error('Failed to get canvas context');
            return;
        }
    }
    /**
     * Process attributes when the element is connected or attributes change.
     * This reads the initial attribute values and applies them to the component.
     */
    processAttributes() {
        const imageA = this.getAttribute('image-a');
        const imageB = this.getAttribute('image-b');
        if (imageA)
            this.loadImage(imageA, 'A');
        if (imageB)
            this.loadImage(imageB, 'B');
        const displayMode = this.getAttribute('display-mode');
        if (displayMode)
            this.setDisplayMode(displayMode);
        const wipeMode = this.getAttribute('wipe-mode');
        if (wipeMode)
            this.setWipeMode(wipeMode === 'simple');
        const wipeX = this.getAttribute('wipe-position-x');
        const wipeY = this.getAttribute('wipe-position-y');
        if (wipeX)
            this.setWipePositionX(parseFloat(wipeX));
        if (wipeY)
            this.setWipePositionY(parseFloat(wipeY));
        const wipeAngle = this.getAttribute('wipe-angle');
        if (wipeAngle)
            this.setWipeAngle(parseFloat(wipeAngle));
        const wipeAlpha = this.getAttribute('wipe-alpha');
        if (wipeAlpha)
            this.setWipeAlpha(parseFloat(wipeAlpha));
        // Process magnifier attributes
        const magnifierRadius = this.getAttribute('magnifier-radius');
        if (magnifierRadius) {
            this.setMagnifierRadius(parseFloat(magnifierRadius));
        }
        const magnifierZoomFactor = this.getAttribute('magnifier-zoom-factor');
        if (magnifierZoomFactor) {
            this.setMagnifierZoomFactor(parseFloat(magnifierZoomFactor));
        }
        const magnifierBorderSize = this.getAttribute('magnifier-border-size');
        if (magnifierBorderSize) {
            this.setMagnifierBorderSize(parseFloat(magnifierBorderSize));
        }
        const checkerboardSquareSize = this.getAttribute('checkerboard-square-size');
        if (checkerboardSquareSize) {
            this.setCheckerboardSquareSize(parseFloat(checkerboardSquareSize));
        }
    }
    /**
     * Update canvas size based on container size.
     * This ensures the canvas matches the component's dimensions.
     */
    updateCanvasSize() {
        if (!this.state.canvas)
            return;
        const width = this.clientWidth;
        const height = this.clientHeight - 40; // Account for bottom banner
        if (width > 0 && height > 0) {
            this.state.canvas.width = width;
            this.state.canvas.height = height;
            if (this.magnifierCanvas) {
                this.magnifierCanvas.width = 400;
                this.magnifierCanvas.height = 400;
            }
            // Redraw with new size
            this.draw();
        }
    }
    /**
     * Update help screen visibility based on whether images are loaded and showHelp state.
     * Shows help screen when fewer than 2 images are loaded OR when manually toggled on.
     * Auto-hides when both images are loaded (unless manually toggled on).
     */
    updateHelpScreenVisibility() {
        const imagesLoaded = (this.state.imageALoaded ? 1 : 0) + (this.state.imageBLoaded ? 1 : 0);
        // Auto-hide help when both images are loaded for the first time
        if (imagesLoaded >= 2) {
            // If help was auto-shown (not manually toggled), hide it and set showHelp to false
            if (this.state.showHelp && !this.manuallyToggledHelp) {
                this.state.showHelp = false;
                this.helpScreen.style.display = 'none';
            }
            // If manually toggled on, keep it visible
            else if (this.state.showHelp) {
                this.helpScreen.style.display = 'flex';
            }
            // If manually toggled off, keep it hidden
            else {
                this.helpScreen.style.display = 'none';
            }
        }
        // Show help screen if fewer than 2 images are loaded
        else {
            this.helpScreen.style.display = 'flex';
            // Reset manual toggle flag when auto-showing
            this.manuallyToggledHelp = false;
        }
        // Update magnifier help visibility
        this.updateMagnifierHelpVisibility();
    }
    /**
     * Updates the visibility of the magnifier help text based on the current zoom factor.
     * Hides the help text when magnifier is disabled (zoom factor <= 0).
     */
    updateMagnifierHelpVisibility() {
        if (this.magnifierHelp) {
            if (this.state.magnifierZoomFactor && this.state.magnifierZoomFactor > 0) {
                this.magnifierHelp.style.display = 'block';
                // Update the help text to include the current zoom factor
                this.magnifierHelp.textContent = `Hold Ctrl to show magnifying glass (${this.state.magnifierZoomFactor}x zoom) at mouse pointer position.`;
            }
            else {
                this.magnifierHelp.style.display = 'none';
            }
        }
    }
    /**
     * Shared implementation for loading images A and B.
     *
     * @param url - The URL to load the image from (can be web URL or blob URL)
     * @param imageType - Which image slot to load into ('A' or 'B')
     * @param filename - Optional filename to display in UI (used for uploaded files)
     *
     * @returns Promise that resolves when image loading and processing is complete
     *
     * @throws Will reject the promise if image loading fails or processing encounters errors
     *
     * @remarks
     * This method performs the complete image loading pipeline:
     * 1. Image loading via HTML Image element
     * 2. Canvas-based pixel data extraction for analysis
     * 3. Mip-map generation for performance optimization
     * 4. UI updates with proper filename handling
     * 5. Layout adjustments and redraw operations
     *
     * The imageType parameter determines which state properties are updated,
     * allowing the same logic to handle both image A and image B loading.
     */
    async loadImage(url, imageType, filename) {
        // Log the loading operation for debugging and monitoring
        console.log(`Loading image ${imageType} from URL:`, url);
        // Create new Image element for loading - this provides better control than direct canvas loading
        const img = new Image();
        // Return a Promise to handle the asynchronous image loading process
        return new Promise((resolve, reject) => {
            // Configure success handler - called when image loads successfully
            img.onload = async () => {
                try {
                    // Store the loaded image in component state for rendering operations
                    // Update the appropriate state properties based on imageType
                    if (imageType === 'A') {
                        this.state.imageA = img;
                        this.state.imageALoaded = true;
                    }
                    else {
                        this.state.imageB = img;
                        this.state.imageBLoaded = true;
                    }
                    // Create temporary canvas for pixel data extraction
                    // This is necessary for pixel-level analysis operations like PSNR calculation
                    const tempCanvas = document.createElement('canvas');
                    // Set canvas dimensions to match the loaded image exactly
                    // This ensures pixel-perfect data extraction without scaling artifacts
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    // Verify canvas context creation succeeded before proceeding
                    if (tempCtx) {
                        // Draw the image to canvas at original size for pixel data extraction
                        // This creates the ImageData needed for analysis operations
                        tempCtx.drawImage(img, 0, 0);
                        // Extract pixel data for analysis operations (PSNR, color sampling, etc.)
                        // ImageData provides direct access to RGBA values for each pixel
                        // Store in the appropriate state property based on imageType
                        if (imageType === 'A') {
                            this.state.imageAData = tempCtx.getImageData(0, 0, img.width, img.height);
                        }
                        else {
                            this.state.imageBData = tempCtx.getImageData(0, 0, img.width, img.height);
                        }
                    }
                    // Generate mip-maps asynchronously for efficient rendering at different zoom levels
                    // Mip-maps provide pre-scaled versions of the image to improve performance
                    // and visual quality when zoomed out
                    const mipMaps = await (0,_mip_mapping__WEBPACK_IMPORTED_MODULE_0__.createMipMaps)(img);
                    if (imageType === 'A') {
                        this.state.imageAMipMaps = mipMaps;
                    }
                    else {
                        this.state.imageBMipMaps = mipMaps;
                    }
                    // Update filename display with intelligent fallback handling
                    // Priority: provided filename > URL extraction > default fallback
                    // This fixes the "Uploaded file" issue for drag-and-drop operations
                    const displayFilename = filename || this.extractFilename(url);
                    const filenameElement = imageType === 'A' ? this.filenameA : this.filenameB;
                    filenameElement.textContent = displayFilename;
                    // Update help screen visibility based on current loading state
                    // The help screen should hide when images are successfully loaded
                    this.updateHelpScreenVisibility();
                    // Perform automatic layout adjustments for optimal viewing experience
                    // Center the wipe position to provide balanced comparison view
                    this.centerWipePosition();
                    // Fit images to viewport for optimal initial viewing
                    // This ensures both images are visible and properly scaled
                    this.fitImagesToViewport();
                    // Trigger complete redraw with the newly loaded image
                    // This updates all visual elements including composite modes
                    this.draw();
                    // Calculate and update PSNR if both images are loaded
                    // PSNR provides quantitative comparison metrics
                    this.updatePSNR();
                    // Resolve the promise to indicate successful completion
                    resolve();
                }
                catch (error) {
                    // Handle any errors during image processing (mip-map generation, etc.)
                    console.error(`Error processing image ${imageType}:`, error);
                    reject(error);
                }
            };
            // Configure error handler for image loading failures
            img.onerror = (error) => {
                // Log the error for debugging purposes
                console.error(`Error loading image ${imageType}:`, error);
                // Update UI to show error state with helpful filename information
                // Extract filename from URL for better error messaging
                const filenameElement = imageType === 'A' ? this.filenameA : this.filenameB;
                filenameElement.textContent = "Error loading " + (url.split('/').pop() || url);
                // Reject the promise to indicate loading failure
                reject(error);
            };
            // Configure CORS handling for cross-origin images
            // This allows loading images from different domains when properly configured
            img.crossOrigin = 'anonymous';
            // Initiate the image loading process by setting the source URL
            // This triggers the onload or onerror handlers defined above
            img.src = url;
        });
    }
    /**
     * Set the display mode for image composition.
     * Updates the composite mode and redraws the canvas.
     */
    setDisplayMode(mode) {
        const previousMode = this.state.compositeMode;
        // Store previous mode if switching to A or B
        if ((mode === 'A' || mode === 'B') &&
            this.state.compositeMode !== 'A' && this.state.compositeMode !== 'B') {
            this.lastCompositeMode = this.state.compositeMode;
            // Store wipe settings when switching to A or B mode
            if (this.state.isWipeEnabled) {
                this.previousWipeAngle = this.state.wipeAngle;
                this.previousWipeAlpha = this.state.wipeAlpha;
            }
        }
        this.state.compositeMode = mode;
        this.modeInfo.textContent = mode;
        // When switching to A or B mode, disable wipe
        if (mode === 'A' || mode === 'B') {
            this.state.isWipeEnabled = false;
        }
        else {
            // When switching back to a composite mode, restore wipe
            this.state.isWipeEnabled = true;
            // Only restore wipe settings if coming from A or B mode
            // If already in a composite mode, keep current wipe settings
            if (previousMode === 'A' || previousMode === 'B') {
                if (this.state.isSimpleWipe) {
                    this.state.wipeAngle = 0; // Simple wipe always has angle 0
                }
                else {
                    this.state.wipeAngle = this.previousWipeAngle;
                    this.state.wipeAlpha = this.previousWipeAlpha;
                }
            }
            // If switching between composite modes, keep current wipe settings unchanged
        }
        this.draw();
    }
    /**
     * Set the wipe mode (simple or full).
     * Updates the wipe interface type and preserves angle and alpha settings.
     */
    setWipeMode(isSimple) {
        // Store the current wipe angle and alpha if switching to simple mode
        if (isSimple && !this.state.isSimpleWipe) {
            this.previousWipeAngle = this.state.wipeAngle;
            this.previousWipeAlpha = this.state.wipeAlpha;
        }
        this.state.isWipeEnabled = true;
        this.state.isSimpleWipe = isSimple;
        // If switching to simple mode, set angle to 0
        if (isSimple) {
            this.state.wipeAngle = 0;
            // Alpha remains the same in simple mode
        }
        else {
            // If switching back to full mode, restore the previous angle and alpha
            this.state.wipeAngle = this.previousWipeAngle;
            this.state.wipeAlpha = this.previousWipeAlpha;
        }
        // If we're in A or B mode, restore the previous composite mode
        if (this.state.compositeMode === 'A' || this.state.compositeMode === 'B') {
            this.state.compositeMode = this.lastCompositeMode;
            this.modeInfo.textContent = this.lastCompositeMode;
        }
        this.draw();
    }
    /**
     * Set the X position of the wipe line in image A coordinates.
     */
    setWipePositionX(x) {
        this.state.wipePositionInImageACoords.x = x;
        this.draw();
    }
    /**
     * Set the Y position of the wipe line in image A coordinates.
     */
    setWipePositionY(y) {
        this.state.wipePositionInImageACoords.y = y;
        this.draw();
    }
    /**
     * Set the angle of the wipe line in degrees.
     */
    setWipeAngle(angle) {
        this.state.wipeAngle = angle;
        this.previousWipeAngle = angle;
        this.draw();
    }
    /**
     * Set the alpha blending factor for the wipe interface.
     */
    setWipeAlpha(alpha) {
        alpha = Math.max(0, Math.min(1, alpha));
        this.state.wipeAlpha = alpha;
        this.previousWipeAlpha = alpha; // Store for mode switching
        this.draw();
    }
    /**
     * Sets the magnifier radius in pixels.
     *
     * @param radius - The radius of the magnifier in pixels
     */
    setMagnifierRadius(radius) {
        if (radius <= 0)
            return; // Prevent invalid values
        this.state.magnifierRadius = radius;
        // Update CSS variable for magnifier diameter (radius * 2)
        this.style.setProperty('--magnifier-diameter', `${radius * 2}px`);
        // Update magnifier if it's currently visible
        if (this.showMagnifier && this.lastMouseX !== 0 && this.lastMouseY !== 0) {
            this.updateMagnifier(this.lastMouseX, this.lastMouseY);
        }
    }
    /**
     * Sets the magnifier zoom factor.
     *
     * @param zoomFactor - The zoom factor for the magnifier (e.g., 8 for 8x zoom)
     *                    - Set to 0 or negative to disable the magnifier functionality
     */
    setMagnifierZoomFactor(zoomFactor) {
        this.state.magnifierZoomFactor = zoomFactor;
        // Update the help text to reflect the current zoom factor or hide it if disabled
        this.updateMagnifierHelpVisibility();
        // If zoom factor is <= 0, disable magnifier functionality
        if (zoomFactor <= 0 && this.showMagnifier) {
            this.showMagnifier = false;
            this.magnifierContainer.classList.add('hidden');
        }
        // Otherwise update magnifier if it's currently visible
        else if (zoomFactor > 0 && this.showMagnifier && this.lastMouseX !== 0 && this.lastMouseY !== 0) {
            this.updateMagnifier(this.lastMouseX, this.lastMouseY);
        }
    }
    /**
     * Sets the magnifier border size.
     *
     * @param borderSize - Border size of the magnifier in pixels
     *                   - Must be non-negative (0 or positive)
     *                   - Typical values: 0-5 pixels
     *                   - Default: 2 pixels
     */
    setMagnifierBorderSize(borderSize) {
        // Validate border size (must be non-negative)
        if (borderSize < 0) {
            console.warn('Magnifier border size must be non-negative, using default value of 2');
            borderSize = 2;
        }
        this.state.magnifierBorderSize = borderSize;
        // Update magnifier if it's currently visible
        if (this.showMagnifier && this.lastMouseX !== 0 && this.lastMouseY !== 0) {
            this.updateMagnifier(this.lastMouseX, this.lastMouseY);
        }
    }
    /**
     * Sets the checkerboard square size.
     *
     * @param squareSize - Size of checkerboard squares in pixels
     *                   - Must be positive (minimum 1 pixel)
     *                   - Typical values: 5-20 pixels
     *                   - Default: 10 pixels
     */
    setCheckerboardSquareSize(squareSize) {
        // Validate square size (must be positive)
        if (squareSize <= 0) {
            console.warn('Checkerboard square size must be positive, using default value of 10');
            squareSize = 10;
        }
        this.state.checkerboardSquareSize = squareSize;
        // Redraw if checkerboard is currently visible
        if (this.state.isCheckerboard) {
            this.draw();
        }
    }
    /**
     * Center the wipe position on the canvas.
     * Converts canvas center coordinates to image A coordinates.
     */
    centerWipePosition() {
        if (!this.state.canvas)
            return;
        // Get the center of the canvas in canvas coordinates
        const canvasCenterX = this.state.canvas.width / 2;
        const canvasCenterY = this.state.canvas.height / 2;
        // Convert canvas center to image A coordinates
        const imageCoords = this.canvasToImageCoords(canvasCenterX, canvasCenterY, 'A');
        // Update wipe position in image A coordinates
        this.state.wipePositionInImageACoords.x = imageCoords.x;
        this.state.wipePositionInImageACoords.y = imageCoords.y;
        // Update attributes to reflect the change
        this.setAttribute('wipe-position-x', imageCoords.x.toString());
        this.setAttribute('wipe-position-y', imageCoords.y.toString());
        // Redraw with the new wipe position
        this.draw();
    }
    /**
     * Fit images to viewport by adjusting scale and position.
     * Ensures images are visible and properly centered.
     */
    fitImagesToViewport() {
        if (!this.state.canvas || (!this.state.imageALoaded && !this.state.imageBLoaded))
            return;
        // Get image dimensions
        const imageWidth = this.state.imageALoaded ? this.state.imageA.width :
            (this.state.imageBLoaded ? this.state.imageB.width : 0);
        const imageHeight = this.state.imageALoaded ? this.state.imageA.height :
            (this.state.imageBLoaded ? this.state.imageB.height : 0);
        if (imageWidth === 0 || imageHeight === 0)
            return;
        // Calculate scale to fit
        const scaleX = this.state.canvas.width / imageWidth;
        const scaleY = this.state.canvas.height / imageHeight;
        // Use the smaller scale to ensure the entire image fits
        this.state.scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some margin
        // Center the images
        this.state.offsetX = (this.state.canvas.width - imageWidth * this.state.scale) / 2;
        this.state.offsetY = (this.state.canvas.height - imageHeight * this.state.scale) / 2;
    }
    /**
     * Update PSNR display using the component's isolated state.
     */
    updatePSNR() {
        const psnrText = (0,_analysis__WEBPACK_IMPORTED_MODULE_1__.calculatePSNRForImages)(this.state.imageAData, this.state.imageBData, this.state.imageA, this.state.imageB, this.state.offsetAX, this.state.offsetAY, this.state.offsetBX, this.state.offsetBY, this.state.scale);
        this.psnrInfo.textContent = psnrText;
    }
    /**
     * Sets up canvas mouse and wheel event listeners for image interaction.
     *
     * This method configures all canvas-related event handling within the web component,
     * enabling users to interact with the image comparison interface through mouse
     * and wheel operations. It establishes the complete canvas interaction system:
     *
     * **Mouse Event Handling:**
     * - **Mouse Down**: Initiates drag operations for image panning and wipe control
     * - **Mouse Move**: Handles active dragging, cursor tracking, and coordinate updates
     * - **Mouse Up**: Terminates drag operations and finalizes interactions
     * - **Mouse Leave**: Ensures drag operations are properly terminated when cursor exits canvas
     *
     * **Wheel Event Handling:**
     * - Configures zoom functionality with passive event prevention
     * - Enables smooth zooming centered on the mouse cursor position
     * - Maintains proper event handling for cross-browser compatibility
     *
     * **Component Integration:**
     * - Includes null safety check to prevent errors during initialization
     * - Properly binds event handlers to maintain component context
     * - Integrates with the component's state management system
     *
     * **Event Handler Binding:**
     * All event handlers are bound to the component instance to ensure proper
     * access to component state and methods during event processing.
     *
     * Factorized to reduce code duplication in setupEventListeners and provide
     * centralized canvas event configuration with proper error handling.
     *
     * @example
     * ```typescript
     * // Called during component initialization after canvas is available
     * this.setupCanvasEventListeners();
     * ```
     *
     * @see {@link handleMouseDown} - Processes mouse down events for drag initiation
     * @see {@link handleMouseMove} - Handles mouse movement for dragging and tracking
     * @see {@link handleMouseUp} - Terminates drag operations
     * @see {@link handleWheel} - Processes wheel events for zoom functionality
     */
    setupCanvasEventListeners() {
        // Ensure canvas is available before setting up event listeners
        if (!this.state.canvas)
            return;
        // Configure mouse down events for drag operation initiation
        this.state.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        // Configure mouse move events for dragging and coordinate tracking
        this.state.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        // Configure mouse up events for drag operation termination
        this.state.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // Configure mouse leave events to ensure drag operations end when cursor exits
        this.state.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        // Configure wheel events for zoom functionality with passive prevention
        this.state.canvas.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }
    /**
     * Sets up file upload event listeners for both image A and B upload boxes.
     *
     * This method configures the file upload user interface by establishing
     * event listeners for both image A and image B upload boxes within the
     * web component. It handles the complete file upload workflow:
     *
     * **Click Event Handling:**
     * - Configures upload box click events to trigger hidden file input dialogs
     * - Provides intuitive user interaction by making upload boxes clickable
     * - Maintains consistent behavior between both A and B upload boxes
     *
     * **File Selection Processing:**
     * - Sets up change event listeners on hidden file input elements
     * - Delegates file processing to specialized handler methods
     * - Ensures proper binding of event handler context to the component instance
     *
     * **Component Integration:**
     * - Integrates with the component's shadow DOM structure
     * - Maintains encapsulation by using component instance methods
     * - Provides consistent file upload behavior across component instances
     *
     * This method eliminates code duplication by centralizing the setup logic
     * that would otherwise be repeated for both upload boxes, while maintaining
     * the specialized behavior required for each image slot.
     *
     * Factorized to reduce code duplication in setupEventListeners and provide
     * a centralized location for file upload configuration within the component.
     *
     * @example
     * ```typescript
     * // Called during component initialization
     * this.setupFileUploadListeners();
     * ```
     *
     * @see {@link handleFileInputA} - Handles file selection for image A
     * @see {@link handleFileInputB} - Handles file selection for image B
     */
    setupFileUploadListeners() {
        // Configure upload box click handlers to trigger file selection dialogs
        this.uploadA.addEventListener('click', () => this.fileInputA.click());
        this.uploadB.addEventListener('click', () => this.fileInputB.click());
        // Configure file input change handlers with proper context binding
        this.fileInputA.addEventListener('change', this.handleFileInputA.bind(this));
        this.fileInputB.addEventListener('change', this.handleFileInputB.bind(this));
    }
    /**
     * Set up event listeners for the component.
     * This includes file uploads, canvas interactions, drag and drop, and keyboard events.
     */
    setupEventListeners() {
        if (!this.state.canvas)
            return;
        // File upload event listeners - factorized setup
        this.setupFileUploadListeners();
        // Canvas mouse event listeners - factorized setup
        this.setupCanvasEventListeners();
        // Drag and drop event listeners
        this.addEventListener('dragover', this.handleDragOver.bind(this));
        this.addEventListener('drop', this.handleDrop.bind(this));
        // Keyboard event listeners - only when this component has focus
        this.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.addEventListener('keyup', this.handleKeyUp.bind(this));
        // Make the component focusable
        this.tabIndex = 0;
        // Focus on mouse enter to capture keyboard events
        this.addEventListener('mouseenter', () => this.focus());
    }
    /**
     * Handle mouse down events on the canvas.
     * Starts dragging operations and handle interactions.
     */
    handleMouseDown(e) {
        e.preventDefault();
        // Get mouse position relative to canvas
        const rect = this.state.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Reset accumulated movement values
        this.accumulatedDX = 0;
        this.accumulatedDY = 0;
        // Check if clicking on wipe UI elements
        if (this.state.isWipeEnabled && this.state.imageALoaded && this.state.imageBLoaded) {
            const wipePos = (0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.getWipePositionInCanvasCoords)(this.state);
            // Check translation handle (center dot)
            const distToTranslation = Math.sqrt(Math.pow(x - wipePos.x, 2) +
                Math.pow(y - wipePos.y, 2));
            if (distToTranslation <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.TRANSLATION_HANDLE_RADIUS) {
                this.activeHandle = 'translation';
                this.dragStartX = x;
                this.dragStartY = y;
                this.state.canvas.style.cursor = 'grabbing';
                return;
            }
            // For full wipe interface, check additional handles
            if (!this.state.isSimpleWipe) {
                // Check rotation handle
                const { x: rotX, y: rotY } = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_5__.calculateRotationHandlePosition)(wipePos, this.state.wipeAngle);
                const distToRotation = Math.sqrt(Math.pow(x - rotX, 2) +
                    Math.pow(y - rotY, 2));
                if (distToRotation <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ROTATION_HANDLE_RADIUS) {
                    this.activeHandle = 'rotation';
                    this.dragStartX = x;
                    this.dragStartY = y;
                    this.state.canvas.style.cursor = 'grabbing';
                    return;
                }
                // Check alpha handle
                const alphaSliderPos = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_5__.calculateAlphaSliderPosition)(wipePos, this.state.wipeAngle, this.state.wipeAlpha);
                const alphaX = alphaSliderPos.x;
                const alphaY = alphaSliderPos.y;
                const distToAlpha = Math.sqrt(Math.pow(x - alphaX, 2) +
                    Math.pow(y - alphaY, 2));
                if (distToAlpha <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_HANDLE_RADIUS) {
                    this.activeHandle = 'alpha';
                    this.dragStartX = x;
                    this.dragStartY = y;
                    this.state.canvas.style.cursor = 'grabbing';
                    return;
                }
            }
        }
        // Start dragging images
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        // Determine which side was clicked for shift+drag
        if (e.shiftKey && this.state.isWipeEnabled &&
            this.state.imageALoaded && this.state.imageBLoaded) {
            const wipePos = (0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.getWipePositionInCanvasCoords)(this.state);
            const angle = this.state.wipeAngle * (Math.PI / 180);
            const mouseX = x - wipePos.x;
            const mouseY = y - wipePos.y;
            // Calculate which side of the wipe line we're on
            const dotProduct = mouseX * Math.cos(angle) + mouseY * Math.sin(angle);
            this.dragSide = dotProduct < 0 ? 'A' : 'B';
            this.state.canvas.style.cursor = 'grabbing';
        }
        else {
            this.state.canvas.style.cursor = 'move';
        }
    }
    /**
     * Handle mouse move events on the canvas.
     * Updates mouse info, handles dragging, and manages cursor states.
     */
    handleMouseMove(e) {
        const rect = this.state.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Store current mouse position
        this.lastMouseX = x;
        this.lastMouseY = y;
        // Update mouse position info and color values
        this.updateMouseInfo(x, y);
        // Handle wipe UI interaction
        if (this.activeHandle) {
            this.handleWipeUIInteraction(x, y);
            return;
        }
        // Handle dragging images
        if (this.isDragging) {
            const dx = e.clientX - this.dragStartX;
            const dy = e.clientY - this.dragStartY;
            if (e.shiftKey && this.state.isWipeEnabled &&
                this.state.imageALoaded && this.state.imageBLoaded && this.dragSide) {
                // Move only one image - accumulate fractional movements
                this.accumulatedDX += dx / this.state.scale;
                this.accumulatedDY += dy / this.state.scale;
                // Apply integer pixel movements
                const intDX = Math.round(this.accumulatedDX);
                const intDY = Math.round(this.accumulatedDY);
                if (intDX !== 0 || intDY !== 0) {
                    if (this.dragSide === 'A') {
                        // Move only image A by integer pixels scaled appropriately
                        this.state.offsetAX += intDX * this.state.scale;
                        this.state.offsetAY += intDY * this.state.scale;
                    }
                    else {
                        // Move only image B by integer pixels scaled appropriately
                        this.state.offsetBX += intDX * this.state.scale;
                        this.state.offsetBY += intDY * this.state.scale;
                    }
                    // Remove the applied movement from accumulated values
                    this.accumulatedDX -= intDX;
                    this.accumulatedDY -= intDY;
                    this.draw();
                    this.updatePSNR();
                }
            }
            else {
                // Move both images together
                this.state.offsetX += dx;
                this.state.offsetY += dy;
                this.draw();
            }
            // Update drag start position for next movement
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
        }
        else {
            // Update cursor based on what's under the mouse
            this.updateCursor(x, y, e.shiftKey);
        }
        // Handle magnifier
        if ((e.ctrlKey || e.metaKey) && this.state.magnifierZoomFactor && this.state.magnifierZoomFactor > 0) {
            this.showMagnifier = true;
            this.updateMagnifier(x, y);
        }
        else {
            this.showMagnifier = false;
            this.magnifierContainer.classList.add('hidden');
        }
    }
    /**
     * Handle mouse up events - stops dragging operations.
     */
    handleMouseUp(_e) {
        this.isDragging = false;
        this.activeHandle = null;
        this.dragSide = null;
        this.showMagnifier = false;
        this.magnifierContainer.classList.add('hidden');
        // Reset cursor
        if (this.state.canvas) {
            this.state.canvas.style.cursor = 'move';
        }
    }
    /**
     * Handle wheel events for zooming.
     * Uses the original zoom calculation for smooth trackpad support.
     */
    handleWheel(e) {
        e.preventDefault();
        // Do nothing if no images are loaded
        if (!this.state.imageALoaded && !this.state.imageBLoaded)
            return;
        const rect = this.state.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Store old scale for ratio calculation
        const oldScale = this.state.scale;
        // Use the original zoom calculation for smooth trackpad support
        // zoomPerWheelDelta = 1.00152 provides smooth zooming on trackpads
        const zoomPerWheelDelta = 1.00152;
        const zoomFactor = Math.pow(zoomPerWheelDelta, -e.deltaY);
        // Apply the calculated zoom factor to the current scale
        this.state.scale *= zoomFactor;
        // Calculate the scale ratio between new and old scale
        // This is used to adjust offsets proportionally
        const scaleRatio = this.state.scale / oldScale;
        // Update the global offset to keep the mouse point fixed during zoom
        // This creates the effect of zooming centered on the mouse position
        // The formula ensures that the point under the mouse remains stationary
        this.state.offsetX = mouseX - scaleRatio * (mouseX - this.state.offsetX);
        this.state.offsetY = mouseY - scaleRatio * (mouseY - this.state.offsetY);
        // Scale the individual image offsets by the same ratio
        // This maintains the relative positioning of images A and B
        this.state.offsetAX *= scaleRatio;
        this.state.offsetAY *= scaleRatio;
        this.state.offsetBX *= scaleRatio;
        this.state.offsetBY *= scaleRatio;
        // Redraw the canvas with the new scale and offsets
        this.draw();
        // Update magnifier if it's currently active to reflect the new zoom level
        // The magnifier content needs to be refreshed when the underlying scale changes
        if (this.showMagnifier) {
            this.updateMagnifier(mouseX, mouseY);
        }
    }
    /**
     * Handle wipe UI interactions (dragging handles).
     * Matches the original handleWipeUIInteraction function exactly.
     */
    handleWipeUIInteraction(x, y) {
        const wipePos = (0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.getWipePositionInCanvasCoords)(this.state);
        if (this.activeHandle === 'translation') {
            // Update image coordinates directly - match original exactly
            // Canvas coordinates will be computed on-demand from these
            this.state.wipePositionInImageACoords = this.canvasToImageCoords(x, y, 'A');
        }
        else if (this.activeHandle === 'rotation') {
            // Calculate angle from wipe position to mouse position
            const dx = x - wipePos.x;
            const dy = y - wipePos.y;
            // Convert from radians to degrees (0° is right, 90° is down)
            this.state.wipeAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        }
        else if (this.activeHandle === 'alpha') {
            // Calculate angle from wipe position to mouse position
            const dx = x - wipePos.x;
            const dy = y - wipePos.y;
            // Calculate the absolute angle in degrees from the wipe center to the mouse position
            // atan2 returns angle in radians (-π to π), convert to degrees (-180° to 180°)
            const clickAngle = Math.atan2(dy, dx) * (180 / Math.PI);
            // Calculate relative angle from the wipe angle
            // This gives us the angle in the wipe's coordinate system where:
            // - 0° is along the wipe line
            // - 90° is perpendicular to the wipe line
            // Add 360° and use modulo to ensure the result is in the range 0-360°
            const relativeAngle = 360 - ((clickAngle - this.state.wipeAngle + 360) % 360);
            // Map the angle to alpha value:
            // - The alpha slider arc spans from 20° to 70° relative to the wipe line
            // - 20° corresponds to alpha = 1.0 (fully opaque)
            // - 70° corresponds to alpha = 0.0 (fully transparent)
            if (relativeAngle >= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE && relativeAngle <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_START_ANGLE) {
                // Linear mapping from angle to alpha within the valid range
                // Formula: alpha = 1 - (angle - minAngle) / (maxAngle - minAngle)
                this.state.wipeAlpha = 1 - ((relativeAngle - _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE) / (_ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_START_ANGLE - _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE));
            }
            else if (relativeAngle < _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_START_ANGLE || relativeAngle > ((_ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_START_ANGLE + _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE) / 2 + 180) % 360) {
                // If the angle is less than 20° or greater than 225°,
                // set to maximum alpha (1.0)
                // This creates a "snap to max" behavior when the mouse is in these regions
                this.state.wipeAlpha = 1;
            }
            else if (relativeAngle > _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_ARC_END_ANGLE) {
                // If the angle is greater than 70° but less than 225°,
                // set to minimum alpha (0.0)
                // This creates a "snap to min" behavior when the mouse is in this region
                this.state.wipeAlpha = 0;
            }
        }
        // Redraw the canvas with the updated wipe settings
        this.draw();
    }
    /**
     * Updates position and RGBA information for a specific image at the given canvas coordinates.
     *
     * This shared function handles the common logic for both image A and image B information display,
     * eliminating code duplication while maintaining type safety and proper state management.
     * The function calculates image coordinates, validates bounds, extracts pixel data, and updates
     * the corresponding DOM elements with position and color information.
     *
     * @param x - Canvas X coordinate where the mouse is positioned
     * @param y - Canvas Y coordinate where the mouse is positioned
     * @param imageType - Which image to process ('A' or 'B')
     *
     * @remarks
     * This method performs several operations:
     * 1. Converts canvas coordinates to image coordinates
     * 2. Validates that coordinates are within image bounds
     * 3. Extracts RGBA pixel data at the specified location
     * 4. Updates position and color display elements
     * 5. Handles edge cases with appropriate fallback values
     *
     * The function uses conditional logic to access the correct state properties
     * and DOM elements based on the imageType parameter, ensuring type safety
     * while sharing the common coordinate and pixel extraction logic.
     *
     * @example
     * ```typescript
     * // Update info for image A
     * this.updateImageInfo(mouseX, mouseY, 'A');
     *
     * // Update info for image B
     * this.updateImageInfo(mouseX, mouseY, 'B');
     * ```
     */
    updateImageInfo(x, y, imageType) {
        // Get image-specific elements and state using factorized helper
        const { isLoaded, image, imageData, coordsRgbaElement } = this.getImageElements(imageType);
        // Process image information if the image is loaded and available
        if (isLoaded && image) {
            // Convert canvas coordinates to image coordinates for the specified image type
            const imageCoords = this.canvasToImageCoords(x, y, imageType);
            const imageX = Math.floor(imageCoords.x);
            const imageY = Math.floor(imageCoords.y);
            // Extract and display RGBA values if image data is available and coordinates are valid
            if (imageData &&
                imageCoords.x >= 0 && imageCoords.x < image.width &&
                imageCoords.y >= 0 && imageCoords.y < image.height) {
                // Calculate pixel index in the ImageData array (4 bytes per pixel: RGBA)
                const pixelIndex = (imageY * image.width + imageX) * 4;
                // Extract individual color channel values from the ImageData
                const r = String(imageData.data[pixelIndex]).padStart(3, '0');
                const g = String(imageData.data[pixelIndex + 1]).padStart(3, '0');
                const b = String(imageData.data[pixelIndex + 2]).padStart(3, '0');
                const a = String(imageData.data[pixelIndex + 3]).padStart(3, '0');
                // Display the combined coordinates and RGBA values in the requested format
                coordsRgbaElement.textContent = ` [${imageX},${imageY}]=(${r},${g},${b},${a})`;
            }
            else {
                // Display placeholder when coordinates are outside image bounds
                coordsRgbaElement.textContent = ` [${imageX},${imageY}]=(-,-,-,-)`;
            }
        }
        else {
            // Clear display when image is not loaded
            coordsRgbaElement.textContent = '';
        }
    }
    /**
     * Update mouse information display and cursor.
     */
    updateMouseInfo(x, y) {
        // Update position and color information for both images using the shared function
        // This eliminates code duplication while maintaining identical functionality
        this.updateImageInfo(x, y, 'A');
        this.updateImageInfo(x, y, 'B');
    }
    /**
     * Updates the mouse cursor appearance based on the current mouse position and interaction context.
     *
     * This method determines the appropriate cursor style by analyzing what UI elements or interactive
     * areas are under the mouse pointer. It handles various cursor states including:
     * - Move cursor for general canvas interaction
     * - Grab cursor for interactive handles (wipe controls)
     * - Grabbing cursor during active drag operations
     * - Hidden cursor when magnifier is active
     *
     * The cursor update is skipped entirely when the magnifier is active to maintain the hidden
     * cursor state that provides a clean magnification experience without visual distractions.
     *
     * @param x - Mouse X coordinate in canvas coordinate system
     * @param y - Mouse Y coordinate in canvas coordinate system
     * @param shiftKey - Whether the Shift key is currently pressed (affects cursor for image-specific dragging)
     *
     * @remarks
     * This method is called frequently during mouse movement and must be performant. It uses
     * early returns to avoid unnecessary calculations when the magnifier is active or when
     * the canvas is not available.
     *
     * @example
     * ```typescript
     * // Called from mouse move handler
     * this.updateCursor(mouseX, mouseY, event.shiftKey);
     * ```
     */
    updateCursor(x, y, shiftKey) {
        // Early exit if canvas is not available - prevents null reference errors
        if (!this.state.canvas)
            return;
        // Critical: Don't update cursor when magnifier is active - it should stay hidden
        // The magnifier provides a clean viewing experience without cursor distractions
        // This prevents the updateCursor method from overriding the 'none' cursor style
        // that was set when the magnifier was activated via Control key press
        if (this.showMagnifier) {
            return;
        }
        // Default cursor for general canvas interaction - indicates draggable content
        let cursor = 'move';
        // Check if over a wipe handle
        if (this.state.isWipeEnabled && this.state.imageALoaded && this.state.imageBLoaded) {
            const wipePos = (0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.getWipePositionInCanvasCoords)(this.state);
            // Check translation handle (center dot) - available in both simple and full wipe modes
            const distToCenter = Math.sqrt(Math.pow(x - wipePos.x, 2) +
                Math.pow(y - wipePos.y, 2));
            if (distToCenter <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.TRANSLATION_HANDLE_RADIUS) {
                cursor = 'grab';
            }
            else if (!this.state.isSimpleWipe) {
                // For full wipe interface, check additional handles
                // Check rotation handle
                const { x: rotX, y: rotY } = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_5__.calculateRotationHandlePosition)(wipePos, this.state.wipeAngle);
                const distToRotHandle = Math.sqrt(Math.pow(x - rotX, 2) +
                    Math.pow(y - rotY, 2));
                if (distToRotHandle <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ROTATION_HANDLE_RADIUS) {
                    cursor = 'grab';
                }
                else {
                    // Check alpha handle
                    const alphaSliderPos = (0,_ui_constants__WEBPACK_IMPORTED_MODULE_5__.calculateAlphaSliderPosition)(wipePos, this.state.wipeAngle, this.state.wipeAlpha);
                    const alphaX = alphaSliderPos.x;
                    const alphaY = alphaSliderPos.y;
                    const distToAlphaHandle = Math.sqrt(Math.pow(x - alphaX, 2) +
                        Math.pow(y - alphaY, 2));
                    if (distToAlphaHandle <= _ui_constants__WEBPACK_IMPORTED_MODULE_5__.UI_CONSTANTS.ALPHA_HANDLE_RADIUS) {
                        cursor = 'grab';
                    }
                }
            }
        }
        // Modify cursor for shift key
        if (shiftKey && this.state.isWipeEnabled &&
            this.state.imageALoaded && this.state.imageBLoaded) {
            cursor = 'grab';
        }
        this.state.canvas.style.cursor = cursor;
    }
    /**
     * Update magnifier position and content.
     */
    updateMagnifier(x, y) {
        if (!this.showMagnifier)
            return;
        // Position and render the magnifier using the dedicated module
        (0,_magnifier__WEBPACK_IMPORTED_MODULE_4__.updateMagnifier)(this.magnifierContainer, this.magnifierCanvas, x, y, this.state);
        this.magnifierContainer.classList.remove('hidden');
    }
    /**
     * Handle drag over events for file dropping.
     */
    handleDragOver(e) {
        e.preventDefault();
        if (e.dataTransfer?.types.includes('Files')) {
            this.dragMessage.textContent = 'Drop images to load';
            this.dragMessage.style.opacity = '1';
        }
    }
    /**
     * Handle drop events for file dropping.
     */
    handleDrop(e) {
        e.preventDefault();
        this.dragMessage.style.opacity = '0';
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const target = e.target;
            if (target === this.uploadA || this.uploadA.contains(target)) {
                const file = e.dataTransfer.files[0];
                const url = URL.createObjectURL(file);
                this.loadImage(url, 'A', file.name);
            }
            else if (target === this.uploadB || this.uploadB.contains(target)) {
                const file = e.dataTransfer.files[0];
                const url = URL.createObjectURL(file);
                this.loadImage(url, 'B', file.name);
            }
            else {
                // Drop anywhere else - load first as A, second as B
                if (e.dataTransfer.files.length >= 1) {
                    const fileA = e.dataTransfer.files[0];
                    const urlA = URL.createObjectURL(fileA);
                    this.loadImage(urlA, 'A', fileA.name);
                }
                if (e.dataTransfer.files.length >= 2) {
                    const fileB = e.dataTransfer.files[1];
                    const urlB = URL.createObjectURL(fileB);
                    this.loadImage(urlB, 'B', fileB.name);
                }
            }
        }
    }
    /**
     * Handle keyboard events - only when component has focus.
     */
    handleKeyDown(e) {
        // Prevent default to avoid browser shortcuts
        e.preventDefault();
        switch (e.key.toLowerCase()) {
            case 'v':
                // Simple wipe mode
                if (this.state.isSimpleWipe) {
                    // Already in simple wipe, center the wipe
                    this.centerWipePosition();
                }
                else {
                    this.setWipeMode(true);
                }
                break;
            case 'w':
                // Full wipe mode
                if (!this.state.isSimpleWipe && this.state.isWipeEnabled) {
                    // Already in full wipe, center the wipe
                    this.centerWipePosition();
                }
                else {
                    this.setWipeMode(false);
                }
                break;
            case 'a':
                this.setDisplayMode('A');
                break;
            case 'b':
                this.setDisplayMode('B');
                break;
            case 'u':
                this.setDisplayMode('Under');
                break;
            case 'o':
                this.setDisplayMode('OnionSkin');
                break;
            case 'd':
                this.setDisplayMode('Diff');
                break;
            case 'i':
                this.setDisplayMode('InvDiff');
                break;
            case 'c':
                this.state.isCheckerboard = !this.state.isCheckerboard;
                this.draw();
                break;
            case 'r':
                // Reset view
                this.resetView();
                break;
            case 'h':
            case '?':
                // Toggle help screen
                this.state.showHelp = !this.state.showHelp;
                this.manuallyToggledHelp = true;
                this.updateHelpScreenVisibility();
                break;
            case 'control':
                // Show magnifier only if zoom factor is greater than 0
                if (this.state.magnifierZoomFactor && this.state.magnifierZoomFactor > 0) {
                    this.showMagnifier = true;
                    this.magnifierContainer.classList.remove('hidden');
                    // Hide cursor when magnifier is active
                    this.state.canvas.style.cursor = 'none';
                    // Use the last known mouse position
                    if (this.lastMouseX !== 0 && this.lastMouseY !== 0) {
                        this.updateMagnifier(this.lastMouseX, this.lastMouseY);
                    }
                    else if (this.state.canvas) {
                        // If no mouse position is known, use the center of the canvas
                        const x = this.state.canvas.width / 2;
                        const y = this.state.canvas.height / 2;
                        this.updateMagnifier(x, y);
                    }
                }
                break;
        }
    }
    /**
     * Handle key up events.
     */
    handleKeyUp(e) {
        // Update cursor when shift key is released
        if (e.key === 'Shift') {
            this.updateCursor(this.lastMouseX, this.lastMouseY, false);
        }
        else if (e.key.toLowerCase() === 'control') {
            // Hide magnifier when Control key is released
            this.showMagnifier = false;
            this.magnifierContainer.classList.add('hidden');
            // Restore appropriate cursor
            this.updateCursor(this.lastMouseX, this.lastMouseY, false);
        }
    }
    /**
     * Extract filename from URL, handling blob URLs properly.
     */
    extractFilename(url) {
        // If it's a blob URL, we can't extract the original filename
        if (url.startsWith('blob:')) {
            return 'Uploaded file';
        }
        // For regular URLs, extract the filename
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        // Remove query parameters if present
        const cleanFilename = filename.split('?')[0];
        return cleanFilename || 'Unknown file';
    }
    /**
     * Reset view to fit images and center wipe.
     * Matches the original resetView function exactly.
     */
    resetView() {
        // Do nothing if no images are loaded
        if (!this.state.imageALoaded && !this.state.imageBLoaded)
            return;
        // Reset zoom and position
        this.state.scale = 1;
        this.state.offsetX = 0;
        this.state.offsetY = 0;
        this.state.offsetAX = 0;
        this.state.offsetAY = 0;
        this.state.offsetBX = 0;
        this.state.offsetBY = 0;
        // Reset wipe settings
        this.state.wipeAngle = 0;
        this.state.wipeAlpha = 1;
        this.state.isSimpleWipe = false;
        // Update attributes to reflect reset state
        this.setAttribute('wipe-angle', '0');
        this.setAttribute('wipe-alpha', '1');
        this.setAttribute('wipe-mode', 'full');
        // Center the image(s) - match original logic exactly
        if (this.state.imageALoaded && this.state.imageA && this.state.canvas) {
            // Center image A
            const targetWidth = this.state.imageA.width;
            const targetHeight = this.state.imageA.height;
            // Calculate scale to fit 90% of the canvas
            this.state.scale = Math.min(this.state.canvas.width / targetWidth, this.state.canvas.height / targetHeight) * 0.9;
            // Center the image
            this.state.offsetX = (this.state.canvas.width - targetWidth * this.state.scale) / 2;
            this.state.offsetY = (this.state.canvas.height - targetHeight * this.state.scale) / 2;
        }
        else if (this.state.imageBLoaded && this.state.imageB && this.state.canvas) {
            // Center image B
            const targetWidth = this.state.imageB.width;
            const targetHeight = this.state.imageB.height;
            // Calculate scale to fit 90% of the canvas
            this.state.scale = Math.min(this.state.canvas.width / targetWidth, this.state.canvas.height / targetHeight) * 0.9;
            // Center the image
            this.state.offsetX = (this.state.canvas.width - targetWidth * this.state.scale) / 2;
            this.state.offsetY = (this.state.canvas.height - targetHeight * this.state.scale) / 2;
        }
        // Set wipe position to center of image A
        if (this.state.imageALoaded && this.state.canvas) {
            this.centerWipePosition();
        }
        // Redraw the canvas and update PSNR
        this.draw();
        this.updatePSNR();
    }
    // Placeholder methods for file input handling and coordinate conversion
    /**
     * Generic file input handler that processes file selection for both image A and B.
     *
     * This method provides a unified approach to handling file input events from
     * both upload boxes within the web component, eliminating code duplication and
     * ensuring consistent file processing behavior. It performs comprehensive
     * file handling operations:
     *
     * **Input Validation and Safety:**
     * - Safely casts the event target to HTMLInputElement for type safety
     * - Verifies that files exist and at least one file was selected
     * - Provides robust error handling for invalid or missing file inputs
     *
     * **File Processing Workflow:**
     * 1. **File Extraction**: Safely extracts the first selected file from the input
     * 2. **URL Generation**: Creates an object URL for the file to enable loading
     * 3. **Image Loading**: Delegates to the loadImage method with proper parameters
     * 4. **Filename Preservation**: Passes the original filename for display purposes
     *
     * **Component Integration:**
     * - Integrates seamlessly with the component's image loading system
     * - Maintains proper context and state management within the component
     * - Supports both A and B image slots through the imageType parameter
     *
     * **Memory Management:**
     * The method creates object URLs that should be properly cleaned up by the
     * loadImage method to prevent memory leaks from accumulated blob URLs.
     *
     * Factorized from separate handleFileInputA and handleFileInputB methods
     * to reduce code duplication and provide a single point of maintenance
     * for file input processing logic within the component.
     *
     * @param e - The file input change event containing the selected file(s)
     * @param imageType - The target image slot ('A' or 'B') for the loaded image
     *
     * @example
     * ```typescript
     * // Used internally by the component for both A and B file inputs
     * this.handleFileInput(event, 'A'); // Load into image A slot
     * this.handleFileInput(event, 'B'); // Load into image B slot
     * ```
     *
     * @see {@link loadImage} - The method that actually loads and processes the image file
     * @see {@link handleFileInputA} - Wrapper method for image A file input
     * @see {@link handleFileInputB} - Wrapper method for image B file input
     */
    handleFileInput(e, imageType) {
        // Cast the event target to HTMLInputElement for type safety and access to files
        const input = e.target;
        // Verify that files exist and at least one file was selected
        if (input.files && input.files[0]) {
            const file = input.files[0]; // Extract the first selected file
            const url = URL.createObjectURL(file); // Create object URL for loading
            // Load the image with the generated URL, target slot, and original filename
            this.loadImage(url, imageType, file.name);
        }
    }
    /**
     * Handles file input events specifically for image A upload box.
     *
     * This method serves as a specialized wrapper around the generic handleFileInput
     * method, providing a dedicated entry point for image A file selection events.
     * It maintains the existing method signature for backward compatibility while
     * leveraging the factorized file handling logic.
     *
     * @param e - The file input change event from the image A file input element
     *
     * @see {@link handleFileInput} - The generic file handler this method delegates to
     */
    handleFileInputA(e) {
        this.handleFileInput(e, 'A');
    }
    /**
     * Handles file input events specifically for image B upload box.
     *
     * This method serves as a specialized wrapper around the generic handleFileInput
     * method, providing a dedicated entry point for image B file selection events.
     * It maintains the existing method signature for backward compatibility while
     * leveraging the factorized file handling logic.
     *
     * @param e - The file input change event from the image B file input element
     *
     * @see {@link handleFileInput} - The generic file handler this method delegates to
     */
    handleFileInputB(e) {
        this.handleFileInput(e, 'B');
    }
    /**
     * Convert canvas coordinates to image coordinates.
     * @param canvasX - X coordinate in canvas space
     * @param canvasY - Y coordinate in canvas space
     * @param imageType - Which image coordinate system to use
     * @returns Image coordinates
     */
    canvasToImageCoords(canvasX, canvasY, imageType) {
        return (0,_coordinates__WEBPACK_IMPORTED_MODULE_2__.canvasToImageCoords)(canvasX, canvasY, imageType, this.state);
    }
    /**
     * Draw the canvas using the comprehensive drawing module.
     */
    draw() {
        if (!this.state.ctx || !this.state.canvas)
            return;
        // Use the comprehensive drawing module
        (0,_drawing__WEBPACK_IMPORTED_MODULE_3__.draw)(this.state);
    }
}
// Register the custom element
customElements.define('image-comparison', ImageComparisonElement);
//# sourceMappingURL=image-comparison-element.js.map
})();

/******/ })()
;
//# sourceMappingURL=image-comparison-element.js.map