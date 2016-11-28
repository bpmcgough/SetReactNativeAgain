import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  Image,
  Animated
} from 'react-native';
import _ from 'underscore';
import Helpers from './theDirectory/helpers';
import Cards from './theDirectory/allTheCards';
import * as Animatable from 'react-native-animatable';

let allTheCards = Cards;
let selectedCards = [];
let usedCards = [];
let currentCards = [];

shuffle = Helpers.shuffle;
checkForSet = Helpers.checkForSet;

generateCards = () => {
  allTheCards = Helpers.shuffle(allTheCards);
  currentCards = [];
  while(currentCards.length < 12){
    currentCards.push(allTheCards.pop());
  }
};

generateCards();

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleOn: false
    };
  }

  componentWillMount() {
    this._animatedValue = new Animated.Value(0);
  }

  handlePress() {
    this._animatedValue = new Animated.Value(0);
    (this.props.handlePress.bind(this))(this.props.card);
    if(this.props.card.selected){
      Animated.timing(this._animatedValue, {
          toValue: 100,
          duration: 2000
      }).start();
    }
    // this.setState({toggleOn: !this.state.toggleOn});
  }

  render() {
      let interpolatedRotateAnimation = this._animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg']
      });

      // let color = this._animatedValue.interpolate({
      //    inputRange: [0, 300],
      //    outputRange: ['green', 'blue']
      // });

      return (
        <Animated.View
              style={[{transform: [{rotate: interpolatedRotateAnimation}]}]}
          >
        <TouchableHighlight style={styles.outerCard} onPress={this.handlePress.bind(this)}>
            <Image
              source={this.props.card.img} resizeMode='center' style={this.props.styles}
            />
        </TouchableHighlight>
      </Animated.View>
      )
  }
}

class SetProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cardArray: currentCards.slice(),
      selectedCards: []
    }
  }

  handlePress(card){
    let newCardArray;
    if(card.selected === false){
      card.selected = true;
      newCardArray = this.state.selectedCards.slice();
      newCardArray.push(card);
      this.setState({selectedCards: newCardArray});
    } else {
      card.selected = false;
      newCardArray = this.state.selectedCards.slice();
      newCardArray = newCardArray.filter( el => el !== card);
      this.setState({selectedCards: newCardArray});
    }
    if(newCardArray.length === 3 && Helpers.checkForSet(newCardArray)){
      this.handleFoundSet(newCardArray);
    }
    this.forceUpdate();
  }

  handleFoundSet(selectedCards){
    let newCardArray = this.state.cardArray.map(el => {
      let shouldReturn = true;
      selectedCards.forEach(card => {
        if(card.id === el.id){
          shouldReturn = false;
        }
      });
      return shouldReturn ? el : allTheCards.pop();
  	});

    usedCards = usedCards.concat(selectedCards);

    this.setState({selectedCards: []});
    this.setState({cardArray: newCardArray});
  };

  reset(){
    generateCards();
    this.setState({cardArray: currentCards.slice()})
  }

  render() {

    let cardElementArray = this.state.cardArray.map((card, i)=>{
      // TODO: Fix this, cardStyle declared 12 times per render
      let cardStyle = {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         margin: 5,
         width: 90,
         height: 117,
         backgroundColor: null,
         borderWidth: 1,
         borderRadius: 10
      };

      if(card.selected){
        cardStyle.backgroundColor = '#B0BEC5'
      } else {
        cardStyle.backgroundColor = '#ECEFF1'
      }
      return (
        <Card card={card} styles={cardStyle} key={i} handlePress={this.handlePress.bind(this)}></Card>
      )
    })

    //TODO: when set is found, either fade cards out or flip to reveal new ones
    return (
      <View style={styles.overarch}>
        <View style={styles.container}>
          {cardElementArray}
        </View>
        <TouchableHighlight>
          <Text onPress={this.reset.bind(this)}>Reset (Get it?)</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: .2,
    justifyContent: 'center'
  },
  submit: {
    flex: .2,
    justifyContent: 'center',
  },
  overarch: {
    flex: 1,
    marginTop: 25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#607D8B'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width: 50,
    height: 70,
  },
  outerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 90,
    height: 117,
    borderWidth: 1,
    borderRadius: 10
  },
  toggle: {
   width: 120,
   backgroundColor: '#333',
   borderRadius: 3,
   padding: 5,
   fontSize: 14,
   alignSelf: 'center',
   textAlign: 'center',
   margin: 10,
   color: 'rgba(255, 255, 255, 1)',
   },
   toggledOn: {
     color: 'rgba(255, 33, 33, 1)',
     fontSize: 16,
     transform: [{
       rotate: '8deg',
     }, {
       translateY: -20,
     }],
   },
});

AppRegistry.registerComponent('SetProject', () => SetProject);
