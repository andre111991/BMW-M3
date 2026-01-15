import * as THREE from 'three';

const config = {
  trees: true, // Add trees to the map
};

const scene = new THREE.Scene();
const raioPista = 225;
const larguraPista =45;
const circunferenciaDentro = raioPista - larguraPista;
const circunferenciaFora = raioPista + larguraPista;

const angulo1 = (1/3) * Math.PI;

const alturaTriangulo1 = Math.sin(angulo1) * circunferenciaDentro; 
const angulo2 = Math.asin(alturaTriangulo1 / circunferenciaFora);

const centro1 = 
    (
        Math.cos(angulo1)*circunferenciaDentro + Math.cos(angulo2)*circunferenciaFora
    )/2;

const angulo3 = Math.acos(centro1 / circunferenciaDentro);
const angulo4 = Math.acos(centro1 / circunferenciaFora);
const ListaCores = [ 0x00F5FF, 0xFF00FF, 0x7000FF,0xFF5F1F,0x39FF14,0xFF3131 ]
let accelerate = false;
let decelerate = false;
const playerCar = Car()
scene.add(playerCar)

//...............................luzes...................................................

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); //cor e intensidade
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

//................................Camera................................................

const aspectratio = window.innerWidth / window.innerHeight;
const camerawidth = 960;
const cameraheight = camerawidth / aspectratio;

const camera = new THREE.OrthographicCamera(            // diferente da camera das aulas
    camerawidth / -2,                                   // camera estilo cubo, 2px para cada lado nos eixos
    camerawidth / 2,
    cameraheight / 2,
    cameraheight / -2,
    0,                              //plano perto e plano longe 
    1000
);

camera.position.set(0,-210,300);
camera.lookAt(0,0,0);

renderMap(camerawidth, cameraheight*2);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
//renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

function renderMap(mapWidth, mapHeight) {

    const mapTexture = getLineMarkings (mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: mapTexture });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const ilhaUM = getilhaUM();
    const ilhaDois = getilhaDois();
    const ilhaTres = getilhaTres();
    const parteFora = getparteFora(mapWidth, mapHeight);

    const fieldGeometry = new THREE. ExtrudeGeometry(
    [ilhaUM, ilhaDois, ilhaTres, parteFora],
    { depth: 6, bevelEnabled: false }
  );

  const fieldMesh = new THREE.Mesh(fieldGeometry,[

    new THREE.MeshLambertMaterial({ color: 0x67c240 }),
    new THREE.MeshLambertMaterial({ color: 0x23311c }),
  ]);

  scene.add(fieldMesh);

  if (config.trees) {
    const tree1 = Tree();
    tree1.position.x = centro1 * 1.3;
    scene.add(tree1);

    const tree2 = Tree();
    tree2.position.y = centro1 * 1.9;
    tree2.position.x = centro1 * 1.3;
    scene.add(tree2);

    const tree3 = Tree();
    tree3.position.x = centro1 * 0.8;
    tree3.position.y = centro1 * 2;
    scene.add(tree3);

    const tree4 = Tree();
    tree4.position.x = centro1 * 1.8;
    tree4.position.y = centro1 * 2;
    scene.add(tree4);

    const tree5 = Tree();
    tree5.position.x = -centro1 * 1;
    tree5.position.y = centro1 * 2;
    scene.add(tree5);

    const tree6 = Tree();
    tree6.position.x = -centro1 * 2;
    tree6.position.y = centro1 * 1.8;
    scene.add(tree6);

    const tree7 = Tree();
    tree7.position.x = centro1 * 0.8;
    tree7.position.y = -centro1 * 2;
    scene.add(tree7);

    const tree8 = Tree();
    tree8.position.x = centro1 * 1.8;
    tree8.position.y = -centro1 * 2;
    scene.add(tree8);

    const tree9 = Tree();
    tree9.position.x = -centro1 * 1;
    tree9.position.y = -centro1 * 2;
    scene.add(tree9);

    const tree10 = Tree();
    tree10.position.x = -centro1 * 2;
    tree10.position.y = -centro1 * 1.8;
    scene.add(tree10);

    const tree11 = Tree();
    tree11.position.x = centro1 * 0.6;
    tree11.position.y = -centro1 * 2.3;
    scene.add(tree11);

    const tree12 = Tree();
    tree12.position.x = centro1 * 1.5;
    tree12.position.y = -centro1 * 2.4;
    scene.add(tree12);

    const tree13 = Tree();
    tree13.position.x = -centro1 * 0.7;
    tree13.position.y = -centro1 * 2.4;
    scene.add(tree13);

    const tree14 = Tree();
    tree14.position.x = -centro1 * 1.5;
    tree14.position.y = -centro1 * 1.8;
    scene.add(tree14);
  }
}

