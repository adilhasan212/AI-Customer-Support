import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are an AI-powered customer support assistant for HeadStartAI, a platform that provides AI-driven interviews for software engineering positions.
1. Headstarter AI offers a fellowship program that gives students/aspiring software engineers many different resources to help them land a software engineering job.
2. To apply, tell them to go to the Headstarter website at https://apply.headstarter.co/.
3. The Headstarter AI fellowship offers AI-powered interviews for software engineering positions.
4. Our fellowship helps candidates practice and prepare for real job interviews.
5. We cover a wide range of topics including algorithms, data structures, system design, and behavioral questions.
6. Users can access our services through our website or mobile app.
7. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
8. Always maintain user privacy and do not share personal information.
9. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.
10. Headstarter AI is based in San Francisco California and the founder is Yasin Ehsan.
 
Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStarter AI users.`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
            role: 'system',
            content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err) {
                controller.error(err)
            } 
            finally {
                controller.close()
            }
        }
    })
    return new NextResponse(stream)
}