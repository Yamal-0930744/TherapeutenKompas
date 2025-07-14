// ThreeJSMap.js  ⟶  hybrid: fast-load + legacy paths

// THREE + GLTFLoader must be added via <script> tags in HTML
const loader        = new THREE.GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const tileSize = 1;

/* ──────────────────────
   MAP LAYOUT (unchanged)
────────────────────────*/
const mapLayout = [
  "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "TRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
  "TRPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPRT",
  "TRPXRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRPRT",
  "TRPRBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPRT",
  "TRPRTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPRT",
  "TRPRTPPRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRPPRT",
  "TRPRTPPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTPPRT",
  "TRPRTPPRTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPRPPRT",
  "TRPRTPPRTPPRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRPRT",
  "TRPRTPPRTPPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTPPRT",
  "TRPRTPPRTPPRTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPRT",
  "TRPRTPPRTPPRTPPRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
  "TRPRTPPRTPPRTPPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTR",
  "TRPRTPPRTPPRTPPRTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPT",
  "TRPRTPPRTPPRTPPRTPPRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
  "TRPRTPPRTPPRTPPRTPPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTR",
  "TRPRTPPRTPPRTPPRTPPRTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPT",
  "TRPRTPPRTPPRTPPRTPPRTPPRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
  "TRPRTPPRTPPRTPPRTPPRTPPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  "TRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
];
while (mapLayout.length < 60) mapLayout.push(mapLayout[mapLayout.length % 22]);

/* ──────────────────────
   CONSTANTS / HELPERS
────────────────────────*/
const mapWidth  = mapLayout[0].length;
const mapHeight = mapLayout.length;

const groundMaterials = {
  P: new THREE.MeshLambertMaterial({ color: 0x474c47 }),
  G: new THREE.MeshLambertMaterial({ color: 0x90EE90 }),
  S: new THREE.MeshLambertMaterial({ color: 0xD2B48C }),
  R: new THREE.MeshLambertMaterial({ color: 0x003905 }),
  B: new THREE.MeshLambertMaterial({ color: 0x003905 }),
  T: new THREE.MeshLambertMaterial({ color: 0x003905 }),
  D: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
  W: new THREE.MeshLambertMaterial({ color: 0x0000FF }),
  X: new THREE.MeshLambertMaterial({ color: 0xFFD700 })
};

const walkableTiles = ['P', 'G', 'S', 'X'];

const treeFiles = [
  'tree_cone.glb', 'tree_default_dark.glb', 'tree_detailed_dark.glb',
  'tree_pineTallB_detailed.glb', 'tree_pineTallC_detailed.glb', 'tree_pineTallD_detailed.glb'
];
const bushFiles = [
  'plant_bush.glb', 'plant_bushDetailed.glb', 'plant_bushLarge.glb',
  'plant_bushSmall.glb', 'plant_bushTriangle.glb'
];

// paths stay un-optimised
const pathFiles = [
  'path_stoneCircle.glb', 'path_stone.glb', 'path_stoneCorner.glb', 'path_stoneEnd.glb'
];
const weightedPaths = [
  ...Array(60).fill('path_stoneCircle.glb'),
  ...Array(20).fill('path_stone.glb'),
  ...Array(15).fill('path_stoneCorner.glb'),
  ...Array(5 ).fill('path_stoneEnd.glb')
];
const randomPathFile = () => weightedPaths[Math.floor(Math.random() * weightedPaths.length)];

/* small util */
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* scale anything so its X/Z footprint fits inside 1×1 tile (with factor) */
function scaleToTile(obj, factor = 1) {
  obj.traverse((c) => {
    if (c.isMesh) {
      c.geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      c.geometry.boundingBox.getSize(size);
      const s = (tileSize * factor) / Math.max(size.x, size.z);
      obj.scale.setScalar(s);
    }
  });
}

/* ──────────────────────
   PRELOAD (trees / bushes / rails only)
────────────────────────*/
const cache = new Map();
function preload(folder, files) {
  return Promise.all(files.map(f =>
    new Promise((res) => {
      const path = folder ? `./assets/${folder}/${f}` : `./assets/${f}`;
      loader.load(path, (gltf) => { cache.set(f, gltf.scene); res(); });
    })
  ));
}

