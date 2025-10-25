const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 제품 카테고리별 가치 전환 템플릿
const valueTransformations = {
  sustainability: [
    '친환경 소재로 재해석',
    '재활용 가능한 버전',
    '에너지 효율적인 디자인',
    '지속가능한 생산 방식'
  ],
  accessibility: [
    '노약자를 위한 개선',
    '어린이 친화적 버전',
    '장애인 접근성 강화',
    '사용 편의성 극대화'
  ],
  smart: [
    'IoT 연동 스마트 버전',
    'AI 기반 자동화 기능',
    '데이터 분석 기능 추가',
    '앱 연동 원격 제어'
  ],
  multifunctional: [
    '공간 절약형 다기능',
    '모듈형 확장 가능',
    '2-in-1 결합 제품',
    '용도 전환 가능한 디자인'
  ],
  emotional: [
    '감성 디자인 강화',
    '개인화 맞춤 서비스',
    '추억 저장 기능',
    '소통과 연결 중심'
  ],
  health: [
    '건강 모니터링 기능',
    '항균/위생 강화',
    '인체공학적 개선',
    '웰빙 증진 요소'
  ]
};

// 제품 추천 생성 함수
function generateRecommendations(productName) {
  const recommendations = [];
  const categories = Object.keys(valueTransformations);

  // 각 카테고리별로 2-3개의 추천 생성
  const selectedCategories = categories.sort(() => Math.random() - 0.5).slice(0, 4);

  selectedCategories.forEach(category => {
    const transformations = valueTransformations[category];
    const selectedTransform = transformations[Math.floor(Math.random() * transformations.length)];

    let categoryName = '';
    let icon = '';
    let description = '';

    switch(category) {
      case 'sustainability':
        categoryName = '지속가능성';
        icon = '🌱';
        description = `${productName}를 ${selectedTransform}하여 환경을 생각하는 가치를 더합니다.`;
        break;
      case 'accessibility':
        categoryName = '접근성';
        icon = '♿';
        description = `${productName}를 ${selectedTransform}하여 모든 사람이 쉽게 사용할 수 있습니다.`;
        break;
      case 'smart':
        categoryName = '스마트화';
        icon = '🤖';
        description = `${productName}에 ${selectedTransform}을 적용하여 미래지향적 가치를 제공합니다.`;
        break;
      case 'multifunctional':
        categoryName = '다기능성';
        icon = '🔧';
        description = `${productName}를 ${selectedTransform}으로 만들어 효율성을 극대화합니다.`;
        break;
      case 'emotional':
        categoryName = '감성가치';
        icon = '💝';
        description = `${productName}에 ${selectedTransform}을 더해 특별한 경험을 선사합니다.`;
        break;
      case 'health':
        categoryName = '건강/웰빙';
        icon = '💪';
        description = `${productName}에 ${selectedTransform}을 추가하여 건강한 생활을 지원합니다.`;
        break;
    }

    recommendations.push({
      category: categoryName,
      icon: icon,
      title: `${selectedTransform} ${productName}`,
      description: description,
      valuePoints: generateValuePoints(category, productName)
    });
  });

  return recommendations;
}

// 가치 포인트 생성
function generateValuePoints(category, productName) {
  const points = {
    sustainability: [
      '탄소 배출 감소',
      '재사용 가능 소재',
      '오래 사용 가능한 내구성'
    ],
    accessibility: [
      '직관적인 사용법',
      '다양한 연령층 고려',
      '안전성 강화'
    ],
    smart: [
      '자동화로 시간 절약',
      '데이터 기반 최적화',
      '편리한 원격 제어'
    ],
    multifunctional: [
      '공간 활용도 향상',
      '비용 절감 효과',
      '다양한 상황 대응'
    ],
    emotional: [
      '개인 맞춤 경험',
      '감성적 만족감',
      '특별한 가치 창출'
    ],
    health: [
      '건강 증진 효과',
      '위생적인 사용',
      '신체 부담 감소'
    ]
  };

  return points[category] || [];
}

// API 엔드포인트
app.post('/api/recommend', (req, res) => {
  const { product } = req.body;

  if (!product || product.trim() === '') {
    return res.status(400).json({ error: '제품명을 입력해주세요.' });
  }

  const recommendations = generateRecommendations(product.trim());

  res.json({
    product: product.trim(),
    recommendations: recommendations,
    timestamp: new Date().toISOString()
  });
});

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 제품 가치 추천 서버가 포트 ${PORT}에서 실행중입니다.`);
  console.log(`   http://localhost:${PORT} 에서 확인하세요.`);
});
