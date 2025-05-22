# WebXR Learning Project

A WebXR application built with Three.js that demonstrates VR controller interactions and canvas manipulation in virtual reality.

## Features

### VR Environment

- Interactive 3D environment with WebXR support
- Smooth VR session handling with proper state management
- Fallback controller models for Meta Quest emulator compatibility
- Background scene with proper lighting setup

### Controller Visualization

- Visible controller models with grip parts
- Green semi-transparent cube (socket) attachments for better controller visibility
- Interactive ray lines extending from controller cubes
- Special visual feedback for left controller trigger:
  - Ray changes color to red when trigger is pressed
  - Returns to white when trigger is released

### Interactive Canvas Panel

- 320x180 pixel canvas panel positioned 2 meters in front of the user
- Maintains 16:9 aspect ratio with proper scaling
- Interactive surface that responds to controller ray intersections
- Visual feedback when pointing at the canvas
- Draws red dots on the canvas when clicking with controllers

## Project Structure

### Main Components

- `main.js`: Core application setup and VR session management
- `controllerCubes.js`: Controller cube (socket) visualization module
- `controllerRay.js`: Controller ray line rendering and interaction module

### Key Classes

- `ControllerCube`: Manages the visible cube attachments for controllers
- `ControllerRay`: Handles ray visualization and interaction state

## Technical Implementation

### Rendering

- Uses Three.js WebGL renderer with antialiasing
- Proper handling of window resizing
- Efficient animation loop with VR session awareness

### Materials

- MeshPhongMaterial for controller components
- MeshBasicMaterial for the interactive canvas
- LineBasicMaterial for controller rays
- Proper material property handling for different material types

### Interaction System

- Raycasting for precise interaction detection
- Matrix-based controller orientation tracking
- Event handling for VR controller inputs
- Visual feedback for interactions

## Setup and Usage

1. Make sure you have Node.js installed
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open in a WebXR-capable browser
6. Click "Enter VR" to begin the VR experience

## Controls

### Left Controller

- Trigger button changes ray color and thickness
- Pointing at canvas shows intersection
- Clicking adds red dots to canvas

### Right Controller

- Same functionality as left controller but without special trigger feedback
- Can also interact with the canvas

## Technical Notes

- Uses Vite as the development server
- Implements proper WebXR session lifecycle management
- Handles material properties appropriately for different material types
- Includes fallback controller models for compatibility
- Proper cleanup and event handling for VR session changes

## Browser Compatibility

- Requires a WebXR-capable browser
- Tested with Meta Quest devices
- Works with WebXR emulator for development

## Development Notes

- Modular code structure for maintainability
- Separate concerns between controller visualization and interaction
- Proper error handling for material properties
- Efficient render loop with VR/non-VR state management
