import { ReactElement, useContext } from "react";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { PlayerContext } from "../../context/PlayerContext";

import api from "../../services/api";

import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss";

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  durationAsString: string;
  duration: number;
  url: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps): ReactElement {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <Image src="/arrow-left.svg" width={20} height={20} alt="Voltar" />
          </button>
        </Link>

        <Image
          src={episode.thumbnail}
          width={700}
          height={160}
          alt={episode.title}
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <Image src="/play.svg" width={50} height={50} alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    description: data.description,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "dd MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24, // 24hours
  };
};
