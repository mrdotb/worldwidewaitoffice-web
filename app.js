
  "use strict";

/*
* Worldwidewaitoffice.world - Playground
* Made by ilithya - edited by TancredeC
* https://threejs.org/
*
* Move the cursor to zoom in/out and float around the cubed space.
* On mobile touch + drag screen to zoom in/out and float.
*
*/
var nearDist = 0.1;
var farDist = 10000;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  nearDist,
  farDist
);
camera.position.x = farDist * -2;
camera.position.z = 300;
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setClearColor("#000022"); // Background Color - Blue

renderer.setPixelRatio(window.devicePixelRatio); // For HiDPI devices to prevent bluring output canvas

renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#canvas-wrapper").appendChild(renderer.domElement); // CREATE POLYHEDRON

var verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];
var indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];
var geometry = new THREE.PolyhedronBufferGeometry( verticesOfCube, indicesOfFaces, 20, 2 );

var material = new THREE.MeshNormalMaterial({
  wireframe: false,
  fog: true,
  shading: THREE.FlatShading,
  blending: THREE.AdditiveBlending,
  transparent: true,
  vertexColors: true
}); // Maps the normal vectors to RGB colors

var group = new THREE.Group();

for (var i = 0; i < 1000; i++) {
  var mesh = new THREE.Mesh(geometry, material);
  var dist = farDist / 3;
  var distDouble = dist * 2;
  var tau = 2 * Math.PI; // One turn

  mesh.position.x = Math.random() * distDouble - dist;
  mesh.position.y = Math.random() * distDouble - dist;
  mesh.position.z = Math.random() * distDouble - dist;
  mesh.rotation.x = Math.random() * tau;
  mesh.rotation.y = Math.random() * tau;
  mesh.rotation.z = Math.random() * tau; // Manually control when 3D transformations recalculation occurs for better performance

  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  group.add(mesh);
}

scene.add(group);

// CREATE TYPOGRAPHY

var loader = new THREE.FontLoader();
var textMesh = new THREE.Mesh();

var createTypo = function createTypo(font) {
  var word = "worldwidewaitoffice.world";
  var typoProperties = {
    font: font,
    size: 40,
    height: 20 / 2,
    curveSegments: 24,
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 6,
    bevelOffset: 0,
    bevelSegments: 0
  };
  var text = new THREE.TextGeometry(word, typoProperties);
  textMesh.geometry = text;
  textMesh.material = material;
  textMesh.position.x = 50 * -2;
  textMesh.position.z = 50 * -1;
  scene.add(textMesh);
};
loader.load(
  "https://raw.githubusercontent.com/TancredeC/worldwidewaitoffice-web/master/fonts/pano-bold.json",
  createTypo
); // CREATE PART OF THE MOUSE/TOUCH OVER EFFECT

var mouseX = 0;
var mouseY = 0;
// mrdotb edit
// Edit ignorePercentBot value 1/8 top et bottom now
var ignorePercentBot = window.innerHeight / 8;
var ignorePercentTop = window.innerHeight - ignorePercentBot;
var mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: function coordinates(coordX, coordY) {
    if (coordY > ignorePercentBot && coordY < ignorePercentTop) {
      mouseX = (coordX - mouseFX.windowHalfX) * 10;
      mouseY = (coordY - mouseFX.windowHalfY) * 10;
    }
  },
  onMouseMove: function onMouseMove(e) {
    mouseFX.coordinates(e.clientX, e.clientY);
  },
  onTouchMove: function onTouchMove(e) {
    mouseFX.coordinates(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  }
};
document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false); // RENDER 3D GRAPHIC

var render = function render() {
  requestAnimationFrame(render); // Camera animation
  // Works with onMouseMove and onTouchMove functions

  // mrdotb edit
  // reduce speed by divising mouseX and mouseY by 10
  camera.position.x += (mouseX / 10 - camera.position.x) * 0.05;
  camera.position.y += (mouseY / 10 * -1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position); // Rotates the object to face a point in world space

  var t = Date.now() * 0.001;
  var rx = Math.sin(t * 0.7) * 0.5;
  var ry = Math.sin(t * 0.3) * 0.5;
  var rz = Math.sin(t * 0.2) * 0.5;
  // mrdotb edit
  // comment the assignation here to see how it change the animations
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;
  textMesh.rotation.x = rx;
  textMesh.rotation.y = ry;
  textMesh.rotation.z = rx; // Happy accident :)

  renderer.render(scene, camera);
};

render();
