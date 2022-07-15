function calculaIdade(anos) {
	return `Daqui a ${anos} anos, ${this.nome} terá ${
		this.idade + anos
	} anos de idade.`;
}
console.log(calculaIdade.call({nome: 'fulano', idade: 18}, 10)) //call passa argumentos por virgula
console.log(calculaIdade.apply({nome: 'fulano', idade: 18}, [10])) //apply passa argumentos por array