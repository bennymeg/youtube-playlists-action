const env = require('dotenv').config();
const core = require('@actions/core');
const readFile = require('fs').promises.readFile;
const writeFile = require('fs').promises.writeFile;
const removeFile = require('fs').promises.rm;
const join = require('path').join;
const getPlaylists = require('./src/api').getPlaylists;
const getPlaylistItems = require('./src/api').getPlaylistItems;

async function workflow() {
    try {
        const channelId = getInput('channel-id');
        const key = getInput('api-key');
        const playlistParts = getInput('playlist-parts');       // contentDetails, id, localizations, player, snippet, status
        const videoParts = getInput('video-parts');             // contentDetails, id, snippet, status
        const maxResults = getInput('max-results');             // 0 - 50, default: 5
        const outpurDir = getInput('output-directory');         // default: 'docs'

        const currentPlaylists = await getPlaylists(channelId, key, playlistParts, maxResults);
        let previousPlaylistsData;

        if (currentPlaylists && currentPlaylists.data.items.length > 0) {
            // read previous playlists toc
            await readFile(join(outpurDir, 'toc.json'))
                .then(toc => prevPlaylists = toc)
                .catch(error => console.error(error));

            if (currentPlaylists.data !== previousPlaylistsData) {
                // update playlists toc to file
                await writeFile(join(outpurDir, 'toc.json'), JSON.stringify(currentPlaylists.data))
                    .then(console.log(`Playlists table of contents file has been ${previousPlaylistsData ? 'updated' : 'added'}!`))
                    .catch(error => console.error(error));

                const previousPlaylistsIds = previousPlaylistsData.items.map(playlist => playlist.id);
                const currentPlaylistsIds = currentPlaylists.data.items.map(playlist => playlist.id);

                const addedPlaylistsIds = currentPlaylistsIds.filter(id => previousPlaylistsIds.includes(id));
                const updatedPlaylistsIds = PlaylistsIds.filter(id => currentPlaylistsIds.includes(id));
                const removedPlaylistsIds = previousPlaylistsIds.filter(id => currentPlaylistsIds.includes(id));

                addedPlaylistsIds.forEach(async (id) => {
                    const items = await getPlaylistItems(id, key, videoParts, maxResults);
                    
                    // save playlist items to file
                    if (items) {
                        writeFile(join(outpurDir, `${id}.json`), JSON.stringify(items.data))
                            .then(console.log(`${id} playlist file has been added!`))
                            .catch(error => console.error(error));
                    }
                });

                updatedPlaylistsIds.forEach(async (id) => {
                    const items = await getPlaylistItems(id, key, videoParts, maxResults);
                    
                    // update playlist items file
                    if (items) {
                        writeFile(join(outpurDir, `${id}.json`), JSON.stringify(items.data))
                            .then(console.log(`${id} playlist file has been updated!`))
                            .catch(error => console.error(error));
                    }
                });

                removedPlaylistsIds.forEach(async (id) => {
                    // remove playlist items file
                    if (items) {
                        removeFile(join(outpurDir, `${id}.json`))
                            .then(console.log(`${id} playlist file has been removed!`))
                            .catch(error => console.error(error));
                    }
                });
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

function getInput(fieldName) {
    let result;
    let envFieldName = fieldName.replace('-', '_').toUpperCase();

    if (process.env[envFieldName]) {
        result = process.env[envFieldName];
    } else {
        result = core.getInput(fieldName);
    }

    return result;
}

workflow();
