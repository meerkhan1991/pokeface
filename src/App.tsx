/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhotoUploader } from './components/PhotoUploader';
import { LoadingState } from './components/LoadingState';
import { ResultsView } from './components/ResultsView';
import { HowItWorks } from './components/HowItWorks';
import { PrivacySection } from './components/PrivacySection';
import { Attribution } from './components/Attribution';
import { ErrorModal } from './components/ErrorModal';
import { TalkToUdForum } from './components/TalkToUdForum';
import { matchPokemon, fetchPokemonInfo, PokemonMatchResult, PokemonApiData } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'match' | 'talk-to-ud'>('match');
  const [hasOpenedForum, setHasOpenedForum] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<PokemonMatchResult | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonApiData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTabChange = (tab: 'match' | 'talk-to-ud') => {
    setActiveTab(tab);
    if (tab === 'talk-to-ud') {
      setHasOpenedForum(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMatching = async (imageDataUrl: string, mimeType: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentImage(imageDataUrl);
    setCurrentMimeType(mimeType);

    try {
      // Step 1: AI visual styling analysis via /api/match
      const match = await matchPokemon(imageDataUrl, mimeType);
      setMatchResult(match);

      // Step 2: Fetch verified Pokédex data & official artwork via /api/pokemon
      const pokeInfo = await fetchPokemonInfo(match.bestMatch.name);
      setPokemonData(pokeInfo);

      // Scroll to top to display results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Matching workflow error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred during analysis. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlternative = async (altPokemonName: string) => {
    if (!matchResult) return;
    setIsLoading(true);
    try {
      const altData = await fetchPokemonInfo(altPokemonName);
      setPokemonData(altData);

      // Update match result explanation and bestMatch to the alternative
      const clickedAlt = matchResult.alternativeMatches.find(
        (a) => a.name.toLowerCase() === altPokemonName.toLowerCase()
      );

      if (clickedAlt) {
        setMatchResult({
          ...matchResult,
          explanation: `Your styling also strongly connects with ${clickedAlt.displayName}'s aesthetic vibe and dominant tones!`,
          bestMatch: clickedAlt
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(`Could not load details for ${altPokemonName}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setMatchResult(null);
    setPokemonData(null);
    setErrorMessage(null);
    setIsLoading(false);
    setActiveTab('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 3-Zone Top Navigation with Talk to UD Tab */}
      <Header
        onReset={handleReset}
        showReset={Boolean(matchResult || currentImage)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main App Content */}
      <main className="flex-1 flex flex-col justify-start">
        {/* Talk to UD Forum Tab - preserved once mounted to prevent Disqus script unmount/remount tearing */}
        {hasOpenedForum && (
          <div className={activeTab === 'talk-to-ud' ? 'block' : 'hidden'}>
            <TalkToUdForum onBackToMatch={() => handleTabChange('match')} />
          </div>
        )}

        {/* Pokémon Matcher Tab */}
        <div className={activeTab === 'match' ? 'block' : 'hidden'}>
          {isLoading ? (
            <div className="my-auto py-12">
              <LoadingState />
            </div>
          ) : matchResult && pokemonData ? (
            <div className="py-8">
              <ResultsView
                matchResult={matchResult}
                pokemonData={pokemonData}
                userPhotoUrl={currentImage}
                onTryAgain={handleReset}
                onSelectAlternative={handleSelectAlternative}
              />
            </div>
          ) : (
            <div className="space-y-6 pb-12">
              <Hero />
              <PhotoUploader
                onStartMatching={handleStartMatching}
                isLoading={isLoading}
              />
              <HowItWorks />
              <PrivacySection />
            </div>
          )}
        </div>
      </main>

      {/* Attribution & Legal Notice */}
      <Attribution />

      {/* User-friendly Error Modal */}
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
        onRetry={
          currentImage
            ? () => handleStartMatching(currentImage, currentMimeType)
            : undefined
        }
      />
    </div>
  );
}
