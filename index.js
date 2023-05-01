

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import os from 'os'
import path from 'path'
import fs from 'fs'
import pdf from "pdf-creator-node";

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import cloudinary from './cloudinary.js';
import { createInvoice } from './pdf.js';

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
const port = process.env.port



app.get('/', async (req, res) => {
    try {
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
        const tmpDir = os.tmpdir();
        const tmpFile = `${tmpDir}/invoice.pdf`;
        let pdf = await createInvoice(invoice, tmpFile)
        pdf.on('finish', async function () {

            let { secure_url, public_id } = await cloudinary.uploader.upload(tmpFile, { resource_type: 'raw' })
            fs.unlink(tmpFile, (err) => {
                if (!err) {
                    if (fs.existsSync(tmpFile)) {
                        console.log('File exists');
                    } else {
                        console.log('File does not exist');
                    }
                } else {
                    console.log(err);
                }
            })
            return res.json({ message: "done", result: { secure_url, public_id } })
        });
    } catch (error) {
        return res.json({ message: "catch error", error })
    }
})


app.get('/pdf', async (req, res) => {
    // try {
    //     const invoice = {
    //         shipping: {
    //             name: 'John Doe',
    //             address: '1234 Main Street',
    //             city: 'San Francisco',
    //             state: 'CA',
    //             country: 'US',
    //             postal_code: 94111,
    //         },
    //         items: [
    //             {
    //                 item: 'TC 100',
    //                 description: 'Toner Cartridge',
    //                 quantity: 2,
    //                 amount: 6000,
    //             },
    //             {
    //                 item: 'USB_EXT',
    //                 description: 'USB Cable Extender',
    //                 quantity: 1,
    //                 amount: 2000,
    //             },
    //         ],
    //         subtotal: 8000,
    //         paid: 0,
    //         invoice_nr: 1234,
    //     };
    //     const tmpDir = os.tmpdir();
    //     const tmpFile = `${tmpDir}/invoice.pdf`;
    //     let pdf = await createInvoice(invoice, tmpFile)
    //     pdf.on('finish', async function () {
    //         let { secure_url, public_id } = await cloudinary.uploader.upload(tmpFile, { resource_type: 'raw' })
    //         fs.unlink(tmpFile, (err) => {
    //             if (!err) {
    //                 if (fs.existsSync(tmpFile)) {
    //                     console.log('File exists');
    //                 } else {
    //                     console.log('File does not exist');
    //                 }
    //             } else {
    //                 console.log(err);
    //             }
    //         })
    //         return res.json({ message: "done", result: { secure_url, public_id } })
    //     });
    // } catch (error) {
    //     return res.json({ message: "catch error", error })
    // }
    var html = fs.readFileSync(path.join(__dirname, "./template.html"), "utf8");
    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
    var users = [
        {
            name: "Shyam",
            age: "26",
        },
        {
            name: "Navjot",
            age: "26",
        },
        {
            name: "Vitthal",
            age: "26",
        },
    ];
    const bitmap = fs.readFileSync("./logo.png")
    const logo = bitmap.toString('base64');
    var document = {
        html: html,
        data: {
            users: users,
            logo: `data:image/png;base64,${logo}`
        },
        path: path.join(__dirname, "./uploade.pdf"),
        type: "",
    };
    await pdf.create(document, options)
    let { secure_url, public_id } = await cloudinary.uploader.upload(path.join(__dirname, "./uploade.pdf"), { resource_type: 'raw' })
    res.json({ message: "done", result: { secure_url, public_id } })

})

app.listen(port, () => console.log(`runing in port 3000`))
