import { strict as assert } from 'node:assert'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import { apply, inject, name, readBundledSkill } from '../lib/index.js'

test('bundled skill keeps its full instruction body and referenced files', () => {
  const skill = readBundledSkill()
  assert.equal(name, 'evidence-first-knowledge-work')
  assert.deepEqual(inject, ['skills'])
  assert.equal(skill.name, name)
  assert.equal(skill.metadata.version, '1.1.0')
  assert.equal(skill.source, 'bundled')
  assert.deepEqual(skill.invocation, { modelInvocable: true, userInvocable: true })
  assert.match(skill.content, /## 3\. Seven mandatory gates/)
  assert.match(skill.content, /references\/guided-development\.md/)
  assert.match(skill.content, /references\/completion-review\.md/)
  assert.ok(statSync(join(skill.resourceBase.path, 'references/guided-development.md')).isFile())
  assert.ok(statSync(join(skill.resourceBase.path, 'evals/check_trace.py')).isFile())
  const raw = readFileSync(skill.path, 'utf8')
  assert.ok(raw.includes(skill.content))
})

test('plugin contributes one native DSH skill without scheduling a conversation', () => {
  const registered = []
  apply({ skills: { register: value => registered.push(value) } })
  assert.equal(registered.length, 1)
  assert.equal(registered[0].name, name)
  assert.equal(registered[0].resourceBase.kind, 'directory')
})

test('real DSH skill registry lists and loads the packaged skill', async () => {
  const root = new Context()
  try {
    await root.plugin(SkillRegistry)
    await root.plugin({
      name: 'existing-user-skill',
      inject: ['skills'],
      apply(ctx) {
        ctx.skills.registerProvider(() => ({
          name: 'existing-user-skill',
          list: async () => [{
            name,
            description: 'Existing user copy',
            invocation: { modelInvocable: true, userInvocable: true },
            source: 'user-dsh',
            provider: 'existing-user-skill',
            rank: 400,
            locator: null
          }],
          get: async () => ({
            name,
            description: 'Existing user copy',
            content: 'Existing user copy',
            invocation: { modelInvocable: true, userInvocable: true },
            source: 'user-dsh',
            provider: 'existing-user-skill'
          })
        }))
      }
    })
    await root.plugin({ name, inject, apply })
    const catalog = await root.skills.list()
    assert.deepEqual(catalog.map(item => item.name), [name])
    assert.equal(catalog[0].provider, 'runtime')
    const loaded = await root.skills.get(name)
    assert.ok(loaded)
    assert.match(loaded.content, /## 3\. Seven mandatory gates/)
    assert.equal(loaded.resourceBase.kind, 'directory')
  } finally {
    await root.fiber.dispose()
  }
})
