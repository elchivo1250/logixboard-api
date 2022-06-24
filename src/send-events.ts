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
        const res = await axios.get(`http://localhost:3000/shipments/aggregate-weight/POUNDS`);
        console.log(res.data);
    } catch (error) {
        console.error(error.code)
    }
}

main()