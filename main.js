import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.scene();

const playerCar = Car()
scene.add(playerCar)

//...............................luzes...................................................

const ambientLight = new THREE.ambientLight(0xffffff, 0,6); //cor e intensidade
scene.add(ambientLight)

const diretionalLight = new THREE.diretionalLight(0xffffff, 0,6);
diretionalLight.position.set(100, -300, 400);
scene.add(diretionalLight);

//................................Camera................................................

const aspectratio = window.innerWidth / window.innerHeight;
const camerawidth = 150;
const cameraheight = camerawidth / aspectratio

const camera = new THREE.orthographicCamera(            // diferente da camera das aulas
    camerawidth / -2,                                   // camera estilo cubo, 2px para cada lado nos eixos
    camerawidth / 2,
    cameraheight / 2,
    cameraheight / -2,
    0,                              //plano perto e plano longe 
    1000
);

camera.position.set(200,-200,300);
camera.up.set(0,0,1); // camera colocada no ponto z=1 e a olhar para o meio 0,0,0
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);



//.................................. carro..............


CoresPossiveis = [ 0x00F5FF, 0xFF00FF, 0x7000FF,0xFF5F1F,0x39FF14,0xFF3131 ]

function Colors(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

function Car() {
    const car = new THREE.Group();

    const CorCarro = Colors(CoresPossiveis);

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60,30,15),
        new THREE.MeshLamberMaterial({color: CorCarro })
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


    const backWheel = Wheel()
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = Wheel()
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60,30,15),
        new THREE.MeshLamberMaterial({color: Colors(Cores)})
    );
    
    main.position.z = 12;
    car.add(main)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33,24,12),
        new THREE.MeshLamberMaterial({color: Colors(Cores)})
    );
    cabin.position.x=-6
    cabin.position.z=25.5
    car.add(cabin);

    return car;
}

function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12,33,12),
        new THREE.MeshLamberMaterial({color: 0x333333 })
    );

    backWheel.position.z = 6;
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
    













