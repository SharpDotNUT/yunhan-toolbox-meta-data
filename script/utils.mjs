
import fs from 'fs'
import path from 'path'
const __dirname= import.meta.dirname

export const Languages = [
    'CHS',
    'CHT',
    'DE',
    'EN',
    'ES',
    'FR',
    'IT',
    'JP',
    'KR',
    'PT',
    'RU',
    'TH',
    'TR',
    'VI'
]

export const SupportLanguages = [
    'CHS',
    'CHT',
    'EN',
    'JP'
]
export const addInSourceMap = (name,lang) => {
    fs.mkdirSync(path.join(__dirname, '../dist'), { recursive: true })
    let map =  fs.existsSync(path.join(__dirname, '../dist/sourceMap.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, '../dist/sourceMap.json'))) : {}
    if(lang) {
        map[name] = map[name] || {}
        map[name][lang] = 'https://cdn.jsdelivr.net/gh/SharpDotNUT/yunhan-toolbox-meta-data/dist/'+name+'/'+lang+'.json'
    }else{
        map[name] = 'https://cdn.jsdelivr.net/gh/SharpDotNUT/yunhan-toolbox-meta-data/dist/'+name+'/'+name+'.json'
    }
    fs.writeFileSync(path.join(__dirname, '../dist/sourceMap.json'), JSON.stringify(map,null,2))
}