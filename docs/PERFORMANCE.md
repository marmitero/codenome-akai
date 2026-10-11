# PERFORMANCE
Assets sob demanda por cena (preload do pack usado); texturas baked uma vez (cache por key);
PixelText cacheia texturas por string; tileSprites para chão; sem física arcade (movimento manual);
sprites fora de tela cullados pela câmera Phaser. PENDING: atlas único p/ reduzir requests no online,
pool de damage numbers, pause em visibilitychange já salva estado.
