const port = 8000;
const express = require('express')
const axios = require('axios');
const cheerio =  require('cheerio');
const { response } = require('express');
const app = express();

const articles = [];

const newspapers = [{
    name: "The times",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
    img:''
},
{
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: 'https://www.telegraph.uk',
    img: ''
},
{
    name: "theguardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: '',
    img: ''
}
];


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
     .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url: newspapers.base + url,
                    source: newspapers.name
                 })
             })
         }).catch((err) => {
         console.log(err)
     })
})


app.get('/', (req, res) => {
    res.json("Welcome to Moses api");
})

app.get('/news', (req, res) => {
    res.json(articles)
})


app.get('/news/:newspaperId', async (req, res) => {
    const newsId = req.params.newspaperId;
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId);
    console.log(newspaper);
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})




