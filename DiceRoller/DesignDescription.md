# 2D Rolling Simulation Design Description

## Purpose / Value / CONOP

### Overview
This game simulates rolling 2D dice (e.g., 4-sided square dice) with realistic physics. The dice will be "tossed" into the air and will bounce around until they settle in a static position. The final value shown on the top face of the dice will be the result.

### Objectives
1. Create an engaging and visually appealing dice rolling simulation.
2. Implement a physics engine to realistically simulate the dice movements and interactions.
3. Provide accurate and easy-to-read results after each roll.

### Key Features
1. **Dice Types**: Support for multiple dice types (e.g., 4-sided, 6-sided) with corresponding shapes (e.g., squares, hexagons).
2. **Physics Simulation**: Realistic physics to simulate tossing, bouncing, and settling of the dice.
3. **Interactive UI**: Simple and intuitive user interface for rolling dice and displaying results.
4. **Customizable Settings**: Options to select dice type, physic parameters, and other settings.

### Components
1. **User Interface (UI)**
   - Roll Button: Initiates the dice roll.
   - Dice Display: Shows the current state of the dice.
   - Result Display: Shows the final result after the dice settle.
   - Settings Menu: Allows users to customize dice type, physics parameters, and other options.
2. **Physics Engine**
   - Toss Simulation: Simulates the initial toss of the dice, including spin and velocity.
   - Collision Detection: Handles collisions between dice and with the floor/walls.
   - Settling Detection: Determines when the dice have settled in a static position.
3. **Dice Objects**
   - Dice Shapes: Represent different dice types (e.g., squares for 4-sided dice).
   - Textures: Visual representations of the dice faces with numbers.

### User Flow
1. User selects the dice type from the settings menu.
2. User clicks the roll button to initiate the dice roll.
3. The die is tossed into the air and the physics engine simulates its movements.
4. The die bounces around and eventually settles in a static position.
5. The result is displayed, showing the value on the top face of the die.

### Technical Requirements
1. **Languages**: TypeScript, HTML, CSS
2. **Libraries/Frameworks**:
   - Physics Engine: Custom
   - UI Framework: plain HTML/CSS
3. Deployment: Host on a web server for browser access.

### Conclusion
This 2D dice rolling game provides a fun and interactive way to simulate dice rolls with realistic physics. By leveraging TypeScript, HTML, and a physics engine, the game can deliver a smooth and engaging experience for players.




## Conceptual Description and Algorithm Design

