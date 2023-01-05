import qr from 'qr-image';

class Upload {

    public generateImage = (base64: string, cb = () => {}) => {
        let qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
        qr_svg.pipe(require('fs').createWriteStream('./storage/whatsapp/qr-code.svg'));
        console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
        console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
        cb()
    }
}

const upload = new Upload()

export default upload