// import { useEffect, useRef } from 'react';

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// export default function useVoiceAnswer(
//   currentQuestion: any,
//   onSelect: (answerId: number) => void,
// ) {
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.log('Browser không hỗ trợ Speech API');
//       return;
//     }

//     const recognition = new SpeechRecognition();

//     recognition.lang = 'vi-VN';
//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onresult = (event: any) => {
//       const text = event.results[event.results.length - 1][0].transcript
//         .trim()
//         .toUpperCase();

//       console.log('Voice:', text);

//       const answerMap: Record<string, number> = {
//         A: 0,
//         B: 1,
//         C: 2,
//         D: 3,
//       };

//       let index = -1;

//       Object.keys(answerMap).forEach((key) => {
//         if (text.includes(key)) {
//           index = answerMap[key];
//         }
//       });

//       if (index >= 0 && currentQuestion?.answers?.[index]) {
//         onSelect(currentQuestion.answers[index].id);
//       }
//     };

//     recognition.start();

//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//     };
//   }, [currentQuestion, onSelect]);
// }
