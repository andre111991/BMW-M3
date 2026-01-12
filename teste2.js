import * as THREE from 'three';

// 1. Configurações Iniciais
const config = { trees: true };
const scene = new THREE.Scene();

// 2. Parâmetros da Pista (Movido para o topo para que todos possam usar)
const raioPista = 225;
const larguraPista = 45;
const circunferenciaDentro = raioPista - larguraPista;
const circunferenciaFora = raioPista + larguraPista;
const angulo1 = (1/3) * Math.PI;
const alturaTriangulo1 = Math.sin(angulo1) * circunferenciaDentro; 
const angulo2 = Math.asin(alturaTriangulo1 / circunferenciaFora);
const centro1 = (Math.cos(angulo1)*circunferenciaDentro + Math.cos(angulo2)*circunferenciaFora)/2;
const angulo3 = Math.acos(centro1 / circunferenciaDentro);
const angulo4 = Math.acos(centro1 / circunferenciaFora);

const ListaCores = [ 0x00F5FF, 0xFF00FF, 0x7000FF, 0xFF5F1F, 0x39FF14, 0xFF3131 ];

// 3. Funções de Utilidade
function Colors(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

// 4. Funções de Criação de Objetos (Carro, Camião, Árvore)
function Wheel() {
    return new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
}

function FrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; context.fillRect(0,0,64,32);
    context.fillStyle = "#666666"; context.fillRect(8,8,48,24);
    return new THREE.CanvasTexture(canvas);
}

function SideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; context.fillRect(0,0,128,32);
    context.fillStyle = "#666666"; context.fillRect(10,8,38,24);
    context.fillRect(58,8,60,24);
    return new THREE.CanvasTexture(canvas);
}

function Car() {
    const car = new THREE.Group();
    const CorCarro = Colors(ListaCores);
    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: CorCarro })
    );
    main.position.z = 12;
    car.add(main);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: FrontTexture() }),
        new THREE.MeshLambertMaterial({ map: FrontTexture() }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    ]);
    cabin.position.set(-6, 0, 25.5);
    car.add(cabin);

    const backWheel = Wheel(); backWheel.position.set(-18, 0, 6); car.add(backWheel);
    const frontWheel = Wheel(); frontWheel.position.set(18, 0, 6); car.add(frontWheel);

    return car;
}

function Truck() {
    const truck = new THREE.Group();
    const Cor = Colors(ListaCores);
    const base = new THREE.Mesh(new THREE.BoxGeometry(100, 25, 5), new THREE.MeshLambertMaterial({ color: Cor }));
    base.position.z = 10; truck.add(base);
    
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(75, 35, 40), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    trailer.position.set(-15, 0, 30); truck.add(trailer);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(25, 30, 30), new THREE.MeshLambertMaterial({ color: Cor }));
    cabin.position.set(40, 0, 20); truck.add(cabin);

    return truck;
}

function Tree() {
    const tree = new THREE.Group();
    const tronco = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 30), new THREE.MeshLambertMaterial({color: 0x4b3f2f }));
    tronco.position.z = 15; tree.add(tronco);
    const height = Colors([45, 60, 75]);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(height / 2, 20, 20), new THREE.MeshLambertMaterial({ color: 0x498c2c}));
    crown.position.z = (height / 2) + 30; tree.add(crown);
    return tree;
}

// 5. Funções do Mapa
function getilhaUM() {
    const shape = new THREE.Shape();
    shape.absarc(-centro1, 0, circunferenciaDentro, angulo1, -angulo1, false);
    shape.absarc(centro1, 0, circunferenciaFora, Math.PI + angulo2, Math.PI - angulo2, true);
    return shape;
}

function getilhaDois() {
    const shape = new THREE.Shape();
    shape.absarc(-centro1, 0, circunferenciaDentro, angulo3, -angulo3, true);
    shape.absarc(centro1, 0, circunferenciaDentro, Math.PI + angulo3, Math.PI - angulo3, true);
    return shape;
}

