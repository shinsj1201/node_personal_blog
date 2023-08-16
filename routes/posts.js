const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');

// 게시글 작성 API
router.post('/', async (req, res) => {
  const { user, password, title, content } = req.body;

  // 요청 본문이 정상적으로 입력되었는지 확인
  if (!user || !password || !title || !content) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    // 게시글 생성
    const newPost = new Post({ user, password, title, content });
    await newPost.save();

    res.json({ message: '게시글을 생성하였습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 게시글을 생성할 수 없습니다.' });
  }
});

// 전체 게시글 목록 조회 API
router.get('/', async (req, res) => {
  try {
    // MongoDB에서 모든 게시글을 조회하고, 최신순으로 정렬 (createdAt을 내림차순으로 정렬)
    const allPosts = await Post.find().sort({ createdAt: -1 });

    // 조회한 데이터를 미리 저장된 게시글 데이터와 합침
    const preSavedPosts = {
      data: [
        {
          postId: '62d6d12cd88cadd496a9e54e',
          user: 'Developer',
          title: '안녕하세요',
          createdAt: '2022-07-19T15:43:40.266Z',
        },
        {
          postId: '62d6cc66e28b7aff02e82954',
          user: 'Developer',
          title: '안녕하세요',
          createdAt: '2022-07-19T15:23:18.433Z',
        },
      ],
    };
    const mergedPosts = [...preSavedPosts.data, ...allPosts];

    // _id를 postId로 변환하여 응답
    const postsWithPostId = mergedPosts.map(post => {
      const postId = post._id ? post._id.toString() : post.postId; // _id가 있으면 _id를 postId로 변환, 없으면 postId 그대로 사용
      return {
        postId,
        user: post.user,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      };
    });

    res.json({ data: postsWithPostId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 게시글을 가져올 수 없습니다.' });
  }
});

// 게시글 상세 조회 API
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    // postId로 조회
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: '해당 게시글을 찾을 수 없습니다.' });
    }

    res.json({ data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 게시글을 조회할 수 없습니다.' });
  }
});

// 게시글 수정 API
router.put('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password, title, content } = req.body;

  // 요청 본문이 정상적으로 입력되었는지 확인
  if (!password || !title || !content) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    // postId로 해당 게시글 조회
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    // 비밀번호 확인
    if (post.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 게시글 수정
    post.title = title;
    post.content = content;
    await post.save();

    res.json({ message: '게시글을 수정하였습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 게시글을 수정할 수 없습니다.' });
  }
});

// 게시글 삭제 API
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  // 요청 본문이 정상적으로 입력되었는지 확인
  if (!password) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    // postId로 해당 게시글 조회
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    }

    // 비밀번호 확인
    if (post.password !== password) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 게시글 삭제
    await Post.deleteOne({ _id: postId });

    res.json({ message: '게시글을 삭제하였습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류로 게시글을 삭제할 수 없습니다.' });
  }
});

module.exports = router;
