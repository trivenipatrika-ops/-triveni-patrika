function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoEmbed({ url }: { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;

  return (
    <div className="relative w-full aspect-video my-6 bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="News Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