/* ──────────────────────
   MAIN CREATE-MAP
────────────────────────*/
async function createMap(scene) {

  // preload the assets that _do_ work well with the cache
  await Promise.all([
    preload('trees',  treeFiles),
    preload('bushes', bushFiles),
    preload('',       ['fence_simple.glb', 'fence_corner.glb'])
    // paths intentionally not pre-cached
  ]);

  const hw = mapWidth  / 2;
  const hh = mapHeight / 2;

  for (let z = 0; z < mapHeight; z++) {
  for (let x = 0; x < mapWidth; x++) {

    const t  = mapLayout[z][x];
    const gx = x - hw;
    const gz = z - hh;

    // ⬇️ ONLY add ground tile if NOT a path tile
    if (t !== 'P') {
      const gTile = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize, 0.3, tileSize),
        groundMaterials[t]
      );
      gTile.position.set(gx, 0, gz);
      gTile.userData.walkable = walkableTiles.includes(t);
      scene.add(gTile);
    }

    // ⬇️ Your custom path handling starts here
    if (t === 'P') {
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize, 0.1, tileSize),
        groundMaterials.P
      );
      plate.position.set(gx, -0.02, gz);
      plate.userData.walkable = true;
      scene.add(plate);

      const file = randomPathFile();
      const placePath = (srcScene) => {
        const mdl = srcScene.clone(true);
        scaleToTile(mdl, 1);
        mdl.position.set(gx, 0.1, gz);
        mdl.userData.walkable = true;
        scene.add(mdl);
      };

      const cached = cache.get(file);
      if (cached) {
        placePath(cached);
      } else {
        loader.load(`./assets/paths/${file}`, (gltf) => {
          cache.set(file, gltf.scene);
          placePath(gltf.scene);
        },
        undefined,
        (err) => console.error('[PATH] load error', err));
      }
    }

    // (Trees, bushes, rails etc. follow below)






      /* -------- TREE (optimised) -------- */
      if (t === 'T') {
        const tree = cache.get(rand(treeFiles)).clone(true);
        scaleToTile(tree, 0.7 + Math.random() * 1.1);
        tree.position.set(gx, 0.05, gz);
        tree.userData.walkable = false;
        scene.add(tree);
        continue;
      }

      /* -------- BUSH (optimised) -------- */
      if (t === 'B') {
        for (let i = 0; i < 3; i++) {
          const bush = cache.get(rand(bushFiles)).clone(true);
          scaleToTile(bush, 0.6 + Math.random() * 0.6);
          const ox = (Math.random() - 0.5) * tileSize * 0.6;
          const oz = (Math.random() - 0.5) * tileSize * 0.6;
          bush.position.set(gx + ox, 0.05, gz + oz);
          bush.userData.walkable = false;
          scene.add(bush);
        }
        continue;
      }

      /* -------- RAILING (optimised) -------- */
      if (t === 'R') {
        // under-tile already placed (gTile)
        const L = x > 0            && mapLayout[z][x - 1] === 'R';
        const R = x < mapWidth - 1 && mapLayout[z][x + 1] === 'R';
        const U = z > 0            && mapLayout[z - 1][x] === 'R';
        const D = z < mapHeight-1  && mapLayout[z + 1][x] === 'R';

        const isCorner = (L || R) && (U || D);
        const rail = cache.get(isCorner ? 'fence_corner.glb' : 'fence_simple.glb').clone(true);
        scaleToTile(rail, 1);

        // orientation
        if (isCorner) {
          if (U && R)           {}
          else if (R && D) rail.rotation.y =  Math.PI / 2;
          else if (D && L) rail.rotation.y =  Math.PI;
          else if (L && U) rail.rotation.y = -Math.PI / 2;
        } else {
          if (!(L || R)) rail.rotation.y = Math.PI / 2;
        }

        const half = tileSize * 0.5;
        if (isCorner) {
          if (U && R)           { rail.translateZ(-half); rail.translateX(-half); }
          else if (R && D) { rail.translateX(-half); rail.translateZ( half); }
          else if (D && L) { rail.translateZ( half); rail.translateX( half); }
          else if (L && U) { rail.translateX( half); rail.translateZ(-half); }
        } else {
          rail.translateZ(half);
        }

        rail.position.add(new THREE.Vector3(gx, 0.05, gz));
        rail.userData.walkable = false;
        scene.add(rail);

        // decorative bushes
        for (let i = 0; i < 4; i++) {
          const bush = cache.get(rand(bushFiles)).clone(true);
          scaleToTile(bush, 0.35 + Math.random() * 0.15);
          const ox = (Math.random() - 0.5) * tileSize * 0.5;
          const oz = (Math.random() - 0.5) * tileSize * 0.5;
          bush.position.set(gx + ox, 0.03, gz + oz);
          bush.userData.walkable = false;
          scene.add(bush);
        }
        continue;
      }
      /* other tile letters (G, S, D, W, X) need no extra work — ground already placed */
    }
  }
}

/* ──────────────────────
   HELPERS NEEDED BY GAME
────────────────────────*/
function getWalkablePositions() {
  const out = [];
  const hw  = mapWidth  / 2, hh = mapHeight / 2;
  for (let z = 0; z < mapHeight; z++)
    for (let x = 0; x < mapWidth; x++)
      if (walkableTiles.includes(mapLayout[z][x]))
        out.push({ x: x - hw, z: z - hh });
  return out;
}

function getSpawnPosition() {
  const hw = mapWidth / 2, hh = mapHeight / 2;
  for (let z = 0; z < mapHeight; z++) {
    const i = mapLayout[z].indexOf('X');
    if (i !== -1) return { x: i - hw, z: z - hh };
  }
  return { x: 0, z: 0 };
}

export { createMap, getWalkablePositions, getSpawnPosition, tileSize };
