import * as THREE from 'three';

// 1. Configuração da Cena e Renderizador
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Cores e utilitários
const ListaCores = [0x00F5FF, 0xFF00FF, 0x7000FF, 0xFF5F1F, 0x39FF14, 0xFF3131];
function Colors(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

// 3. Iluminação (Corrigido 0,6 para 0.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

// 4. Câmera Orthográfica
const aspectratio = window.innerWidth / window.innerHeight;
const camerawidth = 960;
const cameraheight = camerawidth / aspectratio;

const camera = new THREE.OrthographicCamera(
    camerawidth / -2,
    camerawidth / 2,
    cameraheight / 2,
    cameraheight / -2,
    0,
    1000
);
camera.position.set(0, -200, 300); // Ajustado para ver o carro de cima/diagonal
camera.lookAt(0, 0, 0);

// 5. Pista (Chão)
const mapWidth = 2000;
const mapHeight = 2000;
const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x546e90 });
const ground = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(ground);

// 6. Funções de Criação (Carro, Rodas, Texturas)
function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    wheel.position.z = 6;
    return wheel;
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

function Car() {
    const car = new THREE.Group();
    const CorCarro = Colors(ListaCores);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: CorCarro })
    );
    main.position.z = 12;
    car.add(main);

    const TexturaFrenteCarro = FrontTexture();
    TexturaFrenteCarro.center = new THREE.Vector2(0.5, 0.5);
    TexturaFrenteCarro.rotation = Math.PI / 2;

    const TexturaTrasCarro = FrontTexture();
    TexturaTrasCarro.center = new THREE.Vector2(0.5, 0.5);
    TexturaTrasCarro.rotation = -Math.PI / 2;

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: TexturaFrenteCarro }),
        new THREE.MeshLambertMaterial({ map: TexturaTrasCarro }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ map: SideTexture() }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    ]);
    cabin.position.set(-6, 0, 25.5);
    car.add(cabin);

    const backWheel = Wheel();
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

    return car;
}

// 7. Adicionar o jogador à cena
const playerCar = Car();
scene.add(playerCar);

// 8. Loop de Animação (Necessário para renderizar)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Ajuste de redimensionamento de tela
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = (camerawidth / -2);
    camera.right = (camerawidth / 2);
    camera.top = (camerawidth / aspect) / 2;
    camera.bottom = (camerawidth / aspect) / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});