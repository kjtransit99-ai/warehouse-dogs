# WAREHOUSE DOGS — Bar and Coffee Transit

70年代ノワール映画オマージュの正体隠匿・質問推理パーティーゲーム（65インチTVモニター＋参加者スマホQR連動）。

## 構成
- ビルド不要の静的構成（`index.html` / `style.css` / `words.js` / `app.js`）
- Firestore 専用コレクション `warehouse_dogs_rooms` を使用（既存のデジタル人狼アプリのデータ・ホスティングには一切干渉しません）
- モバイルSafari・携帯回線対策（`experimentalForceLongPolling: true`, `useFetchStreams: false`, `runTransaction` 不使用）

## 遊び方（4〜8人）
1. 65インチTVで公開URLを開く
2. 参加者がスマホでQRコードをスキャンし、ニックネームを入力して入室
3. ジャンル（全6種）を選び「ミッション開始」
4. スマホで役職（ボス／警察の犬／強盗団）を確認し、質問フェーズ（05:00）へ
5. 正解が出たらボスがスマホの `UNLOCKED!` をタップ → 議論（03:00・スキップ可）→ 2段階投票で内通者を暴く
