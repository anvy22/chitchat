/**
 * Pixel-Art Sprite Factory
 * Generates all game textures programmatically using Phaser Graphics.
 * Each sprite mimics authentic 16-bit/pixel-art aesthetics.
 */

const TILE = 32;

// ── Color Palettes ──────────────────────────────────────────────
const COLORS = {
  // Floors
  carpetBlue: 0x8B9FD4,
  carpetBlueDark: 0x7A8EC3,
  hardwood: 0xD4A574,
  hardwoodDark: 0xC49464,
  tileCream: 0xE8DCC8,
  tileCreamDark: 0xDDD0BC,
  grass: 0x7EC87E,
  grassDark: 0x6EB86E,

  // Walls
  wallTop: 0xB8C4D8,
  wallSide: 0x9CAAB8,
  wallDark: 0x8494A8,
  windowBlue: 0xADD8E6,
  windowFrame: 0x7A8898,

  // Furniture
  deskBrown: 0x8B7355,
  deskTop: 0xA08868,
  chairGray: 0x555555,
  chairSeat: 0x666666,
  sofaOrange: 0xD4855A,
  sofaCushion: 0xE49E7A,
  sofaRed: 0xC25B5B,
  tableBrown: 0x9B7B5B,
  tableTop: 0xAB8B6B,

  // Objects
  monitorBlack: 0x2A2A2A,
  monitorScreen: 0x4488CC,
  monitorScreenOff: 0x3A6A9A,
  plantGreen: 0x4CAF50,
  plantDark: 0x388E3C,
  potBrown: 0x8D6E4C,
  bookshelfWood: 0x6B5B4C,
  bookColors: [0xE74C3C, 0x3498DB, 0x2ECC71, 0xF39C12, 0x9B59B6],
  whiteboardWhite: 0xF5F5F5,
  whiteboardFrame: 0x888888,
  rugPurple: 0x7E57C2,
  rugPurpleDark: 0x6A45AE,
};

function drawPixel(g: any, x: number, y: number, color: number, size = 2) {
  g.fillStyle(color);
  g.fillRect(x * size, y * size, size, size);
}

// ── Floor Tiles ─────────────────────────────────────────────────

function generateCarpetFloor(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.carpetBlue);
  g.fillRect(0, 0, TILE, TILE);
  // Subtle pixel pattern
  for (let x = 0; x < TILE; x += 4) {
    for (let y = 0; y < TILE; y += 4) {
      if ((x + y) % 8 === 0) {
        g.fillStyle(COLORS.carpetBlueDark);
        g.fillRect(x, y, 2, 2);
      }
    }
  }
  // Grid line
  g.fillStyle(COLORS.carpetBlueDark, 0.4);
  g.fillRect(0, 0, TILE, 1);
  g.fillRect(0, 0, 1, TILE);

  g.generateTexture('floor_carpet', TILE, TILE);
  g.destroy();
}

function generateHardwoodFloor(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.hardwood);
  g.fillRect(0, 0, TILE, TILE);
  // Plank lines
  g.fillStyle(COLORS.hardwoodDark);
  g.fillRect(0, 7, TILE, 1);
  g.fillRect(0, 15, TILE, 1);
  g.fillRect(0, 23, TILE, 1);
  g.fillRect(0, 31, TILE, 1);
  g.fillRect(16, 0, 1, 8);
  g.fillRect(8, 8, 1, 8);
  g.fillRect(24, 16, 1, 8);
  g.fillRect(12, 24, 1, 8);

  g.generateTexture('floor_hardwood', TILE, TILE);
  g.destroy();
}

function generateTileFloor(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.tileCream);
  g.fillRect(0, 0, TILE, TILE);
  g.fillStyle(COLORS.tileCreamDark);
  g.fillRect(0, 0, TILE, 1);
  g.fillRect(0, 0, 1, TILE);
  g.fillRect(15, 0, 1, TILE);
  g.fillRect(0, 15, TILE, 1);

  g.generateTexture('floor_tile', TILE, TILE);
  g.destroy();
}

function generateGrassFloor(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.grass);
  g.fillRect(0, 0, TILE, TILE);
  // Random grass tufts
  const rng = [3, 7, 12, 18, 25, 28];
  rng.forEach((x, i) => {
    g.fillStyle(COLORS.grassDark);
    g.fillRect(x, rng[(i + 2) % rng.length], 2, 3);
  });

  g.generateTexture('floor_grass', TILE, TILE);
  g.destroy();
}

// ── Walls ───────────────────────────────────────────────────────

function generateWallTop(scene: any) {
  const g = scene.add.graphics();
  // Main wall
  g.fillStyle(COLORS.wallTop);
  g.fillRect(0, 0, TILE, TILE);
  // Top accent
  g.fillStyle(COLORS.wallDark);
  g.fillRect(0, 0, TILE, 3);
  // Bottom shadow
  g.fillStyle(COLORS.wallSide);
  g.fillRect(0, TILE - 4, TILE, 4);

  g.generateTexture('wall_top', TILE, TILE);
  g.destroy();
}

