import * as THREE from 'three';

// --- CONFIGURAÇÃO E CONSTANTES ---
const config = { trees: true };
const ListaCores = [ 0x00F5FF, 0xFF00FF, 0x7000FF, 0xFF5F1F, 0x39FF14, 0xFF3131 ];

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

function Colors(Array) { return Array[Math.floor(Math.random() * Array.length)]; }

// --- FUNÇÕES DE CRIAÇÃO ---
function Wheel() {
    return new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
}

function FrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 32;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,64,32);
    ctx.fillStyle = "#666666"; ctx.fillRect(8,8,48,24);
    return new THREE.CanvasTexture(canvas);
}

function SideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 32;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,128,32);
    ctx.fillStyle = "#666666"; ctx.fillRect(10,8,38,24); ctx.fillRect(58,8,60,24);
    return new THREE.CanvasTexture(canvas);
}

function Car() {
    const car = new THREE.Group();
    const cor = Colors(ListaCores);
    const body = new THREE.Mesh(new THREE.BoxGeometry(60,30,15), new THREE.MeshLambertMaterial({color: cor}));
    body.position.z = 12; car.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33,24,12), [
        new THREE.MeshLambertMaterial({ map: FrontTexture() }),
        new THREE.MeshLambertMaterial({ map: FrontTexture() }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    ]);
    cabin.position.set(-6, 0, 25.5); car.add(cabin);
    const fw = Wheel(); fw.position.set(18, 0, 6); car.add(fw);
    const bw = Wheel(); bw.position.set(-18, 0, 6); car.add(bw);
    return car;
}

function Truck() {
    const truck = new THREE.Group();
    const cor = Colors(ListaCores);
    const base = new THREE.Mesh(new THREE.BoxGeometry(100, 25, 5), new THREE.MeshLambertMaterial({ color: cor }));
    base.position.z = 10; truck.add(base);
    const trailer = new THREE.Mesh(new THREE.BoxGeometry(75, 35, 40), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    trailer.position.set(-15, 0, 30); truck.add(trailer);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(25, 30, 30), new THREE.MeshLambertMaterial({ color: cor }));
    cabin.position.set(40, 0, 20); truck.add(cabin);
    const w1 = Wheel(); w1.position.set(-30, 0, 6); truck.add(w1);
    const w2 = Wheel(); w2.position.set(10, 0, 6); truck.add(w2);
    const w3 = Wheel(); w3.position.set(38, 0, 6); truck.add(w3);
    return truck;
}

function Tree() {
    const tree = new THREE.Group();
    const tronco = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 30), new THREE.MeshLambertMaterial({color: 0x4b3f2f }));
    tronco.position.z = 10; tree.add(tronco);
    const h = Colors([45, 60, 75]);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(h/2, 20, 20), new THREE.MeshLambertMaterial({ color: 0x498c2c}));
    crown.position.z = (h/2) + 30; tree.add(crown);
    return tree;
}

// --- CONFIGURAÇÃO DA CENA ---
const scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6); dirLight.position.set(100, -300, 400); scene.add(dirLight);

const aspect = window.innerWidth / window.innerHeight;
const viewW = 960; const viewH = viewW / aspect;
const camera = new THREE.OrthographicCamera(viewW/-2, viewW/2, height/2, height/-2, 1, 1000);
camera.position.set(0, -210, 300); camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- MAPA ---
function renderMap(w, h) {
    const getLineMarkings = (w, h) => {
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#546E90"; ctx.fillRect(0,0,w,h);
        ctx.lineWidth = 2; ctx.strokeStyle = "#E0FFFF"; ctx.setLineDash([10, 14]);
        ctx.beginPath(); ctx.arc(w/2 - centro1, h/2, raioPista, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2 + centro1, h/2, raioPista, 0, Math.PI*2); ctx.stroke();
        return new THREE.CanvasTexture(canvas);
    };

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: getLineMarkings(w, h) }));
    scene.add(plane);

    const ilha1 = new THREE.Shape();
    ilha1.absarc(-centro1, 0, circunferenciaDentro, angulo1, -angulo1, false);
    ilha1.absarc(centro1, 0, circunferenciaFora, Math.PI + angulo2, Math.PI - angulo2, true);

    const ilha2 = new THREE.Shape();
    ilha2.absarc(-centro1, 0, circunferenciaDentro, angulo3, -angulo3, true);
    ilha2.absarc(centro1, 0, circunferenciaDentro, Math.PI + angulo3, Math.PI - angulo3, true);

    const ilha3 = new THREE.Shape();
    ilha3.absarc(centro1, 0, circunferenciaDentro, Math.PI - angulo1, Math.PI + angulo1, true);
    ilha3.absarc(-centro1, 0, circunferenciaFora, -angulo2, angulo2, false);

    const fora = new THREE.Shape();
    fora.moveTo(-w/2, -h/2); fora.lineTo(w/2, -h/2); fora.lineTo(w/2, h/2); fora.lineTo(-w/2, h/2);
    const h1 = new THREE.Path(); h1.absarc(-centro1, 0, circunferenciaFora, 0, Math.PI*2, true); fora.holes.push(h1);
    const h2 = new THREE.Path(); h2.absarc(centro1, 0, circunferenciaFora, 0, Math.PI*2, true); fora.holes.push(h2);

    const fieldGeom = new THREE.ExtrudeGeometry([ilha1, ilha2, ilha3, fora], { depth: 6, bevelEnabled: false });
    const fieldMesh = new THREE.Mesh(fieldGeom, [new THREE.MeshLambertMaterial({ color: 0x67c240 }), new THREE.MeshLambertMaterial({ color: 0x23311c })]);
    scene.add(fieldMesh);
    
    if (config.trees) {
        for(let i=0; i<15; i++) {
            const t = Tree();
            t.position.set((Math.random()-0.5)*800, (Math.random()-0.5)*400, 0);
            scene.add(t);
        }
    }
}

