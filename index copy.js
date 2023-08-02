const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []

app.get('/', (req, res) => {
  res.json('Welcome to my climate change news API')
})

app.get('/news', (req, res) => {
  axios
    .get('https://www.life.com/')
    .then((response) => {
      const html = response.data
      // console.log(html)
      const $ = cheerio.load(html)

      $('a:contains("k")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
          title,
          url,
        })
      })

      res.json(articles)
    })
    .catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT} `))
