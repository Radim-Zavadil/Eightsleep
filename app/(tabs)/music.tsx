import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';

const { width, height } = Dimensions.get('window');

const musicData = [
  {
    id: 1,
    title: 'OPTIMAL DEEP SLEEP FOR PHYSICAL RECOVERY',
    description: 'Higher deep sleep helps with physical recovery and immune system health.',
    category: 'sleep',
    duration: '1h',
    audioFile: require('@/assets/music/rain(glass).mp3'), // Replace with your actual file
    thumbnail: require('@/assets/images/forest.png'),
  },
  {
    id: 2,
    title: 'PEACEFUL FOREST SOUNDS',
    description: 'Natural forest ambiance for deep relaxation and better sleep quality.',
    category: 'sleep',
    duration: '45m',
    audioFile: require('@/assets/music/rain(forest).mp3'), // Replace with your actual file
    thumbnail: require('@/assets/images/forest.png'),
  },
  {
    id: 3,
    title: 'RAIN SOUNDS FOR DEEP SLEEP',
    description: 'Gentle rain sounds to help you fall asleep faster and sleep deeper.',
    category: 'sleep',
    duration: '2h',
    audioFile: require('@/assets/music/thunderstorm.mp3'), // Replace with your actual file
    thumbnail: require('@/assets/images/forest.png'),
  },
];

export default function MusicScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Speed control state
  const [volume, setVolume] = useState(0.6); // Volume control state
  const volumeBarRef = useRef(null);

  const categories = ['All', 'Meditation', 'Stress', 'Sleep'];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async (music) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        music.audioFile,
        { 
          shouldPlay: true,
          rate: playbackSpeed,
          volume: volume
        }
      );
      
      setSound(newSound);
      setCurrentMusic(music);
      setIsPlaying(true);
      setShowPlayer(true);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
          setIsPlaying(status.isPlaying);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseResumeSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  // Toggle playback speed between 1x and 2x
  const toggleSpeed = async () => {
    const newSpeed = playbackSpeed === 1 ? 2 : 1;
    setPlaybackSpeed(newSpeed);
    
    if (sound) {
      try {
        await sound.setRateAsync(newSpeed, true);
      } catch (error) {
        console.error('Error setting playback rate:', error);
      }
    }
  };

  // Skip backward by 15 seconds
  const skipBackward = async () => {
    if (sound) {
      try {
        const newPosition = Math.max(0, position - 15000); // 15 seconds in milliseconds
        await sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping backward:', error);
      }
    }
  };

  // Skip forward by 30 seconds
  const skipForward = async () => {
    if (sound) {
      try {
        const newPosition = Math.min(duration, position + 30000); // 30 seconds in milliseconds
        await sound.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping forward:', error);
      }
    }
  };

  // Adjust volume
  const adjustVolume = async (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (sound) {
      try {
        await sound.setVolumeAsync(clampedVolume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  // Handle volume bar touch and drag
  const handleVolumeBarTouch = (event) => {
    volumeBarRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const touchX = event.nativeEvent.locationX;
      const newVolume = Math.max(0, Math.min(1, touchX / width));
      adjustVolume(newVolume);
    });
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredMusic = selectedCategory === 'All' 
    ? musicData 
    : musicData.filter(music => music.category === selectedCategory.toLowerCase());

  const renderMusicCard = (music) => (
    <TouchableOpacity
      key={music.id}
      style={styles.musicCard}
      onPress={() => playSound(music)}
    >
      <Image source={music.thumbnail} style={styles.thumbnail} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.musicInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{music.category.toUpperCase()}</Text>
          <View style={styles.durationContainer}>
            <Ionicons name="play" size={12} color="white" />
            <Text style={styles.durationText}>{music.duration}</Text>
          </View>
        </View>
        <Text style={styles.musicTitle}>{music.title}</Text>
        <Text style={styles.musicDescription}>{music.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContentContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterTab,
                  selectedCategory === category && styles.activeFilterTab,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === category && styles.activeFilterText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Music List */}
          <ScrollView
            style={styles.musicList}
            contentContainerStyle={styles.musicListContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredMusic.map(renderMusicCard)}
          </ScrollView>
        </SafeAreaView>

        {/* Full Screen Player Modal */}
        <Modal
          visible={showPlayer && currentMusic}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.playerContainer}>
            <SafeAreaView style={styles.playerContent}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPlayer(false)}
              >
                <Ionicons name="chevron-down" size={30} color="white" />
              </TouchableOpacity>

              {/* Square Image */}
              <View style={styles.imageContainer}>
                <Image source={currentMusic?.thumbnail} style={styles.playerImage} />
              </View>

              {/* Music Info */}
              <View style={styles.playerInfo}>
                <Text style={styles.playerTitle}>{currentMusic?.title}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${duration ? (position / duration) * 100 : 0}%` }
                    ]} 
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>-{formatTime(duration - position)}</Text>
                </View>
              </View>

              {/* Control Buttons */}
              <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.controlButton} onPress={toggleSpeed}>
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
                  <Ionicons name="play-skip-back" size={24} color="white" />
                  <Text style={styles.skipText}>15</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={pauseResumeSound}
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={40} 
                    color="white" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
                  <Ionicons name="play-skip-forward" size={24} color="white" />
                  <Text style={styles.skipText}>30</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="moon" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Volume Control with Draggable Bar */}
              <View style={styles.volumeContainer}>
                <TouchableOpacity onPress={() => adjustVolume(volume - 0.1)}>
                  <Ionicons name="volume-low" size={20} color="white" />
                </TouchableOpacity>
                <View 
                  ref={volumeBarRef}
                  style={styles.volumeBarContainer}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderGrant={handleVolumeBarTouch}
                  onResponderMove={handleVolumeBarTouch}
                >
                  <View style={styles.volumeBar}>
                    <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
                  </View>

                </View>
                <TouchableOpacity onPress={() => adjustVolume(volume + 0.1)}>
                  <Ionicons name="volume-high" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 10,
    maxHeight: 50,
  },
  filterContentContainer: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000',
  },
  musicList: {
    flex: 1,
    marginTop: 10,
  },
  musicListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  musicCard: {
    width: '100%',
    height: 410,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  musicInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    marginBottom: 12
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  musicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: "center"
  },
  musicDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playerImage: {
    width: 400,
    height: 470,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 30,
    marginHorizontal: 30
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  speedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  skipText: {
    color: '#fff',
    fontSize: 10,
    position: 'absolute',
    bottom: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  volumeBarContainer: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
    marginHorizontal: 15,
    position: 'relative',
  },
  volumeBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});