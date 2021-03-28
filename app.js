const path = require("path");
var express = require('express')
var app = express()
const fs = require('fs')
const http = require('http')
const axios = require('axios');
const UrlPattern = require('url-pattern')

const sendResponse = (res, seo = null) => {
    fs.readFile(path.join(__dirname, 'public', 'app.html'), 'utf8', (err, data) => {

        if (err) {
            res.status(404).send('შეცდომა :3');
            return
        }


        let title = "AiaSoft"
        let description = "პროგრამირების გაკვეთილებისა და ამოცანების ვებ-გვერდი"

        let og = {
            title: title,
            description: description
        }

        if (seo) {
            title = seo.title
            description = seo.description
            og.title = seo.og.title
            og.description = seo.og.description
        }

        res.send(data.replace('%TITLE', title).replace('%DESCRIPTION', description).replace('%OG:TITLE', og.title).replace('%OG:DESCRIPTION', og.description))
    })
}

async function getSEO_fullProblem(res, url) {

    try {

        const response = await axios.get(`http://aiasoft.ge:5000${url}`)

        if (response.status !== 200) {
            sendResponse(res)
            return
        }

        let data = response.data
        
        sendResponse(res, {
            title: data.id + '. ' + data.title,
            description: data.statement,
            og: {
                title: data.id + '. ' + data.title,
                description: data.statement
            }
         })


    } catch (error) {
        sendResponse(res)

    }
}

app.use(express.static('public'))
app.use((req, res) => {

    let url = req.url

    let isFullProblem = new UrlPattern('/problem/:id').match(url)

    if (isFullProblem) {
        getSEO_fullProblem(res, url)
        return
    }

    sendResponse(res)

})

app.listen(5000)