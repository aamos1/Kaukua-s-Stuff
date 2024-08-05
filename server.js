const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const blogPostsDir = path.join(__dirname, 'blog-posts');
const indexHtmlPath = path.join(__dirname, 'index.html');

app.use(express.static(__dirname));

const getBlogPosts = () => {
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.md'));
    return files.map(filename => {
        const filePath = path.join(blogPostsDir, filename);
        const markdown = fs.readFileSync(filePath, 'utf-8');
        const htmlContent = marked(markdown);
        const title = filename.replace(/-/g, ' ').replace('.md', '');
        const stats = fs.statSync(filePath);
        const creationTime = new Date(stats.birthtime).toLocaleString();
        return { title, content: htmlContent, creationTime };
    });
};

app.get('/', (req, res) => {
    const blogPosts = getBlogPosts();
    const blogContent = blogPosts.map(post => `
        <div class="blog-post">
            <h2>${post.title}</h2>
            <p><small>Created on: ${post.creationTime}</small></p>
            ${post.content}
        </div>`).join('');

    let html = fs.readFileSync(indexHtmlPath, 'utf-8');
    html = html.replace('<!-- Blog content will be injected here -->', blogContent);
    res.send(html);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
