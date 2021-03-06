# Youtube playlists action

This action fetch's all youtube channel playlists with their corresponding video's data into the `docs` directory.

## Inputs

### `channel-id`

**Required** Youtube channel id.

### `api-key`

**Required** Youtube V3 API key.

### `playlist-parts`

**Optional** Youtube channel playlists parts to retrive. Default=all.

### `video-parts`

**Optional** Youtube channel playlist items parts to retrive. Default=all.

### `max-results`

**Optional** Query max results. Default=20.

### `output-directory`

**Optional** Resources output directory. Default='docs'.

## Example usage

```
uses: actions/youtube-playlists-action
with:
  channel-id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
```