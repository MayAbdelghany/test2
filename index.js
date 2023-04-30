

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import os from 'os'
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
            postal_code: 200,
        },
        items: [
            {
                item: 'TC 100',
                description: 'Toner Cartridge',
                quantity: 2,
                amount: 300,
            },
            {
                item: 'USB_EXT',
                description: 'USB Cable Extender',
                quantity: 1,
                amount: 400,
            },
        ],
        subtotal: 9000,
        paid: 0,
        invoice_nr: 12546,
    };
    const tmpDir = os.tmpdir();
    const tmpFile = `${tmpDir}/invoice.pdf`;
    let pdf = await createInvoice(invoice, tmpFile)
    if (pdf) {
        pdf.on('finish', function () {
            // Upload the PDF to Cloudinary
            cloudinary.uploader.upload(tmpFile, { resource_type: 'raw' }, function (error, result) {
                if (error) {
                    return res.json({ message: "error" })

                } else {
                    return res.json({ message: "done", result })

                }
            });

        });
    }



})

app.listen(port, () => console.log(`runing in port 3000`))
