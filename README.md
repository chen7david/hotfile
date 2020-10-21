# hotfile

```js
const directory = '/some/directory/path'
const file = '/some/file/path.ext'
const hf = require('hotfile')

const someAsyncFunction = async () => {
    const hotfiles = await hf.map(directory)
    const hotfile = new hf(file)
    const hotdir = hotfiles[0]
    const newdir = await hotdir.appendDirectory('subtitles')
}
```

```js
const hotdir = new hf(directory)
await hotdir.rename('newfilename', 'ext')

const hotfile = new hf(file)
await hotfile.moveTo(hotdir)
```