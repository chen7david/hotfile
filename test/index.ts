import Koa, { Context } from 'koa'
import Router from 'koa-router'
import { Hotfile } from '../src/index'

const app = new Koa()
const router = new Router()
const PORT = 3000

const controller = async (ctx: Context) => {
  const hotfile = new Hotfile('../desktop')
  await hotfile.loadChildren({
    depth: 2,
    flatten: true,
    extendedProperties: ['id'],
  })
  ctx.body = hotfile
}

router.get('/', controller)
app.use(router.routes())
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
