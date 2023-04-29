

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import pdf from "pdf-creator-node";
import fs from "fs";
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import cloudinary from './cloudinary.js';
import sendEmail from './cloudinary.js';
import { createInvoice } from './pdf.js';

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
const port = process.env.port


app.get('/', async (req, res) => {

    // let newPath = path.join(__dirname, './template.html')

    // var html = fs.readFileSync(newPath, "utf8");
    // let newPath2 = path.join(__dirname, './logo.png')
    // const bitmap = fs.readFileSync(newPath2)
    // const logo = bitmap.toString('base64');
    // var options = {
    //     format: "A3",
    //     orientation: "portrait",
    //     border: "10mm",
    //     header: {
    //         height: "45mm",
    //         contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    //     },
    //     footer: {
    //         height: "28mm",
    //         contents: {
    //             first: 'Cover page',
    //             2: 'Second page', // Any page number is working. 1-based index
    //             default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    //             last: 'Last Page'
    //         }
    //     }
    // };
    // var users = [
    //     {
    //         name: "Shyam",
    //         age: "26",

    //     },
    //     {
    //         name: "Navjot",
    //         age: "26",

    //     },
    //     {
    //         name: "Vitthal",
    //         age: "26",

    //     },
    // ];
    // let newPath3 = path.join(__dirname, './output.pdf')
    // var document = {
    //     html: html,
    //     data: {
    //         users: users,
    //         logo: logo
    //     },
    //     path: newPath3,
    //     type: "",
    // };
    // await pdf
    //     .create(document, options)

    // let newPath3 = path.join(__dirname, './output.pdf')
    // const { secure_url, public_id } = await cloudinary.uploader.upload(newPath3)


    // res.json({ message: "done", "details": { secure_url, public_id } })
    const invoice = {
        shipping: {
            name: 'John Doe',
            address: '1234 Main Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            postal_code: 94111,
        },
        items: [
            {
                item: 'TC 100',
                description: 'Toner Cartridge',
                quantity: 2,
                amount: 6000,
            },
            {
                item: 'USB_EXT',
                description: 'USB Cable Extender',
                quantity: 1,
                amount: 2000,
            },
        ],
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234,
    };


    createInvoice(invoice, path.join(__dirname, `invoice.pdf`));
    // setTimeout(async () => {
    //     const { secure_url, public_id } = await cloudinary.uploader.upload(path.join(__dirname, `invoice.pdf`))
    //     console.log({ secure_url, public_id });
    // }, 2000);
    res.status(200).json({ message: "done" })



})

app.listen(port, () => console.log(`runing in port 3000`))
    