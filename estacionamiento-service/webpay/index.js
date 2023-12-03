const WebpayPlus = require("transbank-sdk").WebpayPlus;

WebpayPlus.configureForTesting();

async function crearTransaccionWebpay(urlRetorno, monto) {
    let buyOrder = `O-${Math.floor(Math.random() * 10000) + 1}`;
    let sessionId = `S-${Math.floor(Math.random() * 10000) + 1}`;

    const webpayTransactionResponse = await (new WebpayPlus.Transaction()).create(
        buyOrder,
        sessionId,
        monto,
        urlRetorno
    );
    
    return {
        buyOrder,
        urlWebpay: webpayTransactionResponse.url,
        token: webpayTransactionResponse.token
    }
}

async function confirmarTransaccion(token) {
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token);
    return commitResponse
}

module.exports = {
    crearTransaccionWebpay,
    confirmarTransaccion
}