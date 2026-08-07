# callen.page
This is my website which has links to all my things such as projects, minecraft server, and social medias.
projects site coming soon?


but why are u looking at my websites README? The site is right [here](https://callen.page)

# fonts
milker.regular.otf - bold, heavy font 
Allura-Regular.ttf - fancy, elegant font


# Below are notes for my other services --- you can just ignore them, these are for me

# COmni AI notes

run it
```
cd ~/comniai-webui
docker build -t comni-ai-webui .
docker stop open-webui
docker rm open-webui
```
```
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e WEBUI_NAME="COmni AI" \
  comni-ai-webui
  ```

## new verion:

Example:

FROM ghcr.io/open-webui/open-webui:v0.11.1

(or whatever version you want)

2. Rebuild your branded image
cd ~/comniai-webui
docker build -t comni-ai-webui .
3. Replace the container
docker stop open-webui
docker rm open-webui
4. Start it again
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e WEBUI_NAME="COmni AI" \
  comni-ai-webui
