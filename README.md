# thayto.com

My personal website and blog

## Leaving the images in tiny size (with ffmpeg)

```sh
ffmpeg -i <FILENAME>.<EXTENSION> -vf scale=20:-1 <FILENAME>-small.<EXTENSION>
```
