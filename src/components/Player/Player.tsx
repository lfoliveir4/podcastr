import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import { PlayerContext } from "../../context/PlayerContext";

import { PlayerProps } from "./props";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./styles.module.scss";

export default function Player({}: PlayerProps): ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevius,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState,
  } = useContext(PlayerContext);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener = useCallback(() => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }, [progress, audioRef]);

  const handleSeek = useCallback(
    (amount: number) => {
      audioRef.current.currentTime = amount;
      setProgress(amount);
    },
    [progress]
  );

  const handleEpisodeEnded = useCallback(() => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }, []);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src="/playing.svg" width={40} height={40} alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
            disabled={!episode || episodeList.length === 1}
          >
            <Image src="/shuffle.svg" width={30} height={30} alt="Embaralhar" />
          </button>

          <button
            type="button"
            onClick={playPrevius}
            disabled={!episode || !hasPrevious}
          >
            <Image
              src="/play-previous.svg"
              width={30}
              height={30}
              alt="Tocar anterior"
            />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Image src="/pause.svg" width={25} height={25} alt="Pausar" />
            ) : (
              <Image src="/play.svg" width={40} height={40} alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <Image
              src="/play-next.svg"
              width={30}
              height={30}
              alt="Tocar proxima"
            />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <Image src="/repeat.svg" width={30} height={30} alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
