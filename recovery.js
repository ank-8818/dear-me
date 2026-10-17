import crypto from "node:crypto";
import bcrypt from "bcrypt";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeRecoveryCode() {
    let raw = "";
    for (let i = 0; i < 16; i++) {
        raw += ALPHABET[crypto.randomInt(ALPHABET.length)];
    }

    return raw.match(/.{4}/g).join("-");
}

export function normalizeCode(text) {
    return text.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashCode(code) {
    return bcrypt.hash(normalizeCode(code), 10);
}

export function checkCode(code, hash) {
    return bcrypt.compare(normalizeCode(code), hash);
}