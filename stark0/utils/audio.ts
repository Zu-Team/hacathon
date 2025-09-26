/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Fix: Added content for audio utilities, which was previously a placeholder.
/**
 * Creates and resumes an AudioContext.
 * Browsers often require a user gesture to start the AudioContext.
 * @returns A new or resumed AudioContext instance.
 */
export function getAudioContext(): AudioContext {
  // `window.AudioContext` is the standard, `webkitAudioContext` is for older Safari.
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    throw new Error('Web Audio API is not supported in this browser.');
  }
  const audioContext = new AudioContext();
  // The AudioContext may start in a 'suspended' state and needs to be resumed by a user gesture.
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Requests microphone access and returns a MediaStream.
 * @returns A promise that resolves with the MediaStream from the microphone.
 * @throws An error if microphone access is denied or fails.
 */
export async function getMicrophoneStream(): Promise<MediaStream> {
  // Check if mediaDevices and getUserMedia are supported.
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('getUserMedia is not supported in this browser.');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    return stream;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    // Provide a more user-friendly error message.
    throw new Error(
      'Microphone access was denied. Please allow microphone access in your browser settings to use this feature.',
    );
  }
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
