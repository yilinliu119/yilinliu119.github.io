const USERNAME = 'yilinliu119';
const REPO_NAME = 'yilinliu119.github.io';
const BRANCH = 'main'; // 或者 'master'，取决于你的默认分支
const FOLDER_PATH = 'posts'; // 存放 markdown 的文件夹

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    fetchFileList();
    generateHeatmap();
});

// 1. 获取文件列表并生成目录
async function fetchFileList() {
    const listElement = document.getElementById('file-list');
    const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO_NAME}/contents/${FOLDER_PATH}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        listElement.innerHTML = ''; // 清空加载提示

        // 过滤出 .md 文件
        const mdFiles = data.filter(file => file.name.endsWith('.md'));

        mdFiles.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name.replace('.md', ''); // 去掉后缀显示
            li.onclick = () => loadMarkdown(file.download_url, file.name);
            listElement.appendChild(li);
        });

    } catch (error) {
        console.error('Error fetching file list:', error);
        listElement.innerHTML = '<li>加载失败 (Check Console)</li>';
    }
}

// 2. 加载并渲染 Markdown
async function loadMarkdown(url, filename) {
    const contentDisplay = document.getElementById('content-display');
    const titleDisplay = document.getElementById('doc-title');
    
    contentDisplay.innerHTML = '<p>Loading data...</p>';
    titleDisplay.textContent = filename;

    try {
        const response = await fetch(url);
        const text = await response.text();
        
        // 使用 marked.js 渲染
        contentDisplay.innerHTML = marked.parse(text);
    } catch (error) {
        contentDisplay.innerHTML = '<p>Error loading content.</p>';
    }
}

// 3. 生成随机热力图 (模拟 GitHub 风格)
// 真正的 GitHub API 获取 commit 记录比较复杂且有速率限制，
// 这里为了视觉效果，我们生成一个基于日期的模拟数据，
// 或者你可以通过获取 posts 文件夹内文件的 commit 时间来精确生成。
function generateHeatmap() {
    const heatmap = document.getElementById('heatmap');
    const daysToShow = 50; // 显示多少个格子

    for (let i = 0; i < daysToShow; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box');
        
        // 随机生成活跃度等级 0-4
        // 为了模拟真实感，让 0 (无贡献) 的概率大一点
        const rand = Math.random();
        let level = 0;
        if (rand > 0.9) level = 4;
        else if (rand > 0.8) level = 3;
        else if (rand > 0.7) level = 2;
        else if (rand > 0.5) level = 1;

        dayBox.classList.add(`level-${level}`);
        
        // 添加简单的 tooltip
        dayBox.title = `${level} contributions`;
        
        heatmap.appendChild(dayBox);
    }
}
