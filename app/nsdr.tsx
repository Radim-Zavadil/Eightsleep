import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function NSDRPage() {
  const [selectedVoice, setSelectedVoice] = useState('woman');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const playAudio = async () => {
    try {
      console.log('Play button clicked, selected voice:', selectedVoice);

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const audioFile = selectedVoice === 'woman'
        ? require('@/assets/music/nsdr-woman.mp3')
        : require('@/assets/music/nsdr-man.mp3');

      console.log('Loading audio file...');
      const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
      console.log('Audio loaded successfully');

      setSound(newSound);

      console.log('Starting playback...');
      await newSound.playAsync();
      console.log('Playback started');

      setIsPlaying(true);
      setTimer(0);
      startTimer();

      newSound.setOnPlaybackStatusUpdate((status) => {
        console.log('Playback status:', status);
        if (status.didJustFinish) {
          console.log('Audio finished playing');
          setIsPlaying(false);
          stopTimer();
        }
        if (status.error) {
          console.error('Playback error:', status.error);
          setIsPlaying(false);
          stopTimer();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      console.error('Error details:', error.message);
      setIsPlaying(false);
      stopTimer();
      setTimer(0);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      stopTimer();
      setTimer(0);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      stopTimer();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopAudio();
    }
  }, [selectedVoice]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NSDR</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/nsdr-picture.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            selectedVoice === 'woman' && styles.selectedButton
          ]}
          onPress={() => setSelectedVoice('woman')}
        >
          <Text style={[
            styles.selectionText,
            selectedVoice === 'woman' && styles.selectedText
          ]}>
            Woman Voice
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            selectedVoice === 'man' && styles.selectedButton
          ]}
          onPress={() => setSelectedVoice('man')}
        >
          <Text style={[
            styles.selectionText,
            selectedVoice === 'man' && styles.selectedText
          ]}>
            Man Voice
          </Text>
        </TouchableOpacity>
      </View>

      {!isPlaying && (
        <TouchableOpacity style={styles.playButton} onPress={playAudio}>
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      )}

      {isPlaying && (
        <View style={styles.playingContainer}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  imageContainer: {
    width: '80%',
    height: 150,
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '40%',
    height: '100%',
  },
  selectionContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 4,
  },
  selectionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  selectionText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  playingContainer: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
});
