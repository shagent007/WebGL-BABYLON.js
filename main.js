const red = new Array(0.7, 0.1, 0.1, 0.7, 0.1);
const green = new Array(0.1, 0.7, 0.1, 0.7, 0.7);
const blue = new Array(0.1, 0.1, 0.7, 0.1, 0.7);
const n = 4;
const rl = 0.5;

window.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
  new BABYLON
    .ArcRotateCamera("", 0, Math.PI/2, 1000, new BABYLON.Vector3(0,0,0), scene)
    .attachControl(canvas, false);

  new BABYLON
    .HemisphericLight("", new BABYLON.Vector3(0, 1, 0), scene)
    .intensity = 0.7;

  new BABYLON.HemisphericLight("", new BABYLON.Vector3(0, -1, 0), scene)
    .intensity = 0.2;

  const gui = new dat.GUI({ closeOnTop: true, width: 190 });  
  const spheres = [];

  (function fractal(x, y, z, r, l, v) {
    const sphere = new BABYLON.Mesh.CreateSphere(l.toString(), 16, r, scene);
    sphere.material = new BABYLON.StandardMaterial("", scene);
    sphere.position = new BABYLON.Vector3(x, y, z);
    sphere.material.diffuseColor = new BABYLON.Color3(red[l], green[l],  blue[l]);
    spheres.push(sphere);
    if (l >= n) return;
    if (v != 1) fractal(x - (r / 2) * (rl + 1), y, z, r * rl, l + 1, 2);
    if (v != 2) fractal(x + (r / 2) * (rl + 1), y, z, r * rl, l + 1, 1);
    if (v != 3) fractal(x, y - (r / 2) * (rl + 1), z, r * rl, l + 1, 4);
    if (v != 4) fractal(x, y + (r / 2) * (rl + 1), z, r * rl, l + 1, 3);
    if (v != 5) fractal(x, y, z - (r / 2) * (rl + 1), r * rl, l + 1, 6);
    if (v != 6) fractal(x, y, z + (r / 2) * (rl + 1), r * rl, l + 1, 5);
  })(0, 0, 0, 256, 0, 0);

  for(let i = 1; i <= n+1; i++){
    gui.add({[`group_${i}`]:true}, `group_${i}`).onChange(
      v => spheres.filter(s => i == s.id).forEach(s => s.visibility = v)
    )
  }

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize",()=>  engine.resize());
});