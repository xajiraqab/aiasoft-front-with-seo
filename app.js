const path = require("path");
var express = require('express')
var app = express()
const fs = require('fs')
const axios = require('axios');

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
            title = seo.title || title
            description = seo.description || description
            og.title = seo.og.title || title
            og.description = seo.og.description || description
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

app.get('/problem/:id', (req, res) => {
    getSEO_fullProblem(res, req.url)
})

app.get('/problems/:page', (req, res) => {

    sendResponse(res, {
        title: `ამოცანები გვ. ${req.params.page}`,
        og: {
            title: `ამოცანები გვ. ${req.params.page}`,
        }
    })
})

app.use((req, res) => {
    sendResponse(res)
})


app.listen(process.env.PORT || 5000)