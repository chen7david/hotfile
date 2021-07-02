# Hotfile

### Usage

#### instantiation
```js
const { Hotfolder, Hotfile, Hot } = require('hotfile')
// const myfolder = require('hotfile')('./myfolder')
const dirpath = './myfolder' 
const filepath = './myfile.txt'
const myfolder = new Hotfolder(dirpath)
const myfile = new Hotfile(filepath)
```
```js
const someAsyncFucn = async () => {

```
### 1. create sub-folders
```js

    const sub1folder = await myfolder.createFolder('subfolder-01')
    const sub2folder = await myfolder.createFolder('subfolder-02')

```

### 2. create file in folder
```js
    const file = await subfolder.create('summer.js')
```

### 3. move file to another folder
```js
    await file.setNameTo('water').setBasenameTo('nemo.mp4').moveTo(sub2folder)
```
### 4. load subfolders with their files
```js
    await myfolder.laodChildren()
```
### 5. load subfolders, their files and for callback for each child
```js
    const cb = async (item) => {
        if(item.isFile){
            // later files here
        }else {
            // later folders here
        }
    } 
    await myfolder.laodChildren({cb})
```
### 6. ignore children that are included
```js
    await myfolder.laodChildren({
        cb,
        exclude: ['node_modules', 'exact_name_of_unwated_file', 'DS_Store']
    })
```
### 7. exclude all hidden files
```js
    await myfolder.laodChildren({
        cb,
        deny: [ /(^|\/)\.[^\/\.]/g, /.*\.mp4/g]
    })
}
```