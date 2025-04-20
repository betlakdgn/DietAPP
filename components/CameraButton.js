import * as React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Entypo } from '@expo/vector-icons';

const CameraButton = () => {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Entypo name={icon} size={28} color={color ? color : '#f1f1f1'}/>
            <Text style={styles.text}>{title}</Text>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: '#f1f1f1',
        fontWeight: 'bold',
        marginLeft: 10
    }

})
export default CameraButton;