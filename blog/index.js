const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const blogPostsDir = path.join(__dirname, 'blog-posts');

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
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Website</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        :root {
            --width: 1000px;
            --font-main: 'Special Elite', monospace;
            --font-secondary: 'Special Elite', monospace;
            --font-scale: 20px;
            --background-color: #ffffff;
            --heading-color: #3e56de;
            --text-color: #333;
            --link-color: #3e56de;
            --visited-color: #2b3eab;
            --code-background-color: #ffffff;
            --code-color: #333;
            --blockquote-color: #ffffff;
        }

        body {
            font-family: var(--font-secondary);
            font-size: var(--font-scale);
            margin: auto;
            padding: 20px;
            max-width: var(--width);
            text-align: left;
            background-color: var(--background-color);
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.5;
            color: var(--text-color);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-main);
            color: var(--heading-color);
            font-size: var(--font-scale);
            font-weight: 400;
        }

        a {
            color: var(--link-color);
            cursor: pointer;
        }

        nav a {
            margin-right: 8px;
        }

        strong, b {
            color: var(--heading-color);
        }

        button {
            margin: 0;
            cursor: pointer;
        }

        main {
            line-height: 1.6;
        }

        table {
            width: 100%;
        }

        hr {
            border: 0;
            border-top: 1px dashed;
        }

        img {
            max-width: 75%;
        }

        code {
            font-family: monospace;
            padding: 2px;
            background-color: var(--code-background-color);
            color: var(--code-color);
            border-radius: 3px;
        }

        blockquote {
            border-left: 1px solid #999;
            color: var(--code-color);
            padding-left: 20px;
            font-style: italic;
        }

        footer {
            padding: 25px 0;
            text-align: center;
        }

        .inline {
            width: auto !important;
        }

        .highlight, .code {
            padding: 1px 15px;
            background-color: var(--code-background-color);
            color: var(--code-color);
            border-radius: 3px;
            margin-block-start: 1em;
            margin-block-end: 1em;
            overflow-x: auto;
        }

        .blog-post {
            margin-bottom: 20px;
        }

        #blog-list {
            display: none;
        }
    </style>
</head>
<body>
    <header>
    	<font size="+2">Kaukua's Stuff.</font>
        <input type="text" id="search-bar" placeholder="Search for a blog post..." onkeyup="searchPosts()">
    </header>
    
    <main>
        <ul id="blog-list"></ul>
        <div id="blog-content">
            ${blogContent}
        </div>
    </main>
    <footer>
        Made in 2024
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        function searchPosts() {
            const searchBar = document.getElementById('search-bar');
            const filter = searchBar.value.toLowerCase();
            const blogList = document.getElementById('blog-list');
            const posts = blogList.getElementsByTagName('li');

            Array.from(posts).forEach(post => {
                const title = post.textContent || post.innerText;
                if (title.toLowerCase().indexOf(filter) > -1) {
                    post.style.display = '';
                } else {
                    post.style.display = 'none';
                }
            });
        }

        window.onload = () => {
            document.getElementById('blog-list').style.display = 'none';
            document.getElementById('search-bar').style.display = 'none';
        };
    </script>
</body>
</html>`;
    res.send(html);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

