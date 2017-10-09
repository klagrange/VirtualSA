import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator } from 'react-native'
import {
  Button,
  Card } from 'react-native-elements'

export default ({
    title,
    options = []
}) => {
    return (
        <Card 
            title={title}
            containerStyle={styles.containerStyle}
        >
        {
            options.map(item => {
                return (
                <Button
                    key={item}
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5}}
                    title={item} />
                )
            })
        }
        </Card>
    )
}


const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 0.1,
    borderRadius: 10,
    borderColor: 'black',
    alignSelf: 'flex-start',
    backgroundColor: '#38E680'
  }
})