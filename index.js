const core = require('@actions/core');
const mkdir = require('fs').promises.writeFile;
const writeFile = require('fs').promises.writeFile;
const join = require('path').join;
const getPlaylists = require('./src/api').getPlaylists;
const getPlaylistItems = require('./src/api').getPlaylistItems;

async function workflow() {
    try {
        const channelId = core.getInput('channel-id');
        const playlistParts = core.getInput('playlist-parts');       // contentDetails, id, localizations, player, snippet, status
        const videoParts = core.getInput('video-parts');             // contentDetails, id, snippet, status
        const maxResults = core.getInput('max-results');             // 0 - 50, default: 5
        const outputPath = core.getInput('path');                    // output path

        await mkdir(outputPath, { recursive: true });
    
        const playlists = await getPlaylists(channelId, playlistParts, maxResults);

        if (playlists && playlists.items.length > 0) {
            // save playlist to file
            writeFile(join(outputPath, 'playlists.json'), playlists)
                .then(console.log(`Playlists index file has been updated!`))
                .catch(error => console.error(error));

            playlists.items.forEach(async (playlist) => {
                const items = await getPlaylistItems(playlist.id, videoParts, maxResults);
                
                // save playlist items to file
                if (items) {
                    writeFile(join(outputPath, `${playlist.id}.json`), items)
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
