# EQUIPMENT SYSTEM
Estrutura (core/types.Equipment): id, ownerId, characterId, slot, itemType, level, rarity,
stats, xValues, quality, sellValue, createdAt, metadata. Slots: weapon/armor/accessory.
Geração: BASE(slot) × levelScale × RARITY_MULT × X_individual (§36: X por stat, nunca compartilhado).
Raridades: common50/uncommon30/rare15/epic4/legendary0.9/celestial0.1 (config LOOT).
Drop: 5% por kill (baseline configurável). Qualidade = normalização da média dos X.
Item de nível maior PODE ser pior (§38). Venda por Coin (sellValue). Equip troca com slot anterior.
