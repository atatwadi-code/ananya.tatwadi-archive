# Typography Playground

A browser-based creative playground for experimenting with typography, combining the power of Google Fonts with intuitive animation controls inspired by p5.js, Variable Fonts UI, and After Effects keyframes.

## Features

### 🔤 Font Management
- **Google Fonts Integration**: Browse and select from popular Google Fonts
- **Real-time Font Loading**: Fonts load dynamically as you select them
- **Search Functionality**: Quickly find fonts using the search bar

### 🎨 Style Controls
Typography controls:
- Font size (12-200px)
- Font weight (100-900)
- Letter spacing
- Line height
- Color picker

Transform controls:
- Rotation (-180° to 180°)
- Scale X/Y (0.1x to 3x)
- Opacity (0-100%)
- Position (draggable on canvas)

### 🎬 Animation System
- **Keyframe-based Timeline**: Create animations by setting keyframes at different points in time
- **Smooth Interpolation**: Automatic smooth transitions between keyframes
- **Playback Controls**: Play, pause, and scrub through your animation
- **Visual Timeline**: Click anywhere on the timeline to jump to that point
- **Keyframe Management**: Add, delete, and navigate between keyframes

### 🖼️ Canvas Preview
- **Live Preview**: See changes in real-time as you adjust controls
- **Grid Background**: Visual reference grid for positioning
- **Centered Layout**: Text is positioned at the center by default

## How to Use

### Basic Text Editing
1. Enter your text in the text area
2. Search and select a font from Google Fonts
3. Adjust typography and transform controls to style your text

### Creating Animations
1. Set your initial text style at time 0s
2. Move the playhead to a different point in time using the timeline
3. Adjust the style controls to create a different look
4. Click "+ Keyframe" to create a keyframe at the current time
5. Repeat to create multiple keyframes
6. Click the play button to see your animation

### Timeline Controls
- **⏮ Reset**: Jump back to the start of the animation
- **▶/⏸ Play/Pause**: Play or pause the animation
- **+ Keyframe**: Add a keyframe at the current playhead position
- **Click Timeline**: Jump to any point in time
- **Click Keyframe Diamond**: Jump to that specific keyframe
- **Hover & Delete (×)**: Remove unwanted keyframes

## Technical Details

### Animation Interpolation
The playground uses linear interpolation between keyframes for smooth transitions. All numeric properties (size, weight, spacing, transforms, etc.) are smoothly animated, while color values transition at the midpoint.

### Font Loading
Fonts are loaded from Google Fonts CDN with support for multiple weights (100-900). The app includes a fallback list of popular fonts if the API is unavailable.

### Performance
- Animations use `requestAnimationFrame` for smooth 60fps playback
- Font loading is optimized with dynamic link injection
- Real-time updates use React state management for responsive controls

## Keyboard Shortcuts
- Space: Play/Pause (when timeline is focused)
- Click & drag on timeline: Scrub through animation

### 📥 Export Formats (After Effects-Compatible)

The playground supports exporting your typography animations in multiple professional formats:

#### Video Formats
- **WebM**: High-quality video using VP9 codec (1920x1080, 30fps)
- **MP4**: Compatible video format using H264 codec (browser-dependent)

#### Image Sequences
- **PNG Sequence**: Export individual frames as PNG images (1920x1080, 30fps)
  - Perfect for importing into After Effects, Premiere, or other video editors
  - Files are numbered sequentially: `frame_0000.png`, `frame_0001.png`, etc.

#### Single Frame Export
- **PNG**: Export current frame as high-quality PNG image
- **JPEG**: Export current frame as JPEG image
- **SVG**: Export current frame as scalable vector graphic

#### Data Formats
- **JSON**: Export animation data with all keyframes and properties
  - Can be used to recreate animations
  - Share animation settings
- **CSS**: Export as CSS keyframe animation
  - Ready to use in web projects
  - Includes `@keyframes` rule and animation class

### Export Quality Settings
- Video: 1920x1080 @ 30fps, 5Mbps bitrate
- Image Sequence: 1920x1080 per frame
- Single Images: 1920x1080 resolution

## How to Export

1. **Create your animation** with keyframes
2. **Scroll to the Export section** in the sidebar
3. **Choose your format**:
   - **Video**: Click WebM or MP4 to export full animation
   - **Image Sequence**: Click PNG Seq to download all frames
   - **Current Frame**: Export a single frame at the current playhead position
   - **Data**: Export animation data as JSON or CSS

4. **Monitor progress** - A progress bar shows export status for video and sequence exports
5. **Files download automatically** to your default downloads folder

### Export Tips
- **Video formats** work best in Chrome/Edge
- **PNG Sequences** are ideal for importing into After Effects or Premiere Pro
- **JSON exports** can be saved and potentially re-imported later
- **CSS exports** are perfect for web animations
- **SVG exports** maintain vector quality and can be edited in Illustrator

## Future Enhancements
- GIF export with proper encoding
- More easing functions (ease-in, ease-out, bezier curves)
- Support for variable fonts with custom axes
- Text path animations
- Multiple text layers
- Import custom fonts
- Save/load projects from JSON
- Transparent background option
- Custom resolution settings

## Browser Compatibility
Works best in modern browsers with full support for:
- CSS transforms
- Google Fonts API
- requestAnimationFrame
- ES6+ JavaScript

---

Built with Next.js, React, and TypeScript

