import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import UserAPI from '../api/UserAPI';

// Generate random userId in format "userXXX"
const generateUserId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Random 3-digit number
  return `user${randomNum}`;
};

const { registerUser } = UserAPI();

const RegisterPage = () => {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    const userId = generateUserId();
    const userData = {
      userId,
      userName,
      name,
      email,
      password,
    };

    try {
      const response = await registerUser(userData);
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" />
      <div className="login-right">
        <h1 className="login-title">Đăng Ký</h1>
        {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người dùng</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tên người dùng"
              required
            />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className="password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className="password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="btn-login">Đăng ký</button>
          <p className="signup-text">
            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;