//................................... ilhas......................................

function getilhaUM() {
  const ilhaUM = new THREE.Shape();

  ilhaUM.absarc(        // desenha lado esquerdo da ilha
    -centro1,
    0,
    circunferenciaDentro,
    angulo1,
    -angulo1,
    false
  );

  ilhaUM.absarc(        // 
    centro1,
    0,
    circunferenciaFora,
    Math.PI + angulo2,
    Math.PI - angulo2,
    true
  );

  return ilhaUM;
}

function getilhaDois() {
  const ilhaDois = new THREE.Shape();

  ilhaDois.absarc(
    -centro1,
    0,
    circunferenciaDentro,
    angulo3,
    -angulo3,
    true
  );

  ilhaDois.absarc(
    centro1,
    0,
    circunferenciaDentro,
    Math.PI + angulo3,
    Math.PI - angulo3,
    true
  );

  return ilhaDois;
}

function getilhaTres() {
  const ilhaTres = new THREE.Shape();

  ilhaTres.absarc(
    centro1,
    0,
    circunferenciaDentro,
    Math.PI - angulo1,
    Math.PI + angulo1,
    true
  );

  ilhaTres.absarc(
    -centro1,
    0,
    circunferenciaFora,
    -angulo2,
    angulo2,
    false
  );

  return ilhaTres;

}

function getparteFora(mapWidth, mapHeight) {

    const parteFora = new THREE.Shape();

    parteFora.moveTo(-mapWidth / 2, -mapHeight / 2);
    parteFora.lineTo(0, -mapHeight / 2);

    parteFora.absarc(
        -centro1,
        0,
        circunferenciaFora,
        -angulo4, 
        angulo4, 
        true);

    parteFora.absarc(
        centro1,
        0,
        circunferenciaFora,
        Math.PI - angulo4,
        Math.PI + angulo4,
        true
    );

    parteFora.lineTo(0, -mapHeight / 2);
    parteFora.lineTo(mapWidth / 2, -mapHeight / 2);
    parteFora.lineTo(mapWidth / 2, mapHeight / 2);
    parteFora.lineTo(-mapWidth / 2, mapHeight / 2);

    return parteFora;

}


//.................................. carro..............


function Colors(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

function Car() {
    const car = new THREE.Group();

    const CorCarro = Colors(ListaCores);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60,30,15),
        new THREE.MeshLambertMaterial({ color: CorCarro })
    );

    main.position.z = 12;
    car.add(main)

    const TexturaFrenteCarro = FrontTexture();
    TexturaFrenteCarro.center = new THREE.Vector2(0.5, 0.5);
    TexturaFrenteCarro.rotation = Math.PI / 2;

    const TexturaTrasCarro = FrontTexture();
    TexturaTrasCarro.center = new THREE.Vector2(0.5, 0.5);
    TexturaTrasCarro.rotation = -Math.PI / 2;

    const TexturaLadoEsquerdoCarro = SideTexture();
    TexturaLadoEsquerdoCarro.flipY = false;

    const TexturaLadoDireitoCarro = SideTexture();


    const backWheel = new Wheel()
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = Wheel()
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const cabin = new THREE.Mesh( new THREE.BoxGeometry(33,24,12),[   // map -> mapa de cores // é o que faz as janelas do carro
        new THREE.MeshLambertMaterial({ map: TexturaFrenteCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaTrasCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaLadoEsquerdoCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaLadoDireitoCarro }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    ]);

    cabin.position.x=-6
    cabin.position.z=25.5
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);

    return car;
}

function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12,33,12),
        new THREE.MeshLambertMaterial({color: 0x333333 })
    );

    wheel.position.z = 6;
    return wheel
}

