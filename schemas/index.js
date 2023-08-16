const mongoose = require('mongoose');
const { postSchema } = require('./post'); // 수정된 부분
const { commentSchema } = require('./comment'); // 수정된 부분

// MongoDB 연결 함수
const connectDB = async () => {
  try {
    const connection = await mongoose.connect('mongodb://127.0.0.1:27017/spa_mall', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB에 연결되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 오류:', error);
    process.exit(1); // 프로세스 종료
  }
};

module.exports = {
  Post: mongoose.model('Post', postSchema), // 수정된 부분
  Comment: mongoose.model('Comment', commentSchema), // 수정된 부분
};

module.exports = connectDB;
