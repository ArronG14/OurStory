import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public/content/chapters/01-the-beginning/photos");
fs.mkdirSync(dir, { recursive: true });

const items = [
  { name: "01-street.svg", w: 1600, h: 1067, label: "2 Amanda Court" },
  { name: "featured-02-first-photo.svg", w: 1200, h: 1500, label: "27 March 2015" },
  { name: "03-together.svg", w: 1400, h: 1400, label: "Summer, 2015" },
  { name: "04-walk.svg", w: 1000, h: 1500, label: "2016" },
  { name: "05-friends.svg", w: 1600, h: 1000, label: "2016" },
  { name: "06-laughing.svg", w: 1500, h: 1000, label: "2017" },
  { name: "07-quiet.svg", w: 1100, h: 1400, label: "2017" },
];

const gradients = [
  ["#1a2029", "#0b0f14"],
  ["#241c12", "#0f0b06"],
  ["#171d24", "#0a0d10"],
  ["#211a10", "#0d0906"],
];

for (let i = 0; i < items.length; i++) {
  const { name, w, h, label } = items[i];
  const [c1, c2] = gradients[i % gradients.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <text x="50%" y="50%" fill="#cba15c" font-family="Georgia, serif" font-size="${Math.round(
    Math.min(w, h) * 0.06
  )}" text-anchor="middle" dominant-baseline="middle" opacity="0.85">${label}</text>
</svg>`;
  fs.writeFileSync(path.join(dir, name), svg, "utf-8");
}

console.log(`Generated ${items.length} placeholder photos in ${dir}`);
