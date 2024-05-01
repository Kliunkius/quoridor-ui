export const CAMERA_STARTING_POSITION: [number, number, number] = [0, 0, 45];
export const CAMERA_DEFAULT_POSITION: [number, number, number] = [0, 7, 1.5];
export const CAMERA_TARGET_POSITION: number = 0;
export const MAX_CAMERA_POLAR_ANGLE: number = Math.PI * 0.47;
export const MIN_CAMERA_POLAR_ANGLE: number = 0.1;
export const CAMERA_MOVE_SPEED: number = 0.025;

export const BOARD_STARTING_POSITION: [number, number, number] = [0, -3.53, 0];
export const LAVA_STARTING_POSITION: [number, number, number] = [0, 0, 0];
export const LAVA_SCALE: [number, number] = [30, 30];
export const WALL_SCALE: [number, number, number] = [1.8, 0.7, 0.18];
export const HITBOX_SCALE: [number, number, number] = [0.7, 0.01, 0.3];
export const GARGOYLE_OFFSET = [-0.1, 2, 0.15];
export const GARGOYLE_SCALE = 2.5;

export const CORNER_POSITION: number = -4;
export const SURFACE_ELEVATION: number = 0.3;
export const AMBIENT_LIGHT_INTENSITY: number = 3;

// fog colour
// distance (where fog starts)
// distance (where fog stops)
export const FOG_PROPERTIES: [string, number, number] = ['#000000', 10, 30];
