# Hotfile
Hotfile makes working with folders and files in node-js easy and clear.


Below is a tree diagram of the folders and files that we will be using in this documentation. This diagram will hereinafter be referred to as the "Diagram A"

```cmd
### Diagram A

/Users/YOUR_USER_NAME/Desktop/YOUR_PROJECT_NAME/home
├── 1
|  ├── 2
|  |  └── 3
|  |     └── 4
|  |        └── 5
|  |           ├── a subtitle file.en copy.srt
|  |           ├── an audio file.mp3
|  |           └── an video file.mp4
|  ├── a subtitle file.en copy.srt
|  ├── an audio file.mp3
|  └── an video file.mp4
├── a
|  ├── a subtitle file.en copy.srt
|  ├── an audio file.mp3
|  ├── an video file.mp4
|  └── b
|     └── c
|        └── d
|           └── e
|              ├── a subtitle file.en copy.srt
|              ├── an audio file.mp3
|              └── an video file.mp4
├── a subtitle file.en copy.srt
├── an audio file.mp3
└── an video file.mp4

directory: 10 file: 15
```
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
#### 0. place your code in an asycn function
```js
const someAsyncFucn = async () => {
    // NOTE: all the code below shuold be placed in an asycn function
}

```
#### 1. Create sub-folders
```js

    const sub1folder = await myfolder.createFolder('subfolder-01')
    const sub2folder = await myfolder.createFolder('subfolder-02')

```

#### 2. Create file in folder
```js
    const file = await subfolder.create('summer.js')
```

#### 3. Move file to another folder
```js
    await file.setNameTo('water').setBasenameTo('nemo.mp4').moveTo(sub2folder)
```
#### 4. Load subfolders with their files
```js
    await myfolder.laodChildren()
```
#### 5. Load subfolders, their files and for callback for each child
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
#### 6. Ignore children that are included
```js
    await myfolder.laodChildren({
        cb,
        exclude: ['node_modules', 'exact_name_of_unwated_file', 'DS_Store']
    })
```
#### 7. Exclude all hidden files
```js
    await myfolder.laodChildren({
        cb,
        deny: [ /(^|\/)\.[^\/\.]/g, /.*\.mp4/g]
    })

```