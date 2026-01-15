import * as THREE from 'three';

// 1. Configuração da Cena e Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Fundo preto para garantir visibilidade

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

// 3. Câmera
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, cameraWidth / 2,
    cameraHeight / 2, cameraHeight / -2,
    0, 1000
);
camera.position.set(0, -200, 300);
camera.lookAt(0, 0, 0);

// 4. Funções de Textura e Utilitários
const ListaCores = [0x00F5FF, 0xFF00FF, 0x7000FF, 0xFF5F1F, 0x39FF14, 0xFF3131];
function Colors(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function FrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; context.fillRect(0, 0, 64, 32);
    context.fillStyle = "#666666"; context.fillRect(8, 8, 48, 24);
    return new THREE.CanvasTexture(canvas);
}

function SideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; context.fillRect(0, 0, 128, 32);
    context.fillStyle = "#666666"; context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
    return new THREE.CanvasTexture(canvas);
}

function Wheel() {
    return new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
}

// 5. Construção do Carro
function Car() {
    const car = new THREE.Group();
    const CorCarro = Colors(ListaCores);

    // Corpo Principal
    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: CorCarro })
    );
    main.position.z = 12;
    car.add(main);

    // Cabine com Texturas
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: FrontTexture() }), // frente
        new THREE.MeshLambertMaterial({ map: FrontTexture() }), // trás
        new THREE.MeshLambertMaterial({ map: SideTexture() }),  // esquerda
        new THREE.MeshLambertMaterial({ map: SideTexture() }),  // direita
        new THREE.MeshLambertMaterial({ color: 0xffffff }),    // topo
        new THREE.MeshLambertMaterial({ color: 0xffffff })     // baixo
    ]);
    cabin.position.set(-6, 0, 25.5);
    car.add(cabin);

    // Rodas
    const backWheel = Wheel(); backWheel.position.set(-18, 0, 6); car.add(backWheel);
    const frontWheel = Wheel(); frontWheel.position.set(18, 0, 6); car.add(frontWheel);

    return car;
}

// 6. Adicionar à Cena e Animar
const playerCar = Car();
scene.add(playerCar);

function animate() {
    requestAnimationFrame(animate);
    
    // Faz o carro girar para provar que o 3D está funcionando
    playerCar.rotation.z += 0.01; 
    
    renderer.render(scene, camera);
}

animate();

// Ajuste de janela
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = cameraWidth / -2;
    camera.right = cameraWidth / 2;
    camera.top = cameraWidth / aspect / 2;
    camera.bottom = cameraWidth / aspect / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});