const url = 'https://jsonplaceholder.typicode.com/posts'

// CARREGANDO ELEMENTOS DO DOM:
// 1- ver all posts
const loadingElement = document.querySelector('#loading')
const postsContainer = document.querySelector('#posts-container')
// 2 - ver post unico
const postPage = document.querySelector('#post')
const postContainer = document.querySelector('#post-container')
const commentsContainer = document.querySelector('#comments-container')
// 3 - hora de postar seu comentário nos posts!
const commentForm = document.querySelector('#comment-form');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');

// Pegando ID da URL
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get("id") //id do post


// FUNÇOES
// 1- get all posts
async function getAllPosts() {
    try {
        const response = await fetch(url)
        console.log(response)

        const data = await response.json()
        console.log(data)

        loadingElement.classList.add("hide")

        data.map((post => {
            const div = document.createElement('div')
            const title = document.createElement('h2')
            const body = document.createElement('p')
            const link = document.createElement('a')

            title.innerText = post.title
            body.innerText = post.body
            link.innerText = 'Ler noticia'
            link.setAttribute('href', `post.html?id=${post.id}`)


            div.appendChild(title)
            div.appendChild(body)
            div.appendChild(link)
            postsContainer.appendChild(div)
        }))
    } catch (error) {
        console.log("Error: ", error)
    }
}

//  Get individual posts
async function getPost(id) {
    try {
        const [responsePost, responseComments] = await Promise.all([
            fetch(`${url}/${id}`),
            fetch(`${url}/${id}/comments`)
        ])

        const dataPost = await responsePost.json()
        const dataComments = await responseComments.json()

        // testando o acesso
        console.log(dataPost)
        console.log(dataComments)

        // escondendo e mosntrando elementos
        loadingElement.classList.add('hide')
        postPage.classList.remove('hide')

        // formandos o conteudo - title e body
        const title = document.createElement('h1')
        title.innerText = dataPost.title
        postContainer.appendChild(title)

        const body = document.createElement('p')
        body.innerText = dataPost.body
        postContainer.appendChild(body)

        // mostrando os comments já exitentes
        dataComments.map((comment) => {
            createComment(comment)
        })

    } catch (error) {
        console.log('Error: ', error)
    }
}

//  recebe args: comment e data
function createComment(comment) {
    try {
        // criando elementos
        const div = document.createElement('div')
        const email = document.createElement('h3')
        const commentbody = document.createElement('p')
        // colocando conteudo
        email.innerText = comment.email
        commentbody.innerText = comment.body
        // montando o div
        div.appendChild(email)
        div.appendChild(commentbody)
        commentsContainer.appendChild(div)

    } catch (error) {
        console.log('Error: ', error)
    }
}


// funçao de postar comment
async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'Post',
        body: comment,
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json();
    createComment(data)
}

// teste para qual html deve mostra
if (!postId) {
    getAllPosts()
} else {
    getPost(postId)
    // adicioando o envento ao submit do form
    commentForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let comment = {
        email: emailInput.value,
        body: bodyInput.value,
    }
    comment = JSON.stringify(comment)

    postComment(comment)
})

}
