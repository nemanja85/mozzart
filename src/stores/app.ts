import { matchesData } from '@/api';
import type { MatchesProps } from '@/types';
import { defineStore } from 'pinia';

function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
function isError(err: unknown): err is Error {
  return err instanceof Error;
}

export type SortBy = 'time' | 'alphabetical' | 'default';
type SortComparator = (a: MatchesProps, b: MatchesProps) => number;

type MatchesStateProps = {
  allMatches: MatchesProps[];
  favoriteMatch: string[];
  searchTerm: string;
  selectedLeague: string;
  sortBy: SortBy;
  isLoading: boolean;
  error: string | null;
}

const sortComparators: Record<string, SortComparator> = {
  default: () => 0,

  time: (a, b) => {
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  },

  alphabetical: (a, b) => {
    return a.homeTeam.localeCompare(b.homeTeam);
  },
};

export const useMatchesStore = defineStore('matches', {
  state: (): MatchesStateProps => ({
    allMatches: [],
    favoriteMatch: [],
    searchTerm: '',
    selectedLeague: 'all',
    sortBy: 'default',
    isLoading: true,
    error: null,
  }),

  actions: {
    setMatches(newMatches: MatchesProps[]) {
      this.allMatches = newMatches;
    },

    setSelectedLeague(league: string) {
      this.selectedLeague = league;
    },
    setSearchTerm(term: string) {
      this.searchTerm = term.toLowerCase();
    },

    setSortBy(sort: SortBy) {
      this.sortBy = sort;
    },
    setFavoriteMatch(matchId: string) {
      const index = this.favoriteMatch.indexOf(matchId);
      if (index > -1) {
        this.favoriteMatch.splice(index, 1);
      } else {
        this.favoriteMatch.push(matchId);
      }
    },

    async getLatestData(): Promise<MatchesProps[]> {
      const MAX_RETRIES = 3;

      if (!this.allMatches.length) {
        this.isLoading = true;
      }
      this.error = null;


      const fetchDataWithRetry = async (attempt: number = 1): Promise<MatchesProps[]> => {
        try {
          const data = await matchesData();
          const newMatches: MatchesProps[] = data?.matches || [];
          this.error = null;
          this.isLoading = false;
          return newMatches;

        } catch (err) {
          console.warn(`Preuzimanja podataka nakon #${attempt} nije uspeo.`);

          if (attempt < MAX_RETRIES) {

            const delayTime = Math.pow(2, attempt - 1) * 1000;
            await delay(delayTime);

            return fetchDataWithRetry(attempt + 1);

          } else {

            const errorMessage = isError(err)
              ? err.message
              : 'Preuzimanje podataka nije uspelo nakon maksimalnog broja pokušaja (3)!';

            this.error = errorMessage;
            this.isLoading = false;
            return [];
          }
        }
      };

      return fetchDataWithRetry();
    }
  },

  getters: {
    filteredMatches: (state) => {
      let result = state.allMatches;

      if (state.selectedLeague !== 'all') {
        result = result.filter(match => match.league === state.selectedLeague);
      }

      if (state.searchTerm) {
        result = result.filter(match =>
          match.homeTeam.toLowerCase().includes(state.searchTerm) ||
          match.awayTeam.toLowerCase().includes(state.searchTerm)
        );
      }

      // Put favorite matches on top
      result.sort((a, b) => {
        const aIsFavorite = state.favoriteMatch.includes(a.id) ? 1 : 0;
        const bIsFavorite = state.favoriteMatch.includes(b.id) ? 1 : 0;

        if (aIsFavorite !== bIsFavorite) {
          return bIsFavorite - aIsFavorite;
        }

        const sortKey = state.sortBy;
        const comparator = (sortComparators[sortKey] || sortComparators.default)!;
        return comparator(a, b);
      });

      return result;
    },

    availableLeagues: (state) => {
      const leagues = new Set(state.allMatches.map(match => match.league));
      return ['all', ...Array.from(leagues)].filter(leagues => leagues);
    }
  }
});
