// script.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");

  const pageMapping = {
    "page1.html": {
      next: "page2.html",
      mapping: {
        q1: "現場/体験",
        q2: "現場/体験",
        q3: "現場/体験",
        q4: "現場/体験",
        q5: "グッズ収集",
        q6: "グッズ収集",
        q7: "グッズ収集",
        q8: "グッズ収集"
      }
    },
    "page2.html": {
      next: "page3.html",
      mapping: {
        q9: "つながり",
        q10: "つながり",
        q11: "つながり",
        q12: "つながり",
        q13: "表現",
        q14: "表現",
        q15: "表現",
        q16: "表現"
      }
    },
    "page3.html": {
      next: "result.html",
      mapping: {
        q17: "考察",
        q18: "考察",
        q19: "考察",
        q20: "考察",
        q21: "自己研鑽",
        q22: "自己研鑽",
        q23: "自己研鑽",
        q24: "自己研鑽"
      }
    }
  };

  // 現在のページファイル名を取得
  const pageName = location.pathname.split("/").pop();


// プログレスバー制御
const progressBar = document.getElementById("progress-bar");
if (progressBar) {
  const totalQuestions = 24;

  // すでに保存された回答数を読み込み（なければ0）
  let savedCount = Number(localStorage.getItem("answeredCount")) || 0;

  // 現在ページ内の回答数を取得
  const currentPageAnswered = document.querySelectorAll('input[type="radio"]:checked').length;

  // まだ回答が少ない方を採用（上書き防止）
  let answeredCount = Math.min(savedCount, totalQuestions - currentPageAnswered) + currentPageAnswered;

  // 進捗更新関数
  const updateProgress = () => {
    // 全ページの合計回答数を再計算
    const allChecked = document.querySelectorAll('input[type="radio"]:checked').length;
    const totalAnswered = Math.min(allChecked + savedCount, totalQuestions);

    // 保存して反映
    localStorage.setItem("answeredCount", totalAnswered);
    const progress = (totalAnswered / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
  };

  // 初回表示時にも反映
  updateProgress();

  // ラジオ変更時に更新
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener("change", updateProgress);
  });
}

  // ===== ページ読み込み時に前回の回答を復元する処理 =====
  const savedAnswers = JSON.parse(localStorage.getItem("oshikatsuAnswers")) || {};
   for (let [key, value] of Object.entries(savedAnswers)) {
    const input = document.querySelector(`input[name="${key}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  //戻るボタンの処理を追加
  const prevButton = document.getElementById("prevBtn");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (window.location.href.includes("page2.html")) {
        window.location.href = "page1.html";
      } else if (window.location.href.includes("page3.html")) {
        window.location.href = "page2.html";
      }
    });
  }

  // フォーム送信の処理
  if (form && pageMapping[pageName]) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const mapping = pageMapping[pageName].mapping;
      const nextPage = pageMapping[pageName].next;

      // 🆕 保存用オブジェクト
      const savedAnswers = JSON.parse(localStorage.getItem("oshikatsuAnswers")) || {};

      // データ取得 or 初期化
      const result = JSON.parse(localStorage.getItem("oshikatsuResult")) || {
        "現場/体験": 0,
        "グッズ収集": 0,
        "つながり": 0,
        "表現": 0,
        "考察": 0,
        "自己研鑽": 0
      };

      // 今ページのスコアを一時的にリセット
for (let key in mapping) {
  const category = mapping[key];
  if (category in result) {
    result[category] = 0; // ← 一旦0に戻す
  }
}

// 今ページの入力を再集計
for (let key in mapping) {
  const val = document.querySelector(`input[name="${key}"]:checked`);
  if (!val) {
    alert("すべての質問に回答してください。");
    return;
  }
  result[mapping[key]] += parseInt(val.value);

  // 回答を保存
  savedAnswers[key] = val.value;
}

localStorage.setItem("oshikatsuAnswers", JSON.stringify(savedAnswers));

    localStorage.setItem("oshikatsuResult", JSON.stringify(result));
      window.location.href = nextPage;
    });
  }

  // 結果ページ処理
  const resultText = document.getElementById("resultText");
  const resultChart = document.getElementById("resultChart");

  if (resultText && resultChart) {
    const data = JSON.parse(localStorage.getItem("oshikatsuResult"));
    if (!data) return;

    const maxCategory = Object.keys(data).reduce((a, b) =>
      data[a] > data[b] ? a : b
    );

    resultText.textContent = `あなたは「${maxCategory}」を重視する傾向にあります。`;

    new Chart(resultChart, {
      type: "radar",
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: "あなたの推し活傾向",
          data: Object.values(data),
          borderColor: "#ec79a0",
          backgroundColor: "rgba(252, 232, 230, 0.65)"
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
  }
});