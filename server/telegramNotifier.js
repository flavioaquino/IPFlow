require('dotenv').config();

// Substitua pelo token do seu bot do Telegram
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;

// Função para enviar uma mensagem via Telegram
function sendTelegramMessage(chatId, message) {
    // Verificar se o token está definido
    if (!TELEGRAM_API_TOKEN) {
        console.error('Token do Telegram não definido');
        return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`;

    // Configuração da solicitação
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    };

    return fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Resposta da API do Telegram:', data);
            if (data.ok) {
                console.log('Mensagem enviada com sucesso para o Telegram');
            } else {
                console.error('Erro ao enviar mensagem para o Telegram:', data.description);
            }
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem para o Telegram:', error.message);
        });
}

module.exports = sendTelegramMessage;
