import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

const postsDir = path.join(__dirname, "../posts");
const mdDir = path.join(__dirname, "../md_posts");
const indexPath = path.join(__dirname, "../index.html");

// Ensure posts directory exists
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir);

// Read all markdown files
const mdFiles = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md"));

const listItems: string[] = [];

mdFiles.forEach((file) => {
  const mdPath = path.join(mdDir, file);
  const mdContent = fs.readFileSync(mdPath, "utf-8");
  const htmlContent = marked(mdContent);

  // Generate individual post HTML
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

  const outFile = file.replace(".md", ".html");
  const outPath = path.join(postsDir, outFile);
  fs.writeFileSync(outPath, htmlTemplate);
  console.log(`Generated: ${outPath}`);

  // Prepare <li> entry for index.html
  listItems.push(`
<li class="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1">
  <a href="posts/${outFile}" class="text-lg font-semibold text-gray-800 hover:text-orange-500 transition">
    ${file.replace(".md", "")}
  </a>
</li>
`);
});

// Update index.html
let indexContent = fs.readFileSync(indexPath, "utf-8");
indexContent = indexContent.replace(
  /<!-- BLOG_POSTS_START -->[\s\S]*<!-- BLOG_POSTS_END -->/,
  `<!-- BLOG_POSTS_START -->\n${listItems.join("\n")}\n<!-- BLOG_POSTS_END -->`,
);

fs.writeFileSync(indexPath, indexContent, "utf-8");
console.log(`Updated index.html with ${listItems.length} posts.`);
