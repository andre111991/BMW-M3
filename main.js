//userdata faz com a transiçao seja suave e tenha a sensaçao de movimento, senão é instantaneo

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
let articulatedGate = null;

const playerCar = Car(true) // true indica que é o carro do jogador que usa as portas e o capô articulados
scene.add(playerCar)

//...............................luzes...................................................

const ambientLight = new THREE.AmbientLight(0xffffff, 1); //cor e intensidade
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

//................................Camera................................................

const aspectratio = window.innerWidth / window.innerHeight;
const camerawidth = 1500;
const cameraheight = camerawidth / aspectratio;

const camera = new THREE.OrthographicCamera(            // diferente da camera das aulas
    camerawidth / -2,                                   // camera estilo cubo, 2px para cada lado nos eixos
    camerawidth / 2,
    cameraheight / 2,
    cameraheight / -2,
    1,                              //plano perto e plano longe 
    2300
);

camera.position.set(0,-210,300);
camera.lookAt(0,0,0);

renderMap(camerawidth, cameraheight*2);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

//....................................mapa..............................................

function renderMap(mapWidth, mapHeight) {

    const mapTexture = getLineMarkings (mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: mapTexture });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial); // cria se o plano e adiciona se a textura = mesh
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

    new THREE.MeshLambertMaterial({ color: 0x67c240 }), // verde de cima
    new THREE.MeshLambertMaterial({ color: 0x23311c }), // verde dos lados 
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

  // Adicionar portão articulado no círculo direito (onde circulam os outros veículos)
  // Posicionar na parte superior do círculo (ângulo Math.PI/2)
  articulatedGate = ArticulatedGate();
  const gateAngle = Math.PI / 2; // Posição na parte superior do círculo (90 graus)
  const gateCenterX = centro1 + Math.cos(gateAngle) * raioPista;
  const gateCenterY = Math.sin(gateAngle) * raioPista;
  
  articulatedGate.position.x = gateCenterX;
  articulatedGate.position.y = gateCenterY;
  // Rotacionar o portão para ficar perpendicular à direção tangencial da pista
  // A direção tangencial em Math.PI/2 é horizontal (esquerda-direita)
  articulatedGate.rotation.z = gateAngle - Math.PI / 2; // Rotacionar para ficar horizontal
  articulatedGate.userData.gatePosition = {
    x: gateCenterX,
    y: gateCenterY,
    angle: gateAngle
  };
  scene.add(articulatedGate);
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
    parteFora.lineTo(mapWidth / 2, mapHeight / 2);            // isto é o que verdadeiramente desenha o verde 
    parteFora.lineTo(-mapWidth / 2, mapHeight / 2);

    return parteFora;

}


//.................................. carro..............


function Colors(Array) { 
    return Array[Math.floor(Math.random() * Array.length)];       //funçao "random" inicialmente usada para escolher a cor do carro depois foi usada para outras coisas, mas mantive o nome
}

