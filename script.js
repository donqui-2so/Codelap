(function () {
  "use strict";

  // ---------- 레슨 데이터 ----------
  // check(doc, logs): 미리보기 문서(doc)와 콘솔 로그(logs)를 보고 true/false 반환
  // solution: '정답 보기' 버튼에 쓰이는 예시 정답 / free: true 면 자유 실습(채점 없음)
  var lessons = [
    {
      title: "1. 첫 번째 HTML",
      desc: "HTML은 웹페이지의 뼈대를 만드는 언어예요.",
      task: "<h1> 태그 안에 '안녕하세요'라는 글자를 넣어보세요.",
      hint: "<h1>안녕하세요</h1> 처럼 쓰면 돼요.",
      starter: "<!-- 여기에 코드를 작성하세요 -->\n<h1></h1>\n",
      solution: "<h1>안녕하세요</h1>\n",
      check: function (doc) {
        var h = doc.querySelector("h1");
        return !!h && h.textContent.trim() === "안녕하세요";
      }
    },
    {
      title: "2. 목록 만들기",
      desc: "<ul>과 <li>로 목록을 만들 수 있어요.",
      task: "<ul> 안에 <li>를 3개 만들어보세요.",
      hint: "<ul>\n  <li>사과</li>\n  <li>바나나</li>\n  <li>포도</li>\n</ul>",
      starter: "<ul>\n  \n</ul>\n",
      solution: "<ul>\n  <li>사과</li>\n  <li>바나나</li>\n  <li>포도</li>\n</ul>\n",
      check: function (doc) {
        return doc.querySelectorAll("ul > li").length >= 3;
      }
    },
    {
      title: "3. CSS로 색 입히기",
      desc: "CSS는 웹페이지를 꾸미는 언어예요.",
      task: "p 태그의 글자색을 red로 바꿔보세요.",
      hint: "p { color: red; }",
      starter: "<style>\n  p {\n    \n  }\n</style>\n\n<p>저는 빨간색이 될 거예요</p>\n",
      solution: "<style>\n  p {\n    color: red;\n  }\n</style>\n\n<p>저는 빨간색이 될 거예요</p>\n",
      check: function (doc) {
        var p = doc.querySelector("p");
        if (!p) return false;
        var c = doc.defaultView.getComputedStyle(p).color;
        return c === "rgb(255, 0, 0)";
      }
    },
    {
      title: "4. 버튼과 JavaScript",
      desc: "JavaScript로 버튼을 눌렀을 때 동작을 만들 수 있어요.",
      task: "버튼을 클릭하면 id가 result인 요소의 글자가 '클릭됨!'으로 바뀌게 해보세요.",
      hint: "document.getElementById('btn').addEventListener('click', function () {\n  document.getElementById('result').textContent = '클릭됨!';\n});",
      starter:
        "<button id=\"btn\">눌러보세요</button>\n<p id=\"result\">아직 안 눌렀어요</p>\n\n<script>\n  \n</script>\n",
      solution:
        "<button id=\"btn\">눌러보세요</button>\n<p id=\"result\">아직 안 눌렀어요</p>\n\n<script>\n  document.getElementById('btn').addEventListener('click', function () {\n    document.getElementById('result').textContent = '클릭됨!';\n  });\n</script>\n",
      check: function (doc) {
        var btn = doc.getElementById("btn");
        var res = doc.getElementById("result");
        if (!btn || !res) return false;
        btn.click();
        return res.textContent.trim() === "클릭됨!";
      }
    },
    {
      title: "5. 반복문",
      desc: "for문으로 같은 일을 여러 번 할 수 있어요.",
      task: "console.log로 1부터 5까지 숫자를 차례대로 출력해보세요.",
      hint: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
      starter: "<script>\n  \n</script>\n",
      solution: "<script>\n  for (let i = 1; i <= 5; i++) {\n    console.log(i);\n  }\n</script>\n",
      check: function (doc, logs) {
        var nums = logs
          .filter(function (l) { return !l.isError; })
          .map(function (l) { return l.text.trim(); });
        return nums.join(",") === "1,2,3,4,5";
      }
    },
    {
      title: "6. 조건문",
      desc: "if문으로 상황에 따라 다른 동작을 할 수 있어요.",
      task: "score가 60 이상이면 '합격', 아니면 '불합격'을 console.log로 한 번 출력해보세요.",
      hint: "if (score >= 60) {\n  console.log('합격');\n} else {\n  console.log('불합격');\n}",
      starter: "<script>\n  var score = 75;\n  // 여기에 if문을 작성하세요\n  \n</script>\n",
      solution:
        "<script>\n  var score = 75;\n  if (score >= 60) {\n    console.log('합격');\n  } else {\n    console.log('불합격');\n  }\n</script>\n",
      check: function (doc, logs) {
        var s = doc.defaultView.score;
        if (typeof s !== "number") return false;
        var expected = s >= 60 ? "합격" : "불합격";
        return logs.length === 1 && !logs[0].isError && logs[0].text.trim() === expected;
      }
    },
    {
      title: "7. 함수",
      desc: "함수는 자주 쓰는 코드를 이름을 붙여 묶어둔 거예요.",
      task: "두 숫자를 더해서 돌려주는 add 함수를 function add(a, b) { ... } 형태로 만들어보세요.",
      hint: "function add(a, b) {\n  return a + b;\n}",
      starter: "<script>\n  // add 함수를 만들어보세요\n  \n  console.log(add(2, 3));\n</script>\n",
      solution:
        "<script>\n  function add(a, b) {\n    return a + b;\n  }\n\n  console.log(add(2, 3));\n</script>\n",
      check: function (doc) {
        var w = doc.defaultView;
        return typeof w.add === "function" && w.add(2, 3) === 5 && w.add(10, -4) === 6;
      }
    },
    {
      title: "8. 배열",
      desc: "배열은 여러 값을 순서대로 담아두는 상자예요.",
      task: "colors 배열에 'red', 'green', 'blue'를 담고, colors.length를 console.log로 출력해보세요.",
      hint: "var colors = ['red', 'green', 'blue'];\nconsole.log(colors.length);",
      starter: "<script>\n  var colors = [];\n  \n</script>\n",
      solution:
        "<script>\n  var colors = ['red', 'green', 'blue'];\n  console.log(colors.length);\n</script>\n",
      check: function (doc, logs) {
        var c = doc.defaultView.colors;
        if (!Array.isArray(c) || c.length !== 3) return false;
        return logs.some(function (l) { return !l.isError && l.text.trim() === "3"; });
      }
    },
    {
      title: "9. 요소 추가하기",
      desc: "JavaScript로 웹페이지에 새 요소를 만들어 넣을 수 있어요.",
      task: "버튼을 누를 때마다 #list 안에 <li>가 하나씩 늘어나게 해보세요.",
      hint:
        "document.getElementById('add').addEventListener('click', function () {\n  var li = document.createElement('li');\n  li.textContent = '새 항목';\n  document.getElementById('list').appendChild(li);\n});",
      starter: "<button id=\"add\">추가</button>\n<ul id=\"list\"></ul>\n\n<script>\n  \n</script>\n",
      solution:
        "<button id=\"add\">추가</button>\n<ul id=\"list\"></ul>\n\n<script>\n  document.getElementById('add').addEventListener('click', function () {\n    var li = document.createElement('li');\n    li.textContent = '새 항목';\n    document.getElementById('list').appendChild(li);\n  });\n</script>\n",
      check: function (doc) {
        var btn = doc.getElementById("add");
        var list = doc.getElementById("list");
        if (!btn || !list) return false;
        var before = list.querySelectorAll("li").length;
        btn.click();
        btn.click();
        return list.querySelectorAll("li").length === before + 2;
      }
    },
    {
      title: "10. Flexbox 정렬",
      desc: "Flexbox는 요소를 가로·세로로 편하게 배치하는 CSS 기능이에요.",
      task: ".box를 display: flex 로 만들고, justify-content: center 로 가운데 정렬해보세요.",
      hint: ".box {\n  display: flex;\n  justify-content: center;\n}",
      starter:
        "<style>\n  .box {\n    \n  }\n</style>\n\n<div class=\"box\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>\n",
      solution:
        "<style>\n  .box {\n    display: flex;\n    justify-content: center;\n  }\n</style>\n\n<div class=\"box\">\n  <span>A</span>\n  <span>B</span>\n  <span>C</span>\n</div>\n",
      check: function (doc) {
        var box = doc.querySelector(".box");
        if (!box) return false;
        var cs = doc.defaultView.getComputedStyle(box);
        return cs.display === "flex" && cs.justifyContent === "center";
      }
    },
    {
      title: "★ 자유 실습",
      desc: "채점 없이 마음대로 코드를 써보는 놀이터예요.",
      task: "HTML, CSS, JavaScript를 자유롭게 섞어서 나만의 페이지를 만들어보세요!",
      free: true,
      starter:
        "<style>\n  body { font-family: sans-serif; text-align: center; }\n  button { padding: 8px 16px; font-size: 1rem; }\n</style>\n\n<h1 id=\"count\">0</h1>\n<button id=\"up\">+1</button>\n\n<script>\n  var n = 0;\n  document.getElementById('up').addEventListener('click', function () {\n    n++;\n    document.getElementById('count').textContent = n;\n    console.log('현재 값:', n);\n  });\n</script>\n"
    }
  ];

  function gradedCount() {
    return lessons.filter(function (l) { return !l.free; }).length;
  }

  // ---------- 상태 / 저장 ----------
  var STORE_KEY = "codelab-state-v1";
  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        return {
          current: Number(s.current) || 0,
          done: s.done || {},
          code: s.code || {},
          theme: s.theme || null,
          fontSize: Number(s.fontSize) || 14
        };
      }
    } catch (e) { /* 저장소 사용 불가 시 무시 */ }
    return { current: 0, done: {}, code: {}, theme: null, fontSize: 14 };
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 무시 */ }
  }

  // ---------- DOM ----------
  var $ = function (id) { return document.getElementById(id); };
  var editor = $("editor");
  var preview = $("preview");
  var consoleOut = $("consoleOut");
  var feedback = $("feedback");

  var logs = [];
  var runToken = 0;

  if (state.current < 0 || state.current >= lessons.length) state.current = 0;

  // ---------- 테마 ----------
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("themeToggle").textContent = t === "dark" ? "☀️" : "🌙";
  }
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(state.theme || (prefersDark ? "dark" : "light"));

  $("themeToggle").addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    state.theme = next;
    applyTheme(next);
    saveState();
  });

  // ---------- 글자 크기 ----------
  function applyFont() {
    state.fontSize = Math.max(11, Math.min(24, state.fontSize));
    editor.style.fontSize = state.fontSize + "px";
  }
  applyFont();

  $("fontDown").addEventListener("click", function () { state.fontSize -= 1; applyFont(); saveState(); });
  $("fontUp").addEventListener("click", function () { state.fontSize += 1; applyFont(); saveState(); });

  // ---------- 사이드바 ----------
  function doneCount() {
    return lessons.filter(function (l, i) { return !l.free && state.done[i]; }).length;
  }

  function renderSidebar() {
    var list = $("lessonList");
    list.innerHTML = "";
    lessons.forEach(function (l, i) {
      var li = document.createElement("li");
      if (l.free) li.className = "free";
      var b = document.createElement("button");
      b.type = "button";
      if (i === state.current) b.className = "active";
      var span = document.createElement("span");
      span.textContent = l.title;
      b.appendChild(span);
      if (state.done[i] && !l.free) {
        var c = document.createElement("span");
        c.className = "check";
        c.textContent = "✓";
        b.appendChild(c);
      }
      b.addEventListener("click", function () { goTo(i); });
      li.appendChild(b);
      list.appendChild(li);
    });
    var done = doneCount();
    var total = gradedCount();
    $("progressText").textContent = done + " / " + total + " 완료";
    $("progressFill").style.width = (total ? (done / total) * 100 : 0) + "%";
  }

  // ---------- 레슨 로드 ----------
  function goTo(i) {
    if (i < 0 || i >= lessons.length) return;
    state.code[state.current] = editor.value;
    state.current = i;
    saveState();
    loadLesson();
  }

  function loadLesson() {
    var l = lessons[state.current];
    $("lessonTitle").textContent = l.title;
    $("lessonDesc").textContent = l.desc;
    $("lessonTask").textContent = (l.free ? "도전: " : "과제: ") + l.task;
    editor.value = state.code[state.current] != null ? state.code[state.current] : l.starter;
    $("hintBtn").hidden = !!l.free;
    $("solutionBtn").hidden = !!l.free;
    $("prevBtn").disabled = state.current === 0;
    $("nextBtn").disabled = state.current === lessons.length - 1;
    setFeedback("", "");
    clearConsole();
    renderSidebar();
    run(false);
  }

  function setFeedback(msg, cls) {
    feedback.textContent = msg;
    feedback.className = "feedback" + (cls ? " " + cls : "");
  }

  // ---------- 축하 효과 ----------
  function celebrate() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var emojis = ["🎉", "✨", "🎊", "⭐"];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      s.className = "confetti";
      s.textContent = emojis[i % emojis.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 2200); })(s);
    }
  }

  // ---------- 콘솔 ----------
  function clearConsole() {
    logs = [];
    consoleOut.innerHTML = "";
  }

  function addLog(text, isError) {
    logs.push({ text: String(text), isError: !!isError });
    var line = document.createElement("div");
    if (isError) line.className = "err";
    line.textContent = String(text);
    consoleOut.appendChild(line);
    consoleOut.scrollTop = consoleOut.scrollHeight;
  }

  $("clearConsole").addEventListener("click", clearConsole);

  // ---------- 실행 ----------
  // iframe(sandbox="allow-scripts")은 부모 DOM에 접근할 수 없으므로
  // 결과 검사는 iframe 안에서 수행하고 postMessage로 결과를 받는다.
  function buildDoc(code, token, checkSource) {
    var bridge =
      "<script>(function(){" +
      "var T=" + token + ";" +
      "function send(m){m.token=T;m.src='codelab';parent.postMessage(m,'*');}" +
      "var oc=console.log;" +
      "console.log=function(){var a=[].slice.call(arguments).map(function(x){" +
      "try{return typeof x==='object'?JSON.stringify(x):String(x);}catch(e){return String(x);}});" +
      "send({type:'log',text:a.join(' ')});oc.apply(console,arguments);};" +
      "window.addEventListener('error',function(e){send({type:'log',text:'오류: '+e.message,isError:true});});" +
      "window.addEventListener('load',function(){" +
      "setTimeout(function(){send({type:'ready'});},0);});" +
      "window.__codelabCheck=" + checkSource + ";" +
      "window.addEventListener('message',function(e){" +
      "if(!e.data||e.data.src!=='codelab-parent'||e.data.token!==T)return;" +
      "var ok=false;try{ok=!!window.__codelabCheck(document,e.data.logs||[]);}catch(err){ok=false;}" +
      "send({type:'result',ok:ok});});" +
      "})();<\/script>";
    return bridge + code;
  }

  var pendingCheck = false;
  var pendingToken = 0;

  function run(checkAnswer) {
    var l = lessons[state.current];
    runToken += 1;
    var token = runToken;
    clearConsole();
    state.code[state.current] = editor.value;
    saveState();
    pendingCheck = !!checkAnswer && !l.free;
    pendingToken = token;
    var src = l.check ? l.check.toString() : "function(){return true;}";
    preview.srcdoc = buildDoc(editor.value, token, src);
    if (checkAnswer && l.free) {
      setFeedback("▶ 실행했어요. 마음껏 실험해보세요!", "info");
    }
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.src !== "codelab" || d.token !== pendingToken) return;
    if (e.source !== preview.contentWindow) return;

    if (d.type === "log") {
      addLog(d.text, d.isError);
    } else if (d.type === "ready") {
      if (pendingCheck) {
        preview.contentWindow.postMessage(
          { src: "codelab-parent", token: pendingToken, logs: logs },
          "*"
        );
      }
    } else if (d.type === "result") {
      pendingCheck = false;
      if (d.ok) {
        state.done[state.current] = true;
        saveState();
        renderSidebar();
        celebrate();
        if (doneCount() === gradedCount()) {
          setFeedback("🏆 모든 레슨을 완료했어요! 자유 실습에서 나만의 페이지를 만들어보세요.", "ok");
        } else {
          setFeedback("🎉 정답이에요! 다음 레슨으로 가볼까요?", "ok");
        }
      } else {
        setFeedback("아직 조건을 만족하지 않아요. 힌트를 확인해보세요.", "err");
      }
    }
  });

  // ---------- 이벤트 ----------
  $("runBtn").addEventListener("click", function () { run(true); });

  $("resetBtn").addEventListener("click", function () {
    if (!confirm("이 레슨의 코드를 처음 상태로 되돌릴까요?")) return;
    delete state.code[state.current];
    editor.value = lessons[state.current].starter;
    saveState();
    setFeedback("", "");
    run(false);
  });

  $("hintBtn").addEventListener("click", function () {
    setFeedback("💡 힌트:\n" + lessons[state.current].hint, "info");
  });

  $("solutionBtn").addEventListener("click", function () {
    if (!confirm("정답 예시를 보면 지금 작성한 코드가 바뀌어요. 계속할까요?")) return;
    editor.value = lessons[state.current].solution;
    state.code[state.current] = editor.value;
    saveState();
    setFeedback("정답 예시를 불러왔어요. ▶ 실행으로 확인해보세요.", "info");
    run(false);
  });

  $("copyBtn").addEventListener("click", function () {
    function done() { setFeedback("📋 코드를 복사했어요.", "info"); }
    function fallback() {
      try {
        editor.focus();
        editor.select();
        if (document.execCommand("copy")) done();
        else setFeedback("복사에 실패했어요. 직접 선택해서 복사해주세요.", "err");
      } catch (err) {
        setFeedback("복사에 실패했어요. 직접 선택해서 복사해주세요.", "err");
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(editor.value).then(done, fallback);
    } else {
      fallback();
    }
  });

  $("resetProgressBtn").addEventListener("click", function () {
    if (!confirm("모든 진행 상황과 작성한 코드가 삭제돼요. 정말 초기화할까요?")) return;
    state.done = {};
    state.code = {};
    state.current = 0;
    saveState();
    loadLesson();
  });

  $("prevBtn").addEventListener("click", function () { goTo(state.current - 1); });
  $("nextBtn").addEventListener("click", function () { goTo(state.current + 1); });

  editor.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      var s = editor.selectionStart;
      var en = editor.selectionEnd;
      editor.value = editor.value.substring(0, s) + "  " + editor.value.substring(en);
      editor.selectionStart = editor.selectionEnd = s + 2;
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run(true);
    }
  });

  editor.addEventListener("input", function () {
    state.code[state.current] = editor.value;
    saveState();
  });

  // ---------- 시작 ----------
  loadLesson();
})();
