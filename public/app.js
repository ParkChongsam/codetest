const productInput = document.getElementById('productInput');
const recommendBtn = document.getElementById('recommendBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const resultTitle = document.getElementById('resultTitle');
const recommendationsList = document.getElementById('recommendationsList');
const exampleBtns = document.querySelectorAll('.example-btn');

// 예시 버튼 클릭 이벤트
exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const product = btn.dataset.product;
        productInput.value = product;
        getRecommendations(product);
    });
});

// 추천받기 버튼 클릭 이벤트
recommendBtn.addEventListener('click', () => {
    const product = productInput.value.trim();
    if (product) {
        getRecommendations(product);
    }
});

// Enter 키 입력 이벤트
productInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const product = productInput.value.trim();
        if (product) {
            getRecommendations(product);
        }
    }
});

// API 호출하여 추천 받기
async function getRecommendations(product) {
    // UI 상태 변경
    recommendBtn.disabled = true;
    resultsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product })
        });

        if (!response.ok) {
            throw new Error('추천을 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        displayRecommendations(data);
    } catch (error) {
        console.error('Error:', error);
        alert('추천을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        recommendBtn.disabled = false;
        loadingSection.classList.add('hidden');
    }
}

// 추천 결과 표시
function displayRecommendations(data) {
    resultTitle.textContent = `"${data.product}" 제품의 가치 추천`;
    recommendationsList.innerHTML = '';

    data.recommendations.forEach(rec => {
        const card = createRecommendationCard(rec);
        recommendationsList.appendChild(card);
    });

    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 추천 카드 생성
function createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';

    const valuePointsHTML = recommendation.valuePoints
        .map(point => `<li>${point}</li>`)
        .join('');

    card.innerHTML = `
        <div class="card-header">
            <span class="card-icon">${recommendation.icon}</span>
            <span class="card-category">${recommendation.category}</span>
        </div>
        <h3 class="card-title">${recommendation.title}</h3>
        <p class="card-description">${recommendation.description}</p>
        <ul class="value-points">
            ${valuePointsHTML}
        </ul>
    `;

    return card;
}

// 페이지 로드시 입력 필드에 포커스
window.addEventListener('load', () => {
    productInput.focus();
});