function generateWallWithWindow(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.wallTop);
  g.fillRect(0, 0, TILE, TILE);
  g.fillStyle(COLORS.wallDark);
  g.fillRect(0, 0, TILE, 3);
  // Window
  g.fillStyle(COLORS.windowFrame);
  g.fillRect(6, 6, 20, 16);
  g.fillStyle(COLORS.windowBlue);
  g.fillRect(8, 8, 16, 12);
  // Window panes
  g.fillStyle(COLORS.windowFrame);
  g.fillRect(15, 8, 2, 12);
  g.fillRect(8, 13, 16, 2);
  // Bottom shadow
  g.fillStyle(COLORS.wallSide);
  g.fillRect(0, TILE - 4, TILE, 4);

  g.generateTexture('wall_window', TILE, TILE);
  g.destroy();
}

// ── Furniture ───────────────────────────────────────────────────

function generateDesk(scene: any) {
  const g = scene.add.graphics();
  // Desk surface (top-down view, 2 tiles wide)
  g.fillStyle(COLORS.deskTop);
  g.fillRect(0, 4, 64, 24);
  g.fillStyle(COLORS.deskBrown);
  g.fillRect(0, 4, 64, 3);
  // Legs
  g.fillStyle(COLORS.deskBrown);
  g.fillRect(2, 26, 4, 4);
  g.fillRect(58, 26, 4, 4);

  g.generateTexture('desk', 64, 32);
  g.destroy();
}

function generateDeskWithMonitor(scene: any) {
  const g = scene.add.graphics();
  // Desk
  g.fillStyle(COLORS.deskTop);
  g.fillRect(0, 8, 64, 20);
  g.fillStyle(COLORS.deskBrown);
  g.fillRect(0, 8, 64, 3);
  // Legs
  g.fillStyle(COLORS.deskBrown);
  g.fillRect(2, 26, 4, 4);
  g.fillRect(58, 26, 4, 4);
  // Monitor
  g.fillStyle(COLORS.monitorBlack);
  g.fillRect(20, 0, 24, 16);
  g.fillStyle(COLORS.monitorScreen);
  g.fillRect(22, 2, 20, 10);
  // Monitor stand
  g.fillStyle(COLORS.monitorBlack);
  g.fillRect(30, 16, 4, 3);
  g.fillRect(26, 18, 12, 2);
  // Keyboard
  g.fillStyle(0x444444);
  g.fillRect(22, 21, 16, 4);

  g.generateTexture('desk_monitor', 64, 32);
  g.destroy();
}

function generateChair(scene: any) {
  const g = scene.add.graphics();
  // Seat
  g.fillStyle(COLORS.chairSeat);
  g.fillRoundedRect(4, 8, 24, 20, 4);
  // Backrest
  g.fillStyle(COLORS.chairGray);
  g.fillRoundedRect(8, 2, 16, 10, 3);
  // Wheels (bottom)
  g.fillStyle(0x333333);
  g.fillCircle(10, 28, 2);
  g.fillCircle(22, 28, 2);

  g.generateTexture('chair', TILE, TILE);
  g.destroy();
}

function generateSofa(scene: any) {
  const g = scene.add.graphics();
  // Base
  g.fillStyle(COLORS.sofaOrange);
  g.fillRoundedRect(0, 8, 96, 20, 4);
  // Cushions
  g.fillStyle(COLORS.sofaCushion);
  g.fillRoundedRect(4, 10, 26, 14, 3);
  g.fillRoundedRect(34, 10, 26, 14, 3);
  g.fillRoundedRect(64, 10, 26, 14, 3);
  // Armrests
  g.fillStyle(COLORS.sofaOrange);
  g.fillRoundedRect(0, 4, 8, 26, 3);
  g.fillRoundedRect(88, 4, 8, 26, 3);

  g.generateTexture('sofa', 96, 32);
  g.destroy();
}

function generateConferenceTable(scene: any) {
  const g = scene.add.graphics();
  // Large round-ish table
  g.fillStyle(COLORS.tableTop);
  g.fillRoundedRect(0, 0, 96, 64, 16);
  g.fillStyle(COLORS.tableBrown);
  g.fillRoundedRect(0, 0, 96, 4, 2);

  g.generateTexture('conference_table', 96, 64);
  g.destroy();
}

function generateSmallTable(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.tableTop);
  g.fillCircle(16, 16, 14);
  g.fillStyle(COLORS.tableBrown);
  g.fillCircle(16, 16, 10);
  g.fillStyle(COLORS.tableTop);
  g.fillCircle(16, 16, 8);

  g.generateTexture('small_table', TILE, TILE);
  g.destroy();
}

// ── Decorations ─────────────────────────────────────────────────

