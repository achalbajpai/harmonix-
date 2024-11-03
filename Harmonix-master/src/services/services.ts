import {
  classicalSongParameters,
  edmSongParameters,
  femaleVoiceParameters,
  maleVoiceParameters,
  popSongParameters,
  urbanSongParameters,
} from "@/lib/constants";
import { breakString } from "@/lib/utils";
import { GenreType, VoiceType } from "@/types/types";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_BEARER_KEY}`,
};

const url = "https://api.voicemod.net/v2/cloud/ttsing";

const data = {
  artistName: "Jerry",
  backgroundImageRemotePath:
    "themes/Levitate/images/Song-Levitate-VideoImageBackground03.png",
  backgroundSounds: false,
  dspEffect: "",
  language: "en",
  singerImageRemotePath: "singers/Singer-Jerry-VideoImageBackground.png",
  songName: "Levitate",
};

export const getSongId = async ({
  prompt,
  voiceType,
  genre,
}: {
  prompt: string;
  voiceType: VoiceType;
  genre: GenreType;
}) => {
  const input = breakString(prompt, 6);
  let payload = { ...data, lyrics: input };
  switch (voiceType) {
    case "male":
      payload = { ...payload, ...maleVoiceParameters };
      break;
    case "female":
      payload = { ...payload, ...femaleVoiceParameters };
      break;
  }

  switch (genre) {
    case "pop":
      payload = { ...payload, ...popSongParameters };
      break;
    case "edm":
      payload = { ...payload, ...edmSongParameters };
      break;
    case "classical":
      payload = { ...payload, ...classicalSongParameters };
      break;
    case "urban":
      payload = { ...payload, ...urbanSongParameters };
      break;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  return json;
};

export const getSong = async (jobId: string) => {
  const getUrl = `${url}/${jobId}`;
  const response = await fetch(getUrl, {
    method: "GET",
    headers: headers,
  });

  const json = await response.json();

  return json;
};

export const generateLyrics = async (prompt: string) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a music lyrics writer and your task is to write lyrics under 30 words base on user's prompt. Just return the lyrics and nothing else",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    },
  );

  if (response.ok) {
    const data = await response.json();
    return data.choices[0].message?.content;
  } else {
    console.error(await response.json());
  }
};
