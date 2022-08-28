/**
 * Fits voxel grid into camera view.
 * @author { smcllns }
 *
 * https://github.com/mrdoob/three.js/issues/6784
 */
function autoFitTo(boundingBox, camera, controls) {
  const boundingSphere = new THREE.Sphere();
  boundingBox.getBoundingSphere(boundingSphere);
  const scale = 2.5; // object size / display size
  const objectAngularSize = (camera.fov * Math.PI / 180) * scale;
  const distanceToCamera = boundingSphere.radius / Math.tan(objectAngularSize / 2)
  const len = Math.sqrt(Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2))

  camera.position.set(len, len, len);
  controls.update();

  camera.lookAt(boundingSphere.center);
  controls.target.set(boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z);

  camera.updateProjectionMatrix();

}

/**
 * Draws the voxel grid.
 */
function drawVoxels(voxels, elementId) {
  // Set up scene.
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);

  // Create voxels.
  let voxelGeometry = new THREE.BoxGeometry(1, 1, 1);
  let voxelGridGeometry = new THREE.Geometry();
  let matrix = new THREE.Matrix4();
  for (let [x, y, z] of voxels) {
    matrix.makeTranslation(x, y, z);
    voxelGridGeometry.merge(voxelGeometry, matrix);
  }
  let material = new THREE.MeshToonMaterial({ color: 0x00FF00 });
  var voxelGridMesh = new THREE.Mesh(voxelGridGeometry, material);

  scene.add(voxelGridMesh);

  // Set up camera.
  let container = document.getElementById(elementId);
  let aspectRatio = container.clientWidth / container.clientHeight;

  let camera = new THREE.PerspectiveCamera(
    fov = 20,
    aspect = aspectRatio,
    near = 0.1,
    far = 10000
  );

  // Set up lights.
  let light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(50, 0, 0);
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(-50, 0, 0);
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(0, 50, 0);
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(0, -50, 0);
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(0, 0, 50);
  scene.add(light);

  light = new THREE.PointLight(0xFFFFFF, 0.2);
  light.position.set(50, 0, -50);
  scene.add(light);

  // Set up renderer.
  let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  let outline = new THREE.OutlineEffect(renderer);

  function render() {
    renderer.render(scene, camera);
    outline.render(scene, camera);
  }

  // Set up camera controls.
  controls = new THREE.TrackballControls(camera, container);
  controls.rotateSpeed = 3.0;
  controls.zoomSpeed = 3;
  controls.panSpeed = 2;
  controls.staticMoving = true;
  controls.addEventListener('change', render);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
  }

  // Initialize view.
  voxelGridGeometry.computeBoundingBox()
  autoFitTo(voxelGridGeometry.boundingBox.clone(), camera, controls);
  render();

  // Manage window resizes.
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    aspectRatio = container.clientWidth / container.clientHeight
    renderer.setSize(
      width = container.clientWidth,
      height = container.clientHeight
    );
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    render();
  }

  // Run.
  animate();
}
