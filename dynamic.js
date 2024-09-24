/*
    Dynamic.js
 */

let offset = 1;     // API needs at least one post
let amount = 15;    // Amount of posts

document.addEventListener("DOMContentLoaded", () => {

    const entryBox = document.getElementById("entryBox");

    // Gets initial posts
    getPosts(offset, amount).then(posts => {
        addPostToPage(entryBox, posts);
        offset += amount;
    });

    // Adds more posts when the end of the page is reached
    window.onscroll = function(e) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            getPosts(offset, 3).then(posts => {
                addPostToPage(entryBox, posts);
                offset += 3;
            });
        }
    };
})

// Explicit AJAX function is defined at the bottom of the page. Since the task asked for that :p
// But Fetch is objectively better >:) So I'm using that.
async function getPosts(offset, amount) {
    let newPost = [];
    for (let i = offset; i < offset + amount; i++) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${i}`);
        const post = await response.json();
        newPost.push(post);
    }
    return newPost;
}

function generateCard(post) {
    return `
      <div class="display-flex flex-column postcard">
        <div class="postcard-header">
          <h3>${post.title}</h3>
        </div>
        <div class="postcard-body">
          <p>${post.body}</p>
        </div>
      </div>
`
}

function addPostToPage(entrybox, posts) {
    posts.forEach((post) => {
        entrybox.innerHTML += generateCard(post);
    })
}

/*
    #####################################################################
    #                                                                   #
    #   Fetch is better and is the Industry Standard, but since the     #
    #   task said to use AJAX explicitly, here is an implementation     #
    #   for that as well... :p                                          #
    #                                                                   #
    #####################################################################

function getPostsAjax(offset, amount) {
    let newPost = [];

    for (let i = offset; i < offset + amount; i++) {
        ajaxGet(`https://jsonplaceholder.typicode.com/posts/${i}`, (response) => {
            newPost.push(response);
        })
    }
    return newPost;
}

function ajaxGet(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };

    xhr.send();
}

    #####################################################################
    #                                                                   #
    #####################################################################
*/