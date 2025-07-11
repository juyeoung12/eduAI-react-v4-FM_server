// server/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ✅ 회원가입
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
  }

  const newUser = new User({ email, password, username }); // role은 기본 'user'
  await newUser.save();

  // ✅ JWT 토큰 발급 (role 포함)
  const token = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // ✅ 응답에 토큰 + 사용자 정보
  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    },
  });

  console.log('🔍 서버 수신 데이터:', req.body);
  console.log('✅ 토큰:', token);
};

// ✅ 로그인 (loginUser라는 이름으로 export)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // ✅ JWT 토큰 발급 (role 포함)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ 응답에 토큰 + 사용자 정보
    res.status(200).json({
      message: '로그인 성공',
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ 로그인 오류:', err);
    res.status(500).json({ message: '로그인 처리 중 오류 발생' });
  }
};

// ✅ 로그아웃 (쿠키 제거)
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.status(200).json({ message: '로그아웃 완료' });
};

// ✅ 사용자 정보 조회 (추후 구현 예정)
export const getMe = async (req, res) => {
  res.status(200).json({ message: '사용자 정보 조회' });
};
