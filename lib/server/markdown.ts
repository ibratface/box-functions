import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import fs from 'fs'
import path from 'path'


export async function formatHTML(mdFile) {
  const fullPath = path.join(process.cwd(), mdFile)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const processedContent = await remark()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(fileContents)

  return String(processedContent)
}
