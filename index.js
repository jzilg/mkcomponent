const fs = require('fs')
const pwd = process.argv[1].replace('/index.js', '')
const boilerplate = `${pwd}/boilerplate`

const init = () => {
    const name = process.argv[2]

    if (fs.existsSync(name)) {
        console.log(`Component "${name}" allready exists`)
        return
    }

    createDir(name)
        .then(() => createIndexFile(name))
        .then(() => createJsxFile(name))
        .then(() => createStyleFile(name))
}

const createIndexFile = (name) => new Promise((resolve, reject) => {
    const src = `${boilerplate}/index.js`
    const file = `${name}/index.js`
    const regex = /%component/g
    const replaceText = `./${name}`

    copyFile(src, file).then(() => {
        editFile(file, regex, replaceText).then(() => {
            console.log(file, 'created')
            resolve()
        })
    })
})

const createStyleFile = (name) => new Promise((resolve, reject) => {
    const filename = getSpinalName(name)
    const file = `${name}/${filename}.scss`

    createFile(file).then(() => {
        console.log(file, 'created')
        resolve()
    })
})

const createJsxFile = (name) => new Promise((resolve, reject) => {
    const src = `${boilerplate}/component.jsx`
    const file = `${name}/${name}.jsx`

    copyFile(src, file).then(() => {
        const componentRegex = /%component/g

        editFile(file, componentRegex, name).then(() => {
            const scssRegex = /%scss/g
            const spinalName = getSpinalName(name)
            const scssFileText = `${spinalName}.scss`

            editFile(file, scssRegex, scssFileText).then(() => {
                console.log(file, 'created')
                resolve()
            })
        })
    })
})


// helper

const createDir = (name) => new Promise((resolve, reject) => {
    fs.mkdirSync(name)
    resolve()
})

const copyFile = (src, dest) => new Promise((resolve, reject) => {
    fs.createReadStream(src).pipe(
        fs.createWriteStream(dest).on('close', () => {
            resolve()
        })
    )
})

const createFile = (file) => new Promise((resolve, reject) => {
    fs.writeFile(file, '', 'utf8', (err) => {
        if (err) {
            return console.log(err)
        }
        resolve()
    })
})

const editFile = (file, regex, text) => new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return console.log(err)
        }

        const result = data.replace(regex, text)

        fs.writeFile(file, result, 'utf8', (err) => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
})

const getSpinalName = (name) => {
    let newName = name
    newName = newName.replace(/([a-z](?=[A-Z]))/g, '$1-')
    newName = newName.toLowerCase()
    return newName
}

init()
