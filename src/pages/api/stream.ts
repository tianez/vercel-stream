import { NextRequest, NextResponse } from 'next/server'

export const config = {
    runtime: 'edge',
    /**
     * https://vercel.com/docs/concepts/edge-network/regions#region-list
     * disable hongkong
     * only for vercel
     */
    regions: ['cdg1', 'arn1', 'dub1', 'lhr1', 'iad1'],
}

const req = async (req: NextRequest, res: NextResponse) => {
    const encoder = new TextEncoder()
    let isStop = false
    let eventId = 0

    // @ts-ignore
    const stream = new ReadableStream({
        start(controller) {
            function pump() {
                setTimeout(async () => {
                    if (isStop || eventId == 100) {
                        controller.close()
                        return
                    }
                    let text = `eventId:${eventId}`
                    console.log(text)
                    const queue = encoder.encode(`${eventId}`)
                    controller.enqueue(queue)
                    eventId++
                    pump()
                }, 200)
            }
            pump()
        },
        cancel: (r) => {
            console.log(r)
            isStop = true
        },
    })
    const rs = new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no',
        },
    })
    return rs
}

export default req
