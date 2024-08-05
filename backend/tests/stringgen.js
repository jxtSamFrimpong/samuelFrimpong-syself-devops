const randomStringsOfCorrectLength = (characters) => {
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < charactersLength; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        const randomCharacter = characters.charAt(randomIndex);
        result += randomCharacter;
    }

    return result;
}

console.log(randomStringsOfCorrectLength('6472181a4a6d3fa94eaf0ccc'))