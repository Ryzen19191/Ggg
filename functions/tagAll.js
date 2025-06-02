async function tagAllMembers(conn, chat, sender, m) {
    try {
        // Fetch group metadata
        const groupMetadata = await conn.groupMetadata(chat);
        const participants = groupMetadata.participants.map(p => p.id);
        
        if (participants.length === 0) {
            return conn.sendMessage(chat, { text: "⚠️ *No members found to tag!*" }, { quoted: m });
        }

        // Extract custom message (if provided)
        const messageText = m.message.conversation?.split(" ").slice(1).join(" ") || "Hello everyone!"; 

        // WhatsApp read-more trick (Minimal space)
        const readMore = "\n\n" + String.fromCharCode(8206).repeat(1500) + "\n\n";

        // Create mention message (hidden behind readmore)
        let message = `👥 *Tagging all members:*\n${messageText}${readMore}\n`;
        let mentions = [];

        participants.forEach((participant) => {
            const formattedNumber = `@${participant.replace('@s.whatsapp.net', '')}`;
            message += `${formattedNumber}\n`;
            mentions.push({ mentionedJid: participant });
        });

        // Add footer with channel promotion
        message += "\n🔥🚀💬\n*Created By Kashmiri Bot*\n*Follow My Channel*: https://whatsapp.com/channel/0029VaieFO2HFxOtUtwLvQ0b";

        // Send message with mentions
        conn.sendMessage(chat, { text: message, mentions }, { quoted: m });

    } catch (error) {
        console.error("❌ Error in .tagall command:", error);
        conn.sendMessage(chat, { text: "⚠️ *Failed to tag members!*" }, { quoted: m });
    }
}

// Export function
module.exports = tagAllMembers;