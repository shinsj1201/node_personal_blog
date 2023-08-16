// routes/comments.js

const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');

// 댓글 목록 조회 API
router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    // 해당 게시글에 대한 댓글 목록 조회
    const comments = await Comment.find({ postId }).sort({ createdAt: 'desc' });

    // 조회한 댓글이 없을 경우 빈 배열로 응답
    if (comments.length === 0) {
      return res.json({ data: [] });
    }

    // 댓글 배열을 요청한 형태로 변환하여 응답
    const responseData = comments.map((comment) => ({
      commentId: comment._id.toString(),
      user: comment.user,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(), // 변경된 부분: ISO 형식으로 출력
    }));

    res.json({ data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 댓글을 가져올 수 없습니다.' });
  }
});

// 댓글 작성 API
router.post('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { user, password, content } = req.body;

  // 요청 본문이 정상적으로 입력되었는지 확인
  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }

  try {
    // 게시글에 댓글 작성
    const newComment = new Comment({ postId, user, password, content });
    await newComment.save();

    res.json({ message: '댓글을 생성하였습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 댓글을 생성할 수 없습니다.' });
  }
});

// 댓글 수정 API
router.put('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
    const { password, content } = req.body;
  
    // 요청 본문이 정상적으로 입력되었는지 확인
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }
  
    try {
      // 해당 게시글에 대한 댓글 조회
      const comment = await Comment.findOne({ _id: commentId, postId });
  
      // 댓글이 존재하지 않을 경우 404 에러 응답
      if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      }
  
      // 비밀번호 비교
      if (comment.password !== password) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
  
      // 댓글 내용 수정
      comment.content = content;
      await comment.save();
  
      res.json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 오류로 댓글을 수정할 수 없습니다.' });
    }
  });
  
// 댓글 삭제 API
router.delete('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
    const { password } = req.body;
  
    // 요청 본문이 정상적으로 입력되었는지 확인
    if (!password) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  
    try {
      // 게시글에 해당하는 댓글 찾기
      const comment = await Comment.findOne({ _id: commentId, postId });
  
      // 댓글이 존재하지 않을 경우 404 에러 출력
      if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      }
  
      // 댓글 작성자의 비밀번호 확인
      if (comment.password !== password) {
        return res.status(401).json({ message: '댓글 작성자의 비밀번호가 일치하지 않습니다.' });
      }
  
      // 댓글 삭제
      await Comment.deleteOne({ _id: commentId });
  
      res.json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 오류로 댓글을 삭제할 수 없습니다.' });
    }
  });

module.exports = router;
