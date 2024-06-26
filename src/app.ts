import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";
import { URL } from 'url';

const flowBienvenida = addKeyword('hola').addAnswer('¡Buenas! Bienvenido a CEGAS, Clínica & Endoscopias Gastrointestinales. ¿En qué puedo ayudarte hoy?');

const flowEndoscopiaAlta = addKeyword(['endoscopia alta', 'endoscopias altas']).addAnswer(
  'Las endoscopias digestivas altas son un procedimiento donde examinamos el esófago, estómago y el duodeno. ¿Tienes alguna duda específica sobre este procedimiento o te gustaría agendar una cita?'
);

const flowColonoscopia = addKeyword('colonoscopia').addAnswer(
  'La colonoscopia es un examen que nos permite ver el interior del colon y el recto. Es útil para detectar cambios o anormalidades. ¿Te gustaría más información o deseas agendar una cita?'
);

const flowRectosigmoidoscopia = addKeyword('rectosigmoidoscopia').addAnswer(
  'La rectosigmoidoscopia es un procedimiento para examinar el recto y la parte inferior del colon. ¿Te gustaría saber más sobre el procedimiento o deseas agendar una cita?'
);

const flowConsultaGeneral = addKeyword(['consulta general', 'gastro']).addAnswer(
  'Ofrecemos consultas generales de gastroenterología para evaluar y tratar problemas digestivos. ¿Tienes alguna pregunta específica o te gustaría agendar una consulta?'
);

const flowGastroPediatra = addKeyword(['gastro pediatra', 'pediatra']).addAnswer(
  'Nuestros gastroenterólogos pediátricos están aquí para cuidar de la salud digestiva de los más pequeños. ¿Te gustaría más información o deseas agendar una consulta para tu hijo?'
);

const flowUltrasonido = addKeyword('ultrasonidos').addAnswer(
  'Realizamos ultrasonidos para una evaluación detallada de diversos órganos abdominales. ¿Te gustaría más información o deseas agendar una cita?'
);

const flowNutricionistas = addKeyword(['nutricionista', 'nutricionistas']).addAnswer(
  'Nuestras consultas con nutricionistas están diseñadas para ayudarte a alcanzar tus metas de salud y bienestar. ¿Te gustaría saber más o agendar una consulta?'
);

// Flujo de fallback para preguntas no reconocidas
const flowFallback = addKeyword('*').addAnswer(
  'Lo siento, no tengo una respuesta para esa pregunta en este momento. Por favor, proporciona más detalles o contacta con nuestro equipo directamente al +1234567890. Estamos aquí para ayudarte.'
);

const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);
    provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
        const body = req.body;
        const number = body.number;
        const message = body.message;
        const mediaUrl = body.mediaUrl;

        try {
            let options = {};
            if (mediaUrl) {
                const url = new URL(mediaUrl);
                options = { media: url.href };
            }

            await bot.sendMessage(number, message, options);
            res.end('Mensaje enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            res.status(500).end('Error al enviar el mensaje');
        }
    }));

    await createBot({
        flow: createFlow([flowBienvenida, flowEndoscopiaAlta, flowColonoscopia, flowRectosigmoidoscopia, flowConsultaGeneral, flowGastroPediatra, flowUltrasonido, flowNutricionistas, flowFallback]),
        database: new MemoryDB(),
        provider
    });
};

main();