function FrontTexture(){
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0,0,64,32);

    context.fillStyle = "#666666";
    context.fillRect(8,8,48,24);

    return new THREE.CanvasTexture(canvas);
}

function SideTexture(){
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0,0,128,32);

    context.fillStyle = "#666666";
    context.fillRect(10,8,38,24);
    context.fillRect(58,8,60,24);

    return new THREE.CanvasTexture(canvas);
}

//.................................. camião.....................................
    
function Truck() {
    const truck = new THREE.Group();
    const CorCamiao = Colors(ListaCores);

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(100, 25, 5),
        new THREE.MeshLambertMaterial({ color: CorCamiao })
    );

    base.position.z = 10;
    truck.add(base);

    const trailer = new THREE.Mesh(
        new THREE.BoxGeometry(75, 35, 40),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    );

    trailer.position.x = -15;
    trailer.position.z = 30;
    trailer.castShadow = true;
    trailer.receiveShadow = true;
    truck.add(trailer);

    const backWheel = Wheel();
    backWheel.position.x = -30;
    truck.add(backWheel);

    const middleWheel = Wheel();
    middleWheel.position.x = 10;
    truck.add(middleWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 38;
    truck.add(frontWheel);

    const TexturaFrenteCamiao = truckTexturaFrente();
    TexturaFrenteCamiao.center = new THREE.Vector2(0.5, 0.5);
    TexturaFrenteCamiao.rotation = Math.PI / 2;

    const TexturaLadoEsquerdoCamiao = truckTexturaLados();
    TexturaLadoEsquerdoCamiao.flipY = false;

    const TexturaLadoDireitoCamiao = truckTexturaLados();

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(25, 30, 30), [
        new THREE.MeshLambertMaterial({ color: CorCamiao, map: TexturaFrenteCamiao }),
        new THREE.MeshLambertMaterial({ color: CorCamiao }), // back
        new THREE.MeshLambertMaterial({ color: CorCamiao, map: TexturaLadoEsquerdoCamiao }),
        new THREE.MeshLambertMaterial({ color: CorCamiao, map: TexturaLadoDireitoCamiao }),
        new THREE.MeshLambertMaterial({ color: CorCamiao }), // top
        new THREE.MeshLambertMaterial({ color: CorCamiao }) // bottom
    ]);

    cabin.position.x = 40;
    cabin.position.z = 20;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add(cabin);

    return truck;
}

function truckTexturaFrente() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(0, 5, 32, 10);

  return new THREE.CanvasTexture(canvas);
}

function truckTexturaLados () {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(17, 5, 15, 10);

  return new THREE.CanvasTexture(canvas);
}

//.................................. árvore.....................................

function Tree() {
  const tree = new THREE.Group();

  const tronco = new THREE.Mesh (new THREE.BoxGeometry(15, 15, 30), new THREE.MeshLambertMaterial({color: 0x4b3f2f }));
  tronco.position.z = 10;
  tronco.castShadow = true;
  tronco.receiveShadow = true;
  tronco.matrixAutoUpdate = false;
  tree.add(tronco);

  const treeHeights = [45, 60, 75];
  const height = Colors(treeHeights);

  const crown = new THREE.Mesh(new THREE.SphereGeometry(height / 2, 30, 30), new THREE.MeshLambertMaterial({ color: 0x498c2c}));
  crown.position.z = height / 2 + 30;
  crown.castShadow = true;
  crown.receiveShadow = false;
  tree.add(crown);

  return tree;
}


function getLineMarkings(mapWidth, mapHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  const context = canvas.getContext("2d");

  context.fillStyle = "#546E90";
  context.fillRect(0, 0, mapWidth, mapHeight);

  context.lineWidth = 2;
  context.strokeStyle = "#E0FFFF";
  context.setLineDash([10, 14]);

// Circulo Esquerdo
  context.beginPath();
  context.arc( mapWidth / 2 - centro1, mapHeight / 2, raioPista, 0, Math.PI * 2 );
  context.stroke();

  // Círculo Direito
  context.beginPath();
  context.arc(mapWidth / 2 + centro1, mapHeight / 2, raioPista, 0, Math.PI * 2);
  context.stroke();

  return new THREE.CanvasTexture(canvas);
}

