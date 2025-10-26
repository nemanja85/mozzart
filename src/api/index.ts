import type { MatchesProps, MatchesResponse } from "@/types";
import { ref } from 'vue';

const apiUrl = `http://172.235.235.11/api/matches?apikey=djoka`;
const username = `mitic.nemanja@hotmail.com`
const matches = ref<MatchesProps[]>([]);


export const matchesData = async (): Promise<MatchesResponse | null> => {
  //`${import.meta.env.VITE_APP_API_URL as string}/matches`)

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      username: username,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Došlo je do greške u komunikaciji sa serverom: ${response.status} - ${response.statusText}`);
  }

  const data: MatchesResponse = await response.json();

  matches.value = data.matches;

  return data;
};

