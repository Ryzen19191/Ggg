/**
 * Check if a user follows the required WhatsApp channel using the channel JID.
 */
async function checkUserFollow(sock, userJid, channelJid) {
    try {
        const metadata = await sock.groupMetadata(channelJid);
        const followers = metadata.participants.map(p => p.id);

        return followers.includes(userJid); // Returns true if the user follows, false otherwise
    } catch (error) {
        console.error("❌ Error checking channel follow status:", error);
        return false; // Assume not following if there's an error
    }
}

module.exports = { checkUserFollow };