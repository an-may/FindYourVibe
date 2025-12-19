// result.js

document.addEventListener("DOMContentLoaded", () => {
  const resultText = document.getElementById("resultText");
  const resultChart = document.getElementById("resultChart");
  const resultDetail = document.getElementById("resultDetail"); // ← ここに詳細（イラスト＆文章）を出す

  const data = JSON.parse(localStorage.getItem("oshikatsuResult"));
  if (!data) return;

  // スコアの最大値を取得
  const maxScore = Math.max(...Object.values(data));

  // 最大値と同じスコアを持つカテゴリを全部取得（同率対応）
  const topCategories = Object.keys(data).filter(
    (key) => data[key] === maxScore
  );

  // 結果メッセージ（同率対応）
  if (topCategories.length === 1) {
    resultText.textContent = `あなたは「${topCategories[0]}」を重視する傾向にあります。`;
  } else {
    resultText.textContent = `あなたは「${topCategories.join("・")}」を重視する傾向にあります。`;
  }

  // カテゴリ別のイラスト＆説明文データ
  const categoryDetails = {
    "現場/体験": {
      img: "images/scene.png",
      text: "イベントやライブなど、実際に足を運ぶことを重視。体験を通して記憶に残すのが好き！"
    },
    "グッズ収集": {
      img: "images/goods.png",
      text: "グッズを集めたり飾ったりすることを重視。お気に入りのコレクションに囲まれて推しへの愛を深めている！"
    },
    "つながり": {
      img: "images/connection.png",
      text: "同じ趣味を持つ仲間と一緒に楽しむことを重視。人とのつながりを通して推し活の世界を広げている！"
    },
    "表現": {
      img: "images/creation.png",
      text: "イラストや文章など、創作を通じて推しを表現することを重視。感情を形にすることで自分らしく推し活を楽しむ！"
    },
    "考察": {
      img: "images/theory.png",
      text: "作品の背景やキャラの心情を考察することを重視。分析力と思考力で推しへの愛をより深める！"
    },
    "自己研鑽": {
      img: "images/selfgrowth.png",
      text: "推しから影響を受けて、自分自身も成長することを重視。努力家で前向きな姿勢が魅力！"
    }
  };

  // 複数カテゴリの詳細を表示
  if (resultDetail) {
    resultDetail.innerHTML = topCategories
      .map((category) => {
        const detail = categoryDetails[category];
        return `
          <div class="result-item">
            <img src="${detail.img}" alt="${category}" class="result-image">
            <p class="result-category">【${category}】</p>
            <p class="result-text">${detail.text}</p>
          </div>
        `;
      })
      .join("");
  }

  // チャート描画
  new Chart(resultChart, {
    type: "radar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "あなたの推し活傾向",
        data: Object.values(data),
        borderColor: "#ec79a0",
        backgroundColor: "rgba(252, 232, 230, 0.65)",
        pointBackgroundColor: "#ec79a0"
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 20,
          ticks: {
            stepSize: 5,
            color: "#000"
          },
          pointLabels: {
            color: "#000",
            font: {
              size: 14
            }
          }
        }
      }
    }
  });
});

// リトライボタン
const retryButton = document.getElementById("retry-btn");
if (retryButton) {
  retryButton.addEventListener("click", () => {
    localStorage.removeItem("oshikatsuResult"); // スコアを消す
    localStorage.removeItem("oshikatsuAnswers"); // 回答リセット
    window.location.href = "page1.html"; // 最初のページに戻る
  });
}

window.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("answeredCount");
});
