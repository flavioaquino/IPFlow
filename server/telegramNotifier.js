const axios = require('axios');

// Substitua pelo token do seu bot do Telegram
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;

// Função para enviar uma mensagem via Telegram
function sendTelegramMessage(chatId, message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`;
    return axios.post(url, {
        chat_id: chatId,
        text: message
    })
    .then(response => {
        if (response.data.ok) {
            console.log('Mensagem enviada com sucesso para o Telegram');
        } else {
            console.error('Erro ao enviar mensagem para o Telegram:', response.data);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar mensagem para o Telegram:', error.message);
    });
}

module.exports = sendTelegramMessage;
