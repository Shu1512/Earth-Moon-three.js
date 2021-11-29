# WebGLの知識なしで地球と月を回してみよう！！
# はじめに
WebGLの知識なしで地球と月を回してみよう！！
と言うことで、この記事ではJavaScriptの知識があれば簡単に3Dコンテンツを作成できるので見て行ってください。

~ 開発した環境 ~
Intel Mac / macOS Catalina version 10.15.7
three.js CDN version r128
Visual Studio Code

## 大まかな流れ
1.[黒い画面を表示](#黒い画面を表示)
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/2754f64d-a7ff-551e-ec7c-b21353c10842.png" width="360px"/>
2.[球体を表示](#球体を表示)
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/003a5e87-4b95-f3a0-6098-d80ea37533ce.png" width="360px"/>
3.[地球に画像を貼る](#地球に画像を貼る)
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/85ec4e88-dcee-8e5e-d417-af88097be801.png" width="360px"/>
4.[地球に動きを加える](#地球に動きを加える)
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/967a8c1c-6598-f6af-f5e3-c3de67a1ef94.gif" width="360"/>
5.[月を作成し動きを加える](#月を作成し動きを加える)
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/71121be4-be1a-a4bc-59dd-c2542882789b.gif" width="360"/>

## Try three.js
### セットアップ
この記事ではCDNを使うので`npm`を使用したい方は[こちら](https://threejs.org/docs/index.html#manual/en/introduction/Installation)に飛んでチェックしてね。

まずindex.html, index.jsこの2つのファイルをつくります。
下記のhtmlをコピペしてindex.jsファイルを作成しthree.jsを使えるように準備しよう。

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
まずthree.jsでは、3Dコンテンツを表示するための必要な３つの定数を準備します。
`scene`、`camera`、`renderer`です。
それでは細かく見て行きましょう！

#### scene

>`scene`を使用すると、three.jsで何をどこにレンダリングするかを設定できます。ここにオブジェクト、ライト、カメラを配置します。

つまり`scene`は舞台のステージだと考えると簡単だと思います。
演じる人がステージの上に立っているステージを作成している感じです。

```javascript:index.js
// シーンを作成
const scene = new THREE.Scene();
```

#### camera

>3Dコンテンツは、カメラの視点がレンダリングされ表示されるように、カメラと少なくとも1つのレイヤーを共有する必要があります。

`camera`はステージに立っている演者を撮る感じです。
少なくとも親御さんは何かしら撮らないとダメと言うことです。

```javascript:index.js
// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
```

#### renderer

`renderer`は3Dコンテンツを`renderer.setSize()`で指定した大きさで`myCanvas`タグに描画します。

```javascript:index.js
// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#myCanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);;
```
一度 Open with Live Serverで画面を確認してみましょう。
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/2754f64d-a7ff-551e-ec7c-b21353c10842.png" width="360px"/>
このように黒い画面が表示されたらステージの完成です。
これで席を用意しスポットライトを演者（3Dコンテンツ）に当ててを踊らすだけです💃。

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

次に球体を作成しますが、まずどの席から舞台を観るのか決めます。
これをしないと舞台を観れないので何も映りません。
100離れた席から舞台を観る処理を`camera`の下に記述を追加します。

```javascript:index.js
// カメラを作成
// const camera = new THREE.PerspectiveCamera(45, width / height);
// == このコードの下に追加してください。 ==
   camera.position.z = 100;
// ===================================
```
今回は球体作成のするので`SphereGeometry()`を使用します。
この関数で球体作成、大きさ指定などをしてます。
引数には半径、水平セグメントの数、垂直セグメントの数が入ります。
詳細は[こちら](https://threejs.org/docs/index.html?q=SphereGeometry#api/en/geometries/SphereGeometry)を参照してください。

```javascript:index.js
// ジオメトリ作成
const geometry = new THREE.SphereGeometry(15, 32, 16);
```
`material`は先ほど作成した球体の材質を指定します。
今回は鏡面ハイライトと光沢のある表面の素材を使用します。
関数の詳細は[こちら](https://threejs.org/docs/index.html?q=MeshPhongMaterial#api/en/materials/MeshPhongMaterial)です。

```javascript:index.js
// マテリアルを作成
const material = new THREE.MeshPhongMaterial({
    color: 0x49ef4,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});
```
作ったジオメトリとマテリアルを`mesh`で組み合わせます。
組み合わせたものを`scene`に追加します。

```javascript:index.js
// 球体メッシュを作成
const earth = new THREE.Mesh(geometry, material);
// 3D空間にメッシュを追加
scene.add(earth);
```
これでステージ、カメラ、演者、席が準備できたので、演者を照らすスポットライトを作成します。

`DirectionalLight()`は特定の方向に光を放射します。
一般的な使用例は、日光のシミュレートです。
太陽の位置は無限であると見なすことができ、太陽からのすべての光線は平行です。
平行光源を指定したら`scene`に追加します。
関数の詳細は[こちら](https://threejs.org/docs/index.html?q=directionalLight#api/en/lights/DirectionalLight)です。

```javascript:index.js
// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
```
最後に`scene`と`camera`をレンダリングするために`tick()`を作成します。

```javascript:index.js
// 毎フレーム時に実行されるループイベント
function tick() {
  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
```
もう一度Open with Live Serverで開いたサイトを見ると...
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/003a5e87-4b95-f3a0-6098-d80ea37533ce.png" width="360px"/>
これでステージ、カメラ、演者、スポットライト、席が準備できましたが、演者が裸で棒立ちのままなので衣装と振り付けをつけます。

### 地球に画像を貼る
先ほど作った青い球体に地球の画像を貼ります。
[こちら](https://www.solarsystemscope.com/textures/)で高画質な惑星の画像をダウンロードできます。
色々な惑星があるので好きな惑星に変えてみましょう！

マテリアルの中の記述を変更します。
球体に貼りたい画像のパスを`map`に記述してください。

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
これで地球になりました！
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/85ec4e88-dcee-8e5e-d417-af88097be801.png" width="360px"/>
地球の衣装を着せたのであとは振り付けをつけてあげます。

### 地球に動きを加える
`tick()`が呼び出されたら球体をy軸0.01づつずらす処理を追加します。

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
Open with Live Serverして確認をしましょう。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/967a8c1c-6598-f6af-f5e3-c3de67a1ef94.gif" width="360"/>

🌏地球が回りました！

せっかくの舞台なのでもう一人演者を作成しましょう！

### 月を作成し動きを加える
最後に月を追加しようと思います。
下記のコードを追加してください。
地球をつくる流れを思い出しみましょう。

`geometry`と`material`をつくり`mesh`で組み合わせて`scene`に追加します。
月を地球の周りを回したいので`position`を指定します。
指定をしないと地球と被って見えないので気を付けましょう。
月の周る半径を指定しましょう。

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
  // レンダリング
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
最後にOpen with Live Serverで表示を確認してみましょう！

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1729554/71121be4-be1a-a4bc-59dd-c2542882789b.gif" width="360"/>
🌏地球の周りに🌕月を回すことができました！！

# 終わりに
three.jsを触ってみてどうだったでしょうか？
舞台の例は分かりやすかったでしょうか？笑
この記事でもっとthree.jsを触ってみたいと思っていただければ嬉しいです！

# 参考サイト一覧
[three.js公式サイト](https://threejs.org/)
[宇宙関連の高画質画像サイト](https://www.solarsystemscope.com/textures/)
[ics.media three.js入門](https://ics.media/tutorial-three/material_basic/)
