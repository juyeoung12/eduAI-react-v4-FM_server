//server\controllers\authController.js
import jwt from 'jsonwebtoken'; // ✅✅ 토큰 발급
import User from '../models/User.js';


export const register = async (req, res) => {
  const { email, password, username } = req.body; // ✅ username도 포함
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
  }

  const newUser = new User({ email, password, username }); // ✅ 사용자 생성
  await newUser.save();

  // ✅ JWT 토큰 발급
  const token = jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role, // ✅ 역할 포함
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // 🔽 응답에도 role 포함
  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role, // ✅ 프론트에서 사용 가능
    },
  });

  console.log('🔍 서버 수신 데이터:', req.body);
  console.log("✅ 토큰:", token);
};

/*
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  res.status(200).json({ message: '로그인 성공', user });
};
*/
//  ✅✅✅로그인 함수 -------------------------------------------------------
  export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 사용자 확인
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      }

    // 🔽 JWT 토큰에 role 포함
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role, // ✅ 역할 포함
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🔽 응답에도 role 포함
    res.status(200).json({
      message: '로그인 성공',
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role, // ✅ 프론트에서 사용 가능
      },
    });
    } catch (err) {
      console.error('❌ 로그인 오류:', err);
      res.status(500).json({ message: '로그인 처리 중 오류 발생' });
    }
  };

  
  export const logout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(200).json({ message: '로그아웃 완료' });
  };

  
  export const getMe = async (req, res) => {
    res.status(200).json({ message: '사용자 정보 조회' });
  };