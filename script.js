(function () {
  "use strict";

  // ---------- 레슨 데이터 ----------
  // check(doc, logs): 미리보기 문서(doc)와 콘솔 로그(logs)를 보고 true/false 반환
  var lessons = [
    {
      title: "1. 첫 번째 HTML",
      desc: "HTML은 웹페이지의 뼈대를 만드는 언어예요.",
      task: "<h1> 태그 안에 '안녕하세요'라는 글자를 넣어보세요.",
      hint: "<h1>안녕하세요</h1> 처럼 쓰면 돼요.",
      starter: "<!-- 여기에 코드를 작성하세요 -->\n<h1></h1>\n",
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
      check: function (doc, logs) {
        var nums = logs
          .filter(function (l) { return !l.isError; })
          .map(function (l) { return l.text.trim(); });
        return nums.join(",") === "1,2,3,4,5";
      }
    }
  ];

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
          theme: s.theme || null
        };
      }
    } catch (e) { /* 저장소 사용 불가 시 무시 */ }
    return { current: 0, done: {}, code: {}, theme: null };
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

  // ---------- 사이드바 ----------
  function renderSidebar() {
    var list = $("lessonList");
    list.innerHTML = "";
    lessons.forEach(function (l, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      if (i === state.current) b.className = "active";
      var span = document.createElement("span");
      span.textContent = l.title;
      b.appendChild(span);
      if (state.done[i]) {
        var c = document.createElement("span");
        c.className = "check";
        c.textContent = "✓";
        b.appendChild(c);
      }
      b.addEventListener("click", function () { goTo(i); });
      li.appendChild(b);
      list.appendChild(li);
    });
    var doneCount = Object.keys(state.done).length;
    $("progressText").textContent = doneCount + " / " + lessons.length + " 완료";
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
    $("lessonTask").textContent = "과제: " + l.task;
    editor.value = state.code[state.current] != null ? state.code[state.current] : l.starter;
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

  function run(checkAnswer) {
    var l = lessons[state.current];
    runToken += 1;
    var token = runToken;
    clearConsole();
    state.code[state.current] = editor.value;
    saveState();
    pendingCheck = !!checkAnswer;
    pendingToken = token;
    preview.srcdoc = buildDoc(editor.value, token, l.check.toString());
  }

  var pendingCheck = false;
  var pendingToken = 0;

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
        setFeedback("🎉 정답이에요! 다음 레슨으로 가볼까요?", "ok");
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
    feedback.style.whiteSpace = "pre-wrap";
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
