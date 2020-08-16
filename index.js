import { getInput, setOutput, setFailed } from '@actions/core';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getPlaylists, getPlaylistItems } from './src/api';

async function workflow() {
    try {
        const channelId = getInput('channel-id');
        const playlistParts = getInput('playlist-parts');       // contentDetails, id, localizations, player, snippet, status
        const videoParts = getInput('video-parts');             // contentDetails, id, snippet, status
        const maxResults = getInput('max-results');             // 0 - 50, default: 5
        const outputPath = getInput('path');                    // output path

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
        setFailed(error.message);
    }
}

workflow();
