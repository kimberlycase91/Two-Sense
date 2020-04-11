# Two-Sense
A server-side application that scrapes the Wall Street Journal for news articels and  allows users to comment on recent headlines.

## What does it do?
This app allows users to scape the web to display recent news article headlines and a brief summary. Users can click the headline to read the full article on the original site. Users can also click "View/Add Comments" to see comments other users have left, and/or add their own comments. 

## How does it work?
This app uses cheerio to scrape the web site for news articles. It then stores the articles and the comments in a MongoDB database using Monggoose and express. Express-handlebars is used to display data on the page. 


## Try it Out:
Click [here](https://polar-cove-40006.herokuapp.com/)

