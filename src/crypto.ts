export function encrypt(s: string) {
    return `encrypted: ${s}`;
}

export function decrypt(s: string) {
    return s.substring(11);
}
