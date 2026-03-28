// import React from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   StyleSheet, 
//   TextInputProps, 
//   ViewStyle, 
//   TextStyle,
//   TouchableOpacity
// } from 'react-native';

// interface InputProps extends TextInputProps {
//   label?: string;
//   error?: string;
//   containerStyle?: ViewStyle;
//   icon?: React.ReactNode;
//   onIconPress?: () => void;
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   error,
//   containerStyle,
//   icon,
//   onIconPress,
//   style,
//   ...props
// }) => {
//   return (
//     <View style={[styles.container, containerStyle]}>
//       {label && <Text style={styles.label}>{label}</Text>}
//       <View style={[styles.inputContainer, error ? styles.inputError : null]}>
//         <TextInput
//           style={[styles.input, style]}
//           placeholderTextColor="#A0A0A0"
//           {...props}
//         />
//         {icon && (
//           <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
//             {icon}
//           </TouchableOpacity>
//         )}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//     width: '100%',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#212121',
//     marginBottom: 8,
//     fontFamily: 'System',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F7F9F9', // Light grey/teal tint
//     height: 58,
//     borderRadius: 29,
//     paddingHorizontal: 20,
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#212121',
//     fontWeight: '400',
//   },
//   inputError: {
//     borderColor: '#FF4D4D',
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#FF4D4D',
//     marginTop: 4,
//     marginLeft: 20,
//   },
// });
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle; // ✅ NEW
  icon?: React.ReactNode;
  onIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputContainerStyle, // ✅ NEW
  icon,
  onIconPress,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        inputContainerStyle  // ✅ Applied to the border View, not TextInput
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
        {icon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            {icon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F9',
    height: 58,
    borderRadius: 29,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    fontWeight: '400',
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4D4D',
    marginTop: 4,
    marginLeft: 20,
  },
});