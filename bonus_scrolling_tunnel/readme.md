# Camera Track in Three.js

This repo shows how to build a scrolling camera path in Three.js. The key files are `src/main.js` (scene + camera movement) and `src/addTrack.js` (the curve + tube geometry).

## Quick start
- `npm install`
- `npm run dev`
- Open the localhost URL from Vite. Scroll to move along the track; red spheres mark control points.

## Step-by-step: building the track
1) **Scene + camera + renderer** (`src/main.js`): create a `THREE.Scene`, a `PerspectiveCamera(75, aspect, 0.1, 1000)`, set `camera.position.set(0, 0, 5)`, and attach a `WebGLRenderer` to `document.body`.
2) **Define control points** (`src/addTrack.js`): create an array of `new Vector3(x, y, z)` points. These are the anchors the camera path will pass through. Change or add points to reshape the track.
3) **(Optional) debug markers**: for each control point, place a small red `Mesh(new SphereGeometry(0.5), new MeshBasicMaterial({ color: 'red' }))` into a `Group`. Adding this group to the scene lets you see and tune the path visually.
4) **Create the curve**: build a `CatmullRomCurve3(points)` so Three.js interpolates smoothly through every control point. Catmull-Rom keeps the curve on the points and avoids sharp corners by blending tangents.
5) **Create the tube mesh**: feed the curve to `new TubeGeometry(curve, 100, 2, 8, false)`. Arguments are `(path, tubularSegments, radius, radialSegments, closedLoop)`. Higher segment counts and radial segments make smoother tubes; increase radius to widen the tunnel. Apply a material (here `MeshMatcapMaterial` using `public/mat.png` and `DoubleSide` to render the interior); `wireframe: true` keeps it lightweight.
6) **Return track + debug group**: `addTrack` returns `{ track: tube, debug: group }`. In `src/main.js`, add them to the scene: `meshes.track = addTrack().track; meshes.debug = addTrack().debug; scene.add(meshes.track); scene.add(meshes.debug);`.

## Step-by-step: moving the camera along the path
1) **Scroll input to velocity** (`handleScroll` in `src/main.js`): listen for `wheel` events, accumulate `scrollVelocity += event.deltaY * acceleration`, and clamp it with `maxVelocity`. This converts user input into a speed value instead of an immediate jump.
2) **Apply friction + clamp progress** (`animate` loop): each frame, decay velocity with `scrollVelocity *= friction` and stop when near zero. Integrate into `targetProgress += scrollVelocity`, then clamp `targetProgress` between `0` and `1` so it stays on the curve.
3) **Smooth toward target**: interpolate `scrollProgress += (targetProgress - scrollProgress) * 0.1`. This easing prevents jitter and makes acceleration/deceleration feel natural.
4) **Map progress to world space** (`updateCamera`): `const position = meshes.track.geometry.parameters.path.getPointAt(scrollProgress);` gives a point on the curve for normalized progress (0 start → 1 end). Set `camera.position.copy(position)`.
5) **Look ahead for better orientation**: sample a slightly advanced point (`getPointAt(Math.min(scrollProgress + 0.01, 1))`) and `camera.lookAt(lookAtPosition)`. Looking ahead instead of at the current point aligns the camera with the upcoming segment and avoids gimbal flips.
6) **Render + resize**: on each animation frame call `renderer.render(scene, camera)`. Update `camera.aspect` and `renderer.setSize` on `resize` so the projection stays correct.

## How it works (conceptually)
- `CatmullRomCurve3` provides a normalized parameter `t` from 0–1 along the entire curve length; `TubeGeometry` and `getPointAt` both consume that same curve so geometry and camera stay in sync.
- Separating `targetProgress` (position) from `scrollVelocity` (speed) creates smooth motion; friction damps speed over time, while interpolation eases position updates.
- The look-ahead point supplies a stable forward vector, preventing the camera from twisting around the tube’s center when curvature changes.

## Tweaks
- Change the `points` array in `src/addTrack.js` to redesign the path; add more points for tighter control.
- Adjust `radius`, `tubularSegments`, or `radialSegments` in `TubeGeometry` for different tunnel thickness/smoothness.
- Tune `acceleration`, `friction`, and `maxVelocity` in `src/main.js` to alter how responsive scrolling feels.
- Swap `MeshMatcapMaterial` for `MeshStandardMaterial` (with lights) or disable `wireframe` for a solid tunnel.

## Files of interest
- `src/main.js` — scene setup, scroll handling, and camera movement along the curve.
- `src/addTrack.js` — curve definition, tube geometry, and debug markers.
- `public/mat.png` — matcap texture used by the tube material.

