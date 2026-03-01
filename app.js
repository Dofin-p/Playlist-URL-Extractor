    // GASで発行したウェブアプリのURL
    const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwakL0S5fq9rf-U62tpzdSx87vsw1GirV3utW_0HUkheShIeqN8WRVy901tn7LIwH4k/exec";

    document.getElementById("selectAllBtn").addEventListener("click", () => {
      const resultArea = document.getElementById("resultArea");
      if (!resultArea.value) return;
      resultArea.select();
      navigator.clipboard.writeText(resultArea.value);
    });

    document.getElementById("fetchBtn").addEventListener("click", async () => {
      const inputVal = document.getElementById("playlistUrl").value.trim();
      if (!inputVal) return alert("URLを入力してください");

      // URLからlist=以降のIDを抽出する
      const match = inputVal.match(/[?&]list=([^&]+)/);
      const playlistId = match ? match[1] : null;
      if (!playlistId) return alert("再生リストIDが見つかりません。URLを確認してください");

      const loading = document.getElementById("loading");
      const resultArea = document.getElementById("resultArea");

      // UIの初期化（ローディング表示）
      loading.style.display = "block";
      resultArea.value = "";
      document.getElementById("fetchBtn").disabled = true;

      try {
        // GASのAPIを叩く
        const response = await fetch(`${GAS_API_URL}?id=${playlistId}`, {
          method: "GET",
          redirect: "follow"
        });

        const json = await response.json();

        if (json.status === "success") {
          // 配列をテキストエリアに表示
          resultArea.value = json.data.join("\n");
        } else {
          alert("エラー: " + json.message);
        }
      } catch (error) {
        alert("通信エラーが発生しました: " + error);
      } finally {
        // ローディング非表示、ボタン復活
        loading.style.display = "none";
        document.getElementById("fetchBtn").disabled = false;
      }
    });
