import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
const RSS_URL = process.env.RSS_URL;
// import  "../../../data/appReviews.json"

// fetch app review data
const fetchAppReviews = async (appId: string) => {
    // fetch data from RSS
    const response = await fetch(`${RSS_URL}/id=${appId}/sortBy=mostRecent/page=1/json`);
    const data = await response.json();
    const currentTime = new Date();
    // Change this back to 48 hrs -- needed to check that data was coming in
    const past48Hours = currentTime.getTime() - (24 * 7 * 60 * 60 * 1000); // 48 hours in milliseconds
    // Filter data based on publication date within the last 48 hours and extract required parameters
    const filteredData = data.feed.entry.filter((entry: any) => {
        const entryDate = new Date(entry.updated.label);
        return entryDate.getTime() >= past48Hours;
    }).map((entry: any) => ({
        title: entry.title.label,
        content: entry.content.label,
        author: entry.author.name.label,
        score: entry['im:rating'].label,
        submissionTime: entry.updated.label
    }));

    return filteredData
}

export async function GET(req: NextRequest, context: any) {
    try {
        const { appId } = context.params;
        const data = await fetchAppReviews(appId);
        return NextResponse.json({ data: data });
    } catch (e) {
        console.log(`error was thrown: ${e}`);
        return e;
    }
}
