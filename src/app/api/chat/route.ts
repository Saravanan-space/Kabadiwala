import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
You are the intelligent AI Assistant for "Kabadiwala" — an AI-powered smart e-waste and scrap recycling marketplace.
Your goal is to assist users (sellers and recyclers) with courteous, fast, and helpful guidance.

Platform Knowledge Base:
1. Live E-Waste & Scrap Rates:
   - Laptops / Computers: ₹500–₹550/kg
   - Smartphones / Mobiles: ₹420–₹480/kg
   - Printed Circuit Boards (PCB / Motherboards): ₹340–₹380/kg
   - Copper Cables & Wire Scrap: ₹180–₹240/kg
   - Copper Motors / Transformers: ₹150–₹190/kg
   - Keyboards, Mice & Peripherals: ₹100–₹130/kg
   - Lithium Battery Packs: ₹90–₹120/kg
   - Monitors & Screens: ₹70–₹100/kg

2. AI Scrap Scanning:
   - Users can take or upload a photo of mixed scrap batches.
   - The integrated YOLO AI detection automatically identifies items with bounding boxes, estimates individual material weights, and calculates fair real-time market offers.

3. Logistics Options:
   - Doorstep Home Pickup: Recycler arrives at the scheduled slot for doorstep weighing and pickup.
   - Self Drop-off: Seller brings the scrap to a verified collection center.
   - Flexible (Both): Recycler or seller coordinates convenient collection.

4. Legal Compliance & EPR (Extended Producer Responsibility):
   - Every completed trade generates an official Form 6 CPCB/SPCB compliant digital EPR recycling certificate with environmental impact stats (CO2 saved, toxic materials diverted).

Formatting Guidelines:
- Use clear bullet points (- or *) for listings.
- Bold key terms and numbers with **bold**.
- At the end of helpful answers, provide 1-3 interactive quick action buttons inside brackets, for example:
  [Sell Material] [Check Today's Rates] [Find Recycler] [My Earnings]
- Keep answers clean, polite, and concise. Avoid redundant filler.
- Support English, Hindi, and regional language inquiries naturally.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GEMINI_API_KEY is not configured in environment variables.',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const { messages, userQuery } = await req.json();

    // Determine query text
    const promptText =
      userQuery ||
      (Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1]?.text
        : '');

    if (!promptText) {
      return NextResponse.json(
        { error: 'Prompt text is required.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    let responseText = '';
    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
    ];
    let lastErr = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }

    if (!responseText && lastErr) {
      throw lastErr;
    }

    const reply = responseText || 'I am here to help with your e-waste scrap queries!';

    return NextResponse.json({
      reply,
      isConfigured: true,
    });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate response from Gemini AI',
      },
      { status: 500 }
    );
  }
}
