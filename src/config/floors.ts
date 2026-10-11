// Codenome: AKAI — Tower floors ("hunting grounds").
// Master prompt §21/§22/§55: floors define difficulty/enemies/rewards and
// NEVER contain bosses. Bosses live in separate content (Phase 12).

export interface FloorDef {
  floor: number;
  name: string;
  theme: 'cursed';
  mobs: string[]; // sprite set keys
  /** stat multiplier applied on top of per-floor linear scaling */
  difficulty: number;
}

export const FLOORS: FloorDef[] = [
  { floor: 1, name: 'Campos Amaldiçoados', theme: 'cursed', mobs: ['mob_slime1'], difficulty: 1.0 },
  { floor: 2, name: 'Charco Verde', theme: 'cursed', mobs: ['mob_slime1', 'mob_slime2'], difficulty: 1.15 },
  { floor: 3, name: 'Lodaçal Rubro', theme: 'cursed', mobs: ['mob_slime2', 'mob_slime3'], difficulty: 1.3 },
  { floor: 4, name: 'Matagal Predador', theme: 'cursed', mobs: ['mob_plant1'], difficulty: 1.5 },
  { floor: 5, name: 'Raízes Famintas', theme: 'cursed', mobs: ['mob_plant1', 'mob_slime3'], difficulty: 1.7 },
  { floor: 6, name: 'Acampamento Orc', theme: 'cursed', mobs: ['mob_orc1'], difficulty: 2.0 },
  { floor: 7, name: 'Trilha de Guerra', theme: 'cursed', mobs: ['mob_orc1', 'mob_plant1'], difficulty: 2.3 },
  { floor: 8, name: 'Cripta Rasa', theme: 'cursed', mobs: ['mob_vampire'], difficulty: 2.7 },
  { floor: 9, name: 'Vigília Noturna', theme: 'cursed', mobs: ['mob_vampire', 'mob_orc1'], difficulty: 3.1 },
  { floor: 10, name: 'Portão da Torre', theme: 'cursed', mobs: ['mob_vampire', 'mob_slime3', 'mob_orc1'], difficulty: 3.6 },
];

export const floorDef = (floor: number): FloorDef => {
  const f = FLOORS.find((x) => x.floor === floor);
  if (!f) throw new Error(`unknown floor ${floor}`);
  return f;
};
