import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

const postsDir = path.join(__dirname, "../posts");
const mdDir = path.join(__dirname, "../md_posts"); // Markdown files

// Ensure posts directory exists
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

const mdFiles = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md"));

mdFiles.forEach((file) => {
  const mdPath = path.join(mdDir, file);
  const mdContent = fs.readFileSync(mdPath, "utf-8");
  const htmlContent = marked(mdContent);

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.replace(".md", "")}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 p-6">
  <article class="prose lg:prose-xl max-w-3xl mx-auto">${htmlContent}</article>
</body>
</html>`;

  const outPath = path.join(postsDir, file.replace(".md", ".html"));
  fs.writeFileSync(outPath, htmlTemplate);
  console.log(`✅ Generated: ${outPath}`);
});
