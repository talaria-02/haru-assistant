import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>하루비서</h1>
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
