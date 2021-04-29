import { createContext, useCallback, useState } from "react";

type RenderProps = {
  children: JSX.Element[] | JSX.Element;
};

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevius: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

export default function PlayerProvider({ children }: RenderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = useCallback(
    (episode: Episode) => {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    },
    [episodeList, currentEpisodeIndex, isPlaying]
  );

  const playList = useCallback(
    (list: Episode[], index: number) => {
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
    },
    [episodeList, currentEpisodeIndex, isPlaying]
  );

  const togglePlay = useCallback(() => setIsPlaying(!isPlaying), [isPlaying]);

  const toggleLoop = useCallback(() => setIsLooping(!isLooping), [isLooping]);

  const toggleShuffle = useCallback(() => setIsShuffling(!isShuffling), []);

  const setPlayingState = useCallback((state: boolean) => setIsPlaying(state), [
    isPlaying,
  ]);

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  const playNext = useCallback(() => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [currentEpisodeIndex]);

  const playPrevius = useCallback(() => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }, [currentEpisodeIndex]);

  const clearPlayerState = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }, [episodeList, currentEpisodeIndex]);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevius,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
