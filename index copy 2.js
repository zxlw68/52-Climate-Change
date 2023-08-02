const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
  {
    name: 'foodnetwork',
    address: 'https://www.foodnetwork.com/recipes/',
    base: 'https:',
  },
]

const app = express()

const articles = []

app.get('/', (req, res) => {
  res.json('Welcome to my climate change news API')
})

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a span:contains("a")', html).each(function () {
        const title = $(this).text()
        const url = $(this).parent().attr('href')
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/news', (req, res) => {
  res.json(articles)
})

// app.get('/news', (req, res) => {
//   axios
//     .get('https://www.foodnetwork.com/recipes/')
//     .then((response) => {
//       const html = response.data
//       // console.log(html)
//       const $ = cheerio.load(html)

//       $('a span:contains("a")', html).each(function () {
//         const title = $(this).text()
//         const url = $(this).parent().attr('href')
//         articles.push({
//           title,
//           url,
//         })
//       })

//       res.json(articles)
//     })
//     .catch((err) => console.log(err))
// })

app.get('/news/:newspaperId', async (req, res) => {
  // console.log(req.params.newspaperId)
  const newspaperId = req.params.newspaperId

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

      $('a span:contains("a")', html).each(function () {
        const title = $(this).text()
        const url = $(this).parent().attr('href')
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        })
      })

      res.json(specificArticles)
    })
    .catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT} `))
