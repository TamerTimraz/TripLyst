"use server"

import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const MAX_AI_TRIP_DAYS = 7

function calculateDayCount(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return (
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
}

export async function generateItineraryWithAI(params: {
    destination: string
    startDate: string
    endDate: string
    preferences?: string
}) {
    const dayCount = calculateDayCount(params.startDate, params.endDate)

    if (dayCount > MAX_AI_TRIP_DAYS) {
        throw new Error(`AI generation is limited to ${MAX_AI_TRIP_DAYS} days`)
    }

    const prompt = `
You are a travel planner.

Generate a detailed travel itinerary in STRICT JSON format.
DO NOT include markdown or explanations.
Generate 3-5 activities per day.

These are the inputs:

Destination: ${params.destination}
Start date: ${params.startDate}
End date: ${params.endDate}
Preferences: ${params.preferences ?? "None"}

JSON format:
{
    "title": string,
    "description": string | null,
    "days": [
        {
        "date": "YYYY-MM-DD",
        "activities": [
            {
            "title": string,
            "description": string | null
            }
        ]
        }
    ]
}
`

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    })

    //console.log(response.text)

    if (response.text) {
        try {
            return JSON.parse(response.text)
        } catch {
            throw new Error("AI response was not valid JSON")
        }
    }
}