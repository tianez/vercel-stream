import Head from 'next/head'

const Page = () => {
    const startStream = async () => {
        const data = await fetch(`/api/stream`)
            .then(async (response) => {
                const data = response.body
                if (!data) {
                    throw new Error('没有返回数据')
                }
                return data
            })
            .then(async (data) => {
                const reader = data.getReader()
                const decoder = new TextDecoder('utf-8')
                let done = false
                while (!done) {
                    const { value, done: readerDone } = await reader.read()
                    if (value) {
                        const char = decoder.decode(value)
                        console.log(char)
                        console.log(char)
                        if (char == 5) {
                            reader.cancel()
                        }
                    }
                    done = readerDone
                }
                return 'over'
            })
            .catch((err) => err.message)
        console.log(data)
    }

    return (
        <div>
            <Head>
                <meta name="theme-color" content="#00d39a" />
                <title>Stream</title>
            </Head>
            <div>
                <div className='btn' onClick={startStream}>startStream</div>
            </div>
        </div>
    )
}

export default Page
