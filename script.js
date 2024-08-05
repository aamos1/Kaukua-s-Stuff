document.addEventListener("DOMContentLoaded", () => {
    fetch('blog-posts/example1.md')
        .then(response => response.text())
        .then(text => {
            const htmlContent = marked(text);
            document.getElementById('blog-content').innerHTML = htmlContent;
        });
});

function searchPosts() {
    const searchBar = document.getElementById('search-bar');
    const filter = searchBar.value.toLowerCase();
    const blogContent = document.getElementById('blog-content');
    const posts = blogContent.getElementsByTagName('div');

    Array.from(posts).forEach(post => {
        const title = post.getElementsByTagName('h2')[0].innerText;
        if (title.toLowerCase().indexOf(filter) > -1) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}
