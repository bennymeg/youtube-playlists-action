const core = require('@actions/core');
const writeFile = require('fs').promises.writeFile;
const join = require('path').join;
const getPlaylists = require('./src/api').getPlaylists;
const getPlaylistItems = require('./src/api').getPlaylistItems;

async function workflow() {
    try {
        const channelId = core.getInput('channel-id');
        const key = core.getInput('apiKey');
        const playlistParts = core.getInput('playlist-parts');       // contentDetails, id, localizations, player, snippet, status
        const videoParts = core.getInput('video-parts');             // contentDetails, id, snippet, status
        const maxResults = core.getInput('max-results');             // 0 - 50, default: 5

        const playlists = await getPlaylists(channelId, key, playlistParts, maxResults);

        if (playlists && playlists.data.items.length > 0) {
            // save playlist to file
            writeFile(join('docs', 'toc.json'), JSON.stringify(playlists.data))
                .then(console.log(`Playlists index file has been updated!`))
                .catch(error => console.error(error));

            playlists.data.items.forEach(async (playlist) => {
                const items = await getPlaylistItems(playlist.id, key, videoParts, maxResults);
                
                // save playlist items to file
                if (items) {
                    writeFile(join('docs', `${playlist.id}.json`), JSON.stringify(items.data))
                        .then(console.log(`${playlist.id} playlist file has been updated!`))
                        .catch(error => console.error(error));
                }
            });
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

workflow();
