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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});