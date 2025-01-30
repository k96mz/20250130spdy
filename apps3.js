const config = require('config');
const fs = require('fs');
const express = require('express');
const http2 = require('http2');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// config constants
const morganFormat = config.get('morganFormat');
const htdocsPath = config.get('htdocsPath');
const privkeyPath = config.get('privkeyPath');
const fullchainPath = config.get('fullchainPath');
const port = config.get('port');
const mbtilesDir = config.get('mbtilesDir');
const logDirPath = config.get('logDirPath');

// SSL証明書の存在チェック
if (!fs.existsSync(privkeyPath) || !fs.existsSync(fullchainPath)) {
  console.error('❌ SSL証明書ファイルが見つかりません！');
  process.exit(1);
}

// logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${logDirPath}/server-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});

logger.stream = {
  write: message => {
    logger.info(message.trim());
  },
};

// Expressアプリケーションの設定
const app = express();
const VTRouter = require('./routes/VT'); // tiling
app.use(cors());
app.use(
  morgan(morganFormat, {
    stream: logger.stream,
  })
);
app.use(express.static(htdocsPath));
app.use('/VT', VTRouter);

// `requestListener` を作成（修正ポイント）
const requestListener = app.callback
  ? app.callback()
  : (req, res) => app(req, res);

// for http2 (https)
const server = http2.createSecureServer(
  {
    key: fs.readFileSync(privkeyPath),
    cert: fs.readFileSync(fullchainPath),
    allowHTTP1: true, // HTTP/1.1 もサポート
  },
  requestListener // 修正したリスナーを使用
);

// ポートが開けない場合のエラーハンドリング
server
  .listen(port, () => {
    console.log(`✅ HTTP/2 Server running on https://localhost:${port}`);
  })
  .on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ ポート ${port} はすでに使用されています！`);
    } else {
      console.error(`🚨 サーバー起動エラー:`, err);
    }
  });
