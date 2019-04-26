let scene;

function render() {
    scene.userData.light.position.copy(scene.userData.camera.position.clone().normalize());
    scene.userData.light.position.z *= 2;
    scene.userData.light.position.x *= 5;
    scene.userData.light.position.normalize();
    scene.userData.renderer.render(scene, scene.userData.camera);
    scene.userData.outline.render(scene, scene.userData.camera);
}

/**
 * Fits voxel grid into camera view.
 * @author { smcllns }
 *
 * https://github.com/mrdoob/three.js/issues/6784
 */
function autoFitTo( boundingBox, camera, controls ) {
  const boundingSphere = new THREE.Sphere();
  boundingBox.getBoundingSphere(boundingSphere);
  const scale = 2.5; // object size / display size
  const objectAngularSize = ( camera.fov * Math.PI / 180 ) * scale;
  const distanceToCamera = boundingSphere.radius / Math.tan( objectAngularSize / 2 )
  const len = Math.sqrt( Math.pow( distanceToCamera, 2 ) + Math.pow( distanceToCamera, 2 ) )

  camera.position.set(len, len, len);
  controls.update();

  camera.lookAt( boundingSphere.center );
  controls.target.set( boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z );

  camera.updateProjectionMatrix();

}


function drawVoxels(voxels, elementId) {

    let voxelGeometry = new THREE.BoxGeometry(1, 1, 1);
    let voxelGridGeometry = new THREE.Geometry();
    let matrix = new THREE.Matrix4();
    for (let [state, [x, y, z]] of voxels) {
        if (state === 1) {
            matrix.makeTranslation(x, y, z);
            voxelGridGeometry.merge(voxelGeometry, matrix);
        }
    }
    let material = new THREE.MeshToonMaterial({color: 0x00FF00});
    var voxelGridMesh = new THREE.Mesh( voxelGridGeometry, material );


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    let container = document.getElementById(elementId);
    let aspectRatio = container.clientWidth / container.clientHeight;
    scene.userData.container = container;

    let camera = new THREE.PerspectiveCamera(20, aspectRatio, 0.1, 10000);
    scene.userData.camera = camera;

    let light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.copy(camera.position.clone().normalize());
    light.position.z *= 2;
    light.position.x *= 5;
    light.position.normalize();
    light.target.position.copy(new THREE.Vector3(0, 0, 0));
    scene.add(light);
    scene.userData.light = light;

    let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    scene.userData.renderer = renderer;

    controls = new THREE.TrackballControls(camera, container);
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 3;
    controls.panSpeed = 2;
    controls.staticMoving = true;
    controls.addEventListener('change', render);
    scene.userData.controls = controls;

    let outline = new THREE.OutlineEffect(renderer);
    scene.userData.outline = outline;

    voxelGridGeometry.computeBoundingBox()
    autoFitTo(voxelGridGeometry.boundingBox.clone(), camera, controls);
    render();

    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        for (let scene of scenes) {
            scene.userData.renderer.setSize(scene.userData.container.clientWidth, scene.userData.container.clientHeight);
            scene.userData.camera.aspect = scene.userData.container.clientWidth / scene.userData.container.clientHeight;
            scene.userData.camera.updateProjectionMatrix();
        }
        render();
    }

}
