import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  Image
} from 'react-native';
import _ from 'underscore';
import Helpers from './theDirectory/helpers';
import Cards from './theDirectory/allTheCards';

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

handleFoundSet = () => {
  currentCards = currentCards.filter(el => {
    let shouldReturn = true;
    selectedCards.forEach(card => {
      if(card.id === el.id){
        shouldReturn = false;
      }
    });
    if(shouldReturn) return el;
	});

  usedCards = usedCards.concat(selectedCards);

  selectedCards = [];

  for(let i = 0; i < 3; i++){
    currentCards.push(allTheCards.pop());
  }
};

generateCards();

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       margin: 5,
       width: 90,
       height: 100,
       borderWidth: 1,
       backgroundColor: this.props.card.selected ? '#CCC' : 'white'
      }
    };
  }

  handleChange() {
    (this.props.handlePress.bind(this))(this.props.card);
    let style = _.extend({}, this.state.style);
    style.backgroundColor = (style.backgroundColor === 'white' ? '#CCC' : 'white');
    this.setState({style});
  }

  render() {
    if(this.props.card){
      return (
        <TouchableHighlight style={this.state.style} onPress={this.handleChange.bind(this)}>
          <Image
            source={this.props.card.img} resizeMode='center' style={styles.image}
          />
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight style={this.state.style}>
          <Text>End of the deck!</Text>
        </TouchableHighlight>
      )
    }
  }
}

let cardsArray;

class SetProject extends Component {
  constructor(props) {
    super(props);
  }

  handlePress(card){
    if(card.selected === false){
      card.selected = true;
      selectedCards.push(card);
    } else {
      card.selected = false;
      selectedCards = selectedCards.filter( el => el !== card);
    }
    if(selectedCards.length === 3 && Helpers.checkForSet(selectedCards)){
      handleFoundSet(selectedCards);
      this.forceUpdate();
    }
  }

  generateCards(){
    generateCards();
    this.forceUpdate();
  }

  makeCardsArray(){
    cardsArray = currentCards.map((card) => {
      return (
        <Button card={card} handlePress={this.handlePress.bind(this)} backgroundColor='white'></Button>
      )
    });
  }

  render() {
    this.makeCardsArray();
    return (
      <View style={styles.overarch}>
        <View style={styles.container}>
          {cardsArray}
        </View>
        <TouchableHighlight onPress={this.generateCards.bind(this)} style={styles.submit}>
          <Text style={styles.welcome}>Start Over</Text>
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
    flexWrap: 'wrap',
    flexDirection: 'column'
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
    height: 70
  }
});


AppRegistry.registerComponent('SetProject', () => SetProject);
