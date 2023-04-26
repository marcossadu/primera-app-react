import { useEffect, useState } from "react";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Wordle.css';
import Word from "./Word.jsx";

//parámetros
const estadosPalabraDefault = ["unchecked", "unchecked", "unchecked", "unchecked", "unchecked"]; //"unchecked", "error", "exists", "matches"
const palabrasInicial = [{
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}, {
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}, {
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}, {
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}, {
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}, {
    contenido: "",
    estados: estadosPalabraDefault,
    checkeada: false,
    erronea: false
}];
const MAX_WORD_LENGTH = 5;
const MAX_NUM_WORDS = palabrasInicial.length;

function Wordle() {

    const [todasPalabras, setTodasPalabras] = useState([]);
    const [palabras, setPalabras] = useState(palabrasInicial);
    const [lettersOk, setLettersOk] = useState("");
    const [lettersNotOk, setLettersNotOk] = useState("");
    const [solucion, setSolucion] = useState("");
    const [fin, setFin] = useState(false);

    const obtenerPalabras = () => {
        fetch("https://random-word-api.herokuapp.com/all?lang=es")
        .then(result => result.json())
        .then((todasPalabras)=>{
            let palabrasArr = [];
            todasPalabras.filter(palabra => palabra.length === 5).forEach(palabra => {
                if(palabra.length === 5 && !palabra.includes(".") && !palabra.includes(" ")) {
                    let palabraCopia = palabra.toUpperCase();
                    palabraCopia = palabraCopia.replace("Á", "A");
                    palabraCopia = palabraCopia.replace("É", "E");
                    palabraCopia = palabraCopia.replace("Í", "I");
                    palabraCopia = palabraCopia.replace("Ó", "O");
                    palabraCopia = palabraCopia.replace("Ú", "U");
                    palabrasArr.push(palabraCopia);
                }
            })
            console.log("palabras: ", palabrasArr);
            // setSolucion(palabrasArr[Math.floor(Math.random()*palabrasArr.length)].toUpperCase());
            setSolucion("TIGRE");
            setTodasPalabras(palabrasArr);
        })
    }
    const comprobarPalabra = (palabra) => {
        return todasPalabras.includes(palabra.toUpperCase());
    }
    const toastNoExiste = () => 
        toast("La palabra no existe!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: false,
            theme: "dark",
    });
    const toastPalabraCorrecta = () => {
        toast('Palabra correcta!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: false,
            theme: "dark",
        });
    };
    const toastHasPerdido = () => 
        toast("Has perdido! La solución era "+solucion, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: false,
            theme: "dark",
    });
    const keyPress = (letter) => {
        if(fin) return;
        
        //detectamos en qué palabra estamos:
        let indicePalabraActual = palabras.findIndex(palabra => !palabra.checkeada);
        let palabraActual = palabras[indicePalabraActual];

        let palabrasCopy = palabras.map(palabra => palabra);
        
        if(letter === "{bksp}") {
            if(palabraActual.contenido.length > 0) {
                palabrasCopy[indicePalabraActual].contenido = palabraActual.contenido.substring(0, palabraActual.contenido.length-1);
            } 
            setPalabras(palabrasCopy);
        } else if (letter === "{enter}") {
            if(palabraActual.contenido.length === MAX_WORD_LENGTH) {
                if(palabraActual.contenido === solucion) {
                    //GUANYAT!
                    setFin(true);
                    toastPalabraCorrecta();
                } else if(!comprobarPalabra(palabraActual.contenido)) {
                    //si la paraula no existeix
                    palabrasCopy[indicePalabraActual].contenido = "";
                    palabrasCopy[indicePalabraActual].checkeada = false;
                    palabrasCopy[indicePalabraActual].erronea = true;
                    setPalabras(palabrasCopy);
                    toastNoExiste();
                    return;
                } else if(indicePalabraActual === MAX_NUM_WORDS - 1) {
                    toastHasPerdido();
                    setFin(true);
                }
                
                let letrasOk = lettersOk;
                let letrasNoOk = lettersNotOk;
                let estados = [];
                Array.from(palabras[indicePalabraActual].contenido).forEach((letra, k) => {
                    if(letra === solucion.charAt(k)) {
                        letrasOk += ` ${letra}`;
                        estados.push("matches");
                    }
                    else if(solucion.includes(letra)) {
                        letrasOk += ` ${letra}`;
                        estados.push("exists");
                    }
                    else {
                        letrasNoOk += ` ${letra}`;
                        estados.push("error");
                    }
                })

                setLettersOk(letrasOk);
                setLettersNotOk(letrasNoOk);

                palabrasCopy[indicePalabraActual].estados = estados;
                palabrasCopy[indicePalabraActual].checkeada = true;

                setPalabras(palabrasCopy);

            } 
        } else {
            if(palabras.filter(palabra => palabra.checkeada).length === MAX_NUM_WORDS) {
                console.log("juego finalizado!!");
                setFin(true);
                return;
            }
            //añadimos la letra pulsada
            if(palabrasCopy[indicePalabraActual].contenido.length < MAX_WORD_LENGTH) {
                palabrasCopy[indicePalabraActual].contenido = palabraActual.contenido + letter;
            }
            setPalabras(palabrasCopy);
        }
    }

    useEffect(()=>{
        obtenerPalabras();
    }, []);


    let buttonTheme = [
        {
          class: "hg-red",
          buttons: lettersOk
        },
        {
          class: "hg-highlight",
          buttons: lettersNotOk
        }
      ];

    return (<div className="container wordle">
        <ToastContainer />
        <header>
            <h1>La palabra<br /><em>del día</em></h1>
        </header>
        {palabras.map((palabra, k) => <Word palabra={palabra} key={k}/>)}
        <div className="container-fluid teclado">
            <div className="row inner-teclado">
                <Keyboard
                    onKeyPress={keyPress}
                    layout={{
                        default: [
                            "Q W E R T Y U I O P",
                            'A S D F G H J K L Ñ',
                            "{enter} Z X C V B N M {bksp}"
                        ]
                    }}
                    display={{
                        '{bksp}': '<i class="fa-solid fa-delete-left"></i>',
                        '{enter}': 'ENVIAR'
                      }}
                    theme={"hg-theme-default hg-layout-default myTheme"}
                    layoutName="default"
                    buttonTheme={buttonTheme}
                />
            </div>
        </div>
    </div>);
}

export default Wordle;