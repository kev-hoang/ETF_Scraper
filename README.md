# ETF_Scraper

## Synopsis

This project uses the MEAN stack to create a web scraper for ETF's and then displays the holdings data using D3.js. Some unique features include all the transmigrated docs from SPDR, a way to add funds to your favorites, and also providing you with a log of the funds you have researched.

## Installation

1. You must install node.js. You can follow the steps via this link https://github.com/nodejs/node
2. You will also need MongoDB. The installation steps can be found here. https://github.com/mongodb/mongo
3. Please feel free to fork/clone/zip this repo to get all the necessary files.
4. In your terminal/command line, you will need to run, '
5. In your terminal/command line, run 'gulp'
6. Lastly, run 'npm start'

## Issues

1. The double-search, typealong through double-scrapping of the all the funds turned out to be extremely intensive. It works best when the the navbar search has loaded before switching to the search page. However, since the search is a replacement of home, it is the first thing you land on if you're session persists. I will be implementing the angular services to solve this at a later time.
2. The tooltips of the pie charts are not displaying. My css/svg may have been miscalculated. They are there and working correctly.
3. There is a slight angular problem where the app gets buggy on reboot of the app. I have a feeling it is the way browserify works and the order or missing semi-colons that are tripping it up sometimes.

##Future Implementations

0.5 I need to go through my code and make it DRY and document a lot better.
1. I want to make the country breakdown into a D3.js world heat map. It's easy to use a third party to accomplish this, but I'd like to try on my own.
2. Implement services to handle data across states.
3. Make it so that you can delete a single favorited fund. Easy implementation, but would like to handle the services first to see where the data falls.
4. Scrap more information on a single fund and produce a better layout that is tabbed similar to SPDR's. I would like to make it vertical though.
5. A search page that will populate all the funds and category pages.
6. Make all tables sortable.
7. Animate the pie charts more so they pop out the slice you highlight based on the legend or vice versa.
8. Make the design more responsive.

## License

All data on this website belongs to SPDR.
