import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import UserAPI from '../api/UserAPI';

const { loginUser } = UserAPI();

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('email'); // Default to email
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(identifier, password);
      console.log('Login successful:', response);

      if (remember) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left" />
      <div className="login-right">
        <h1 className="login-title">Đăng Nhập</h1>
        {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Đăng nhập bằng</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="email"
                  checked={loginType === 'email'}
                  onChange={() => setLoginType('email')}
                /> Email
              </label>
              <label style={{ marginLeft: '15px' }}>
                <input
                  type="radio"
                  value="username"
                  checked={loginType === 'username'}
                  onChange={() => setLoginType('username')}
                /> Tên người dùng
              </label>
            </div>
            <input
              type={loginType === 'email' ? 'email' : 'text'}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={loginType === 'email' ? 'you@example.com' : 'Tên người dùng'}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              /> Lưu thông tin đăng nhập
            </label>
            <a href="#" className="forgot">Quên mật khẩu?</a>
          </div>
          <button type="submit" className="btn-login">Đăng nhập</button>
          <p className="signup-text">
            Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;