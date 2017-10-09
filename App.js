import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import Login from './src/screens/Login.js'
import Convo from './src/screens/Convo.js'
import {
  Header } from 'react-native-elements'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: null
    }
  }

  componentWillMount () {
    firebase.initializeApp({
      apiKey: 'AIzaSyA1ypg0witl2QjkcpDntDvdOichj9Rg0Iw',
      authDomain: 'virtualsa-native.firebaseapp.com',
      databaseURL: 'https://virtualsa-native.firebaseio.com',
      projectId: 'virtualsa-native',
      storageBucket: 'virtualsa-native.appspot.com',
      messagingSenderId: '984601793694'
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: false })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }

  render () {
    let renderComponent
    switch (this.state.loggedIn) {
      case false:
        renderComponent =
          <Login
            onSuccess={() => this.setState({ loggedIn: true })}
          />
        break
      case true:
        renderComponent = <Convo />
        break
      default:
        renderComponent =
          <View style={{height: '100%', alignContent: 'center', justifyContent: 'center'}}>
            <ActivityIndicator
              size='large'
              color='#38E680' />
          </View>
    }

    return (
      <View style={{flex: 1}}>
        <Header
          leftComponent={{ icon: 'menu', color: 'green' }}
          centerComponent={{ text: 'VIRTUAL SA', style: { color: 'green' } }}
          rightComponent={{ icon: 'home', color: 'green' }}
        />
        <View style={{marginTop: 70}}>
          {renderComponent}
        </View>
      </View>
    )
  }
}

// const styles = StyleSheet.create({
// })
