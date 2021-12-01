# WebGLの知識なしで地球と月を回してみよう！！
# はじめに
WebGLの知識なしで地球と月を回してみよう！！<br>
と言うことで、この記事ではJavaScriptの知識があれば簡単に3Dコンテンツを作成できるので見て行ってください。<br>

~ 開発した環境 ~<br>
Intel Mac / macOS Catalina version 10.15.7<br>
three.js CDN version r128<br>
Visual Studio Code<br>

[こちら](https://github.com/Shu1512/Earth-Moon-three.js)githubのリンクです。<br>

## 大まかな流れ
1.[黒い画面を表示](#黒い画面を表示)<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/2754f64d-a7ff-551e-ec7c-b21353c10842.png" width="360px"/><br>
2.[球体を表示](#球体を表示)<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/003a5e87-4b95-f3a0-6098-d80ea37533ce.png" width="360px"/><br>
3.[地球に画像を貼る](#地球に画像を貼る)<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/85ec4e88-dcee-8e5e-d417-af88097be801.png" width="360px"/><br>
4.[地球に動きを加える](#地球に動きを加える)<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/967a8c1c-6598-f6af-f5e3-c3de67a1ef94.gif" width="360"/><br>
5.[月を作成し動きを加える](#月を作成し動きを加える)<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/71121be4-be1a-a4bc-59dd-c2542882789b.gif" width="360"/><br>

## Try three.js
### セットアップ
この記事ではCDNを使うので`npm`を使用したい方は[こちら](https://threejs.org/docs/index.html#manual/en/introduction/Installation)に飛んでチェックしてね。<br>

まずindex.html, index.jsこの2つのファイルをつくります。<br>
下記のhtmlをコピペしてindex.jsファイルを作成しthree.jsを使えるように準備しよう。<br>

```html:index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>try three.js</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body style="margin: 0;">
    <canvas id="myCanvas" style="width:100%;height:100%;"></canvas>
    <!-- three.jsのCDN -->
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
      integrity="sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <script src="index.js"></script>
  </body>
</html>
```

### 黒い画面を表示

```javascript:index.js
window.addEventListener("load", init);

function init() {
  // サイズを指定
  const width = 960;
  const height = 540;

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```
まずthree.jsで最も重要な３つの定数を準備します。<br>
`scene`、`camera`、`renderer`です。<br>
わかりやすくピタゴラスイッチに例えて伝えていこうと思います！<br>
それでは見て行きましょう！<br>

#### scene

>`scene`を使用すると、three.jsで何をどこにレンダリングするかを設定できます。ここにオブジェクト、ライト、カメラを配置します。<br>

`scene`はピタゴラスイッチの机の上だと考えるとわかりやすいと思います。<br>

```javascript:index.js
// シーンを作成
const scene = new THREE.Scene();
```

#### camera

>3Dではどの視点から空間を撮影するか、という実装をします。この機能は「視点」や「カメラ」と呼ばれます。<br>

`camera`はピタゴラスイッチを撮影するために用意します。<br>
当たり前ですがカメラがないと何も映らないので必ず用意しましょう。<br>

```javascript:index.js
// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
```

#### renderer

`renderer`は3Dコンテンツを`renderer.setSize()`で指定した大きさで`myCanvas`タグに描画します。<br>
ピタゴラスイッチをカメラで撮ってテレビで見れるようにしている感じです！<br>

```javascript:index.js
// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#myCanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);;
```
一度 Open with Live Serverで画面を確認してみましょう。<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/2754f64d-a7ff-551e-ec7c-b21353c10842.png" width="360px"/><br>
このように黒い画面が表示されたらOKです。<br>
次にスポットライトとピタゴラスイッチ（3Dコンテンツ）を用意します。<br>

### 球体を表示

```javascript:index.js
// カメラを作成
// const camera = new THREE.PerspectiveCamera(45, width / height);
// == このコードの下に追加してください。 ==
   camera.position.z = 100;
// ===================================

// ジオメトリ作成
const geometry = new THREE.SphereGeometry(15, 32, 16);

// マテリアルを作成
const material = new THREE.MeshPhongMaterial({
    color: 0x49ef4,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
});

// 球体メッシュを作成
const earth = new THREE.Mesh(geometry, material);

// 3D空間にメッシュを追加
scene.add(earth);

// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 毎フレーム時に実行されるループイベント
function tick() {
  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```

次に球体を作成しますが、まずどの距離から撮るのかを決めます。<br>
指定しないと0距離でピタゴラスイッチを撮影するのでなんのテレビ番組なのかわかりません。<br>
なので100離れた場所からピタゴラスイッチを撮る処理を`camera`の下に記述を追加します。<br>

```javascript:index.js
// カメラを作成
// const camera = new THREE.PerspectiveCamera(45, width / height);
// == このコードの下に追加してください。 ==
   camera.position.z = 100;
// ===================================
```
次にどのようなピタゴラスイッチを作るかを決めます。<br>

今回は球体作成のするので`SphereGeometry()`を使用します。<br>
この関数で球体作成、大きさ指定などをしてます。<br>
引数には半径、水平セグメントの数、垂直セグメントの数が入ります。<br>
関数の詳細は[こちら](https://threejs.org/docs/index.html?q=SphereGeometry#api/en/geometries/SphereGeometry)を参照してください。<br>

```javascript:index.js
// ジオメトリ作成
const geometry = new THREE.SphereGeometry(15, 32, 16);
```
次にピタゴラスイッチの色や素材を決めます。<br>

`material`は球体の材質を指定します。<br>
今回は鏡面ハイライトと光沢のある表面の素材を使用します。<br>
関数の詳細は[こちら](https://threejs.org/docs/index.html?q=MeshPhongMaterial#api/en/materials/MeshPhongMaterial)です。<br>

```javascript:index.js
// マテリアルを作成
const material = new THREE.MeshPhongMaterial({
    color: 0x49ef4,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
```
先ほど作ったジオメトリとマテリアルを`mesh`で組み合わせます。<br>
組み合わせたものを`scene`に追加します。<br>

```javascript:index.js
// 球体メッシュを作成
const earth = new THREE.Mesh(geometry, material);
// 3D空間にメッシュを追加
scene.add(earth);
```
ピタゴラスイッチを照らすスポットライトを作成します。<br>
スポットライトがなくては何も見えないので必ず設定していきましょう。<br>

`DirectionalLight()`は特定の方向に光を放射します。<br>
一般的な使用例は、日光のシミュレートです。<br>
太陽の位置は無限であると見なすことができ、太陽からのすべての光線は平行です。<br>
平行光源を指定したら`scene`に追加します。<br>
関数の詳細は[こちら](https://threejs.org/docs/index.html?q=directionalLight#api/en/lights/DirectionalLight)です。<br>

```javascript:index.js
// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
```
最後に`scene`と`camera`をレンダリングするために`tick()`を作成します。<br>

```javascript:index.js
// 毎フレーム時に実行されるループイベント
function tick() {
  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```
もう一度Open with Live Serverで開いたサイトを見ると...<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/003a5e87-4b95-f3a0-6098-d80ea37533ce.png" width="360px"/><br>
これで球体の3Dコンテンツを作成できました。<br>
この青い球体を地球にしていきましょう！

### 地球に画像を貼る
先ほど作った青い球体に地球の画像を貼ります。<br>
[こちら](https://www.solarsystemscope.com/textures/)で高画質な惑星の画像をダウンロードできます。<br>
興味のある方は色々な惑星があるので好きな惑星に変えてみましょう！<br>

マテリアルの中の記述を変更します。<br>
球体に貼りたい画像のパスを`map`に記述してください。<br>

```javascript:index.js
// マテリアルを作成
// const material = new THREE.MeshPhongMaterial( {
    // color: 0x49ef4,
    // polygonOffset: true,
    // polygonOffsetFactor: 1,
    // polygonOffsetUnits: 1
// });
// ⬇︎
const material = new THREE.MeshStandardMaterial({
  // 画像を指定
  map: new THREE.TextureLoader().load("惑星の画像を指定"),
  side: THREE.DoubleSide,
});
```
これで地球になりました！<br>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/85ec4e88-dcee-8e5e-d417-af88097be801.png" width="360px"/><br>
次に動きを付け加えます！<br>

### 地球に動きを加える
`tick()`が呼び出されたら球体をy軸0.01づつずらす処理を追加します。<br>

```javascript:index.js
// 毎フレーム時に実行されるループイベント
function tick() {
  // == 追加 ==
  earth.rotation.y += 0.01
  // ==========
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```
Open with Live Serverして確認をしましょう。<br>

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/967a8c1c-6598-f6af-f5e3-c3de67a1ef94.gif" width="360"/><br>

🌏地球が回りました！<br>


### 月を作成し動きを加える
最後に月を追加し動かしてみましょう。<br>
地球をつくる流れを思い出しみましょう。<br>

`geometry`と`material`をつくり`mesh`で組み合わせて`scene`に追加します。<br>
月を地球の周りに回したいので`position`で指定します。<br>
指定をしないと地球と被って見えなくなるので気を付けましょう。<br>

```javascript:index.js
const geometry2 = new THREE.SphereGeometry(3, 32, 16);
const material2 = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load("moon.jpg"),
  side: THREE.DoubleSide,
});
const moon = new THREE.Mesh(geometry2, material2);
scene.add(moon);

let radius = 30;// 半径
let radian = 0;// 角度
function tick() {
  earth.rotation.y += 0.01
  // == 追加 ==
  moon.position.x = radius * Math.cos(radian);// 月を周回させる
  moon.position.z = radius * Math.sin(radian);
  radian += 0.01;// 角度に加算する
  // ==========
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```
最後にOpen with Live Serverで表示を確認してみましょう！<br>

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/71121be4-be1a-a4bc-59dd-c2542882789b.gif" width="360"/><br>
🌏地球の周りに🌕月を回すことができました！！<br>

# 終わりに
three.jsを触ってみてどうだったでしょうか？<br>
ピタゴラスイッチの例は分かりやすかったでしょうか？笑<br>
この記事でもっとthree.jsを触ってみたいと思っていただければ嬉しいです！<br>

# 参考サイト一覧
[three.js公式サイト](https://threejs.org/)<br>
[宇宙関連の高画質画像サイト](https://www.solarsystemscope.com/textures/)<br>
[ics.media three.js入門](https://ics.media/tutorial-three/material_basic/)<br>
