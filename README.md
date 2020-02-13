## CompanyUnknown's Playgrounds


#### An interactive visualization of company stats. Totally not a game.

Visit our site at https://uw-cse442-wi20.github.io/A3-game-dev-pubg/!

### About

Do you want to watch PUBG but with game studios fighting each other? Do you want to know about the player's top choice studio and their best-selling games? Well, you've come to the right place. Choose your Battle Arena of sales figures and ratings, hit the play button and watch the top 20 companies fight for players from 2003 to 2016. 

### Initiative

Coincidentally, some of our team members chose to work on a game sales visualization in A2. We felt the limitation of still images - it's very unintuive to showcase the growth process of sales data over the years. That was why we wished to create a dynamic view of game studios performance in this assignment. 

### Graphics and design choices

#### Data selection and Cleaning

Our original data contained game sales statistics from 1980s to 2016. However, a lot of the data were missing in the early stages of the Internet. Therefore we picked the starting point as 2003 to ensure the quality of data. We used Python Pandas to convert the CSV files to JSON, which we then load to the visualizations page. 

#### Year slider

Since we wished to create a dynamic view of the game sales data on a yearly basis, a year slider should be a good resemblance to a timeline. A user can drag the pointer to view the exact year. 

#### Auto-play

To make the year-by-year distinctions clearer, we added the auto-play feature that can automatically showcase the growth of game studios.  

#### Peek-N-Pop

A game studio can drastically gain market recognition and profits through the release of blockbuster games. 

#### Multi-view

We understand that the performance of a game studio cannot be simply measured by a single index alone. Thus, we introduced the multi-view metrics system. A user can choose from total sales, average sales, average user scores and critic scores, and view the critera that he/she most concerns. We've made sure that  when a user switches between views, the auto-play will pause and the user will view the same year's data (of another view). 

For the two ratings, we calculate the average rating of games released each year. Note that for it is quite common for game studios to release games once in a few years. To resolve this issue where sometimes a game studio won't have data points at all, we introduce the "carry-over" policy where the average rating of a studio will be carried over from last year's data if this studio didn't release games. 



### Sources

[Video Game Sales with Ratings](https://www.kaggle.com/rush4ratio/video-game-sales-with-ratings/kernels)



