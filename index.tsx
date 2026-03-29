# DOKO*2 Frontend（観光地検索アプリ）

JAZZSで作成する地図アプリDOKO*2(どこどこ)のフロントエンド用のディレクトリです。

---

## このアプリの仕様

お出かけ先でおすすめスポットを手軽に見つけるためのアプリ。googleのapiを用いた周辺スポットの検索機能やgeminiのapiを用いたaiチャット機能などを実装。<br>
現在はiosのexpo-goでのみ使用が可能となっております。フレームワークにexpoを使用しているので、随時アップデートし、androidやwebでも使用可能なマルチプラットフォーム対応のアプリにしていきたいと思っています。<br>

---

## この frontend で使っているもの

現在、以下のライブラリを使用しています。

- expo / react-native
  → アプリ開発の基盤となるフレームワーク

- expo-router
  → ルーティング(画面遷移)を行うためのもの

- react-native-maps
  → 地図機能を表示・操作するためのもの

- expo-location
  → ユーザーの位置情報を取得するためのもの

- expo-camera
  → カメラを使用するためのもの

- expo-splash-screen
  → アイキャッチを表示、制御するためのもの

- Ionicons
  → アイコン用ライブラリ。

---

## ツールのインストール
npmコマンドやデバッグを行うために下記のツールを適宜インストールしてください。

- Node.js
フロントエンドではNode.jsを使用しています。公式サイトから適宜インストールを行ってください。
[Node.js公式サイト](https://nodejs.org/ja)

- Expo Go
ご自身のスマホでアプリの動作を確認するためにExpo Goというアプリをご自身のスマホにインストールしてください。

---

## セットアップ方法
各々のlocal環境でfrontendのシステムを動かすために以下の手順でセットアップを行ってください。この地図アプリのフロントエンドが更新されるたびにこれらのセットアップを実行してください。

1. 必要なパッケージのインストール
システムがpackage.jsonなどを参照し、必要なパッケージをローカル環境にインストールします。誰かが新しいパッケージを外部からインストールした際などは新たにパッケージがインストールされます。

```bash
npm install
```

2. アプリの起動
以下のコマンドで開発サーバーを立ち上げます。

```bash
npx expo start
```

3. アプリの選択
ターミナル上でExpo Go用のQRコードや環境を起動するためのコマンドが表示されるので適宜選んで実際の画面を確認します。

---

## ディレクトリ構成と役割

frontend/<br>
├── .expo/ # expo startしたときに生成されるキャッシュとかをまとめたフォルダ<br>
│<br>
├── .vscode/ # vscodeで使いやするくするための設定が書いてあるフォルダ<br>
│<br>
├── api/ # バックエンドのapiをたたくためのディレクトリ。<br>
│ ├── client.ts # ベースURLやタイムアウトなどのホストサーバに接続するための設定などを行うファイル。<br>
│ ├── types.ts # バックエンドとやり取りする際のインターフェースを定義するファイル。<br>
│ └── endpoints/ # それぞれのapiと接続するメソッドを格納するフォルダ。<br>
│   ├── chatApi.ts # AIチャット機能用のapi接続メソッド。<br>
│   ├── healthCheck.ts # バックエンドとの接続を確認するためのapi接続メソッド。<br>
│   └── recommendPlaces.ts # 周辺スポット表示機能用のapi接続メソッド。<br>
│<br>
├── app/ # 地図アプリの仕組み部分。<br>
│ ├── _layout.tsx # フォルダ内のコードのルールとかを書くファイル。<br>
│ └── (tabs)/ # ページ<br>
│   ├── _layout.tsx # フォルダ内のコードのルールとか書くファイル。<br>
│   ├── camera.tsx # 周囲の情報をカメラから取得するためのページ。<br>
│   └── index.tsx # ホームページ。地図と現在地を描画。<br>
│<br>
├── assets/ # 画像などの部品を保存する用のディレクトリ。<br>
│ └── images/ # 画像用のディレクトリ。<br>
│   └── メインロゴ.png # ロゴ。<br>
│<br>
├── components/ # 自作コンポーネント保存用のディレクトリ。<br>
│ ├── AIChatInput.tsx # アイキャッチを表示するコンポーネント。<br>
│ ├── Eyecathc.tsx # アイキャッチを表示するコンポーネント。<br>
│ └── RecommendPlacesButton.tsx # 任意の数を指定するとその数だけ周囲のスポットを検索するボタンコンポーネント。<br>
│<br>
├── hooks/ # reactの機能を使った自作hookを置くためのディレクトリ。<br>
│ └── useLocationTracker.tsx # 現在地取得用のhook。<br>
│<br>
├── node_modules/ # ライブラリの倉庫。npm installされたときに自動で作成される。<br>
│<br>
├── utils/ # reactの機能を使わないで作成した自作関数を置くためのディレクトリ。<br>
│<br>
├── .env # apikeyやホストサーバのアドレスなどを記述するためのファイル。<br>
│<br>
├── .gitignore # gitの除外リスト。git pushとかgit addしてもこのファイルに載っているものは無視して実行される。<br>
│<br>
├── app.json # アプリの「履歴書」兼「設定図」。<br>
│<br>
├── declarations.d.ts # エディタのエラーを制御するためのもの。.svgを使用するために作成。<br>
│<br>
├── eslint.config.js # 警告を出すためのルールブック的なもの。<br>
│<br>
├── metro.config.js # .svgを画像ではなくコードとして利用するために作成。<br>
│<br>
├── package-lock.json # package.jsonより優先度の高いpackage.jsonみたいなもの。<br>
│<br>
├── package.json # このプロジェクトで使用しているライブラリ等が一覧で書いてある。npm installする際等に自動で参照する。<br>
│<br>
├── README.md # このフォルダの説明が書かれているマークダウンファイル。<br>
│<br>
└── tsconfig.json # 型チェックなどのルールブック的なもの。<br>

---

## 公式ドキュメント

- [React公式ドキュメント](https://ja.react.dev/)
- [Node.js公式ドキュメント](https://nodejs.org/ja)
- [ReactNative公式ドキュメント](https://reactnative.dev/)
- [expo公式ドキュメント](https://docs.expo.dev/)
- [ExpoLocation公式ドキュメント](https://docs.expo.dev/versions/latest/sdk/location/)
- [react-native-maps公式ドキュメント](https://docs.expo.dev/versions/latest/sdk/map-view/)