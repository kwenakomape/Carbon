export const getRandomNumber = (caseType) => {
    let min, max;
    switch(caseType) {
        case 1:    // Biokineticist
            min = 1;
            max = 5;
            break;
        case 2:        // Dietitian
            min = 6;
            max = 10;
            break;
        case 3:   // Physiotherapist
            min = 11;
            max = 15;
            break;
        default:
            throw new Error("Invalid case type. Please use 'Biokineticist', 'Dietitian', or 'Physiotherapist'.");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};