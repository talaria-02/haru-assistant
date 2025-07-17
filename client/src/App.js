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
  const [userInfo, setUserInfo] = useState({
    age: '',
    job: '',
    career: '',
    skills: '',
    region: '',
    gender: '',
  });

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

  // 사용자 정보 입력 핸들러
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 사용자 정보 입력 완료 후 다음 단계로
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    setStep('goal');
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
        {step === 'userinfo' && (
          <form onSubmit={handleUserInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
            <input name="age" type="number" min="0" max="120" placeholder="나이" value={userInfo.age} onChange={handleUserInfoChange} required />
            <input name="gender" placeholder="성별(선택)" value={userInfo.gender} onChange={handleUserInfoChange} />
            <input name="region" placeholder="거주 지역(도시/국가)" value={userInfo.region} onChange={handleUserInfoChange} />
            <input name="job" placeholder="직업" value={userInfo.job} onChange={handleUserInfoChange} required />
            <input name="career" placeholder="주요 경력/전공" value={userInfo.career} onChange={handleUserInfoChange} />
            <input name="skills" placeholder="능력/스킬(예: 영어 중급, IT 활용 등)" value={userInfo.skills} onChange={handleUserInfoChange} />
            <button type="submit" style={{ padding: '10px 0', fontSize: 16 }}>다음</button>
          </form>
        )}
        {/* 목표/계획 입력 및 결과 화면은 step === 'goal' 이후에 분기 */}
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
