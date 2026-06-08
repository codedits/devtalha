const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i;

export function getMediaType(url: string): "image" | "video" {
  return VIDEO_EXTENSIONS.test(url.trim()) ? "video" : "image";
}

export function isVideoUrl(url: string): boolean {
  return getMediaType(url) === "video";
}
