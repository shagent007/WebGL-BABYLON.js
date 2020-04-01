window.addEventListener("DOMContentLoaded", function() {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);
    var camera = new BABYLON.ArcRotateCamera(
      "camera1",
      0,
      Math.PI / 2,
      1000,
      new BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, false);
    var light1 = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    var light2 = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, -1, 0),
      scene
    );
    light1.intensity = 0.7;
    light2.intensity = 0.2;

    var red = new Array(0.7, 0.1, 0.1, 0.7, 0.1);
    var green = new Array(0.1, 0.7, 0.1, 0.7, 0.7);
    var blue = new Array(0.1, 0.1, 0.7, 0.1, 0.7);

    function circle(r) {
      var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, r, scene);
      var materials = new BABYLON.StandardMaterial("mat", scene);
      sphere.material = materials;
      return sphere;
    }

    var n = 4;
    var rl = 0.5;
    var sph = new Array();

    function fractal(x, y, z, r, l, v) {
      var parametrs = new (function() {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.l = l;
        this.shar = new circle(this.r);
        this.shar.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.shar.material.diffuseColor = new BABYLON.Color3(
          red[l],
          green[l],
          blue[l]
        );
      })();

      if (l < n) {
        if (v != 2) fractal(x + (r / 2) * (rl + 1), y, z, r * rl, l + 1, 1);
        if (v != 1) fractal(x - (r / 2) * (rl + 1), y, z, r * rl, l + 1, 2);
        if (v != 4) fractal(x, y + (r / 2) * (rl + 1), z, r * rl, l + 1, 3);
        if (v != 3) fractal(x, y - (r / 2) * (rl + 1), z, r * rl, l + 1, 4);
        if (v != 6) fractal(x, y, z + (r / 2) * (rl + 1), r * rl, l + 1, 5);
        if (v != 5) fractal(x, y, z - (r / 2) * (rl + 1), r * rl, l + 1, 6);
      }

      sph.push(parametrs);
    }

    fractal(0, 0, 0, 256, 0, 0);

    var InputGUIa = function() {
      this.group_1 = true;
      this.group_2 = true;
      this.group_3 = true;
      this.group_4 = true;
      this.group_5 = true;
    };

    var InputGUI = new InputGUIa();
    var gui = new dat.GUI({ closeOnTop: true, width: 190 });

    var check1 = gui.add(InputGUI, "group_1");
    var check2 = gui.add(InputGUI, "group_2");
    var check3 = gui.add(InputGUI, "group_3");
    var check4 = gui.add(InputGUI, "group_4");
    var check5 = gui.add(InputGUI, "group_5");

    check1.onChange(function(value) {
      view(value, 0);
    });
    check2.onChange(function(value) {
      view(value, 1);
    });
    check3.onChange(function(value) {
      view(value, 2);
    });
    check4.onChange(function(value) {
      view(value, 3);
    });
    check5.onChange(function(value) {
      view(value, 4);
    });

    function view(v, lv) {
      for (var i = 0; i < sph.length; i++) {
        if (sph[i].l == lv) {
          sph[i].shar.visibility = v;
        }
      }
    }

    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(function() {
    scene.render();
  });

  window.addEventListener("resize", function() {
    engine.resize();
  });
});