function Car(isPlayerCar = false) { //é falso para puder usar o carro sem as portas e o capo no lado do "pc" senao ia ter de usar os carros todos com as portas e o capo
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
    TexturaTrasCarro.center = new THREE.Vector2(0.5, 0.5); // usei para poder rodar a textura senao ele roda como eixo no canto inferior esquerdo e para poder rodar a textura no meio
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
                                                        // tamanho do caixote da cabine
    const cabin = new THREE.Mesh( new THREE.BoxGeometry(33,24,12),[   // map é usado como o color só que serve para embrulhar um objeto 2d em 3d (Canvas das janelas do carro)
        new THREE.MeshLambertMaterial({ map: TexturaFrenteCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaTrasCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaLadoEsquerdoCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaLadoDireitoCarro }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // teto
        new THREE.MeshLambertMaterial({ color: 0xffffff }) // debaixo do cubo
    ]);

    cabin.position.x=-6
    cabin.position.z=25.5
    car.add(cabin);

    
    if (isPlayerCar) {
        const hoodGroup = new THREE.Group();
        const hood = new THREE.Mesh(
            new THREE.BoxGeometry(25, 30, 3), 
            new THREE.MeshLambertMaterial({ color: CorCarro })
        );
        hood.position.x = 12.5; // Metade do comprimento do capô (centro do capô)
        hood.position.y = 0;
        hood.position.z = 1.5; // Metade da altura do capô
        hoodGroup.add(hood);
        
        hoodGroup.position.x = 5; // Parte traseira do capô (beira do vidro)
        hoodGroup.position.y = 0;
        hoodGroup.position.z = 19.5; // Parte superior do carro (topo do main)
        hoodGroup.rotation.y = 0; // Inicialmente fechado (rotação em Y, negativo abre para cima)
        car.add(hoodGroup);

      
        const leftDoorGroup = new THREE.Group();
        const leftDoor = new THREE.Mesh(
            new THREE.BoxGeometry(3, 20, 12), // Largura, altura, profundidade
            new THREE.MeshLambertMaterial({ color: CorCarro })
        );
        
        leftDoor.position.x = 0;
        leftDoor.position.y = 1.5; 
        leftDoor.position.z = 6; 
        leftDoorGroup.add(leftDoor);
        
        leftDoorGroup.position.x = 0;
        leftDoorGroup.position.y = -15; 
        leftDoorGroup.position.z = 0;
        leftDoorGroup.rotation.z = 0; 
        car.add(leftDoorGroup);

        
        const rightDoorGroup = new THREE.Group();
        const rightDoor = new THREE.Mesh(
            new THREE.BoxGeometry(3, 20, 12),
            new THREE.MeshLambertMaterial({ color: CorCarro })
        );
        
        rightDoor.position.x = 0;
        rightDoor.position.y = -1.5; 
        rightDoor.position.z = 6; 
        rightDoorGroup.add(rightDoor);
        
        rightDoorGroup.position.x = 0;
        rightDoorGroup.position.y = 15; 
        rightDoorGroup.position.z = 0;
        rightDoorGroup.rotation.z = 0; 
        car.add(rightDoorGroup);

        // Armazenar referências e estados no userData do carro
        car.userData = {
            hoodGroup: hoodGroup,
            leftDoorGroup: leftDoorGroup,
            rightDoorGroup: rightDoorGroup,
            hoodOpen: false,
            doorsOpen: false,
            hoodTargetRotation: 0, // 0 = fechado, Math.PI / 2.5 = aberto (~72 graus)
            hoodCurrentRotation: 0,
            doorsTargetRotation: 0, // 0 = fechado, Math.PI / 3 = aberto (60 graus)
            doorsCurrentRotation: 0,
            hoodRotationSpeed: 0.06, // Velocidade de animação do capô
            doorsRotationSpeed: 0.05 // Velocidade de animação das portas
        };
    }

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
    context.fillRect(0,0,64,32); //(x, y, largura, altura)

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
  tronco.matrixAutoUpdate = false;
  tree.add(tronco);

  const treeHeights = [45, 60, 75];
  const height = Colors(treeHeights);

  const crown = new THREE.Mesh(new THREE.SphereGeometry(height / 2, 30, 30), new THREE.MeshLambertMaterial({ color: 0x498c2c}));
  crown.position.z = height / 2 + 30;
  tree.add(crown);

  return tree;
}

//.................................. portão articulado.....................................

function ArticulatedGate() {
  const gate = new THREE.Group();

  // Largura do portão (cobre a largura da pista)
  const gateWidth = larguraPista * 2 + 20; // Largura da pista + margem
  const gateHeight = 60; // Altura dos postes
  const gateBarHeight = 8; // Altura da cancela
  const gateBarDepth = 6; // Profundidade da cancela

  // Poste esquerdo (suporte fixo) - lado interno da pista
  const leftPost = new THREE.Mesh(
    new THREE.BoxGeometry(8, 8, gateHeight),
    new THREE.MeshLambertMaterial({ color: 0x555555 }) // cor do poste
  );
  leftPost.position.x = -gateWidth / 2;
  leftPost.position.z = gateHeight / 2;
  gate.add(leftPost);

  // Poste direito (suporte fixo) - lado externo da pista
  const rightPost = new THREE.Mesh(
    new THREE.BoxGeometry(8, 8, gateHeight),
    new THREE.MeshLambertMaterial({ color: 0x555555 })
  );
  rightPost.position.x = gateWidth / 2;
  rightPost.position.z = gateHeight / 2;
  gate.add(rightPost);

  
  const gateArmGroup = new THREE.Group();
  
  // Braço da cancela (barra horizontal quando fechada)
  const gateArm = new THREE.Mesh(
    new THREE.BoxGeometry(gateWidth, gateBarHeight, gateBarDepth),
    new THREE.MeshLambertMaterial({ color: 0xFFD700 })
  );
  gateArm.position.x = gateWidth / 2; // Centro da cancela
  gateArm.position.z = gateHeight - 10; // Altura da cancela (próximo ao topo dos postes)
  gateArmGroup.add(gateArm);

  // Eixo de rotação (dobradiça) - posicionado no poste esquerdo
  gateArmGroup.position.x = -gateWidth / 2;
  gateArmGroup.position.z = gateHeight - 10;
  gateArmGroup.rotation.z = 0; // Inicialmente fechado (horizontal, 0 graus)
  
  gate.add(gateArmGroup);

  // Armazenar referências e estado
  gate.userData = {
    gateArmGroup: gateArmGroup,
    isOpen: false,
    targetRotation: 0, // 0 = fechado (horizontal), Math.PI/2 = aberto (vertical, 90 graus para cima)
    currentRotation: 0,
    rotationSpeed: 0.08, // Velocidade de abertura/fechamento (radianos por frame)
    gateWidth: gateWidth,
    gatePosition: { x: 0, y: 0, angle: 0 } // Posição do portão na pista
  };

  return gate;
}


function getLineMarkings(mapWidth, mapHeight) {  // função para desenhar as linhas do mapa
  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  const context = canvas.getContext("2d");

  context.fillStyle = "#546E90";
  context.fillRect(0, 0, mapWidth, mapHeight); // Cria o retangulo por debaixo das linhas e do verde (x, y, largura, altura)

  context.lineWidth = 2; // espessura da linha
  context.strokeStyle = "#E0FFFF";
  context.setLineDash([10, 14]); // define a linha tracejada [tamanho do traço, espaço entre traços]

// Circulo Esquerdo
  context.beginPath(); // torna o desenho independente
  context.arc( mapWidth / 2 - centro1, mapHeight / 2, raioPista, 0, Math.PI * 2 );
  context.stroke(); // desenha a linha

  // Círculo Direito
  context.beginPath();
  context.arc(mapWidth / 2 + centro1, mapHeight / 2, raioPista, 0, Math.PI * 2);
  context.stroke();

  return new THREE.CanvasTexture(canvas);
}

//.................................. Logica do jogo .....................................

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
    playerAngleMoved = 0;  // posiciona o carro do jogador no angulo inicial
    movePlayerCar(0); // atualiza a posiçao do carro do jogador para onde ele começa
    score = 0;
    scoreElement.innerText = score;
    lastTimestamp = undefined;

    otherVehicles.forEach((vehicle) => {
        scene.remove(vehicle.mesh);
    });
    otherVehicles = []; // apaga os carros existentes

    // Resetar estado do portão articulado
    if (articulatedGate && articulatedGate.userData) {
        articulatedGate.userData.isOpen = false;
        articulatedGate.userData.targetRotation = 0;
        articulatedGate.userData.currentRotation = 0;
        articulatedGate.userData.gateArmGroup.rotation.z = 0;
    }

    //............................................................................................................................

    // Resetar estado do capô e portas do carro do jogador
    if (playerCar && playerCar.userData) {
        const carData = playerCar.userData;
        carData.hoodOpen = false;
        carData.doorsOpen = false;
        carData.hoodTargetRotation = 0;
        carData.hoodCurrentRotation = 0;
        carData.doorsTargetRotation = 0;
        carData.doorsCurrentRotation = 0;
        carData.hoodGroup.rotation.y = 0;
        carData.leftDoorGroup.rotation.z = 0;
        carData.rightDoorGroup.rotation.z = 0;
    }

    renderer.render(scene, camera);
    ready = true;
}

