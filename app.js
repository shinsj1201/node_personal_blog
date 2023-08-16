const express = require('express');
const app = express();
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments'); // commentsRouter 추가
const connectDB = require('./schemas/index');

app.use(express.json());

// MongoDB 연결
connectDB();

app.use('/api/posts', postsRouter);
app.use('/api/posts', commentsRouter); // commentsRouter를 /api/posts 경로 아래에 추가

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
