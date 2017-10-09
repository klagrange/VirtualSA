import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator } from 'react-native'
import firebase from 'firebase'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
  Card } from 'react-native-elements'
import Options from '../components/Options' 

export default class Login extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: ''
    }
  }

  onButtonPress () {
    const { email, password } = this.state
    this.setState({ error: '', loading: true })

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.onLoginSuccess.bind(this)
        this.props.onSuccess()
      })
      .catch((error) => {
        this.onLoginFail.bind(this)(error)
      })
  }

  onLoginFail (error) {
    const { message } = error
    this.setState({ error: message, loading: false })
  }

  onLoginSuccess () {
    this.setState({
      email: '',
      password: '',
      loading: false,
      error: ''
    })
  }

  renderButton (onPress) {
    if (this.state.loading) {
      return <ActivityIndicator size='large' color='#38E680' />
    }

    return (
      <Button
        title='LOG IN'
        large
        raised
        backgroundColor='#05CC98'
        buttonStyle={{borderRadius: 5}}
        containerViewStyle={{borderRadius: 5, marginTop: 10}}
        onPress={this.onButtonPress.bind(this)}
      />
    )
  }

  renderError () {
    if (this.state.error) {
      return (
        <View style={{alignItems: 'center'}}>
          <FormValidationMessage> {this.state.error} </FormValidationMessage>
        </View>
      )
    }

    return null
  }

  render () {
    return (
      <View>
        <FormLabel> Email </FormLabel>
        <FormInput
          onChangeText={email => this.setState({email})}
          inputStyle={{fontSize: 22}} />
        <FormLabel> Password </FormLabel>
        <FormInput
          onChangeText={password => this.setState({password})}
          secureTextEntry
          inputStyle={{fontSize: 22}} />
        { this.renderError() }
        { this.renderButton() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 40,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
})
