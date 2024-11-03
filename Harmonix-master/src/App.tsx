"use client";
import { useState } from "react";
import { GenreSelector } from "./components/GenreSelector";
import { Textarea } from "./components/ui/textarea";
import { VoiceSelector } from "./components/VoiceSelector";
import { GenreType, VoiceType } from "./types/types";
import { Button } from "./components/ui/button";
import { generateLyrics, getSong, getSongId } from "./services/services";
import { useToast } from "./hooks/use-toast";
import { ClimbingBoxLoader } from "react-spinners";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  const [voiceType, setVoiceType] = useState<VoiceType>("male");
  const [genre, setGenre] = useState<GenreType>("pop");
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const { toast } = useToast();

  const handleGenerateSong = async () => {
    if (prompt.length <= 50) {
      toast({
        title: "Invalid Input",
        description: "Enter at least 50 characters.",
      });
      return;
    }
    let intervalId: NodeJS.Timeout;
    try {
      setIsLoading(true);
      const response = await getSongId({ prompt, voiceType, genre });
      console.log(response.jobId);
      intervalId = setInterval(async () => {
        const res = await getSong(response.jobId);
        if (res.status === "completed") {
          setAudioUrl(res.transformedAudioUrl);
          clearInterval(intervalId);
          setIsLoading(false);
        }
      }, 8 * 1000);
    } catch (error) {
      console.error("Error to get song (id): ", error);
    }
  };

  const handleGenerateLyrics = async () => {
    const lyrics = await generateLyrics(prompt);
    setPrompt(lyrics);
  };

  return (
    <main className="h-screen flex flex-col items-center p-10 gap-20">
      {isLoading && (
        <>
          <div className="top-0 left-0 h-screen w-screen z-10 fixed backdrop-blur-lg opacity-75 " />
          <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-20">
            <ClimbingBoxLoader color="#6d28d9" size={30} />
          </div>
        </>
      )}
      <div className="flex items-center w-full justify-center -ml-7">
        <img src="/favicon.png" alt="logo" className="w-20" />
        <h1 className="text-5xl">Harmonix</h1>
      </div>
      <section className="w-[1024px] flex flex-col p-5 gap-10 ring ring-purple-600 rounded">
        <div className="flex flex-col gap-3">
          <h1>Enter Prompt</h1>
          <Textarea
            disabled={isLoading}
            placeholder="Leave lyrics to us or enter your own lyrics"
            value={prompt}
            onChange={(e) => setPrompt(e.currentTarget.value.trimStart())}
          />
        </div>
        <section className="flex gap-20 w-full">
          <div className="flex gap-3 items-center">
            <h1>Choose voice</h1>
            <VoiceSelector voiceType={voiceType} setVoiceType={setVoiceType} />
          </div>
          <div className="flex gap-3 items-center">
            <h1>Select Genre</h1>
            <GenreSelector genre={genre} setGenre={setGenre} />
          </div>
          <div className="ml-auto flex gap-10">
            <Button
              disabled={isLoading}
              variant={"default"}
              onClick={handleGenerateLyrics}
            >
              Generate Lyrics
            </Button>
            <Button
              disabled={isLoading}
              variant={"default"}
              onClick={handleGenerateSong}
            >
              Generate Song
            </Button>
          </div>
        </section>
      </section>
      {audioUrl && (
        <AudioPlayer
          waveColor="#3a1673"
          progressColor="#6d28d9"
          audioUrl={audioUrl}
        />
      )}
    </main>
  );
}

export default App;
