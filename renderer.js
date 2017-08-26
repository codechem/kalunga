// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require('jquery');
require('./simplescrollbars')

function refreshCodeMirror(instance) {
  instance.refresh();
  instance.setValue(instance.getValue());
}

function getOrCreateLine(instance, lineNb) {
  const resultLH = instance.getDoc().getLineHandle(lineNb);
  return resultLH;
}

function setLine(instance, lineNb, content) {
  const resultLH = getOrCreateLine(instance, lineNb);
  resultLH.text = content && content.toString() || "";
  refreshCodeMirror(instance);
}

function syncScroll(origin, dest) {
  const scrollNfo = origin.getScrollInfo();
  dest.scrollTo(scrollNfo.left, scrollNfo.top);
}
// Add the listener
document.addEventListener('DOMContentLoaded', function () {
  const actionArea = document.getElementById("actionArea");
  const resultELement = document.getElementById("resultArea");

  const codeArea = CodeMirror.fromTextArea(actionArea, {
    lineNumbers: true,
    mode: "javascript",
    theme: "material",
    scrollbarStyle: "overlay",
    styleActiveLine: true,
    matchBrackets: true,
  });

  const resultArea = CodeMirror.fromTextArea(resultELement, {
    mode: "javascript",
    theme: "material",
    styleActiveLine: true,
    matchBrackets: true,
    scrollbarStyle: null,
    readOnly: true
  });

  resultArea.getDoc().setValue("\n".repeat(10000));

  codeArea.on("scroll", (instance, changeObj) => {
    syncScroll(codeArea, resultArea);
  });

  codeArea.on("change", (instance, changeObj) => {
    const lineNb = instance.getDoc().getCursor().line;
    const lineContent = instance.getDoc().getLine(lineNb);

    new Promise((resolve, reject) => {
      try {
        console.log(lineContent);
        const isJs = lineContent.startsWith("$");
        if (isJs) {
          const result = eval(lineContent.substr(1));
          console.log(result);
          setLine(resultArea, lineNb, result);
        }
      } catch (err) {
        console.log(err);
        if (lineContent.trim().length == 0) {
          setLine(resultArea, lineNb, "");
        } else {
          setLine(resultArea, lineNb, "Cannot Evaluate");
        }
      }
    });

    syncScroll(codeArea, resultArea);
  });
})
