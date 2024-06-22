function Atributos(atributos, ptsLimite = 27) {
    const tabelaCusto = {
        8:0,
        9:1,
        10:2,
        11:3,
        12:4,
        13:5,
        14:7,
        15:9
    };

    let ptsGastos = 0;
    let detalhes = [];

    for(let atributo in atributos) {
        let valor = atributos[atributo];

        if (valor < 8 || valor > 15) {
            return `Valor inválido para ${atributo}. Deve estar entre 8 e 15.`;
        };

        ptsGastos += tabelaCusto[valor];
        detalhes.push(`${atributo}: ${valor} (custo: ${tabelaCusto[valor]})`);
    }

    if(ptsGastos > ptsLimite) {
        return `Pontos gastos (${ptsGastos}) excedem o limite de ${ptsLimite}. Detalhes: ${detalhes.join(', ')}`;
    }

    return `Atributos válidos. Pontos Gastos: ${ptsGastos}. Detalhes: ${detalhes.join(', ')}`;
} 

const atributosPersonagem = {
    FOR: 15,
    DES: 14,
    CON: 13,
    INT: 12,
    SAB: 10,
    CAR: 8
};

const resultado = Atributos(atributosPersonagem);
console.log(resultado);