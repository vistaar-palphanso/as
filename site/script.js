const input = document.getElementById("input");
const output = document.getElementById("output");

let history = [];
let historyIndex = -1;

const jokes = ["Why do programmers prefer dark mode? Because light attracts bugs.","I told my computer I needed a break, and it said 'No problem — I’ll go to sleep.'"];
const commands = {
  help() {
    return `
available commands:
- help
- about
- links
- clear
- theme
- date
- echo
- joke
- invert
- rainbow
`;
  },

  about() {
    return `
name: ...
interests: ...
`;
  },

  links() {
    return `
github: ...
blog: ...
`;
  },

  theme(args) {
    const themes = {
      green:  { fg: "#33ff33", glow: "#33ff33", bg: "#000000" },
      red:    { fg: "#ff0008", glow: "#ff0008", bg: "#000000" },
      blue:   { fg: "#33ccff", glow: "#33ccff", bg: "#000000" }
    };
    if (!args[0]) return `usage: theme [name]\navailable themes:\n- green\n- red\n- blue`;
    const selected = themes[args[0]];
    if (!selected) return `unknown theme: ${args[0]}`;
    document.documentElement.style.setProperty("--fg", selected.fg);
    document.documentElement.style.setProperty("--glow", selected.glow);
    document.documentElement.style.setProperty("--bg", selected.bg);
    return `theme set to ${args[0]}`;
  },

  clear() {
    output.innerHTML = "";
    return "";
  },

  date() {
    return new Date().toString();
  },

  echo(args) {
    return args.join(" ");
  },

  joke() {
    return jokes[Math.floor(Math.random() * jokes.length)];
  },
  
  invert() {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg");
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--fg");
    document.documentElement.style.setProperty("--bg", fg);
    document.documentElement.style.setProperty("--fg", bg);
    return "colors inverted";
  },

  rainbow() {
    const colors = ["#ff0000","#ff7f00","#ffff00","#00ff00","#0000ff","#4b0082","#9400d3"];
    let i = 0;
    const elements = document.querySelectorAll(".output p, .cmd");
    elements.forEach(el => {
      el.style.color = colors[i%colors.length];
      i++;
    });
    return "rainbow activated";
  },

};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    if (cmd) history.push(cmd);
    historyIndex = history.length;
    runCommand(cmd);
    input.value = "";
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (history.length===0) return;
    historyIndex = Math.max(0, historyIndex-1);
    input.value = history[historyIndex];
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (history.length===0) return;
    historyIndex = Math.min(history.length, historyIndex+1);
    input.value = historyIndex===history.length ? "" : history[historyIndex];
  }
});

function runCommand(inputText) {
  printLine(`user@web:~$ ${inputText}`);
  const parts = inputText.split(" ");
  const cmd = parts[0];
  const args = parts.slice(1);
  if (commands[cmd]) {
    const result = commands[cmd](args);
    if (result) printBlock(result);
  } else {
    printLine(`command not found: ${cmd}`);
  }
}

function printLine(text) {
  const p = document.createElement("p");
  p.textContent = text;
  output.appendChild(p);
  scrollBottom();
}

function printBlock(text) {
  text.trim().split("\n").forEach(line => printLine(line));
}

function scrollBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
