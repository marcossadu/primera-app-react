import Letter from "./Letter";

/*
{
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}
*/
export default function Word({palabra}) {

    let contenido = palabra.contenido;
    for(let i=contenido.length; i<5; i++) {
        contenido+=" ";
    }

    return (
    <div className="word row align-content-center">
        {Array.from(contenido).map((letter, k) => <Letter key={k} checkeada={palabra.checkeada} erronea={palabra.erronea} letra={letter} estado={palabra.estados[k]} index={k}/>)}
    </div>)
}