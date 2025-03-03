import Koa from "koa"
import Router from "koa-router"
import { readdirSync, readFileSync, statSync } from "node:fs"

const router = new Router()

router.post('/search', async ({request, response}) => {
    const c = request.query.category as 'books' | 'movies' | 'musics'
    const q = request.query.term as string

    try {
        const files = searchFilesInCategory(c, q)
        response.body = JSON.stringify({ files })
        response.type = 'json'
    } catch (error) {
        response.body = JSON.stringify({ error })
        response.type = 'json'
    }
})

function searchFilesInCategory(c: 'books' | 'movies' | 'musics', q: string): string[] {
    return readdirSync(`./data/${c}`)
        .filter((x: string) => statSync(`./data/${c}/${x}`).isFile())
        .filter((x: string) => readFileSync(`./data/${c}/${x}`, 'utf-8').toLowerCase().includes(q.toLowerCase()))
}

new Koa().use(router.routes()).listen(8080, () => {})
