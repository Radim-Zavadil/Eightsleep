import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useVitaminDContext } from '../Context/VitaminDContext';

const VitaminDCard: React.FC = () => {
  
  const { showVitaminDWidget, setShowVitaminDWidget } = useVitaminDContext();
  
  const toggleVitaminDWidget = () => {
    setShowVitaminDWidget(!showVitaminDWidget);
  };

  return (
    <LinearGradient
      colors={["#9A4514", "#582A10", "#170903"]}
      style={{
        width: '100%',
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
            borderWidth: 1,
            borderColor: "#6B728A",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
            <Svg width={31} height={25} viewBox="0 0 31 25">
            <Path
                d="M7.75 23.3334C7.75 21.1234 8.56651 19.0039 10.0199 17.4412C11.4733 15.8785 13.4446 15.0005 15.5 15.0005C17.5554 15.0005 19.5267 15.8785 20.9801 17.4412C22.4335 19.0039 23.25 21.1234 23.25 23.3334C23.25 23.7754 23.0867 24.1993 22.796 24.5119C22.5053 24.8244 22.1111 25 21.7 25C21.2889 25 20.8947 24.8244 20.604 24.5119C20.3133 24.1993 20.15 23.7754 20.15 23.3334C20.15 22.0074 19.6601 20.7357 18.788 19.7981C17.916 18.8604 16.7333 18.3337 15.5 18.3337C14.2667 18.3337 13.084 18.8604 12.212 19.7981C11.3399 20.7357 10.85 22.0074 10.85 23.3334C10.85 23.7754 10.6867 24.1993 10.396 24.5119C10.1053 24.8244 9.71108 25 9.3 25C8.88891 25 8.49467 24.8244 8.20398 24.5119C7.9133 24.1993 7.75 23.7754 7.75 23.3334ZM24.8 15.6905L25.8959 14.5122C26.1782 14.1979 26.3344 13.7769 26.3309 13.3399C26.3274 12.903 26.1643 12.485 25.877 12.176C25.5896 11.867 25.2008 11.6917 24.7944 11.6879C24.388 11.6841 23.9965 11.8521 23.7041 12.1557L22.6083 13.3339C22.4603 13.4877 22.3422 13.6716 22.2609 13.8749C22.1797 14.0782 22.137 14.2969 22.1352 14.5182C22.1334 14.7395 22.1726 14.959 22.2505 15.1638C22.3285 15.3686 22.4436 15.5547 22.5891 15.7111C22.7346 15.8676 22.9077 15.9914 23.0982 16.0752C23.2887 16.159 23.4928 16.2011 23.6986 16.1992C23.9044 16.1973 24.1078 16.1513 24.2969 16.064C24.486 15.9766 24.657 15.8497 24.8 15.6905ZM27.9 25H29.45C29.8611 25 30.2553 24.8244 30.546 24.5119C30.8367 24.1993 31 23.7754 31 23.3334C31 22.8914 30.8367 22.4675 30.546 22.155C30.2553 21.8424 29.8611 21.6668 29.45 21.6668H27.9C27.4889 21.6668 27.0947 21.8424 26.804 22.155C26.5133 22.4675 26.35 22.8914 26.35 23.3334C26.35 23.7754 26.5133 24.1993 26.804 24.5119C27.0947 24.8244 27.4889 25 27.9 25ZM3.1 21.6668H1.55C1.13891 21.6668 0.744666 21.8424 0.453984 22.155C0.163303 22.4675 0 22.8914 0 23.3334C0 23.7754 0.163303 24.1993 0.453984 24.5119C0.744666 24.8244 1.13891 25 1.55 25H3.1C3.51109 25 3.90533 24.8244 4.19601 24.5119C4.4867 24.1993 4.65 23.7754 4.65 23.3334C4.65 22.8914 4.4867 22.4675 4.19601 22.155C3.90533 21.8424 3.51109 21.6668 3.1 21.6668ZM5.10415 14.5122L6.2 15.6905C6.34298 15.8497 6.51402 15.9766 6.70312 16.064C6.89223 16.1513 7.09562 16.1973 7.30143 16.1992C7.50724 16.2011 7.71134 16.159 7.90183 16.0752C8.09232 15.9914 8.26538 15.8676 8.41091 15.7111C8.55645 15.5547 8.67154 15.3686 8.74947 15.1638C8.82741 14.959 8.86663 14.7395 8.86484 14.5182C8.86305 14.2969 8.82029 14.0782 8.73906 13.8749C8.65782 13.6716 8.53974 13.4877 8.3917 13.3339L7.29585 12.1557C7.00352 11.8521 6.61198 11.6841 6.20558 11.6879C5.79917 11.6917 5.41041 11.867 5.12303 12.176C4.83565 12.485 4.67264 12.903 4.6691 13.3399C4.66557 13.7769 4.82181 14.1979 5.10415 14.5122ZM15.5 13.3339C15.9111 13.3339 16.3053 13.1584 16.596 12.8458C16.8867 12.5333 17.05 12.1094 17.05 11.6674V5.69101L19.0541 7.8459C19.3465 8.14948 19.738 8.31746 20.1444 8.31367C20.5508 8.30987 20.9396 8.1346 21.227 7.8256C21.5143 7.5166 21.6774 7.0986 21.6809 6.66163C21.6844 6.22466 21.5282 5.80368 21.2458 5.48936L16.5958 0.48962C16.4519 0.334418 16.2808 0.211281 16.0925 0.127264C15.9042 0.0432471 15.7023 0 15.4984 0C15.2946 0 15.0927 0.0432471 14.9044 0.127264C14.7161 0.211281 14.545 0.334418 14.4011 0.48962L9.75105 5.48936C9.60714 5.64431 9.49303 5.82822 9.41522 6.03059C9.33742 6.23296 9.29744 6.44983 9.29759 6.66881C9.29788 7.11106 9.46155 7.53507 9.7526 7.84757C10.0436 8.16006 10.4382 8.33545 10.8495 8.33514C11.2609 8.33482 11.6552 8.15884 11.9458 7.8459L13.95 5.69101V11.6674C13.95 12.1094 14.1133 12.5333 14.404 12.8458C14.6947 13.1584 15.0889 13.3339 15.5 13.3339Z" fill="#95949A"
            />
            </Svg>
        </View>
        

        <View
          style={{
            backgroundColor:'#603B27',
            borderRadius: 7,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontFamily: "Inter",
              fontWeight: '500',
            }}
          >
            {showVitaminDWidget ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Category Text */}
      <Text
        style={{
          marginTop: 12,
          color: '#DDAF94',
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
        Vitamin D
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#DDAF94',
          fontSize: 14,
          fontFamily: "Inter",
          marginTop: 6,
          flex: 1,
          opacity: 0.6
        }}
      >
        Maximize your Vitamin D with smart and personalized suggestions for sun exposure.
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
          opacity: showVitaminDWidget ? 0.5 : 1
        }}
      >
        <Text
          onPress={toggleVitaminDWidget}
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontFamily: "Inter"
          }}
        >
          {showVitaminDWidget ? "Added" : "Get"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default VitaminDCard;
