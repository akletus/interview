import Koa from "koa"
import Router from "koa-router"
import { readdirSync, readFileSync, statSync } from "node:fs"

const router = new Router()

router.post('/search', async ({req, res}, next) => {
    const c = req.query.category as 'books' | 'movies' | 'music'
    const q = req.query.term as string

    try {
        const files = searchFilesInCategory(c, q)
        res.body = JSON.stringify({ files })
        res.type = 'json'
    } catch (e) {
        res.body = JSON.stringify({ error: e.message })
        res.type = 'json'
    }
})

function searchFilesInCategory(c: 'books' | 'movies' | 'music', q: string): string[] {
    return readdirSync(`./data/${c}`)
        .filter(x => statSync(`./data/${c}/${x}`).isFile())
        .filter(x => readFileSync(`./data/${c}/${x}`, 'utf-8').includes(q))
}

new Koa().use(router.routes()).listen(80, () => {})
