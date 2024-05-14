##About this Project
This is my take home assessment for Runway.team


### Running the application:
1. git clone
2. npm i 
3. npm run dev
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Explanation of Tech & Design
For this take home, I used Next.js with Typescript and React. This allowed me to easily set up the project and be able to create productionalized code very easily. I also chose to use next.js because it would automatically install tailwind which is inline css (note: this doesn't reduce the time necessarily spent styling, but nice to create in line). 

For the actual design, the user is able to input either 1 or many input ids, separated by commas and retrieve all reviews from the past 48 hours. If they lose their session due to stopping the program etc. the search is stored in the user's local storage which is then used to retreived the review data in a json file. The reason why I do this is because while we want just enough data on the user's side that we can continue their session, but we don't want to trust the user with all of our data so the client side will still have to query the backend to retreive. 

On the backend, the server stores only the past 48 hours worth of each app's data as this is only thing necessary to the user. If we tried to store all data throughout time in each query, it would become redundant with the API's data and also we would be exponentially increasing the searching for each app in our locally stored json. When the client queries the backend endpoints, we will first check the local json file to see if it has the IOS app and if it has only been the past 5 minutes (this is my reasonable time limit), if it fits both these conditionals then it will pull from the JSON, otherwise will query the API. I used 5 minutes as my limit because it is just enough time that if there is a flood of bad reviews we will catch it within a reasonable time limit, but if not then there is no need to constantly query the db for results that are most likely not going to change. In addition, I noted that the API URL uses pagination and took into consideration this edge case. To make sure we are getting ALL 48 hours worth of reviews, I iterated through 10 pages (the limit of the RSS URL api), in mostRecent sorted data and once we reach data that is past the 48 hours we terminate, filter, and return the data.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
