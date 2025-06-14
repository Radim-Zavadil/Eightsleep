import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useScreenContext } from '../Context/ScreenContext';

const ScreentimeCard: React.FC = () => {
  
  const { showScreenWidget, setShowScreenWidget } = useScreenContext();
  
  const toggleScreenWidget = () => {
    setShowScreenWidget(!showScreenWidget);
  };

  return (

    <LinearGradient
      colors={["#3B4E9B", "#162157", "#000926"]}
      style={{
        width: 380,
        height: 240,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        position: 'relative',
      }}
      start={{x:0, y:1}}
      end={{x:0, y:1}}
    >
      {/* Header Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
            style={{
                backgroundColor: "#1F1E23",
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: "1px",
                borderColor: "#6B728A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Svg width={20} height={25} viewBox="0 0 25 25">
            <Path
                d="M2.92308 19.9266V25.2188H1.38462C1.17231 25.2188 1 25.3937 1 25.6094C1 25.825 1.17231 26 1.38462 26H16.9046H17.6738H20.6154C20.8277 26 21 25.825 21 25.6094C21 25.3937 20.8277 25.2188 20.6154 25.2188H19.0769V19.9266C19.0769 16.9727 17.44 14.3117 14.8408 12.9336C17.44 11.5547 19.0769 8.89375 19.0769 5.93984V1.78125H20.6154C20.8277 1.78125 21 1.60625 21 1.39062C21 1.175 20.8277 1 20.6154 1H1.38462C1.17231 1 1 1.175 1 1.39062C1 1.60625 1.17231 1.78125 1.38462 1.78125H2.92308V5.93984C2.92308 8.89297 4.56 11.5547 7.15923 12.9336C4.56 14.3117 2.92308 16.9727 2.92308 19.9266ZM5.36615 25.2188C5.36615 20.5312 10.4692 19.1688 11.0831 19.0422C11.6792 19.1141 16.4431 19.7086 16.8631 25.2188H5.36615ZM11.0054 11.1367C8.72385 10.3383 7.72231 8.81953 7.34077 8.03125H14.6677C13.7154 10.1352 11.5131 10.9688 11.0054 11.1367ZM8.22308 13.2961C8.36923 13.2367 8.46538 13.093 8.46538 12.9328C8.46538 12.7727 8.37 12.6289 8.22308 12.5703C5.47077 11.4594 3.69231 8.85625 3.69231 5.93984V1.78125H18.3077V5.93984C18.3077 8.85625 16.5292 11.4594 13.7769 12.5703C13.6308 12.6297 13.5346 12.7734 13.5346 12.9336C13.5346 13.0938 13.6308 13.2375 13.7769 13.2969C16.5292 14.407 18.3077 17.0094 18.3077 19.9266V25.2188H17.6285C17.2085 19.6141 12.4108 18.5422 11.3315 18.3742C11.3623 18.318 11.3846 18.257 11.3846 18.1875V11.9375C11.3846 11.9023 11.3738 11.8711 11.3654 11.8391C12.1931 11.5523 14.7254 10.4719 15.5962 7.76172C15.6346 7.64297 15.6146 7.5125 15.5423 7.41094C15.47 7.31016 15.3538 7.25 15.2308 7.25H6.76923C6.64846 7.25 6.53462 7.30781 6.46231 7.40547C6.38923 7.50391 6.36615 7.63047 6.4 7.74844C6.43308 7.86641 7.24769 10.582 10.6377 11.8266C10.6269 11.8625 10.6154 11.8984 10.6154 11.9375V18.1875C10.6154 18.2 10.6215 18.2109 10.6223 18.2234C9.26154 18.6633 4.59692 20.5227 4.59692 25.2188H3.69231V19.9266C3.69231 17.0094 5.47077 14.407 8.22308 13.2961Z" fill="#95949A" stroke="#95949A" stroke-width="0.7"
            />
            </Svg>
        </View>
        

        <View
          style={{
            backgroundColor: '#394267',
            borderRadius: 7,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '500',
              fontFamily: "Inter"
            }}
          >
            {showScreenWidget ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Category Text */}
      <Text
        style={{
          marginTop: 12,
          color: '#9CA7CC',
          fontSize: 12,
          fontFamily: "Inter",
          letterSpacing: 4,
          opacity: 0.6
        }}
      >
        PRODUCTIVITY
      </Text>

      {/* Title */}
      <Text
        style={{
          color: '#fff',
          fontSize: 22,
          fontFamily: "Inter",
          fontWeight: '400',
          marginTop: 4,
        }}
      >
        Screentime
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#9CA7CC',
          fontSize: 14,
          fontFamily: "Inter",
          marginTop: 6,
          flex: 1,
          opacity: 0.6
        }}
      >
        Tracks screen time and its impact on your sleep, offering personalized insights for healthier habits.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          opacity: showScreenWidget ? 0.5 : 1
        }}
      >
        <Text
          onPress={toggleScreenWidget} 
          style={{
            color: '#000',
            fontFamily: "Inter",
            fontWeight: 'bold',
          }}
        >
          {showScreenWidget ? "Added" : "Get"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ScreentimeCard;