function getilhaTres() {
    const shape = new THREE.Shape();
    shape.absarc(centro1, 0, circunferenciaDentro, Math.PI - angulo1, Math.PI + angulo1, true);
    shape.absarc(-centro1, 0, circunferenciaFora, -angulo2, angulo2, false);
    return shape;
}

function getparteFora(mapWidth, mapHeight) {
    const shape = new THREE.Shape();
    shape.moveTo(-mapWidth / 2, -mapHeight / 2);
    shape.lineTo(mapWidth / 2, -mapHeight / 2);
    shape.lineTo(mapWidth / 2, mapHeight / 2);
    shape.lineTo(-mapWidth / 2, mapHeight / 2);
    
    // Buracos para a pista
    const hole1 = new THREE.Path();
    hole1.absarc(-centro1, 0, circunferenciaFora, 0, Math.PI * 2, true);
    shape.holes.push(hole1);
    
    const hole2 = new THREE.Path();
    hole2.absarc(centro1, 0, circunferenciaFora, 0, Math.PI * 2, true);
    shape.holes.push(hole2);

    return shape;
}

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth; canvas.height = mapHeight;
    const context = canvas.getContext("2d");
    context.fillStyle = "#546E90"; context.fillRect(0, 0, mapWidth, mapHeight);
    context.lineWidth = 2; context.strokeStyle = "#E0FFFF"; context.setLineDash([10, 14]);
    
    context.beginPath(); context.arc(mapWidth/2 - centro1, mapHeight/2, raioPista, 0, Math.PI*2); context.stroke();
    context.beginPath(); context.arc(mapWidth/2 + centro1, mapHeight/2, raioPista, 0, Math.PI*2); context.stroke();
    return new THREE.CanvasTexture(canvas);
}

function renderMap(mapWidth, mapHeight) {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(mapWidth, mapHeight),
        new THREE.MeshLambertMaterial({ map: getLineMarkings(mapWidth, mapHeight) })
    );
    scene.add(plane);

    const fieldGeometry = new THREE.ExtrudeGeometry(
        [getilhaUM(), getilhaDois(), getilhaTres()],
        { depth: 6, bevelEnabled: false }
    );
    const fieldMesh = new THREE.Mesh(fieldGeometry, new THREE.MeshLambertMaterial({ color: 0x67c240 }));
    fieldMesh.position.z = 1;
    scene.add(fieldMesh);

    if (config.trees) {
        for(let i=0; i<10; i++) {
            const tree = Tree();
            tree.position.set((Math.random()-0.5)*800, (Math.random()-0.5)*400, 0);
            scene.add(tree);
        }
    }
}

// 6. Configuração da Câmara e Renderer
const aspect = window.innerWidth / window.innerHeight;
const width = 960;
const height = width / aspect;
const camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 1, 2000);
camera.position.set(0, -210, 300);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 7. Lógica do Jogo
const playerCar = Car();
scene.add(playerCar);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); dirLight.position.set(100, -300, 400); scene.add(dirLight);

renderMap(width, height * 2);

let playerAngleMoved = 0;
const speed = 0.0017;
let lastTimestamp;
let accelerate = false;

function movePlayerCar(timeDelta) {
    const playerSpeed = accelerate ? speed * 2 : speed;
    playerAngleMoved -= playerSpeed * timeDelta;
    const totalAngle = Math.PI + playerAngleMoved;

    playerCar.position.x = Math.cos(totalAngle) * raioPista - centro1;
    playerCar.position.y = Math.sin(totalAngle) * raioPista;
    playerCar.rotation.z = totalAngle - Math.PI / 2;
}

function animation(timestamp) {
    if (!lastTimestamp) { lastTimestamp = timestamp; return; }
    const delta = timestamp - lastTimestamp;
    movePlayerCar(delta);
    renderer.render(scene, camera);
    lastTimestamp = timestamp;
}

window.addEventListener("keydown", (e) => { 
    if(e.key === "ArrowUp") { accelerate = true; renderer.setAnimationLoop(animation); }
});
window.addEventListener("keyup", (e) => { 
    if(e.key === "ArrowUp") accelerate = false; 
});

renderer.render(scene, camera);