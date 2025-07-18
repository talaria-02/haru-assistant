const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 목표를 받아 계획을 반환하는 엔드포인트 (임시 더미 데이터)
app.post('/api/plan', (req, res) => {
  const { goal } = req.body;
  // TODO: OpenAI 연동 후 실제 계획 생성
  const dummyPlan = [
    '매일 30분 영어 듣기 연습',
    '주 3회 영어로 일기 쓰기',
    '주 1회 원어민과 대화 시도',
    '한 달 후 실력 점검'
  ];
  res.json({ plan: dummyPlan, goal });
});

// AI 코칭 엔드포인트 (임시 더미)
app.post('/api/coaching', (req, res) => {
  const { userInfo, goalInput, plan, checked, failReasons, period } = req.body;
  // TODO: OpenAI 연동 후 실제 코칭 생성
  const done = plan.filter((_, i) => checked[i]).length;
  const total = plan.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  let feedback = `이번 ${period === 'month' ? '달' : '주'}의 목표 달성률은 ${percent}%입니다.\n`;
  if (percent >= 80) feedback += '아주 잘하고 있어요! 이대로 꾸준히 실천해보세요.';
  else if (percent >= 50) feedback += '절반 이상 달성했어요. 실패한 이유를 돌아보고, 다음엔 더 높은 달성률을 목표로 해봐요!';
  else feedback += '아직 부족하지만, 포기하지 말고 작은 것부터 실천해보세요.';
  if (Object.values(failReasons).some(r => r.option || r.text)) {
    feedback += '\n실패 이유 분석: ';
    feedback += Object.values(failReasons).map(r => r.option || '').filter(Boolean).join(', ');
    feedback += Object.values(failReasons).map(r => r.text || '').filter(Boolean).length ? ' / ' + Object.values(failReasons).map(r => r.text || '').filter(Boolean).join(', ') : '';
  }
  res.json({ coaching: feedback });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});