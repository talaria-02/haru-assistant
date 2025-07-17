import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

function App() {
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('login'); // login, userinfo, goal, plan

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlan([]);
    try {
      const res = await axios.post('http://localhost:5000/api/plan', { goal });
      setPlan(res.data.plan);
    } catch (err) {
      setError('계획 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setStep('userinfo');
    } catch (err) {
      alert('구글 로그인에 실패했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setStep('login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>하루비서</h1>
        {step === 'login' && (
          <button onClick={handleGoogleLogin} style={{ padding: '12px 24px', fontSize: 18 }}>
            구글로 시작하기
          </button>
        )}
        {user && (
          <div style={{ marginBottom: 16 }}>
            <img src={user.photoURL} alt="profile" style={{ width: 48, borderRadius: '50%' }} />
            <div>{user.displayName}</div>
            <button onClick={handleLogout} style={{ marginTop: 8 }}>로그아웃</button>
          </div>
        )}
        {/* 아래에 단계별 화면 분기 추가 예정 */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="달성하고 싶은 목표를 입력하세요"
            style={{ padding: 8, width: 250, fontSize: 16 }}
            required
          />
          <button type="submit" style={{ marginLeft: 8, padding: '8px 16px', fontSize: 16 }}>
            계획 생성
          </button>
        </form>
        {loading && <p>계획을 생성 중입니다...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {plan.length > 0 && (
          <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
            <h2>하루비서의 제안</h2>
            <ol>
              {plan.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