renderMap(viewW, viewH * 2);
const playerCar = Car(); scene.add(playerCar);

// --- LÓGICA DO JOGO ---
let otherVehicles = [];
let ready, playerAngleMoved, score, lastTimestamp;
let accelerate = false, decelerate = false;
const speed = 0.0017;
const scoreElement = document.getElementById("score");

function reset() {
    playerAngleMoved = 0; score = 0; scoreElement.innerText = score;
    lastTimestamp = undefined;
    otherVehicles.forEach(v => scene.remove(v.mesh));
    otherVehicles = [];
    movePlayerCar(0);
    renderer.render(scene, camera);
    ready = true;
}

function movePlayerCar(delta) {
    const pSpeed = accelerate ? speed * 2 : (decelerate ? speed * 0.5 : speed);
    playerAngleMoved -= pSpeed * delta;
    const angle = Math.PI + playerAngleMoved;
    playerCar.position.x = Math.cos(angle) * raioPista - centro1;
    playerCar.position.y = Math.sin(angle) * raioPista;
    playerCar.rotation.z = angle - Math.PI / 2;
}

function addVehicle() {
    const type = Math.random() > 0.4 ? "car" : "truck";
    const mesh = type === "car" ? Car() : Truck();
    scene.add(mesh);
    const clockwise = Math.random() >= 0.5;
    const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;
    const vSpeed = type === "car" ? 1 + Math.random() : 0.6 + Math.random();
    otherVehicles.push({ mesh, type, clockwise, angle, speed: vSpeed });
}

function moveOtherVehicles(delta) {
    otherVehicles.forEach(v => {
        v.angle += (v.clockwise ? -speed : speed) * delta * v.speed;
        v.mesh.position.x = Math.cos(v.angle) * raioPista + centro1;
        v.mesh.position.y = Math.sin(v.angle) * raioPista;
        v.mesh.rotation.z = v.angle + (v.clockwise ? -Math.PI/2 : Math.PI/2);
    });
}

function hitDetection() {
    const getHitZone = (pos, angle, dist) => ({
        x: pos.x + Math.cos(angle - Math.PI/2) * dist,
        y: pos.y + Math.sin(angle - Math.PI/2) * dist
    });
    const p1 = getHitZone(playerCar.position, Math.PI + playerAngleMoved, 15);
    const p2 = getHitZone(playerCar.position, Math.PI + playerAngleMoved, -15);

    const hit = otherVehicles.some(v => {
        const dist = v.type === "car" ? 15 : 35;
        const v1 = getHitZone(v.mesh.position, v.angle, dist);
        const v2 = getHitZone(v.mesh.position, v.angle, -dist);
        const getDist = (c1, c2) => Math.sqrt((c2.x - c1.x)**2 + (c2.y - c1.y)**2);
        return getDist(p1, v1) < 40 || getDist(p1, v2) < 40 || getDist(p2, v1) < 40;
    });
    if (hit) renderer.setAnimationLoop(null);
}

function animation(timestamp) {
    if (!lastTimestamp) { lastTimestamp = timestamp; return; }
    const delta = timestamp - lastTimestamp;
    movePlayerCar(delta);
    const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));
    if (laps !== score) { score = laps; scoreElement.innerText = score; }
    if (otherVehicles.length < (laps + 1) / 5) addVehicle();
    moveOtherVehicles(delta);
    hitDetection();
    renderer.render(scene, camera);
    lastTimestamp = timestamp;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") { if(ready) { ready = false; renderer.setAnimationLoop(animation); } accelerate = true; }
    if (e.key === "ArrowDown") decelerate = true;
    if (e.key.toLowerCase() === "r") reset();
});
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") accelerate = false;
    if (e.key === "ArrowDown") decelerate = false;
});

reset();