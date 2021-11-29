window.addEventListener("load", init);

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.z = 100;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ジオメトリ作成
  const geometry = new THREE.SphereGeometry(15, 32, 16);

  // マテリアルを作成
  const material = new THREE.MeshStandardMaterial({
    // 画像を指定
    map: new THREE.TextureLoader().load("earth.jpg"),
    side: THREE.DoubleSide,
  });

  // 球体メッシュを作成
  const earth = new THREE.Mesh(geometry, material);

  // 3D空間にメッシュを追加
  scene.add(earth);

  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 月作成
  const geometry2 = new THREE.SphereGeometry(3, 32, 16);
  const material2 = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("moon.jpg"),
    side: THREE.DoubleSide,
  });
  const moon = new THREE.Mesh(geometry2, material2);
  scene.add(moon);

  let radius = 30;// 半径
  let radian = 0;// 角度

  // 毎フレーム時に実行されるループイベント
  function tick() {
    // レンダリング
    renderer.render(scene, camera);
    moon.position.x = radius * Math.cos(radian);// 月を周回させる
  moon.position.z = radius * Math.sin(radian);
  radian += 0.01;// 角度に加算する
    earth.rotation.y += 0.01
    requestAnimationFrame(tick);
  }
  tick();
}