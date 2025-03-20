import Koa from 'koa'
import Router from 'koa-router'
import { readdirSync, readFileSync } from 'fs'

const router = new Router().post('/search', async ({ request, response }) => {
  const c = request.query.category as 'books' | 'movies' | 'music'
  const q = request.query.term as string

  try {
    response.body = { files: searchFilesInCategory(c, q) }
  } catch (error) {
    response.body = { error: String(error) }
  }
})

function searchFilesInCategory(category: 'books' | 'movies' | 'music', keyword: string): string[] {
  const files = readdirSync(`./data/${category}`)
  return files.filter(x => readFileSync(`./data/${category}/${x}`, 'utf-8').includes(keyword.toLowerCase()))
}

new Koa().use(router.routes()).listen(80)
