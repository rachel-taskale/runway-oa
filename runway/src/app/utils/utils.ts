import fs from "fs"
// Json Structure for our ReviewData
interface ReviewData {
  [appId: string]: {
      timestamp: string;
      reviews: any;
  };
}
// Check if the last time we got the reviews was in the past 5 minutes
export const isLastLogWithinFiveMinutes: (timestamp: string) => boolean = (timestamp) => {
    const currentTime: number = new Date().getTime();
    const modifiedTime: number = new Date(timestamp).getTime()
    return currentTime - modifiedTime <= 5 * 60 * 1000; // 5 minutes in milliseconds
  };



// Read JSON from a file
export const readAppReviewsFromJSON: () => ReviewData = () => {
  try {
    // use the current working directory from where we ran npm run start
      const filePath: string = process.cwd() + "/src/app/data/appReviews.json"
      const data: string = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
  } catch (e) {
      console.log(`Error reading app reviews to file: ${e}`)
      return {}
  }
}


// Write to our local file
export const writeAppReviewsToFile: (data: any)=> Promise<void> = async(data) => {
  try {
        // use the current working directory from where we ran npm run start
      const filePath: string = process.cwd() + "/src/app/data/appReviews.json";
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
      console.error('Error writing app reviews to file:', error);
  }
};
