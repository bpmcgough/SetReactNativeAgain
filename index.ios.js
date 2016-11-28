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

generateCards();

class Card extends Component {
  constructor(props) {
    super(props);
  }

  handlePress() {
    (this.props.handlePress.bind(this))(this.props.card);
  }

  render() {
      return (
        <TouchableHighlight style={styles.outerCard} onPress={this.handlePress.bind(this)}>
          <Image
            source={this.props.card.img} resizeMode='center' style={this.props.styles}
          />
        </TouchableHighlight>
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
    let newCardArray = this.state.cardArray.filter(el => {
      let shouldReturn = true;
      selectedCards.forEach(card => {
        if(card.id === el.id){
          shouldReturn = false;
        }
      });
      if(shouldReturn) return el;
  	});

    usedCards = usedCards.concat(selectedCards);

    this.setState({selectedCards: []});

    for(let i = 0; i < 3; i++){
      newCardArray.push(allTheCards.pop());
    }

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
         backgroundColor: null
      };

      if(card.selected){
        cardStyle.backgroundColor = '#CCC'
      } else {
        cardStyle.backgroundColor = 'white'
      }
      return (
        <Card card={card} styles={cardStyle} key={i} handlePress={this.handlePress.bind(this)}></Card>
      )
    })

    return (
      <View style={styles.overarch}>
        <View style={styles.container}>
          {cardElementArray}
        </View>
        <TouchableHighlight>
          <Text onPress={this.reset.bind(this)}>Reset</Text>
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
  },
  outerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 90,
    height: 100,
    borderWidth: 1
  }
});

AppRegistry.registerComponent('SetProject', () => SetProject);