function startGame() {

    if (ready) {
        ready = false;
        renderer.setAnimationLoop(animation);
    }
}

function animateArticulatedGate(timeDelta) {
  if (!articulatedGate || !articulatedGate.userData) return;

  const gateData = articulatedGate.userData;
  
  // Animação suave em direção ao ângulo alvo
  if (Math.abs(gateData.currentRotation - gateData.targetRotation) > 0.01) {
    const direction = gateData.targetRotation > gateData.currentRotation ? 1 : -1;
    gateData.currentRotation += direction * gateData.rotationSpeed;
    
    // Limitar ao ângulo alvo
    if ((direction > 0 && gateData.currentRotation >= gateData.targetRotation) ||
        (direction < 0 && gateData.currentRotation <= gateData.targetRotation)) {
      gateData.currentRotation = gateData.targetRotation;
    }
    
    gateData.gateArmGroup.rotation.z = gateData.currentRotation;
  }
}

function toggleGate() {
  if (!articulatedGate || !articulatedGate.userData) return;
  
  const gateData = articulatedGate.userData;
  gateData.isOpen = !gateData.isOpen;
  gateData.targetRotation = gateData.isOpen ? Math.PI / 2 : 0; // 90 graus quando aberto, 0 quando fechado
}

// Funções para controlar capô e portas do carro do jogador
function toggleHood() {
  if (!playerCar || !playerCar.userData) return;
  
  const carData = playerCar.userData;
  carData.hoodOpen = !carData.hoodOpen;
  carData.hoodTargetRotation = carData.hoodOpen ? Math.PI / 2.5 : 0; // ~72 graus quando aberto
}

function toggleDoors() {
  if (!playerCar || !playerCar.userData) return;
  
  const carData = playerCar.userData;
  carData.doorsOpen = !carData.doorsOpen;
  carData.doorsTargetRotation = carData.doorsOpen ? Math.PI / 3 : 0; // 60 graus quando aberto
}

