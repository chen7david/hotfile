# Hotfile
Hotfile makes working with folders and files in node-js easy and clear.


## Getting Started
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

```cmd
##### console.log(aHotFolder)
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

## Documentation

### Diagram A
Below is a tree diagram of the folders and files that we will be using in this documentation. This diagram will hereinafter be referred to as "Diagram A"

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

### Options
When you want to load the subfolders of a hotfile folder instance can specify certain parameters by passing an options object to the loadChildren function like so: <code>instance.loadChildren(/* options */)</code>
```js
const options = {
    id: true, // generates md5 hashes of an item's path and adds that to the item as its id property
    depth: 3, // how deep down the directory tree it loads items, this is 0 by default.
    files: true, // constructs an array of files present in the loaded folders and attaches it to the instance that called the load method.
    cb: async (item) => { /* code in here runs for each loaded file and folder */ }, 
    exclude: ['strings'], // files and folders matching any of the strings in this array will not be loaded
    include: ['strings'], // files and folders matching any of the strings in this array will be loaded
    $exclude: ['regex'], // files and folders matching any of the regular expressions in this array will not be loaded
    $include: ['regex'] // files and folders matching any of the regular expressions in this array will be loaded
}

aHotFolder.loadChildren(options)
```
Note: filters can not be mixed, as such only one of the four filters (include, exclude, $include, $exclude) may be included in an object.

#### Example 1
In this example we add md5 ids to each loaded item, load just 1 subfolder deep, collect the files in an array, filter out <code>.SD_Store</code> files, and run an async call back function which renames and moves all files to another Hotfile folder instance. 
```js
const someAsyncFunction = async () => {

    await aHotFolder.loadChildren({
        id: true,
        depth: 1,
        files: true,
        exclude: ['.DS_Store'],
        cb: async (item) => {
            const name = item.md5Id(new Date().toISOString())
            const ext = 'mp4'
            await item.setNameTo(name).setExtTo(ext).moveTo(anotherHotFolder)
        }
    })
}
someAsyncFunction()
```

#### Example 2
In this example we load 5 levels deep and delete all files and folders. 
```js
const someAsyncFunction = async () => {

    await aHotFolder.loadChildren({
        depth: 5,
        files: true,
        cb: async (item) => {
            await item.delete()
        }
    })
}
someAsyncFunction()
```


### Instance Methods

#### Example 1: Creating a Subfolder
You can create subfolders in Hotfile folder instances by using the createFolder or createFolderSync method. Both of these return an instance of the newly created subfolder. 

```js
instance.createFolderSync(string) -> instance
instance.createFolder(string) -> instance
```
In the following example we create 4 nested folders A,B,C, and D.
```js
const aHotFolderA = require('hotfile')(SOME_FOLDER_PATH)
const foldername = 'some-name-not-a-path'
const aHotfolderB = aHotFolderA.createFolderSync(foldername)
const aHotfolderC = aHotfolderB.createFolderSync(foldername)
const aHotfolderD = aHotfolderC.createFolderSync(foldername)
```

#### Example 2: Moving a Hotfile
Hotfile file instances can be move from one Hotfile folder instance to another. 
```js
async instance.moveTo(instanec) -> instance
```
Hotfile file instances can be move from one Hotfile folder instance to another. 

```js
const aHotFolderA = require('hotfile')(SOME_FOLDER_PATH_A)
const aHotFolderB = require('hotfile')(SOME_FOLDER_PATH_A)
const aHotFile = require('hotfile')(SOME_FILE_PATH)

await aHotfile.moveTo(aHotFolderA)
await aHotfile.moveTo(aHotFolderB)
```


#### Example 3: Deleting Hotfile file instance
Hotfile file instances can be deleted from anywhere. 
```js
async instance.delete() -> boolean
```
Hotfile file instances can be move from one Hotfile folder instance to another. 

```js
const aHotFile = require('hotfile')(SOME_FILE_PATH)

const result = await aHotfile.delete()

```