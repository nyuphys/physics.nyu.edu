export function randIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SAMPLE_SPACE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randString(len=20) {
    let build = "";

    for (let count = 0; count < len; count++) {
        build += SAMPLE_SPACE.charAt(Math.floor(SAMPLE_SPACE.length * Math.random()));
    }

    return build;
}