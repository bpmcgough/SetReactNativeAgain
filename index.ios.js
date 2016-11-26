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

  handleChange() {
    (this.props.handlePress.bind(this))(this.props.card);
  }

  // handleChange() {
 //     (this.props.handlePress.bind(this))(this.props.card);
 //     let style = _.extend({}, this.state.style);
 //     style.backgroundColor = (style.backgroundColor === 'white' ? '#CCC' : 'white');
 //     this.setState({style});
 //   }
 //
 //   render() {
 //     if(this.props.card){
 //       return (
 //         <TouchableHighlight style={this.state.style} onPress={this.handleChange.bind(this)}>
 //           <Image
 //             source={this.props.card.img} resizeMode='center' style={styles.image}
 //           />
 //         </TouchableHighlight>
 //       );

  render() {
    let backgroundColor = "hello";
      return (
        <TouchableHighlight style={this.props.styles} onPress={this.handleChange.bind(this)}>
          <Image
            source={this.props.card.img} resizeMode='center' style={this.props.styles}
          />
        </TouchableHighlight>
      )
  }
}

// so here's the goal:
// show nothing at first
// make button that, when pressed, displays a card
// make another button that, when pressed, changes the cards background color

class SetProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // put things in state that you need to rerender
      cardArray: currentCards.slice(),
      selectedCards: []
    }
  }

  displayNewCard(){
    let emptyCardArray = [];
    this.setState({cardArray: emptyCardArray});
  }

  changeBackgroundColor(){
    let newCardArray = [{id: 2, backgroundColor: 'red', color: 'red', selected: false, number: 1, fill: 'empty', shape: 'oval', img: require('/Users/michaelmcgough/Desktop/Coding/SideProjects/SetProject/cardImages/ovals/1-purple-shaded-oval.png'), id: 1, key: 1}]
    this.setState({cardArray: newCardArray});
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
    console.log('selectedCards.length: ', this.state.selectedCards.length, newCardArray.length);
    if(newCardArray.length === 3 && Helpers.checkForSet(newCardArray)){
      this.handleFoundSet();
    }
    this.forceUpdate();
  }

  handleFoundSet(){
    console.log('found set!')
    let newCardArray = this.state.cardArray.filter(el => {
      let shouldReturn = true;
      this.state.selectedCards.forEach(card => {
        if(card.id === el.id){
          shouldReturn = false;
        }
      });
      if(shouldReturn) return el;
  	});


    usedCards = usedCards.concat(this.state.selectedCards);

    this.setState({selectedCards: []});

    for(let i = 0; i < 3; i++){
      newCardArray.push(allTheCards.pop());
    }

    this.setState({cardArray: newCardArray});

  };

  render() {
    console.log('rendered')

    let cardElementArray = this.state.cardArray.map((card, i)=>{
      let cardStyle = {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         margin: 5,
         width: 90,
         height: 100,
         borderWidth: 1,
         backgroundColor: null
      };

      console.log('card.selected:', card.selected)
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
        <TouchableHighlight style={styles.image}>
          <Text onPress={this.displayNewCard.bind(this)}>Display A Card</Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text onPress={this.changeBackgroundColor.bind(this)}>Change Background</Text>
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
    // flexWrap: 'wrap',
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
  card: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   margin: 5,
   width: 90,
   height: 100,
   borderWidth: 1,
   backgroundColor: "white"
  }
});


AppRegistry.registerComponent('SetProject', () => SetProject);

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   TouchableHighlight,
//   ListView,
//   Image
// } from 'react-native';
// import _ from 'underscore';
// import Helpers from './theDirectory/helpers';
// import Cards from './theDirectory/allTheCards';
//
// let allTheCards = Cards;
// let selectedCards = [];
// let usedCards = [];
// let currentCards = [];
//
// shuffle = Helpers.shuffle;
// checkForSet = Helpers.checkForSet;
//
// generateCards = () => {
//   allTheCards = Helpers.shuffle(allTheCards);
//   currentCards = [];
//   while(currentCards.length < 12){
//     currentCards.push(allTheCards.pop());
//   }
// };
//
// handleFoundSet = () => {
//   currentCards = currentCards.filter(el => {
//     let shouldReturn = true;
//     selectedCards.forEach(card => {
//       if(card.id === el.id){
//         shouldReturn = false;
//       }
//     });
//     if(shouldReturn) return el;
// 	});
//
//   usedCards = usedCards.concat(selectedCards);
//
//   selectedCards = [];
//
//   for(let i = 0; i < 3; i++){
//     currentCards.push(allTheCards.pop());
//   }
// };
//
// generateCards();
//
// class Button extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       style: {
//        flex: 1,
//        justifyContent: 'center',
//        alignItems: 'center',
//        margin: 5,
//        width: 90,
//        height: 100,
//        borderWidth: 1,
//        backgroundColor: "white"
//       }
//     };
//   }
//
//   componentDidMount(){
//     let style = _.extend({}, this.state.style);
//     style.backgroundColor = 'orange';
//     this.setState({style});
//   }
//
//   handleChange() {
//     (this.props.handlePress.bind(this))(this.props.card);
//     let style = _.extend({}, this.state.style);
//     style.backgroundColor = (style.backgroundColor === 'white' ? '#CCC' : 'white');
//     this.setState({style});
//   }
//
//   render() {
//     if(this.props.card){
//       return (
//         <TouchableHighlight style={this.state.style} onPress={this.handleChange.bind(this)}>
//           <Image
//             source={this.props.card.img} resizeMode='center' style={styles.image}
//           />
//         </TouchableHighlight>
//       );
//     } else {
//       return (
//         <View></View>
//       )
//     }
//   }
// }
//
// let cardsArray;
//
// class SetProject extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   handlePress(card){
//     if(card.selected === false){
//       card.selected = true;
//       selectedCards.push(card);
//     } else {
//       card.selected = false;
//       selectedCards = selectedCards.filter( el => el !== card);
//     }
//     if(selectedCards.length === 3 && Helpers.checkForSet(selectedCards)){
//       handleFoundSet(selectedCards);
//       this.forceUpdate();
//     }
//   }
//
//   generateCards(){
//     generateCards();
//     this.makeCardsArray();
//     this.forceUpdate();
//   }
//
//   makeCardsArray(){
//     cardsArray = currentCards.map((card) => {
//       return (
//         <Button card={card} handlePress={this.handlePress.bind(this)} backgroundColor='white'></Button>
//       )
//     });
//   }
//
//   render() {
//     this.makeCardsArray();
//     return (
//       <View style={styles.overarch}>
//         <View style={styles.container}>
//           {cardsArray}
//         </View>
//         <TouchableHighlight onPress={this.generateCards.bind(this)} style={styles.submit}>
//           <Text style={styles.welcome}>Shit Fuck</Text>
//         </TouchableHighlight>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   title: {
//     flex: .2,
//     justifyContent: 'center'
//   },
//   submit: {
//     flex: .2,
//     justifyContent: 'center',
//   },
//   overarch: {
//     flex: 1,
//     marginTop: 25,
//     marginBottom: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     flexDirection: 'column'
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     flexDirection: 'column'
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   image: {
//     width: 50,
//     height: 70
//   }
// });
//
//
// AppRegistry.registerComponent('SetProject', () => SetProject);
