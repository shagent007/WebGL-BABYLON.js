window.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  
  const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    
    new BABYLON.ArcRotateCamera(
      "",
      0,
      Math.PI / 2,
      1000,
      new BABYLON.Vector3.Zero(),
      scene
    ).attachControl(canvas, false);

    new BABYLON.HemisphericLight(
      "",
      new BABYLON.Vector3(0, 1, 0),
      scene
    ).intensity = 0.7;

    new BABYLON.HemisphericLight(
      "",
      new BABYLON.Vector3(0, -1, 0),
      scene
    ).intensity = 0.2;

    const n = 4;
    const rl = 0.5;
    const control = {}
    const gui = new dat.GUI({ closeOnTop: true, width: 190 });  
    let previousLevel = -1;
    const controlElements = [];
    const spheres = [];

    const createControls = (sphere, level) => {
      spheres.push({sphere, level});
      if(level<=previousLevel) return;
      control[`group_${level}`] = true;
      controlElements.push({
        control:gui.add(control, `group_${level}`),
        level});
      previousLevel = level;
    }

    (function fractal(x, y, z, r, l, v) {
      createControls(createSphere(x, y, z, r, l), l);
      if (l < n) {
        if (v != 2) fractal(x + (r / 2) * (rl + 1), y, z, r * rl, l + 1, 1);
        if (v != 1) fractal(x - (r / 2) * (rl + 1), y, z, r * rl, l + 1, 2);
        if (v != 4) fractal(x, y + (r / 2) * (rl + 1), z, r * rl, l + 1, 3);
        if (v != 3) fractal(x, y - (r / 2) * (rl + 1), z, r * rl, l + 1, 4);
        if (v != 6) fractal(x, y, z + (r / 2) * (rl + 1), r * rl, l + 1, 5);
        if (v != 5) fractal(x, y, z - (r / 2) * (rl + 1), r * rl, l + 1, 6);
      }
    })(0, 0, 0, 256, 0, 0);
  
    for (const {control,level} of controlElements) {
      control.onChange((val)=>controlSphere(val,level));
    } 

    const controlSphere = (controlValue,controlLevel) => {
      for (const {sphere, level:sphereLevel} of spheres) {
        if(sphereLevel !== controlLevel) continue;
        sphere.visibility = controlValue;
      }
    }

    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize",()=>  engine.resize());
});


var red = new Array(0.7, 0.1, 0.1, 0.7, 0.1);
var green = new Array(0.1, 0.7, 0.1, 0.7, 0.7);
var blue = new Array(0.1, 0.1, 0.7, 0.1, 0.7);

const createSphere = (x, y, z, r, l) => {
  const sphere = new BABYLON.Mesh.CreateSphere("sphere1", 16, r, scene);
  sphere.material = new BABYLON.StandardMaterial("mat", scene);
  sphere.position = new BABYLON.Vector3(x, y, z);
  sphere.material.diffuseColor = new BABYLON.Color3(red[l], green[l],  blue[l]);
  return sphere;
}