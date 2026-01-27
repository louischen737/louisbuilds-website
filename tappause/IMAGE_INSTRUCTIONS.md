# Pause Symbol Image Instructions

## Required Image: `pause-symbol.png`

This image is referenced in `index.html` and is the **only visual element** on the marketing page.

## Image Requirements

### Content
- **App Home Screen Screenshot**: Take a screenshot of the TapPause home screen
- **Pause Symbol**: The white pause symbol (two vertical bars) centered on dark background
- **Background**: Dark gray (#1C1C1E) - same as app background

### Technical Specs
- **Format**: PNG (with transparency if needed)
- **Dimensions**: Square or near-square (recommended: 800x800px or 1200x1200px for Retina)
- **Quality**: Retina/2x resolution
- **File Size**: Optimize for web (< 200KB recommended)

### Visual Requirements
- ✅ **DO**: 
  - Dark background (#1C1C1E)
  - White pause symbol centered
  - Clean, minimal appearance
  - High resolution for Retina displays

- ❌ **DON'T**:
  - No phone frame/border
  - No shadows or effects
  - No animations (static image only)
  - No additional UI elements
  - No text or labels

## How to Create

### Option 1: Screenshot from Simulator/Device
1. Open TapPause app on iOS Simulator or device
2. Navigate to home screen (pause symbol visible)
3. Take screenshot (Cmd+S on Simulator, or device screenshot)
4. Crop to show only the pause symbol area
5. Remove any phone frame/chrome
6. Ensure background is solid #1C1C1E
7. Save as `pause-symbol.png` in this directory

### Option 2: Design Tool
1. Create 800x800px canvas
2. Fill background with #1C1C1E
3. Add white pause symbol (two vertical bars) centered
4. Export as PNG
5. Save as `pause-symbol.png` in this directory

## File Location

Save the image as:
```
website/tappause/pause-symbol.png
```

## Testing

After adding the image:
1. Open `index.html` locally in browser
2. Verify image displays correctly
3. Check that image is centered
4. Ensure image quality is sharp on Retina displays
