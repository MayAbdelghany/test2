

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import path from 'path'
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
    let pdf = await createInvoice(invoice, path.join(__dirname, `invoice.pdf`))
    pdf.on('finish', function () {
        // Upload the PDF to Cloudinary
        cloudinary.uploader.upload(path.join(__dirname, `invoice.pdf`), { resource_type: 'raw' }, function (error, result) {
            if (error) {
                return res.json({ message: "error" })

            } else {
                return res.json({ message: "done", result })

            }
        });

    });



})

app.listen(port, () => console.log(`runing in port 3000`))
