// 처음 로드할 때
window.onload = function () {
  drawGraph();
};

// 창 크기 변경될 때마다
window.onresize = function () {
  drawGraph();
};

let data = [
  //초기 데이터터
  { id: 0, value: 75 },
  { id: 1, value: 20 },
  { id: 2, value: 85 },
  { id: 3, value: 100 },
];

function drawGraph() {
  const graph = document.getElementById("graph");

  // 그래프 그리기 전에 기존 요소 다 삭제
  graph.innerHTML = "";

  const graphWidth = graph.offsetWidth;
  const graphHeight = graph.offsetHeight;

  // 축 만들기
  const xAxis = document.createElement("div");
  xAxis.id = "x-axis";
  xAxis.className = "axis";
  graph.appendChild(xAxis);

  const yAxis = document.createElement("div");
  yAxis.id = "y-axis";
  yAxis.className = "axis";
  graph.appendChild(yAxis);

  const barWidth = 30;
  const barGap = (graphWidth - 40 - data.length * barWidth) / data.length;

  data.forEach((item, index) => {
    const value = item.value;
    const id = item.id;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (value / 100) * (graphHeight - 80) + "px";
    bar.style.left = 40 + barGap / 2 + index * (barWidth + barGap) + "px";
    graph.appendChild(bar);

    // Tooltip 추가 (bar에 hover)
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerText = value;
    bar.appendChild(tooltip);

    const label = document.createElement("div");
    label.className = "label-x";
    label.style.left = 40 + barGap / 2 + index * (barWidth + barGap) + "px";
    label.innerText = id;
    graph.appendChild(label);
  });

  // y축 라벨
  const yLabels = [0, 100];
  yLabels.forEach((value) => {
    const label = document.createElement("div");
    label.className = "label-y";
    label.style.bottom = (value / 100) * (graphHeight - 80) + "px";
    label.style.width = "30px";
    label.style.height = "50px";
    label.innerText = value;
    graph.appendChild(label);
  });
}

function updateTable() {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.innerText = item.id;
    tr.appendChild(tdId);

    const tdValue = document.createElement("td");
    const input = document.createElement("input");
    input.style.backgroundColor = "transparent";
    input.style.border = "none";
    input.style.textAlign = "center";
    input.value = item.value;
    input.dataset.index = index;
    input.min = 0;
    input.max = 100;
    tdValue.appendChild(input);
    tr.appendChild(tdValue);

    const tdDelete = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.innerText = "삭제";
    delBtn.style.color = "red";
    delBtn.style.backgroundColor = "transparent";
    delBtn.classList.add("delete-btn");

    delBtn.onclick = () => {
      data.splice(index, 1);
      updateTable();
      updateAdvancedEditor();
    };

    tdDelete.appendChild(delBtn);
    tr.appendChild(tdDelete);

    tbody.appendChild(tr);
  });

  const applyBtn = document.getElementById("apply1");
  applyBtn.onclick = () => {
    const inputs = document.querySelectorAll("#data-table tbody input");
    let isValid = true; // 유효성 검사 변수

    inputs.forEach((input) => {
      let value = Number(input.value);
      if (value < 0 || value > 100) {
        alert("value 값은 0 이상 100 이하로 입력해야 합니다.");
        isValid = false; // 유효성 검사 실패
      } else {
        data[input.dataset.index].value = value; // 값이 유효하면 업데이트
      }
    });

    if (isValid) {
      drawGraph();
      updateAdvancedEditor();
    }
  };
}

// edit function
window.onload = function () {
  drawGraph();
  updateTable();
  updateAdvancedEditor();

  document.getElementsByClassName("edit-apply").onclick = function () {
    const inputs = document.querySelectorAll("#data-table tbody input");
    let isValid = true;

    data = Array.from(inputs).map((input) => {
      let value = Number(input.value);
      if (value < 0 || value > 100) {
        alert("value 값은 0 이상 100 이하로 입력해야 합니다.");
        isValid = false;
      }
      return value;
    });

    if (isValid) {
      drawGraph();
      updateTable();
    }
  };

  // add function
  document.getElementById("add-btn").onclick = function () {
    const newId = document.getElementById("new-id").value;
    const newValue = document.getElementById("new-value").value;

    if (newValue !== "" && newId !== "") {
      let value = Number(newValue);
      if (value < 0 || value > 100) {
        alert("value 값은 0 이상 100 이하로 입력해야 합니다.");
      } else {
        data.push({ id: Number(newId), value: value });
        drawGraph();
        updateTable();
        updateAdvancedEditor();
        document.getElementById("new-id").value = "";
        document.getElementById("new-value").value = "";
      }
    }
  };
};

// 데이터를 json형식으로 값 출력
function updateAdvancedEditor() {
  const advancedEditor = document.getElementById("advanced-editor");
  const dataWithIds = data.map((item) => ({
    id: item.id,
    value: item.value,
  }));
  advancedEditor.innerText = JSON.stringify(dataWithIds, null, 2);
}

// 고급 편집 apply function
document.getElementById("apply2").onclick = function () {
  const advancedEditor = document.getElementById("advanced-editor");
  try {
    const parsed = JSON.parse(advancedEditor.innerText);

    const isValid = parsed.every(
      (item) => item.value >= 0 && item.value <= 100
    );

    if (isValid) {
      data = parsed.map((item) => ({
        id: item.id,
        value: item.value,
      }));
      drawGraph();
      updateTable();
      updateAdvancedEditor();
    } else {
      alert("value 값은 0 이상 100 이하이어야 합니다.");
    }
  } catch (e) {
    alert("JSON 형식이 잘못되었습니다."); //Json형식에 어긋나면 출력력
  }
};
