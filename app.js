#!/usr/bin/env node

const inputArr = process.argv.slice(2);
const fs = require('fs');
const path = require("path");
const types = require('./utility.js')['types'];


const command = inputArr[0];
const dirPath = inputArr[1];

switch (command) {
    case 'tree':
        treeFun(dirPath);
        break;
    case 'organize':
        organizeFun(dirPath);
        break;
    case 'help':
        helpFun();
        break;
    default:
        console.log('please input right command!!!');
}

function treeFun(dirPath) {
    if (dirPath == undefined) {
        dirPath = process.cwd();
    }
    if (!fs.existsSync(dirPath)) {
        console.log('enter the valid path');
        return;
    }
    treeHelp(dirPath, "");
}

function treeHelp(dirPath, indent) {
    if (fs.lstatSync(dirPath).isFile()) {
        let fileName = path.basename(dirPath);
        console.log(indent + "|--> " + fileName);
        return;
    } else {
        let dirName = path.basename(dirPath);
        console.log(indent + "|--> " + dirName);
        let childerns = fs.readdirSync(dirPath);

        for (let i = 0; i < childerns.length; i++) {
            let childPath = path.join(dirPath, childerns[i]);
            treeHelp(childPath, indent + "  ");
        }
    }
}

function organizeFun(dirPath) {
    if (dirPath == undefined) {
        dirPath = process.cwd();
    }
    if (!fs.existsSync(dirPath)) {
        console.log('enter the valid path');
        return;
    }

    let desPath = path.join(dirPath, "organizedPath");
    if (!fs.existsSync(desPath)) {
        fs.mkdirSync(desPath);
    }

    let childName = fs.readdirSync(dirPath);

    for (let i = 0; i < childName.length; i++) {
        let childDir = path.join(dirPath, childName[i]);

        if (fs.lstatSync(childDir).isFile()) {
            let category = getCategory(childDir);
            if (category) {
                sendFiles(childDir, desPath, category);
            }
        }
    }

}

function getCategory(filePath) {
    let ext = path.extname(filePath).slice(1);

    for (let type in types) {
        let typeArr = types[type];
        for (let i = 0; i < typeArr.length; i++) {
            if (ext === typeArr[i]) {
                return type;
            }
        }
    }
    return null;
}

function sendFiles(childDir, desPath, category) {
    let catPath = path.join(desPath, category);
    if (!fs.existsSync(catPath)) {
        fs.mkdirSync(catPath);
    }

    let fileName = path.basename(childDir);
    let finalPath = path.join(catPath, fileName);

    if (!fs.existsSync(finalPath)) {
        fs.copyFileSync(childDir, finalPath);
        fs.unlinkSync(childDir);
    }
}

function helpFun() {
    console.log(`
List of all commands:
    1.tree "directoryPath"(opt)
    2.organize "directoryPath"(opt)
    3.help
`);
}