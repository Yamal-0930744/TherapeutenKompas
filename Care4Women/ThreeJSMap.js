// ThreeJSMap.js
// Map layout symbols:
// P = Path (walkable)
// G = Grass (walkable)
// S = Town square (walkable, special area)
// R = Railing (not walkable)
// B = Bushes (not walkable)
// T = Tree (not walkable)
// D = Dirt (not walkable)
// W = Water (not walkable)
// X = Spawn point (walkable, unique)

const textureLoader = new THREE.TextureLoader();
const loader = new THREE.GLTFLoader();

const mapLayout = [
  "TTTTTTTTTTTTTTTTTTTTTTTTTTWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "TRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRT",
  "TRPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPRT",
  "TRPXRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRPRT",
  "TRPRTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTRRT",
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

while (mapLayout.length < 60) {
  mapLayout.push(mapLayout[mapLayout.length % 22]);
}

const groundMaterials = {
  P: new THREE.MeshLambertMaterial({ color: 0x808080 }),
  G: new THREE.MeshLambertMaterial({ color: 0x90EE90 }),
  S: new THREE.MeshLambertMaterial({ color: 0xD2B48C }),
  R: new THREE.MeshLambertMaterial({ color: 0xB22222 }),
  B: new THREE.MeshLambertMaterial({ color: 0xFFC0CB }),
  T: new THREE.MeshLambertMaterial({ color: 0x006400 }),
  D: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
  W: new THREE.MeshLambertMaterial({ color: 0x0000FF }),
  X: new THREE.MeshLambertMaterial({ color: 0xFFD700 })
};

const walkableTiles = ['P', 'G', 'S', 'X'];

const tileSize = 1;
const mapWidth = mapLayout[0].length;
const mapHeight = mapLayout.length;

const pathVariants = [
  { file: 'path_stoneCircle.glb', weight: 60 },
  { file: 'path_stone.glb',       weight: 20 },
  { file: 'path_stoneCorner.glb', weight: 15 },
  { file: 'path_stoneEnd.glb',    weight: 5 }
];
const weightedList = [];
pathVariants.forEach(v => { for (let i = 0; i < v.weight; i++) weightedList.push(v.file); });
const randomPathFile = () => weightedList[Math.floor(Math.random() * weightedList.length)];

const treeFiles = [
  'tree_cone.glb',
  'tree_default_dark.glb',
  'tree_detailed_dark.glb',
  'tree_pineTallB_detailed.glb',
  'tree_pineTallC_detailed.glb',
  'tree_pineTallD_detailed.glb'
];
const randomTreeFile = () => treeFiles[Math.floor(Math.random() * treeFiles.length)];

function createMap(scene) {
  const halfWidth = mapWidth / 2;
  const halfHeight = mapHeight / 2;

  for (let z = 0; z < mapHeight; z++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileChar = mapLayout[z][x];
      const posX = x - halfWidth;
      const posZ = z - halfHeight;

      if (tileChar === 'P') {
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(tileSize, 0.1, tileSize),
          new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        base.position.set(posX, -0.05, posZ);
        scene.add(base);

        loader.load(`./assets/${randomPathFile()}`, (gltf) => {
          const model = gltf.scene;
          model.traverse((c)=>{ if(c.isMesh){
            c.geometry.computeBoundingBox();
            const box=c.geometry.boundingBox; const size=new THREE.Vector3(); box.getSize(size);
            const s= tileSize / Math.max(size.x,size.z);
            model.scale.set(s,s,s); c.position.y=(box.max.y-box.min.y)/2;
          }});
          model.position.set(posX,0.05,posZ);
          model.userData.walkable=true;
          scene.add(model);
        });

      } else if (tileChar === 'T') {
        const tile = new THREE.Mesh(
          new THREE.BoxGeometry(tileSize, 0.3, tileSize),
          groundMaterials['T']
        );
        tile.position.set(posX, 0, posZ);
        tile.userData.walkable = false;
        scene.add(tile);

        loader.load(`./assets/trees/${randomTreeFile()}`, (gltf) => {
          const tree = gltf.scene;
          tree.traverse((c) => {
            if (c.isMesh) {
              c.geometry.computeBoundingBox();
              const box = c.geometry.boundingBox;
              const size = new THREE.Vector3();
              box.getSize(size);
              const scaleFactor = tileSize * (0.7 + Math.random() * 1.1); // tussen 0.7 en 1.8
              const s = scaleFactor / Math.max(size.x, size.z);
              tree.scale.set(s, s, s);
            }
          });
          tree.position.set(posX, 0.05, posZ);
          tree.userData.walkable = false;
          scene.add(tree);
        });

      } else if (groundMaterials[tileChar]) {
        const material = groundMaterials[tileChar];
        const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 0.3, tileSize), material);
        tile.position.set(posX, 0, posZ);
        tile.userData.walkable = walkableTiles.includes(tileChar);
        scene.add(tile);
      }
    }
  }
}

function getWalkablePositions() {
  const positions = [];
  const halfWidth = mapWidth / 2;
  const halfHeight = mapHeight / 2;

  for (let z = 0; z < mapHeight; z++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileChar = mapLayout[z][x];
      if (walkableTiles.includes(tileChar)) {
        positions.push({ x: x - halfWidth, z: z - halfHeight });
      }
    }
  }
  return positions;
}

function getSpawnPosition() {
  const halfWidth = mapWidth / 2;
  const halfHeight = mapHeight / 2;

  for (let z = 0; z < mapHeight; z++) {
    const xIndex = mapLayout[z].indexOf('X');
    if (xIndex !== -1) {
      return { x: xIndex - halfWidth, z: z - halfHeight };
    }
  }
  return { x: 0, z: 0 };
}

export { createMap, getWalkablePositions, getSpawnPosition, tileSize };
