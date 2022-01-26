import {HapticCommand} from "./commands"
import * as Handlers from "./handlers"
import {HapticFileHandler} from "./hapticFileHandler"

interface IFileReaderEventTarget extends EventTarget {
  result: string
}

interface IFileReaderEvent extends Event {
  target: IFileReaderEventTarget
  getMessage(): string
}

export function LoadString(aBody: string): HapticFileHandler | undefined {
  const fileTypes = Object.keys(Handlers)
  const parsers: HapticFileHandler[] = []
  fileTypes.map((handlerType) => {
    // @ts-ignore
    const h: HapticFileHandler = new Handlers[handlerType]()
    try {
      h.LoadString(aBody)
      parsers.push(h)
    } catch (e) {
      // just ignore if there's an error.
      // TODO: Should probably at least typecheck error.
    }
  })
  if (parsers.length === 1) {
    return parsers[0]
  }
  // TODO: Return a better error when multiple parsers available somehow.
  return undefined
}
