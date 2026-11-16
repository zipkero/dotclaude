import type { EngineInterface, Register } from 'claude-code'

// auto compaction 기준 토큰의 80%: 저장 턴 하나와 그 응답이 들어갈 여유를 남긴다.
const SAVE_RATIO = 0.8

let threshold: number | undefined
// 한 번 저장을 요청한 뒤에는 compaction으로 사용량이 기준 아래로 내려갈 때까지 다시 요청하지 않는다.
let isSaveRequested = false

async function readThreshold($: EngineInterface): Promise<number | undefined> {
  const { context } = await $.session.usage({ breakdown: 'summary' })
  return context.breakdown?.autoCompactThreshold
}

// 저장할 차례면 [사용 토큰, 기준]을, 아니면 undefined를 돌려준다.
async function checkSaveDue($: EngineInterface, tokens: number | undefined): Promise<[number, number] | undefined> {
  if (tokens === undefined) return undefined
  threshold ??= await readThreshold($)
  if (threshold === undefined) return undefined

  if (tokens < threshold * SAVE_RATIO) {
    isSaveRequested = false
    return undefined
  }
  if (isSaveRequested) return undefined
  isSaveRequested = true
  return [tokens, threshold]
}

export const register: Register = on => {
  // session.measure는 턴이 끝날 때만 오므로, 도구를 이어 부르는 긴 턴에서는 도구 결과 뒤에 지시를 붙인다.
  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    if (result.deny !== undefined || e.agentId !== undefined) return result

    const due = await checkSaveDue($, (await $.session.usage()).context.tokens)
    if (due === undefined) return result

    const [tokens, limit] = due
    $.ui.toast(`context-autosave: ${tokens}/${limit} tokens, context-save 요청`)
    const note =
      `컨텍스트 사용량이 auto compaction 기준(${limit} tokens)의 ${Math.round((tokens / limit) * 100)}%다. ` +
      '다음 행동으로 Skill 도구로 context-save를 실행해 CONTEXT.md를 갱신한 뒤, 하던 작업을 이어 간다. ' +
      '사용자 제약이 CONTEXT.md 쓰기를 막으면 저장하지 않고 그 사실을 한 줄로 알린다.'
    return { ...result, context: [...(result.context ?? []), note] }
  }).catch(($, e, next) => next(e))

  // 도구 없이 끝난 턴의 대비책: 세션이 idle이 되면 /context-save를 실행한다.
  on('session.measure', async ($, e, next) => {
    if (!e.changed.includes('context')) return next(e)

    const due = await checkSaveDue($, e.context.tokens)
    if (due === undefined) return next(e)

    $.ui.toast(`context-autosave: ${due[0]}/${due[1]} tokens, /context-save 실행`)
    void $.command.run({ command: 'context-save' }).catch((err: unknown) => {
      isSaveRequested = false
      $.ui.toast(`context-autosave: /context-save 실행 실패: ${String(err)}`)
    })
    return next(e)
  }).catch(($, e, next) => next(e))
}
