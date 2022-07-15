class Aluno{
    constructor(nome, media){
        this.nome = nome
        this.media = media
    }
}
const alunos = [new Aluno('fulano', 10), new Aluno('beltrano', 5), new Aluno('ciclano', 6)]

const aprovados = alunos.filter(el => {
    let { media } = el
    if(media < 6) return null
    return el
})

console.log(aprovados)