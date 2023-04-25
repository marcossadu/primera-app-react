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
    }
    const comprobarPalabra = (palabra) => {
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
        if(fin) {
            return;
        }
        
        //detectamos en qué palabra estamos:
        let indicePalabraActual = palabras.findIndex(palabra => !palabra.checkeada);

        let palabrasAux = palabras.map(palabra => palabra);
        
        if(letter === "{bksp}") {
            palabrasAux = palabras.map((palabra, k) => {
                if(k === indicePalabraActual && palabra.contenido.length > 0) {
                    palabra.contenido = palabra.contenido.substring(0, palabra.contenido.length-1);
                }
                return palabra;
            })
            setPalabras(palabrasAux);
        } else if (letter === "{enter}") {
            if(palabras[indicePalabraActual].contenido.length === MAX_WORD_LENGTH) {
                if(fin) return;

                console.log("palabra: ", palabras[indicePalabraActual].contenido);
                console.log("existe? ", comprobarPalabra(palabras[indicePalabraActual].contenido));
                if(palabras[indicePalabraActual].contenido === solucion) {
                    //GUANYAT!
                    setFin(true);
                    toastPalabraCorrecta();
                } else if(!comprobarPalabra(palabras[indicePalabraActual].contenido)) {
                    //si la paraula no existeix
                    palabrasAux[indicePalabraActual].contenido = "";
                    palabrasAux[indicePalabraActual].checkeada = false;
                    palabrasAux[indicePalabraActual].erronea = true;
                    setPalabras(palabrasAux);
                    toastNoExiste();
                    return;
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

                // palabrasAux = palabras.map(palabra => palabra);
                
                palabrasAux[indicePalabraActual].estados = estados;
                palabrasAux[indicePalabraActual].checkeada = true;

                setPalabras(palabrasAux);
                // setPalabras(palabrasInicial);

            } else {
            }
        } else {
            if(palabras.filter(palabra => palabra.checkeada).length === MAX_NUM_WORDS) {
                console.log("juego finalizado!!");
                return;
            }
            //añadimos la letra pulsada
            palabrasAux = palabras.map((palabra, k) => {
                if(k === indicePalabraActual && palabra.contenido.length < 5) {
                    palabra.contenido += letter;
                }
                return palabra;    
            })
            setPalabras(palabrasAux);
        }
    }

    useEffect(()=>{
        obtenerPalabras();
    }, []);

    useEffect(()=>{
        if(fin) return;

        if(palabras.filter(palabra => palabra.checkeada).length === MAX_NUM_WORDS) {
            //palabra incorrecta!
            toastHasPerdido();
            setFin(true);
        }

    }, [palabras])

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