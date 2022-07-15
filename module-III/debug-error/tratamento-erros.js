function ErrorHandler(arr, num){
    try{
        if(!arr && !num) throw new ReferenceError('Falta os parametros')
        if(typeof arr !== 'object' || typeof num !== 'number') throw new TypeError('Tipo invalido!')
        if(arr.length !== num) throw new RangeError('Parametro diferente do tamanho do array!')
        return console.log(arr)
    } catch (e){
        console.log(e)
        
    }
}

//ErrorHandler([])
//ErrorHandler([],[])
//ErrorHandler(1,[])
//ErrorHandler([],1)
ErrorHandler([],0)