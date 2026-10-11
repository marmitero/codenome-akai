// First access: create the King (nickname + skin) — master prompt §5/§6.

import Phaser from 'phaser';
import { KING_SKINS } from '../config/heroes';
import { pixelFont } from '../ui/PixelText';
import { arrowButton, button, panel } from '../ui/widgets';
import { state } from '../game/session';

export function normalizeNickname(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '_').slice(0, 14);
}

export function validateNickname(raw: string): string | null {
  const n = normalizeNickname(raw);
  if (n.length < 3) return 'MINIMO 3 LETRAS';
  if (!/^[A-Z0-9_]+$/.test(n)) return 'USE A-Z 0-9 _';
  return null;
}

export class KingCreationScene extends Phaser.Scene {
  private skinIndex = 0;
  private nameInput!: HTMLInputElement;
  private errorText: Phaser.GameObjects.Image | null = null;
  private portrait: Phaser.GameObjects.Sprite | null = null;

  constructor() {
    super('king_creation');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x120d16);

    pixelFont.text(this, w / 2, h * 0.08, 'CODENOME: AKAI', { scale: 3 });
    pixelFont.text(this, w / 2, h * 0.13, 'CRIE O SEU REI', { scale: 2 });

    panel(this, w / 2, h * 0.36, 'empty', 3).setDepth(1);

    // skin portrait
    this.redrawPortrait(w, h);

    // skin arrows
    arrowButton(this, w / 2 - 105, h * 0.36, 'left', () => this.cycleSkin(-1)).setDepth(2);
    arrowButton(this, w / 2 + 105, h * 0.36, 'right', () => this.cycleSkin(1)).setDepth(2);

    pixelFont.text(this, w / 2, h * 0.5, KING_SKINS[this.skinIndex].label, { scale: 2 }).setName('skinlabel');

    // DOM nickname input (technical necessity for mobile keyboards)
    this.nameInput = document.createElement('input');
    this.nameInput.id = 'akai-name-input';
    this.nameInput.maxLength = 14;
    this.nameInput.placeholder = 'NOME DO REI';
    this.nameInput.style.top = `${Math.round(h * 0.56)}px`;
    document.body.appendChild(this.nameInput);
    this.events.once('shutdown', () => this.nameInput.remove());

    button(this, w / 2, h * 0.68, 'create', () => this.tryCreate(), 3).setDepth(2);
    pixelFont.text(this, w / 2, h * 0.78, 'O REI ADMINISTRA. OS CAMPEOES LUTAM.', { scale: 1 });

    this.scale.once('resize', () => this.scene.restart());
  }

  private redrawPortrait(w: number, h: number) {
    if (this.portrait) this.portrait.destroy();
    const skin = KING_SKINS[this.skinIndex];
    this.portrait = this.add
      .sprite(w / 2, h * 0.35, `${skin.spriteSet}_idle_sheet`)
      .setFrame(0)
      .setScale(3)
      .setDepth(2);
  }

  private cycleSkin(dir: number) {
    this.skinIndex = (this.skinIndex + dir + KING_SKINS.length) % KING_SKINS.length;
    const { width: w, height: h } = this.scale;
    this.redrawPortrait(w, h);
    const old = this.children.getByName('skinlabel');
    if (old) old.destroy();
    pixelFont.text(this, w / 2, h * 0.5, KING_SKINS[this.skinIndex].label, { scale: 2 }).setName('skinlabel');
  }

  private tryCreate() {
    const err = validateNickname(this.nameInput.value);
    if (this.errorText) {
      this.errorText.destroy();
      this.errorText = null;
    }
    const { width: w, height: h } = this.scale;
    if (err) {
      this.errorText = pixelFont.text(this, w / 2, h * 0.74, err, { scale: 2 });
      return;
    }
    state.createKing(normalizeNickname(this.nameInput.value), KING_SKINS[this.skinIndex].id);
    this.scene.start('hero_choice');
  }
}
