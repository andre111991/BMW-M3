import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const playerCar = Car()
scene.add(playerCar)

//...............................luzes...................................................

const ambientLight = new THREE.ambientLight(0xffffff, 0.6); //cor e intensidade
scene.add(ambientLight)

const diretionalLight = new THREE.diretionalLight(0xffffff, 0,6);
diretionalLight.position.set(100, -300, 400);
scene.add(diretionalLight);

//................................Camera................................................

const aspectratio = window.innerWidth / window.innerHeight;
const camerawidth = 960;
const cameraheight = camerawidth / aspectratio;

const camera = new THREE.orthographicCamera(            // diferente da camera das aulas
    camerawidth / -2,                                   // camera estilo cubo, 2px para cada lado nos eixos
    camerawidth / 2,
    cameraheight / 2,
    cameraheight / -2,
    0,                              //plano perto e plano longe 
    1000
);

camera.position.set(0,0,300);
camera.lookAt(0,0,0);

renderMap(camerawidth, cameraheight*2);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);



//.................................. carro..............


 const ListaCores = [ 0x00F5FF, 0xFF00FF, 0x7000FF,0xFF5F1F,0x39FF14,0xFF3131 ]

function Colors(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

function Car() {
    const car = new THREE.Group();

    const CorCarro = Colors(ListaCores);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60,30,15),
        new THREE.MeshLambertMaterial({ CorCarro })
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

    const cabin = new THREE.Mesh( new THREE.BoxBufferGeometry(33,24,12),[   // map -> mapa de cores // é o que faz as janelas do carro
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

    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(25, 30, 30), [
        new THREE.MeshLambertMaterial({ color, map: TexturaFrenteCamiao }),
        new THREE.MeshLambertMaterial({ color }), // back
        new THREE.MeshLambertMaterial({ color, map: TexturaLadoEsquerdoCamiao }),
        new THREE.MeshLambertMaterial({ color, map: TexturaLadoDireitoCamiao }),
        new THREE.MeshLambertMaterial({ color }), // top
        new THREE.MeshLambertMaterial({ color }) // bottom
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

  const tronco = new THREE.Mesh (new THREE.BoxGeometry(15, 15, 30), new THREE.MeshLambertMaterial({color: treeTrunkColor }));
  tronco.position.z = 10;
  tronco.castShadow = true;
  tronco.receiveShadow = true;
  tronco.matrixAutoUpdate = false;
  tree.add(tronco);

  const treeHeights = [45, 60, 75];
  const height = Colors(treeHeights);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(height / 2, 30, 30),
    treeCrownMaterial
  );
  crown.position.z = height / 2 + 30;
  crown.castShadow = true;
  crown.receiveShadow = false;
  tree.add(crown);

  return tree;
}

//.................................. pista.....................................

//ilhas 1 e 2 

const raioPista = 1000;
const larguraPista =50;
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

const centro2 = 3 * centro1; // sitio onde o "circulo" 2 e 3 se intersectam