### Introduction
- **Purpose**: The main CONOP for the 2D Dice Rolling Game simulation is described above.  My objective in creating this is to gain experience with the advantages of using TypeScript and to have fun implementing kinematics into a SW simulation.
- **Audience**: Myself and some of my friends.  The intention is for this to be hosted on [https://pcowhill.github.io](https://pcowhill.github.io).
- **Overview**: This game simulates rolling 2D dice (e.g., 4-sided square dice) with realistic physics. The dice will be "tossed" into the air and will bounce around until they settle in a static position. The final value shown on the top face of the dice will be the result.

### Game Overview
- **Concept**: The concept behind this simulation is comprised of a number of components which are each described in more detail in their appropriate sections following this one.
  - Dice Objects: A mathematical model will be made for the dice objects and the edges of the box.
  - Physics and Simulation Engine: A custom kinematics-based physics engine will be implemented to ensure that the behavior of the dice when starting at a random initial state will reliably behave as expected.  Collision logic will be implemented to have the dice realistically interact with the edges of the box.
  - User Interface: An intuitive user interface will be created for the user to interact with the simulation engine.

### Dice Objects
- **Shapes**: Dice can have any integer number of sides of at least 2 (so a 2-sided die -- i.e. a coin -- can be created).  All of the dice will be regular polygons.
- **Composition**: The dice will be modeled as a collection of vertices.  Since there will not exist any edge collision (as the box containing the dice is concave and the dice themselves are convex), the edges are not modeled.  The position, velocity, and acceleration of the die will be in two components: a cartesian component, and a torsional/polar component.  The position of each individual vertex will be determined from each of these.  For example, the figure below shows a representation of a 4-sided die.
  - The grey axes represent the primary coordinate system being used for tracking the relative position of dice with the edges of the box.  For the purposes of this graphic, the axes are centered on the middle of the die, but this may not be the case for every instance of this die at each time point.
  - The black circle represents a constant radius distance away from the center of the die.
  - The orange square shows how the die will be graphically displayed within the game.
  - The blue dots represent the vertices of the polygon.  The blue cross shows another skeleton-frame based representation of these vertices.

![4 Sided Die Graphic](4SidedDie.png)

*Figure: Representation of 4-sided Die*

- **Texture**: As shown in the figure above, the dice will be represented graphically as regular polygons (such as the orange square in the above figure).
- **Properties**: Many of the properties of the dice can be explored within this simulation such as: the number of sides, the length of the side (and therefore the polygon's radius), and the color of the die.  More complex properties such as having vertices with differing masses and irregular polygons could also be explored.

### Physics and Simulation Engine
- **Time Steps**: The main simulation logic will take place within a loop.  The amount of time that has passed since the last loop commenced will be measured and will constitute the amount that the die should move and accelerate.  This should ensure that the animation looks smooth, independent of if a single frame took 0.01s to create or 0.001s to create.  There may also be a place for an FPS limiter on this depending on how the physics logic handles small values of time.
- **Force of Gravity**: Gravity will naturally be applied as a force against the die to pull it downward.
- **Collision Detection and Response**: Collision detection and response follows a few steps.
   1. Edge Collision Detection: The edges of the box will be concave and static.  For each vertex within the polygon, it can be determined if the vertex were to lie outside the bounds of the box by running a simple threashold comparison on the relevant component of its absolute cartesian position.  For example, if the right-most vertical edge of the box exists at x=200.0, then a collision would occur if the x-position of a vertex is greater than or equal to 200.0.
   2. 1-Frame Reversal Force: When a collision is detected during a frame (and multiple detections could occur in a single frame), then the vertex that caused the collision will experience a single-frame reversal force that will attempt to simulate an innelastic collision.
      1.  First, it will be determined what the velocity of the point should be after this frame.  In an inelastic collision, the component of the velocity normal to the edge of the box should be reversed and dampened by some scale factor.  For example, if the velocity going toward a vertical edge is +10.0, and the scalling factor reduced the velocity by 10%, then the new velocity should be -9.0.
      2. Then, based on the mass of the vertex and the duration of the time step, the necessary force to be applied to the vertex which would result in this new velocity being acheived in the next frame will be applied.
      3. Then, the force will be converted from a 2D cartesian vector into two components.  A cartesian component which will be applied to the center of mass of the die, and a polar component which will apply torsional force against the center of mass of the die.
      4. Then, the force will be applied to the center of mass of the die, impacting all vertices in the expected manner.
   3. Frictional Force:  When a collision occurs, an additional frictional force will be applied in the direction parallel to the edge.  This will behave in a similar manner to the 1-frame reversal force.
- **Velocity and Acceleration Tracking**: The position, velocity, and accelleration of the dice will be solely applied to and determined from the center of mass and not from the vertices themselves.
- **Settling Behavior**: To avoid "bouncing" where the die constantly dips into the bottom edge of the box (due to gravity) and then pushes back up from the 1-frame collision force, settling logic will be implemented to declare the die completely still.
  - Low-velocity collisions: If the component of the velocity normal to the edge being collided with is sufficiently small, then the collision may simply move the vertex toward the surface of the edge, and then completely negate that component of the velocty (instead of attempting to reflect it).
  - Disabling gravity: For when the center of mass of the die is sufficiently close to the bottom edge, then gravity may simply be turned off to allow the die to settle.
  - Friction: To avoid dice sliding around on the bottom of the edge of the box, frictional force will continued to be applied even if strict collision logic (as previously described) is not being used.

### User Interface
The user interface will be designed in the course of development.  It is not the focus of this exercise, and is therefore not a major enough concern at the time of writing this document.

### Implementation Plan
- **Development Phases**: The following stages will be pursued within the development of this simulation:
  - Concept: With the creation of the CONOP, the concept stage has been completed.
  - Design: With the creation of this Design Document, the design stage has been completed.
  - Prototype: A prototype version of some of the physics simulation objects will be composed to ensure they are realistic.
  - Functional: A stubb-version of the code will be writin with all major classes, attributes, and methods (but with none of the logic present).
  - Technical Implementation: Each of the functions will be implemented.
  - Validation and Testing: Necessary validation of results and automated testing will be implemented to eliminate/reduce bugs and provide a quality product.
- **Milestones**: Multiple major minimum viable product (MVP) stages will be pursed in order to make incremental progress toward the successful implementation of this simulation.  Tentatively, they are:
  - v0.1 single-point physics: in which a single vertex will be tested
  - v0.2 2-point physics: in which a "coin-like" object will be tested
  - v0.3 n-point physics: in which a true polygon will be tested
  - v0.4 graphical basics: in which intuitive graphics and UI will be designed
  - v1.0 initial release: in which the app will be released
- **Testing and Validation**: Necessary testing and validation steps will be implemented.