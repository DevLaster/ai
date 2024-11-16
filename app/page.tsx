'use client';

import React, { useState, useCallback } from 'react';

const AIComponent: React.FC = () => {
  const [circleSize, setCircleSize] = useState(100);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getResponse = (query: string) => {
    if (query.toLowerCase().includes('سلام') || query.toLowerCase().includes('هی')) {
      return 'سلام , عشقم چطوری خوبی؟ روزت چطور بود عشقم';
    } else if (query.toLowerCase().includes('چطوری')) {
      return 'روز من خیلی خوب بوده، ممنون که پرسیدی!';
    } else {
      return 'ببخشید عشقم متوجه حرفت نشدم میشه دوباره بگی فدات بشم؟';
    }
  };

  const speakResponse = useCallback((response: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'fa-IR';
      utterance.voice =
        window.speechSynthesis.getVoices().find((voice) => voice.lang === 'fa-IR') || null;

      utterance.onend = () => {
        setTimeout(() => {
          setIsSpeaking(false);
          startListening();
        }, 100);
      };

      if (!isSpeaking) {
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      console.error('SpeechSynthesis is not supported in this browser.');
    }
  }, [isSpeaking]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);

        if (transcript.toLowerCase().includes('youtube')) {
          window.open('https://www.youtube.com', '_blank');
          return;
        }

        const response = getResponse(transcript);
        setAiResponse(response);
        speakResponse(response);
        setCircleSize(150);
        setTimeout(() => setCircleSize(100), 1000);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error occurred in speech recognition: ', event.error);
      };

      recognition.start();
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  }, [speakResponse]);

  return (
    <div>
      <div style={{ width: circleSize, height: circleSize, borderRadius: '50%', backgroundColor: 'white' }}></div>
      <p>User Input: {userInput}</p>
      <p>AI Response: {aiResponse}</p>
    </div>
  );
};

export default AIComponent;
