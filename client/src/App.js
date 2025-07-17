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

  // 목표/환경 입력 상태
  const [goalInput, setGoalInput] = useState({
    goal: '',
    time: '',
    budget: '',
    method: '',
    offline: '',
    etc: '',
  });
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [checked, setChecked] = useState([]); // 체크리스트 완료 여부
  const [failReasons, setFailReasons] = useState({}); // 실패 이유

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

  // 목표/환경 입력 핸들러
  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setGoalInput((prev) => ({ ...prev, [name]: value }));
  };

  // 목표/환경 입력 완료 후 계획 생성
  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlan([]);
    try {
      const res = await axios.post('http://localhost:5000/api/plan', {
        goal: goalInput.goal,
        userInfo,
        env: goalInput,
      });
      setPlan(res.data.plan);
      setChecked(Array(res.data.plan.length).fill(false));
      setStep('plan');
    } catch (err) {
      setError('계획 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 체크리스트 완료/실패 처리
  const handleCheck = (idx, checkedVal) => {
    const newChecked = [...checked];
    newChecked[idx] = checkedVal;
    setChecked(newChecked);
    // 경험치/레벨 처리
    if (checkedVal) {
      setExp((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          setLevel((lv) => lv + 1);
          return next - 100;
        }
        return next;
      });
    } else {
      setExp((prev) => {
        const next = prev - 10;
        if (next < 0) {
          setLevel((lv) => (lv > 1 ? lv - 1 : 1));
          return 90;
        }
        return next;
      });
    }
  };

  // 실패 이유 입력 핸들러
  const handleFailReason = (idx, value) => {
    setFailReasons((prev) => ({ ...prev, [idx]: value }));
  };

  // 실패 이유 선택형 옵션
  const failOptions = ['시간 부족', '동기 저하', '외부 사정', '계획 미흡', '기타'];

  // 성취도 퍼센트 계산
  const percent = plan.length > 0 ? Math.round((checked.filter(Boolean).length / plan.length) * 100) : 0;

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
        {step === 'goal' && (
          <form onSubmit={handleGoalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
            <input name="goal" placeholder="달성하고 싶은 목표" value={goalInput.goal} onChange={handleGoalInputChange} required />
            <input name="time" placeholder="하루 투자 가능 시간(예: 30분)" value={goalInput.time} onChange={handleGoalInputChange} />
            <input name="budget" placeholder="예산(무료/유료/월 예산 등)" value={goalInput.budget} onChange={handleGoalInputChange} />
            <input name="method" placeholder="선호 방식(온라인/오프라인/혼합)" value={goalInput.method} onChange={handleGoalInputChange} />
            <input name="offline" placeholder="오프라인 활동 가능 여부(예: 불가)" value={goalInput.offline} onChange={handleGoalInputChange} />
            <input name="etc" placeholder="기타(특이사항)" value={goalInput.etc} onChange={handleGoalInputChange} />
            <button type="submit" style={{ padding: '10px 0', fontSize: 16 }}>계획 생성</button>
          </form>
        )}
        {step === 'plan' && (
          <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
            <h2>하루비서의 제안</h2>
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontWeight: 'bold' }}>성취도: {percent}%</div>
              <div style={{ background: '#eee', borderRadius: 8, height: 16, width: '100%', margin: '8px 0' }}>
                <div style={{ background: '#4caf50', width: `${percent}%`, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 14 }}>레벨: {level} / 경험치: {exp} / {plan.length > 0 && `${checked.filter(Boolean).length}단계 완료`}</div>
            </div>
            <ol style={{ padding: 0 }}>
              {plan.map((stepText, idx) => (
                <li key={idx} style={{ marginBottom: 16, listStyle: 'decimal inside' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={checked[idx] || false} onChange={e => handleCheck(idx, e.target.checked)} />
                    <span style={{ flex: 1 }}>{stepText}</span>
                  </div>
                  {!checked[idx] && (
                    <div style={{ marginLeft: 24, marginTop: 4 }}>
                      <select value={failReasons[idx]?.option || ''} onChange={e => handleFailReason(idx, { ...failReasons[idx], option: e.target.value })} style={{ marginRight: 8 }}>
                        <option value="">실패 이유 선택</option>
                        {failOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <input type="text" placeholder="자유 입력" value={failReasons[idx]?.text || ''} onChange={e => handleFailReason(idx, { ...failReasons[idx], text: e.target.value })} style={{ width: 120 }} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
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
