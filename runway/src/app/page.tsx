"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [reviewData, setReviewData] = useState<any[]>([])
  const [appIdInput, setAppIdInput] = useState("")

  // Will check if we have any data in localstorage and if we do then fetch the data based
  // on our last session
  useEffect(() => {
    const fetchData = async () => {
      const appId = readUserMetadata();
      // fetch data if local storage was not empty and we dont have anything in review data
      if (appId !== "" && reviewData.length === 0) {
        getReviewDataWithParams(appId)
      }
    }
    fetchData();
  }, [reviewData.length]);


  // Reading the our search that is stored in local storage
  const readUserMetadata: () => string = () => {
    try {
      // retreive item
      const jsonData: string | null = localStorage.getItem('searchQuery');
      if (jsonData) {
        setAppIdInput(jsonData);
        return jsonData; // Return true if data is found in localStorage
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return ""; // Return false if unable to read data from localStorage
  };


  // Function to write data to localStorage
  const writeUserMetadata: (data: string) => void = (data) => {
    localStorage.setItem('searchQuery', data); // Don't stringify data here
  };

  // will retrieve the data from server side if we obtained the appIds from local storage
  const getReviewDataWithParams: (appId: string) => Promise<void> = async (appId) => {
    try {
      const res: Response = await fetch(`/api/reviews/${appId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: any = await res.json();
      // set state to response data 
      setReviewData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // will retreive the data from the server side based on client input
  const getReviewData: () => Promise<void> = async () => {
    try {
      const res: Response = await fetch(`/api/reviews/${appIdInput}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: any = await res.json();
      // set state to response data 
      setReviewData(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  // If we update the input, we will store the changes in state and in localstorage
  const handleUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    writeUserMetadata(e.target.value)
    setAppIdInput(e.target.value)
  }

  // Just for styling we do conditional rendering for text color
  const getColor: (score: number) => string = (score) => {
    if (score > 7) {
      return "text-green-700"
    } else if (score >= 5) {
      return "text-yellow-700"
    } else {
      return "text-red-700"
    }
  }

  return (
    <main className="flex pt-40 px-20">
      <div className="space-y-10 ">
        <div className="text-4xl">What IOS app do you want to see reviews for?</div>
        <div className="flex space-x-4 text-2xl">
          <input className="border w-full px-4 py-2" onChange={handleUpdate} value={appIdInput}></input>
          <button className="border px-4 py-2 bg-primary " type="submit" onClick={getReviewData}>Submit</button>
        </div>
        <div className="text-2xl">ex. dragonvale: 440045374 or multiple apps (instagram, fb): 389801252,284882215 </div>
        <div className="space-y-10">
          {/* Iterate thru all the review data first by appId then by each review and map them into html objects */}
          {reviewData && Object.keys(reviewData).map((key: any) => (
            <div className="space-y-2" key={key}>
              {reviewData[key].map((item: any, index: number) => (
                <div className="border p-4 space-y-2" key={index}>
                  <div className="text-2xl flex space-x-4 font-bold">
                    <div className={getColor(item.score)}>{item.score}/10</div>
                    <div className="">{item.title}</div>
                  </div>
                  <div className="text-2xl">{item.content}</div>
                  <div className="w-full flex justify-between">
                    <div className="text-lg">{item.author}</div>
                    <div className="">{item.submissionTime}</div>
                  </div>
                </div>
              ))
              }
            </div>
          ))}

        </div>
      </div>

    </main>
  );
}
