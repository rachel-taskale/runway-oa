"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [reviewData, setReviewData] = useState<any[]>([])
  const [appIdInput, setAppIdInput] = useState("")
  
  
  const getReviewData = async () => {
    try {
        const res = await fetch(`/api/reviews/${appIdInput}`);
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log(data); // Log the fetched data
        setReviewData(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, e.g., show a message to the user
    }
  }

const getColor=(score:number)=>{
  if (score > 7){
    return "text-green-700"
  }else if(score >=5){
    return "text-yellow-700"
  }else{
    return "text-red-700"
  }
}


  return (
    <main className="flex justify-center pt-40 px-20">
      <div className="space-y-10 ">
      <div className="text-4xl">What IOS app do you want to see reviews for?</div>
      <div className="flex justify-center space-x-4 text-2xl">
      <input className="border w-full px-4 py-2" onChange={(e)=>setAppIdInput(e.target.value)} value={appIdInput}></input>
      <button className="border px-4 py-2 bg-primary " type="submit" onClick={getReviewData}>Submit</button>
      </div>
      <div className="text-2xl">ex. dragonvale: 440045374</div>
      <div className="space-y-10">
      {reviewData && reviewData?.map((item:any, index:number) => (
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
      ))}

      </div>
      </div>

    </main>
  );
}
