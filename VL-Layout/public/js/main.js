/*
 *====Check if Detector.js is available
 */
if (!Detector.webgl) Detector.addGetWebGLMessage();

/*
 * Local-Var
 */
var container;
var stats; // https://github.com/mrdoob/stats.js/  - fps
var camera; 
var scene;
var renderer;
var mesh;
var SEGMENTS = 100;
var RADIUS = 20;

var DEBUG = true;
var basicRotate = false;
var rotationSpeed = 0.25;

var renderSkydome = false;
var skydomeDistance = 100;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

setup();
update();

function setup(){
    
    //add mouse listener and keyboard listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener("keypress", keyboardListener, false);

    //get div container for replacing it with an canvas obj
    container = document.getElementById('container');

    //perspective camera from three.js
    //http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.z = 100; //set z back for higher render distance
    
    //create entites
    createEntities();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
    container.appendChild(renderer.domElement);
    
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function update(){
    //Creating the renderloop
    //http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
    requestAnimationFrame(update);

    //update the cube && viewport
    var time = Date.now() * 0.001;
    
    tX = mouseX * 0.03;
    tY = mouseY * 0.03;
    
    if (basicRotate) {
        mesh.rotation.x = tY * 0.125;
        mesh.rotation.y = tX * 0.125;
    } else {
        mesh.rotation.x = time * rotationSpeed;
        mesh.rotation.y = time * rotationSpeed;
    }
    
    
    var light = new THREE.AmbientLight(0x255255255); // soft white light
    scene.add(light);   
    
    renderer.render(scene, camera);
    stats.update();
}

function createEntities(){
    createMesh();
    if (renderSkydome) {
        createSkydome();
    }
}

function createMesh(){
    
    //creating scene
    scene = new THREE.Scene();

    //getting into scene stuff 
    //http://threejs.org/docs/#Reference/Core/BufferGeometry
    var geomBuffer = new THREE.BufferGeometry();
    var vertMat = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    var vertPos = new Float32Array(SEGMENTS * 3);
    var vertCol = new Float32Array(SEGMENTS * 3);
    
    for (var i = 0; i < SEGMENTS; i++) {
        var rX = Math.random() * RADIUS - RADIUS / 2;
        var rY = Math.random() * RADIUS - RADIUS / 2;
        var rZ = Math.random() * RADIUS - RADIUS / 2;
        
        //calculate vertexdata
        vertPos[i * 3] = rX;
        vertPos[i * 3 + 1] = rY;
        vertPos[i * 3 + 2] = rZ;
        vertCol[i * 3] = (rX / RADIUS) + 0.5;
        vertCol[i * 3 + 1] = (rY / RADIUS) + 0.5;
        vertCol[i * 3 + 2] = (rZ / RADIUS) + 0.5;
    }
    
    geomBuffer.addAttribute('position', new THREE.BufferAttribute(vertPos, 3));
    geomBuffer.addAttribute('color', new THREE.BufferAttribute(vertCol, 3));
    
    geomBuffer.computeBoundingSphere();
    
    //create mesh object from geomBuffer and verMat
    //http://threejs.org/docs/#Reference/Objects/Mesh
    //http://threejs.org/docs/#Reference/Objects/Line
    mesh = new THREE.Line(geomBuffer, vertMat);
    scene.add(mesh);
}

function createSkydome(){
    //http://threejs.org/docs/#Reference/Extras.Geometries/SphereGeometry
    var geometry = new THREE.SphereGeometry(skydomeDistance, 100, 100);
    var uniforms = {
        texture: { type: 't', value: THREE.ImageUtils.loadTexture('/img/skydome.jpg') }
    };
    
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: "varying vec2 vUV;void main() {vUV = uv;vec4 pos = vec4(position, 1.0);gl_Position = projectionMatrix * modelViewMatrix * pos;}",
        fragmentShader: "uniform sampler2D texture;varying vec2 vUV;void main() {vec4 sample = texture2D(texture, vUV);gl_FragColor = vec4(sample.xyz, sample.w);}"
    });
    
    skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    scene.add(skyBox);
}

/*
 * Browser Based Functions
 */

function onWindowResize() {
    resizeVP();
}

function resizeVP(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

}

function keyboardListener(e) {
    if (e.key == "o") {
        if (basicRotate) {
            basicRotate = false;
        }
        else {
            basicRotate = true;
        }
    }
    if (e.key == "w") {
        SEGMENTS += 100;
        createEntities();
    }
    if (e.key == "s") {
        if (!(SEGMENTS - 100 < 0)) {
            SEGMENTS -= 100;
            createEntities();
        }
    }
    if (e.key == "d") {
        RADIUS += 1;
        createEntities();
    }
    if (e.key == "a") {
        if (!(RADIUS - 1 < 0)) {
            RADIUS -= 1;
            createEntities();
        }
    }
    if (e.key == "q") {
        skydomeDistance += 10;
        createEntities();
    }
    if (e.key == "e") {
        if (!(skydomeDistance - 10 < 0)) {
            skydomeDistance -= 10;
        }
    }
    if (e.key == "f") {
        if (renderSkydome) {
            renderSkydome = false;
            createEntities();
        }
        else {
            renderSkydome = true;
            createEntities();
        }
    }

}