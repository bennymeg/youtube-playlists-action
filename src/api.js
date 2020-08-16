const { google } = require('googleapis');
const service = google.youtube('v3');
const playlistParts = "contentDetails, id, localizations, player, snippet, status";
const playlistItemParts = "contentDetails, id, snippet, status";

/**
 * Gets a specific youtube channel playlists list.
 *
 * @param {string} channelId youtube channel id.
 * @param {string} parts playlists parts to retrive. Default=all.
 * @param {string} maxResults max number of playlists to retrive [0:50]. Default=20.
 * @returns {playlistListResponse} channel playlists list
 */
async function getPlaylists(channelId, parts=playlistParts, maxResults=20) {
    let playlists;

    try {
        playlists = await service.playlists.list({ channelId, part: parts, maxResults });
    } catch (error) {
        console.log('The API returned an error: ' + error);
    }

    return playlists;
}

/**
 * Gets a specific youtube channel playlist items.
 *
 * @param {string} playlistId youtube playlist id.
 * @param {string} parts playlists parts to retrive. Default=all.
 * @param {string} maxResults max number of playlists to retrive [0:50]. Default=20.
 * @returns {playlistItemListResponse} playlist items list
 */
async function getPlaylistItems(playlistId, parts=playlistItemParts, maxResults=20) {
    let playlistItems;

    try {
        playlistItems = await service.playlistItems.list({ playlistId, part: parts, maxResults });
    } catch (error) {
        console.log('The API returned an error: ' + error);
    }

    return playlistItems;
}

module.exports = { getPlaylists, getPlaylistItems };