function animateCarParts(timeDelta) {
  if (!playerCar || !playerCar.userData) return;
  
  const carData = playerCar.userData;
  
  // Animar capô (rotação em Y, negativo para abrir para cima)
  // O eixo está na beira do vidro (parte traseira), a frente levanta
  if (Math.abs(carData.hoodCurrentRotation - carData.hoodTargetRotation) > 0.01) {
    const direction = carData.hoodTargetRotation > carData.hoodCurrentRotation ? 1 : -1;
    carData.hoodCurrentRotation += direction * carData.hoodRotationSpeed;
    
    // Limitar ao ângulo alvo
    if ((direction > 0 && carData.hoodCurrentRotation >= carData.hoodTargetRotation) ||
        (direction < 0 && carData.hoodCurrentRotation <= carData.hoodTargetRotation)) {
      carData.hoodCurrentRotation = carData.hoodTargetRotation;
    }
    
    carData.hoodGroup.rotation.y = -carData.hoodCurrentRotation; // Rotação negativa em Y para abrir para cima
  }
  
  // Animar portas (rotação em Z para abrir para dentro/fora)
  if (Math.abs(carData.doorsCurrentRotation - carData.doorsTargetRotation) > 0.01) {
    const direction = carData.doorsTargetRotation > carData.doorsCurrentRotation ? 1 : -1;
    carData.doorsCurrentRotation += direction * carData.doorsRotationSpeed;
    
    // Limitar ao ângulo alvo
    if ((direction > 0 && carData.doorsCurrentRotation >= carData.doorsTargetRotation) ||
        (direction < 0 && carData.doorsCurrentRotation <= carData.doorsTargetRotation)) {
      carData.doorsCurrentRotation = carData.doorsTargetRotation;
    }
    
    // Porta esquerda abre para fora (rotação negativa em Z)
    carData.leftDoorGroup.rotation.z = -carData.doorsCurrentRotation;
    // Porta direita abre para fora (rotação positiva em Z)
    carData.rightDoorGroup.rotation.z = carData.doorsCurrentRotation;
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

    if (event.key === "p" || event.key === "P") {
        toggleGate();
        return;
    }

    if (event.key === "c" || event.key === "C") {
        toggleHood();
        return;
    }

    if (event.key === "v" || event.key === "V") {
        toggleDoors();
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
  if (!lastTimestamp) {             // se nao houver ultimo timestamp guarda este como ultimo
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

  // Animar portão articulado
  animateArticulatedGate(timeDelta);

  // Animar capô e portas do carro do jogador
  animateCarParts(timeDelta);

  hitDetection();

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;  // guarda numero de graus que andou

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved; // diz o ponto exato onde esta o carro 

  const playerX = Math.cos(totalPlayerAngle) * raioPista - centro1; // coordenadas do sitio inicial onde o carro esta
  const playerY = Math.sin(totalPlayerAngle) * raioPista;

  playerCar.position.x = playerX;
  playerCar.position.y = playerY;

  playerCar.rotation.z = totalPlayerAngle - Math.PI / 2; // Como estamos a mover o carro através de ângulos polares, o valor de totalPlayerAngle 
  // aponta do centro para o carro (o raio). No entanto, para o carro parecer que está a conduzir pela estrada, ele deve estar orientado pela tangente da curva. Como a tangente é perpendicular ao raio,~
  //  subtraímos pi-meios radianos (90 graus) para alinhar o modelo 3D com a direção do movimento 
}

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    const oldAngle = vehicle.angle;
    
    if (vehicle.clockwise) {
      vehicle.angle -= speed * timeDelta * vehicle.speed;
    } else {
      vehicle.angle += speed * timeDelta * vehicle.speed;
    }

    // Verificar colisão com portão fechado
    if (articulatedGate && articulatedGate.userData && !articulatedGate.userData.isOpen) {
      const gateAngle = articulatedGate.userData.gatePosition.angle || Math.PI / 2;
      
      // Normalizar ângulos para comparação (0 a 2π)
      let vehicleAngleNorm = vehicle.angle;
      while (vehicleAngleNorm < 0) vehicleAngleNorm += Math.PI * 2;
      while (vehicleAngleNorm >= Math.PI * 2) vehicleAngleNorm -= Math.PI * 2;
      
      let gateAngleNorm = gateAngle;
      while (gateAngleNorm < 0) gateAngleNorm += Math.PI * 2;
      while (gateAngleNorm >= Math.PI * 2) gateAngleNorm -= Math.PI * 2;
      
      // Calcular diferença angular mínima
      let angleDiff = Math.abs(vehicleAngleNorm - gateAngleNorm);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      
      // Se o veículo está próximo do portão (dentro de um pequeno arco de ~10 graus)
      // A largura da cancela cobre aproximadamente essa área
      if (angleDiff < 0.175) { // ~10 graus
        // Bloquear movimento - reverter para o ângulo anterior
        vehicle.angle = oldAngle;
      }
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