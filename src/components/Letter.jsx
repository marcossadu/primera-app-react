function Letter ({checkeada, erronea, letra, estado, index}) {

    //className={`letter align-items-stretch w-100 animate__animated animate__flipInX ${!checkeada && "non-animate"} ${checkeada && estado} animate__delay-${index*0.5}s`}

    let clasesError = "animate__animated animate__shakeY";
    let clasesCheck = `${estado} animate__animated animate__flipInX animate__delay-${index}s`;
    let clasesNoCheck = "non-animate"

    return(<div className={`col letter ${checkeada && clasesCheck} ${erronea && clasesError} ${!checkeada && !erronea && clasesNoCheck}`}>
            {letra}
        </div>);
}

export default Letter;