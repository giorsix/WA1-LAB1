"use strict";

/**
 * Given an array of strings, for each string computes a new string
 * made of the first two and the last two characters of the original string.
 *  The new string should replace the old one in the same array.
 * @param {array} strings
 */
function firstAndLastTwo(strings) {
    for( let i=0; i<strings.length; i++) {
        const len = strings[i].length;
        if ( len < 4) {
            strings[i] = '';
        } else {
            strings[i] = strings[i].substring(0, 2) + strings[i].substring(len-2, len);
        }
    }
}

let aString = `for each string computes a new string 
made of the first two and the last two characters 
of the original string`;

const originalStrings = aString.replace(/\n/g, '').split(" ");

firstAndLastTwo(originalStrings);

console.log(originalStrings);

// debugger;
