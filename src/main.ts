// Codenome: AKAI — bootstrap. Full-screen game, mobile-portrait first.

import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { KingCreationScene } from './scenes/KingCreationScene';
import { HeroChoiceScene } from './scenes/HeroChoiceScene';
import { LobbyScene } from './scenes/LobbyScene';
import { TowerScene } from './scenes/TowerScene';
import { InventoryOverlay } from './scenes/overlays/InventoryOverlay';
import { TeamOverlay } from './scenes/overlays/TeamOverlay';
import { TowerSelectOverlay } from './scenes/overlays/TowerSelectOverlay';
import { SettingsOverlay } from './scenes/overlays/SettingsOverlay';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#120d16',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [
    BootScene,
    KingCreationScene,
    HeroChoiceScene,
    LobbyScene,
    TowerScene,
    InventoryOverlay,
    TeamOverlay,
    TowerSelectOverlay,
    SettingsOverlay,
  ],
};

const game = new Phaser.Game(config);

// keep the canvas glued to the visual viewport (mobile browser chrome safe)
const setHeight = () => {
  const el = document.getElementById('game');
  if (el) el.style.height = `${window.visualViewport?.height ?? window.innerHeight}px`;
};
window.addEventListener('resize', setHeight);
window.visualViewport?.addEventListener('resize', setHeight);
setHeight();

export default game;
