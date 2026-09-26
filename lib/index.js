import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

export const name = 'evidence-first-knowledge-work'
export const inject = ['skills']

const directory = fileURLToPath(new URL('../assets/evidence-first-knowledge-work/', import.meta.url))
const path = join(directory, 'SKILL.md')
const requiredResources = [
  'references/evidence-template.md',
  'references/coding-protocol.md',
  'references/guided-development.md',
  'references/knowledge-protocol.md',
  'references/decision-playbook.md',
  'references/worked-examples.md',
  'references/completion-review.md',
  'references/acceptance-cases.md',
  'evals/README.md'
]

export function readBundledSkill() {
  const raw = readFileSync(path, 'utf8')
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (!frontmatter) throw new Error(`${name}: SKILL.md has no YAML frontmatter`)
  const data = parse(frontmatter[1])
  if (!data || typeof data !== 'object' || data.name !== name || typeof data.description !== 'string' || !data.description.trim())
    throw new Error(`${name}: invalid skill name or description`)
  const content = raw.slice(frontmatter[0].length).trim()
  if (!content) throw new Error(`${name}: SKILL.md has no instruction body`)
  for (const resource of requiredResources)
    if (!statSync(join(directory, resource)).isFile())
      throw new Error(`${name}: missing resource ${resource}`)
  return {
    name,
    description: data.description.trim(),
    content,
    path,
    source: 'bundled',
    resourceBase: { kind: 'directory', path: directory },
    invocation: { modelInvocable: true, userInvocable: true },
    ...(data.metadata && typeof data.metadata === 'object' ? { metadata: data.metadata } : {})
  }
}

export function apply(ctx) {
  ctx.skills.register(readBundledSkill())
}
