"use client";

import { useEffect, useRef } from "react";

export function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);

  useEffect(() => {
    if (!gameRef.current) return;
    
    // Dynamically importing phaser to avoid SSR issues
    let isMounted = true;
    import("phaser").then((Phaser) => {
      if (!isMounted) return;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameRef.current!,
        width: 800,
        height: 600,
        backgroundColor: '#F8F9FA',
        transparent: true,
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: '100%',
          height: '100%'
        }
      };

      let player: Phaser.Physics.Arcade.Sprite;
      let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

      function preload(this: Phaser.Scene) {
        // Create a programmatic texture for the player avatar (Gather.town style)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x6D3BD7); // Primary color
        graphics.fillRoundedRect(0, 0, 32, 48, 8);
        graphics.generateTexture('avatar', 32, 48);
        graphics.destroy();

        // Create a tile texture for the floor
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0xE2E8F0, 0.4);
        bgGraphics.fillRect(0, 0, 40, 40);
        bgGraphics.lineStyle(1, 0xCBD5E1, 0.5);
        bgGraphics.strokeRect(0, 0, 40, 40);
        bgGraphics.generateTexture('gridTile', 40, 40);
        bgGraphics.destroy();
        
        // Desk texture
        const deskGraphics = this.add.graphics();
        deskGraphics.fillStyle(0x94A3B8, 0.8);
        deskGraphics.fillRoundedRect(0, 0, 100, 60, 4);
        deskGraphics.generateTexture('desk', 100, 60);
        deskGraphics.destroy();
      }

      function create(this: Phaser.Scene) {
        // Tile sprite background covering the map
        this.add.tileSprite(0, 0, 4000, 4000, 'gridTile').setScrollFactor(0.5);

        // Add some furniture/obstacles
        const desks = this.physics.add.staticGroup();
        desks.create(400, 300, 'desk');
        desks.create(600, 200, 'desk');
        desks.create(200, 400, 'desk');

        // Player
        player = this.physics.add.sprite(300, 300, 'avatar');
        player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 2000, 2000);

        this.physics.add.collider(player, desks);

        // Name tag
        const nameText = this.add.text(0, -30, 'Dale', {
          fontSize: '12px',
          color: '#0F172A',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: { x: 4, y: 2 }
        }).setOrigin(0.5, 0.5);

        // Container to sync player and text
        player.setData('nameTag', nameText);

        // Camera follow
        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setZoom(1.2);

        if (this.input.keyboard) {
            cursors = this.input.keyboard.createCursorKeys();
        }
      }

      function update(this: Phaser.Scene) {
        if (!cursors) return;

        player.setVelocity(0);
        const speed = 200;

        if (cursors.left.isDown) {
          player.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
          player.setVelocityX(speed);
        }

        if (cursors.up.isDown) {
          player.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
          player.setVelocityY(speed);
        }

        // Keep name tag aligned with player
        const nameTag = player.getData('nameTag') as Phaser.GameObjects.Text;
        if (nameTag) {
          nameTag.setPosition(player.x, player.y - 36);
        }
      }

      phaserGameRef.current = new Phaser.Game(config);
    });

    return () => {
      isMounted = false;
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden glass-card-static">
      <div ref={gameRef} className="w-full h-full" />
    </div>
  );
}
