import * as fs from "fs";
import * as path from "path";

const postsDir = path.join(__dirname, "../posts");
const indexPath = path.join(__dirname, "../index.html");

const files = fs.readdirSync(postsDir)
    .filter((file: string) => file.endsWith(".html"));

const listItems = files.map((file: string) => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const titleMatch = content.match(/<h2>(.*?)<\/h2>/i);
    const title = titleMatch ? titleMatch[1] : file;
    return `                <li><a href="posts/${file}">${title}</a></li>`;
}).join("\n");

let indexContent = fs.readFileSync(indexPath, "utf-8");

indexContent = indexContent.replace(
    /<!-- BLOG_POSTS_START -->[\s\S]*<!-- BLOG_POSTS_END -->/,
    `<!-- BLOG_POSTS_START -->\n${listItems}\n                <!-- BLOG_POSTS_END -->`
);

fs.writeFileSync(indexPath, indexContent, "utf-8");
console.log(`✅ index.html updated with ${files.length} posts.`);
