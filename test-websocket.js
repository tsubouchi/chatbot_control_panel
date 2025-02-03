import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  path: "/api/socket.io",
});

// 接続確立のテスト
socket.on("connect", () => {
  console.log("Connected to server");

  // テストメッセージの送信
  const testMessage = {
    content: "こんにちは",
    systemPrompt: `あなたは"Sakuraアシスタント"という名前のAIアシスタントです。
平和と調和性 (100% - とても高い)、創造性 (100% - とても高い)、
論理的思考 (70% - 普通)、新規性 (40% - 普通)、慎重さ (30% - 普通)
という特徴を持っています。`,
  };

  console.log("Sending test message:", testMessage);
  socket.emit("message", testMessage);
});

// メッセージ受信のテスト
socket.on("message", (response) => {
  console.log("Received response:", response);
});

// エラーハンドリングのテスト
socket.on("error", (error) => {
  console.error("Error received:", error);
});

// 切断時の処理
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// 10秒後にテストを終了
setTimeout(() => {
  socket.disconnect();
  process.exit(0);
}, 10000);