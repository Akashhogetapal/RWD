const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "a.txt");
const raw = fs.readFileSync(filePath, "utf-8");
const lyrics = raw.split("\n");

const TYPE_SPEED = 50;

let lineIndex = 0;
let charIndex = 0;
let currentLine = "";
let pauseUntil = 0;

function typeLine() {
  const now = Date.now();
  if (now < pauseUntil) return;

  if (lineIndex >= lyrics.length) {
    console.log("\n🕊️  ...aujla di khede.\n");
    clearInterval(mainTimer);
    return;
  }

  if (currentLine === "") {
    const line = lyrics[lineIndex].trim();

    if (line.startsWith("<<PAUSE:")) {
      const delay = Number(line.replace(/[^\d]/g, ""));
      pauseUntil = Date.now() + delay;
      lineIndex++;
      return;
    }

    if (line === "") {
      process.stdout.write("\n");
      lineIndex++;
      return;
    }

    if (lineIndex === 0) {
      console.log("\n💫  Geetan Di Machine...\n");
    }

    currentLine = line;
    process.stdout.write("   ");
  }

  if (charIndex < currentLine.length) {
    process.stdout.write(currentLine[charIndex]);
    charIndex++;
  } else {
    process.stdout.write("\n");
    lineIndex++;
    charIndex = 0;
    currentLine = "";
  }
}

const mainTimer = setInterval(typeLine, TYPE_SPEED);   