function generatePlant(scene: any) {
  const g = scene.add.graphics();
  // Pot
  g.fillStyle(COLORS.potBrown);
  g.fillRect(10, 20, 12, 10);
  g.fillRect(8, 18, 16, 4);
  // Leaves
  g.fillStyle(COLORS.plantGreen);
  g.fillCircle(16, 14, 8);
  g.fillCircle(10, 10, 5);
  g.fillCircle(22, 10, 5);
  g.fillStyle(COLORS.plantDark);
  g.fillCircle(14, 12, 4);
  g.fillCircle(20, 8, 3);

  g.generateTexture('plant', TILE, TILE);
  g.destroy();
}

function generateLargePlant(scene: any) {
  const g = scene.add.graphics();
  // Pot
  g.fillStyle(COLORS.potBrown);
  g.fillRect(8, 28, 16, 12);
  g.fillRect(6, 26, 20, 4);
  // Trunk
  g.fillStyle(0x6B5B4C);
  g.fillRect(14, 14, 4, 14);
  // Leaves (tree-like)
  g.fillStyle(COLORS.plantGreen);
  g.fillCircle(16, 10, 10);
  g.fillCircle(8, 8, 6);
  g.fillCircle(24, 8, 6);
  g.fillCircle(16, 4, 7);
  g.fillStyle(COLORS.plantDark);
  g.fillCircle(12, 8, 4);
  g.fillCircle(20, 6, 4);

  g.generateTexture('large_plant', TILE, 44);
  g.destroy();
}

function generateBookshelf(scene: any) {
  const g = scene.add.graphics();
  // Shelf frame
  g.fillStyle(COLORS.bookshelfWood);
  g.fillRect(0, 0, TILE, 48);
  g.fillStyle(0x5B4B3C);
  g.fillRect(2, 2, 28, 14);
  g.fillRect(2, 18, 28, 14);
  g.fillRect(2, 34, 28, 12);
  // Books (top shelf)
  COLORS.bookColors.forEach((c, i) => {
    g.fillStyle(c);
    g.fillRect(3 + i * 5, 3, 4, 12);
  });
  // Books (middle shelf)
  COLORS.bookColors.slice().reverse().forEach((c, i) => {
    g.fillStyle(c);
    g.fillRect(3 + i * 5, 19, 4, 12);
  });
  // Books (bottom shelf)
  g.fillStyle(0xDDD);
  g.fillRect(4, 36, 24, 8);

  g.generateTexture('bookshelf', TILE, 48);
  g.destroy();
}

function generateWhiteboard(scene: any) {
  const g = scene.add.graphics();
  g.fillStyle(COLORS.whiteboardFrame);
  g.fillRect(0, 0, 64, 40);
  g.fillStyle(COLORS.whiteboardWhite);
  g.fillRect(2, 2, 60, 36);
  // Some "written" lines
  g.fillStyle(0x333333);
  g.fillRect(6, 8, 24, 2);
  g.fillRect(6, 14, 32, 2);
  g.fillRect(6, 20, 20, 2);
  g.fillStyle(0xE74C3C);
  g.fillRect(40, 8, 16, 2);
  g.fillStyle(0x3498DB);
  g.fillRect(6, 26, 40, 2);

  g.generateTexture('whiteboard', 64, 40);
  g.destroy();
}

function generateRug(scene: any) {
  const g = scene.add.graphics();
  // Outer
  g.fillStyle(COLORS.rugPurple, 0.6);
  g.fillRoundedRect(0, 0, 96, 64, 6);
  // Inner
  g.fillStyle(COLORS.rugPurpleDark, 0.5);
  g.fillRoundedRect(8, 6, 80, 52, 4);
  // Diamond pattern
  g.fillStyle(COLORS.rugPurple, 0.7);
  g.fillRect(44, 20, 8, 8);
  g.fillRect(36, 28, 8, 8);
  g.fillRect(52, 28, 8, 8);

  g.generateTexture('rug', 96, 64);
  g.destroy();
}

function generateWaterCooler(scene: any) {
  const g = scene.add.graphics();
  // Base
  g.fillStyle(0xCCCCCC);
  g.fillRect(8, 20, 16, 12);
  // Jug
  g.fillStyle(0xAADBEE);
  g.fillRoundedRect(10, 4, 12, 16, 4);
  g.fillStyle(0x88BBCC);
  g.fillRoundedRect(12, 6, 8, 12, 3);
  // Tap
  g.fillStyle(0x888888);
  g.fillRect(14, 18, 4, 4);

  g.generateTexture('water_cooler', TILE, TILE);
  g.destroy();
}

// ── Master Loader ───────────────────────────────────────────────

export function generateAllSprites(scene: any) {
  generateCarpetFloor(scene);
  generateHardwoodFloor(scene);
  generateTileFloor(scene);
  generateGrassFloor(scene);
  generateWallTop(scene);
  generateWallWithWindow(scene);
  generateDesk(scene);
  generateDeskWithMonitor(scene);
  generateChair(scene);
  generateSofa(scene);
  generateConferenceTable(scene);
  generateSmallTable(scene);
  generatePlant(scene);
  generateLargePlant(scene);
  generateBookshelf(scene);
  generateWhiteboard(scene);
  generateRug(scene);
  generateWaterCooler(scene);
}

export { TILE, COLORS };
