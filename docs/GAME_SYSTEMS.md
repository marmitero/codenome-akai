# GAME SYSTEMS — visão geral
Sistemas e onde vivem (código/config): Rei (core/state), Heróis (config/heroes + core/state),
Equipe (core/state + config/balance TEAM_SLOTS), XP (core/xp), Combate (core/battle + scenes/TowerScene),
Torre (config/floors + TowerScene), Loot/Equipamento (core/equipment), Inventário (core/state + InventoryOverlay),
Mercado (core/market — matemática; server-side = fase online), Offline (core/offline),
Persistência (core/persistence), Debug (SettingsOverlay, ?debug=1).
Interações: kill → coin+XP(pool dividido)+roll de loot → inventário → equipar/vender → stats (heroStats).
