import { marked } from 'marked'

// The CMS (cms.roihin.com) stores post content as Markdown, but older posts
// may contain ready-made HTML. Only convert when no block-level HTML is present.
// Closing tags are matched (not `<br>`/`<img>`) because Markdown image alt text
// can legitimately contain stray inline tags like `![<br>](...)`.
const HTML_BLOCK_RE = /<\/(p|div|h[1-6]|ul|ol|li|table|blockquote|figure|section|article)>/i

export function markdownToHtml(content: string): string {
  if (!content) return ''
  if (HTML_BLOCK_RE.test(content)) return content

  return marked.parse(content, {
    gfm: true,
    breaks: true,
    async: false,
  }) as string
}
