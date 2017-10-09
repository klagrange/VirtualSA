import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  Image,
  ActivityIndicator } from 'react-native'
import {
  FormInput,
  Avatar,
  Icon,
  Button } from 'react-native-elements'
import Options from '../components/Options'
import firebase from 'firebase'
import moment from 'moment'
import axios from 'axios'

const myConvo = [
  {
    message: 'Hey there!',
    from: 'self',
    first: true
  },
  {
    message: 'Hello',
    from: 'virtual-sa',
    buttons: ['option A', 'option B', 'option C'],
    first: true
  }
]

const VIRTUAL_SA_URL = 'https://cloudstack99.dscloud.biz:8443/mobile'

export default class Login extends Component {
  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    const { currentUser } = firebase.auth()

    this.state = {
      dataSource: undefined,
      lastIdxType: '',
      currentUser,
      message: '',
      showMessageBar: true
    }
  }

  componentWillMount () {
    firebase.database().ref(`/${this.state.currentUser.uid}/`)
      .on('value', snapshot => {
        const snap = snapshot.val() || {}
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.setState({ dataSource: ds.cloneWithRows(snap) })
      })
  }

  componentDidUpdate () {
    // TODO: FIND A BETTER WAY THAN THIS HACK.
    if (this.state.dataSource) {
      setTimeout(() => this.refs.ListView.scrollToEnd({animated: true}), 50)
    }
    // setTimeout(() => this.refs.ListView.scrollToEnd({animated: true}), 2000)
  }

  setStateMessage (message) {
    this.setState({ message })
  }

  renderButtons (buttons) {
    if (buttons) {
      return (
        <View>
          {
            buttons.map((el) => {
              return (
                <Button
                  title={el.text}
                  small
                  raised
                  backgroundColor='#05CC98'
                  buttonStyle={{borderRadius: 5}}
                  containerViewStyle={{borderRadius: 5, marginTop: 10}}
                  onPress={
                    () => {
                      this.setState({ message: el.value })
                    }
                  }
                />
              )
            })
          }
        </View>
      )

    return null
    }    
  }


  renderReceivedAnswer (message, first, buttons) {
    // const toSend = buttons ? `${message} (${buttons})` : `${message}`
    const toSend = `${message}`
    if (first) {
      return (
        <View style={{
          flexDirection: 'row'
        }}>
          <Avatar
            medium
            rounded
            source={{
              // uri: 'https://media.glamour.com/photos/5862b19999e7331b159887bb/master/pass/41bc2106c2c71d45780e0e75f00dec9e152d0a31510ddba21872ba7cdb43b22d7e11e05907cc9b961ad44c2eade12410.jpg'
              // uri: 'https://static.giantbomb.com/uploads/scale_small/0/5911/1491088-me2_illusive_man_headshot.jpg'
              // uri: 'http://i2.cdn.cnn.com/cnnnext/dam/assets/161107120239-01-trump-parry-super-169.jpg'
              uri: 'http://sg.palo-it.com/wp-content/uploads/sites/6/2014/01/men_022.png'
            }}
            onPress={() => console.log('Works!')}
            activeOpacity={0.7}
          />
          <View>
             <Text style={[styles.receivedAnswer, { marginLeft: 5, marginTop: 25, borderTopLeftRadius: 0 }]}>
              {toSend}
            </Text>
            { this.renderButtons(buttons) }
          </View>

        </View>
      )
    }

    // { this.renderButtons(buttons) }
    return (
      <Text style={[styles.receivedAnswer, { marginLeft: 55, marginTop: 2 }]}>
        {message}
      </Text>
    )
  }

  renderMyAnswer (message, first) {
    if (first) {
      return (
        <Text style={[styles.myAnswer, { borderTopRightRadius: 0 }]}>
          {message}
        </Text>
      )
    }

    return (
      <Text style={styles.myAnswer}>
        {message}
      </Text>
    )
  }

  renderRow (rowData, i) {
    const { message, from, first, buttons = undefined } = rowData

    if (buttons) {
      this.setState({ showMessageBar: false })
    } else {
      this.setState({ showMessageBar: true })
    }

    switch (from) {
      case 'self':
        return this.renderMyAnswer(message, first)
      case 'virtual-sa':
        return this.renderReceivedAnswer(message, first, buttons)
      default:
        return <Text> from was not defined! </Text>
    }
  }

  renderRowTest (rowData, i) {
    return (
      <Text> {rowData.message} </Text>
    )
  }

  renderMessageBar (showMessageBar) {
    return (
        <View style={{
        flexDirection: 'row'
        }}>
        <FormInput
          onChangeText={message => this.setState({message})}
          value={this.state.message}
          focus={() => this.setState({ message: 'HEY' })}
          placeholder={'Type a message'}
          containerStyle={styles.MessageBar}
          underlineColorAndroid='rgba(0,0,0,0)'
          raised
          disabled
          buttonStyle={{
            borderColor: 'blue',
            borderWidth: 10
          }}
        />
        <Icon
          raised
          name='arrow-circle-right'
          type='font-awesome'
          color='#05CC98'
          onPress={() => this.onPress()}
          />
      </View> 
    )
  }

  onPress () {
    const { message, currentUser } = this.state

    switch (message) {
      case '':
        this.refs.ListView.scrollToEnd({animated: true})
        break
      default:
        this.setState({ message: '' })
        const now = moment().unix()

        // Store our message to firebase.
        console.log(message)
        firebase.database().ref(`/${currentUser.uid}/${now}/`)
          .set({
            message,
            from: 'self',
            first: true
          })
          .then(() => {
            // The message was succesfully stored inside firebase.
            // Fire the message to CORE now.
            this.refs.ListView.scrollToEnd({animated: true})
            axios.post(VIRTUAL_SA_URL,
              {
                senderId: currentUser.uid,
                text: message,
                type: 'message'
              },
              {
                headers: {'content-type': 'application/json'}
              })
              .then((response) => {
                console.log(response)
                console.log('HELLO')
                console.log('YO')
              })
              .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
    }
  }

  render () {
    return (
      <Image
        style={styles.backgroundImage}
        source={{
          // uri: 'https://media.glamour.com/photos/5862b19999e7331b159887bb/master/pass/41bc2106c2c71d45780e0e75f00dec9e152d0a31510ddba21872ba7cdb43b22d7e11e05907cc9b961ad44c2eade12410.jpg'
          // uri: 'https://media.licdn.com/media/AAEAAQAAAAAAAArrAAAAJGZmNDJmYmU5LTY0YjUtNGYwNS04OTQ3LTNmMjkyMTY0ZTNlZg.png'
          // uri: 'https://pbs.twimg.com/media/ClFf92JUsAAQAH2.jpg'
          // uri: 'http://sg.palo-it.com/wp-content/uploads/sites/6/2014/01/men_022.png'
          // uri: 'https://image-store.slidesharecdn.com/35a8734a-13c0-4b62-a63b-4efc57174217-original.png'
          uri: 'https://d2d00szk9na1qq.cloudfront.net/Product/e1eca657-9b12-43d0-b36c-71669ff884ae/Images/Large_0354265.jpg'
        }}>
        {
          this.state.dataSource
          ? <ListView
            dataSource={this.state.dataSource}
            ref='ListView'
            renderRow={(rowData, _, i) => this.renderRow(rowData, i)}
            onChangeVisibleRows={(visibleRows, changedRows) => console.log(visibleRows, changedRows)}
          />
          : <ActivityIndicator
              style={{flex: 1}}
              size='large'
              color='#38E680' />
        }
        {
          this.renderMessageBar()
        }
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    alignSelf: 'stretch',
    width: null
  },
  container: {
    height: '100%',
    backgroundColor: '#05CC98'
    // PALO Green #05CC98
    // PALO Vivid Green #38E680
  },
  myAnswer: {
    borderWidth: 0.1,
    borderRadius: 10,
    marginTop: 2,
    maxWidth: '80%',
    marginLeft: '20%',
    marginRight: 2,
    padding: 7,
    backgroundColor: '#FFAF3B',
    alignSelf: 'flex-end',
    fontSize: 18
  },
  receivedAnswer: {
    borderWidth: 0.1,
    borderRadius: 10,
    borderColor: 'black',
    maxWidth: '80%',
    marginRight: '20%',
    padding: 7,
    alignSelf: 'flex-start',
    fontSize: 18,
    backgroundColor: '#05CC98'
  },
  MessageBar: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
    height: 'auto',
    alignSelf: 'center',
    flex: 2
  },
  SendButton: {
    flex: 1
  }
})


            // onPress={() => {
            //   this.refs.ListView.scrollToEnd({animated: true})
            //   const { message, currentUser } = this.state

            //   switch (message) {
            //     case '':
            //       console.log('DO NOT DO ANYTHING')
            //       break
            //     default:
            //       console.log(`I JUST WROTE: ${message}`)
            //       this.setState({ message: '' })
            //       const now = moment().unix()
            //       firebase.database().ref(`/${currentUser.uid}/${now}/`)
            //         .set({
            //           message,
            //           from: 'self',
            //           first: true
            //         })
            //         .then(() => {
            //           console.log('MESSAGE STORED IN FIREBASE DATABASE SUCCESSFULLY -> FIRE TO WEBHOOK')
            //           axios.post(VIRTUAL_SA_URL,
            //             {
            //               senderId: currentUser.uid,
            //               text: message,
            //               type: 'message'
            //             },
            //             {
            //               headers: {'content-type': 'application/json'}
            //             })
            //             .then(reponse => console.log(reponse))
            //             .catch(error => console.log(error))
            //         })
            //         .catch(error => console.log(error))
            //   }
            // }}
