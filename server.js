const express = require('express');
const app = express();
const fs = require('fs');
const getStat = require('util').promisify(fs.stat)

app.use(express.static('public'));

// 10 * 1024 * 1024 // 10MB
// buffer minúsculo! O padrão é 64k
const highWaterMark =  2;

app.get('/audio', async (req, res) => {
    const filePath = './audio.mp3';
    
    const stat = await getStat(filePath);
    console.log(stat)

    res.writeHead(200, {
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size
    });

    const stream = fs.createReadStream(filePath, { highWaterMark });

    // só exibe quando terminar de enviar tudo
    stream.on('end', () => console.log('acabou'));

    // faz streaming do audio 
    stream.pipe(res);
});

app.listen(3000, () => console.log('App na porta 3000'));