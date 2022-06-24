import { messages } from './messages'
import axios from 'axios'

async function main() {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        let endpoint = 'shipment'
        if (message.type === 'ORGANIZATION') {
            endpoint = 'organization'
        }

        try {
            await axios.post(`http://localhost:3000/${endpoint}`, message)
        } catch (error) {
            console.error(error.code)
        }
    }

    try {
        const res = await axios.get(`http://localhost:3000/shipments/S00001197`);
        console.log(JSON.stringify(res.data));
    } catch (error) {
        console.error(error.code)
    }

    try {
        const res = await axios.get(`http://localhost:3000/organizations/34f195b5-2aa1-4914-85ab-f8849f9b541a`);
        console.log(JSON.stringify(res.data));
    } catch (error) {
        console.error(error.code)
    }

    try {
        const res = await axios.get(`http://localhost:3000/shipments/aggregate-weight/POUNDS`);
        console.log(JSON.stringify(res.data));
    } catch (error) {
        console.error(error.code)
    }
}

main()