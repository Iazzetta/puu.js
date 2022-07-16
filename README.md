## puujs

framework javascript para criação de templates dinâmicos (estudos)

- [Demo](https://iazzetta.github.io/puu.js/example.html)


### Uso

``javascript
// inicializar puu.js
const puu = new Puu(document.getElementById('root'));

// criar contextos ( variaveis, funções, etc.)
puu.context({
  posts: ['oi', 'test'],
})
puu.context({
  listPosts: () => {
    const posts = puu.ctx('posts');
    let string = ''
    for(let x in posts) string = `<p class="post">${posts[x]}</p>` + string
    return string
  },
  newPost: () => document.querySelector('input[name="message"]').value
})
puu.watch({ message: '' })

// chamando e atualizando contexto fora do puujs
const newPost = () => {
  puu.context({ posts: [ ... puu.ctx('posts'), puu.ctx('f:newPost')] })
}

// inicializar template
puu.template(`
  <h1>puu.js</h1>
  <input type="text" name="message" placeholder="No que esta pensando?" puu-watch="message" value="{{w:message}}">
  <button onclick="newPost()">Publicar "{{w:message}}"</button>
  <div class="posts">
    {{f:listPosts}}
  </div>
`)
``

## Autor
- Guilherme L. C. Iazzetta
