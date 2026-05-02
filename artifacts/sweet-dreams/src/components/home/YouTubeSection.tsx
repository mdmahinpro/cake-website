import AnimatedSection from "../shared/AnimatedSection";
import { useStore } from "../../store/useStore";
import { FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

function extractChannelId(url: string): string | null {
  const match = url.match(/youtube\.com\/(?:channel\/|@)([\w-]+)/);
  return match ? match[1] : null;
}

export default function YouTubeSection() {
  const { state } = useStore();
  const { settings } = state;

  if (!settings.youtubeChannelUrl) return null;

  const channelId = extractChannelId(settings.youtubeChannelUrl);
  const embedUrl = channelId
    ? `https://www.youtube.com/embed?listType=user_uploads&list=${channelId}`
    : null;

  return (
    <section className="py-20 bg-choco-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaYoutube size={36} color="#ff0000" />
            <p className="section-subtitle">Watch Us Bake</p>
          </div>
          <h2 className="section-title">Our YouTube Channel</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <AnimatedSection delay={100}>
          {embedUrl ? (
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video">
              <iframe
                src={embedUrl}
                title="YouTube Channel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="card-dark p-10 rounded-3xl flex flex-col items-center gap-4">
              <FaYoutube size={64} color="#ff0000" />
              <p className="text-caramel-200 text-center font-poppins">
                Visit our YouTube channel for cake tutorials, behind-the-scenes and more!
              </p>
              <a
                href={settings.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2"
              >
                <FaExternalLinkAlt size={14} />
                Visit Channel
              </a>
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