let ready;
let playerAngleMoved;
let score;
const scoreElement = document.getElementById("score");
let otherVehicles = [];
let lastTimestamp;
const playerAngleInitial = Math.PI;
const speed = 0.0017;

reset();

function reset() {
    playerAngleMoved = 0;
    movePlayerCar(0);
    score = 0;
    scoreElement.innerText = score;
    lastTimestamp = undefined;

    otherVehicles.forEach((vehicle) => {
        scene.remove(vehicle.mesh);
    });
    otherVehicles = [];

    renderer.render(scene, camera);
    ready = true;
}

function startGame() {

    if (ready) {
        ready = false;
        renderer.setAnimationLoop(animation);
    }
}


window.addEventListener("keydown", function (event){
    if(event.key === "ArrowUp") {
        startGame();
        accelerate = true;
        return;
    }

    if (event.key === "ArrowDown") {
        decelerate = true;
        return;
    }

    if (event.key === "r" || event.key === "R") {
        reset();
        return;
    }
});

window.addEventListener("keyup", function (event){
    if (event.key === "ArrowUp") {
        accelerate = false;
        return;
    }

    if (event.key === "ArrowDown") {
        decelerate = false;
        return;
    }   
});

function animation(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }

  const timeDelta = timestamp - lastTimestamp;

  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));

  
  if (laps != score) {
    score = laps;
    scoreElement.innerText = score;
  }


  if (otherVehicles.length < (laps + 1) / 5) addVehicle();

  moveOtherVehicles(timeDelta);

  hitDetection();

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

  const playerX = Math.cos(totalPlayerAngle) * raioPista - centro1;
  const playerY = Math.sin(totalPlayerAngle) * raioPista;

  playerCar.position.x = playerX;
  playerCar.position.y = playerY;

  playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
}

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    if (vehicle.clockwise) {
      vehicle.angle -= speed * timeDelta * vehicle.speed;
    } else {
      vehicle.angle += speed * timeDelta * vehicle.speed;
    }

    const vehicleX = Math.cos(vehicle.angle) * raioPista + centro1;
    const vehicleY = Math.sin(vehicle.angle) * raioPista;
    const rotation =
      vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);
    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function getPlayerSpeed() {
  if (accelerate) return speed * 2;
  if (decelerate) return speed * 0.5;
  return speed;
}

function addVehicle() {
    const vehicleTypes = ["car", "truck"];

    const type = Colors(vehicleTypes);
    const mesh = type === "car" ? Car() : Truck();
    scene.add(mesh);

    const clockwise = Math.random() >= 0.5;
    const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;
    
    const speed = getVehicleSpeed(type);

    otherVehicles.push({ mesh, type, clockwise, angle, speed });

}

function getVehicleSpeed(type) {
  if (type == "car") {
    const minimumSpeed = 1;
    const maximumSpeed = 2;
    return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
  }
  if (type == "truck") {
    const minimumSpeed = 0.6;
    const maximumSpeed = 1.5;
    return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
  }
}


function getHitZonePosition(center, angle, clockwise, distance) {
  const directionAngle = angle + (clockwise ? -Math.PI / 2 : +Math.PI / 2);
  return {
    x: center.x + Math.cos(directionAngle) * distance,
    y: center.y + Math.sin(directionAngle) * distance
  };
}

function hitDetection() {

    // Hit zones para o carro do jogador
  const playerHitZone1 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    15
  );

  const playerHitZone2 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    -15
  );

  // hit zones para os carros em loop
  const hit = otherVehicles.some((vehicle) => {
    if (vehicle.type == "car") {
      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        15
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -15
      );

      // The player hits another vehicle
      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;

      // Another vehicle hits the player
      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }

    if (vehicle.type == "truck") {

      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        35
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        0
      );

      const vehicleHitZone3 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -35
      );

      // The player hits another vehicle
      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone3) < 40) return true;

      // Another vehicle hits the player
      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }
  });

  if (hit) renderer.setAnimationLoop(null); // Stop animation loop
  
}

// carros batem se a frente for menor que 40 unidades da frente do outro carro
// e calculado com o teorema de pitagoras
function getDistance(coordinate1, coordinate2) {
  const horizontalDistance = coordinate2.x - coordinate1.x;
  const verticalDistance = coordinate2.y - coordinate1.y;
  return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
}