import { NextRequest, NextResponse } from "next/server";
const RSS_URL = process.env.RSS_URL;
import { isLastLogWithinFiveMinutes, writeAppReviewsToFile, readAppReviewsFromJSON } from "@/app/utils/utils";


// Json Structure for our ReviewData
interface ReviewData {
    [appId: string]: {
        timestamp: string;
        reviews: any;
    };
}


// Function to fetch and transform app review data for a single appId
const fetchAndTransformDataForAppId: (appId: string) => Promise<ReviewData[]> = async (appId) => {
    let data: any[] = [];
    let page: number = 1;
    try {
        while (page <= 10) { // Limiting to 10 pages as per RSS_URL condition
            const response: Response = await fetch(`${RSS_URL}/id=${appId}/sortBy=mostRecent/page=${page}/json`);
            const responseData: any = await response.json();
            const currentTime = new Date();
            const past48Hours = currentTime.getTime() - (48 * 60 * 60 * 1000); // 48 hours in milliseconds

            // filter and map function for the past 48 hour data only and transform into a DTO for client
            const filteredData = responseData.feed.entry.filter((entry: any) => {
                const entryDate = new Date(entry.updated.label);
                return entryDate.getTime() >= past48Hours;
            }).map((entry: any) => ({
                title: entry.title.label,
                content: entry.content.label,
                author: entry.author.name.label,
                score: entry['im:rating'].label,
                submissionTime: entry.updated.label
            }));
        
            console.log(filteredData.length)
            if (filteredData.length === 0) {
                return data
            }

            data.push(...filteredData);
            page += 1;
        }

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data from the API');
    }
};


// Function to fetch app review data for multiple appIds
const fetchAppReviewsForMultipleIds: (appIds: string[]) => Promise<any[]> = async (appIds) => {
    try {
        const jsonAppReviews: ReviewData = readAppReviewsFromJSON();
        const filteredDataForAllAppIds: any[] = [];
        for (let appId of appIds) {
            if (jsonAppReviews.hasOwnProperty(appId) && isLastLogWithinFiveMinutes(jsonAppReviews[appId].timestamp)) {
                filteredDataForAllAppIds.push(jsonAppReviews[appId].reviews);
            } else {
                // Fetch and transform data for the appId
                const filteredData: ReviewData[] = await fetchAndTransformDataForAppId(appId);
                // Update the reviews in the JSON file
                jsonAppReviews[appId] = {
                    reviews: filteredData,
                    timestamp: new Date().toISOString()
                };
                await writeAppReviewsToFile(jsonAppReviews);
                filteredDataForAllAppIds.push(filteredData);
            }
        }
        return filteredDataForAllAppIds;
    } catch (e) {
        throw new Error();
    }
};



export async function GET(req: NextRequest, context: any) {
    try {
        let { appId }: { appId: string } = context.params;
        appId = appId.replace(/\s/g,'')
        const appIdList: string[] = appId.split(",")
        const data: any[] = await fetchAppReviewsForMultipleIds(appIdList);
        return NextResponse.json({ data: data });
    } catch (e) {
        console.log(`error was thrown: ${e}`);
        return NextResponse.json({ data: {} })
    }
}
