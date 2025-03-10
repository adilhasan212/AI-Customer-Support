import { NextResponse } from 'next/server'; 
import OpenAI from 'openai'; 

// System prompt defining chatbot behavior and guidelines
const systemPrompt = `You are an AI-powered customer support assistant for HeadStarter AI, a platform that provides AI-driven interviews for software engineering positions.
1. HeadStarter AI offers a fellowship program that gives students/aspiring software engineers many different resources to help them land a software engineering job.
2. To apply, tell them to go to the HeadStarter website at https://apply.headstarter.co/.
3. The HeadStarter AI fellowship offers AI-powered interviews for software engineering positions.
4. Our fellowship helps candidates practice and prepare for real job interviews.
5. We cover a wide range of topics including algorithms, data structures, system design, and behavioral questions.
6. Users can access our services through our website or mobile app.
7. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
8. Always maintain user privacy and do not share personal information.
9. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.
10. HeadStarter AI is based in San Francisco, California, and the founder is Yasin Ehsan.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStarter AI users.`;

// Handles incoming POST requests
export async function POST(req) {
    const openai = new OpenAI(); // Initialize OpenAI client
    const data = await req.json(); // Parse the request body 

    // Request AI generated response from OpenAI GPT model
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system', 
                content: systemPrompt, // Provide AI system instructions
            },
            ...data, // Append user messages
        ],
        model: 'gpt-4o-mini', 
        stream: true, // Enable streaming response for real-time updates
    });

    // Creates a readable stream to send AI responses as they come in
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder(); // Encoder to convert text to binary format
            try {
                for await (const chunk of completion) { // Iterate over streamed response
                    const content = chunk.choices[0]?.delta?.content; // Extract AI generated text
                    if (content) {
                        const text = encoder.encode(content); // Convert text to binary
                        controller.enqueue(text); // Push the encoded text into the stream
                    }
                }
            } catch (err) {
                controller.error(err); // Handle errors
            } finally {
                controller.close(); // Close the stream when done
            }
        }
    });

    return new NextResponse(stream); // Return the streamed AI response to the frontend
}
