const hexadecimal = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
];

function generateRandomColor() {
    let generatedColor = "#";

    for (let i = 0; i < 6; i++) {
        generatedColor += hexadecimal[Math.trunc(Math.random() * 16)];
    }

    return generatedColor;
}

export { generateRandomColor };
