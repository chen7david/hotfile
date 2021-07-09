# Hotfile
Hotfile makes working with folders and files in node-js easy and clear.


### Getting Started
1. <code>$ npm i hotfile</code>
```js
const SOME_FOLDER_PATH = 'some-folder-path'
const aHotFolder = require('hotfile')(SOME_FOLDER_PATH)

const someAsyncFunction = async () => {

    await aHotFolder.loadChildren()

    console.log(aHotFolder)

}
someAsyncFunction()
```

##### console.log(aHotFolder)
```cmd
{
    "isFile": false,
    "path": "home",
    "basename": "home",
    "size": 224,
    "children": [
        {
            "isFile": false,
            "path": "home/1",
            "basename": "1",
            "size": 192,
            "children": []
        },

        ...

        {
            "isFile": true,
            "path": "home/an video file.mp4",
            "basename": "an video file.mp4",
            "size": 60,
            "ext": ".mp4"
        }
    ]
}
```

### Diagram A
Below is a tree diagram of the folders and files that we will be using in this documentation. This diagram will hereinafter be referred to as the "Diagram A"

```cmd
/Users/YOUR_USER_NAME/Desktop/YOUR_PROJECT_NAME/home
├── 1
|  ├── 2
|  |  └── 3
|  |     └── 4
|  |        └── 5
|  |           ├── a subtitle file.en.srt
|  |           ├── an audio file.mp3
|  |           └── a video file.mp4
|  ├── a subtitle file.en copy.srt
|  ├── an audio file.mp3
|  └── a video file.mp4
├── a
|  ├── a subtitle file.en.srt
|  ├── an audio file.mp3
|  ├── an video file.mp4
|  └── b
|     └── c
|        └── d
|           └── e
|              ├── a subtitle file.en.srt
|              ├── an audio file.mp3
|              └── a video file.mp4
├── a subtitle file.en.srt
├── an audio file.mp3
└── a video file.mp4

directory: 10 file: 15
```
### Usage


#### Instantiation

#### Example 1
```js
const SOME_FOLDER_PATH = 'home'
const SOME_FILE_PATH = 'home/a/a subtitle file.en.srt'
const aHotFolder = require('hotfile')(SOME_FOLDER_PATH)
const aHotFile = require('hotfile')(SOME_FILE_PATH)
```
#### Example 2
If you would like to access the Hotfile and or HotfileError class
```js
const SOME_FOLDER_PATH = 'home'
const SOME_FILE_PATH = 'home/a/a subtitle file.en.srt'
const { Hotfile, HotfileError } = require('hotfile')
const aHotFolder = Hotfile(SOME_FOLDER_PATH)
const aHotFile = Hotfile(SOME_FILE_PATH)
```

#### 

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