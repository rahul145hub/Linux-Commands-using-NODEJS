#!/usr/bin/env node

const inputArr = process.argv.slice(2);
const fs = require("fs");
const path = require("path");

let fileArr = [];
let flagArr = {
    '-s': false,
    '-b': false,
    '-n': false
};

const flagExist = ['-s', '-b', '-n']

for (let i = 0; i < inputArr.length; i++) {
    let currPath = path.join(process.cwd(), inputArr[i]);
    if (fs.existsSync(currPath)) {
        fileArr.push(currPath);
    } else {
        for (let j = 0; j < flagExist.length; j++) {
            if (flagExist[j] === inputArr[i]) {
                flagArr[inputArr[i]] = true;
                break;
            }
        }
    }
}

if (flagArr['-n'] && flagArr["-b"]) {
    console.error("-n and -b both can't exist at same time");
} else {
    let cnt = ``;
    for (let i = 0; i < fileArr.length; i++) {
        cnt += fs.readFileSync(fileArr[i], 'utf-8');

        if (i + 1 < fileArr.length) cnt += '\r\n';
        else cnt += '\r';
    }

    if (flagArr["-s"]) {
        let cntArr = cnt.split("\r");

        cnt = '';
        for (let i = 0; i < cntArr.length; i++) {
            if (cntArr[i] == "\n" && cntArr[i + 1] == "\n") {
                continue;
            } else {
                cnt += cntArr[i] + "\r";
            }
        }
    }
    if (flagArr["-n"]) {
        let cntArr = cnt.split("\r\n");
        cnt = '';
        for (let i = 0; i < cntArr.length; i++) {
            cnt += `\t${i+1}  ${cntArr[i]}\r\n`;
        }
    }

    if (flagArr["-b"]) {
        let cntArr = cnt.split("\r\n");
        cnt = '';
        let lineNo = 1;
        for (let i = 0; i < cntArr.length; i++) {
            if (cntArr[i].length != 0) {
                cnt += `${lineNo}.${cntArr[i]}\n`;
                lineNo++;
            } else {
                cnt += "\r\n";
            }
        }
    }
    console.log(cnt);
}