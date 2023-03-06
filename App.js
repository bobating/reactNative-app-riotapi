import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from "react";
import axios from 'axios';



export default function App() {

  const [player, setPlayer] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [matchData, setMatchData] = useState({});
  const API = "RGAPI-ac724e9a-d9f9-479b-b585-f622b6c2a022";
  const image = { uri: "https://i.pinimg.com/originals/8d/ce/94/8dce947888c856405752c26fa6285cdc.jpg" };
  let playerIcon = { uri: "http://img3.wikia.nocookie.net/__cb20150215130030/leagueoflegends/images/6/66/Fat_Poro_Icon.png" };
  let playerName = "";
  let playerDate = "";
  let playerLevel = "";
  let playerSoloRank = [];
  let playerFlexRank = [];
  let soloRank = "";
  let flexRank = "";
  let soloWinRate = 0;
  let flexWinRate = 0;

  //searching for player
  function searchPlayer(event) {
    if (event != null && event != undefined) {
      // API link to search the player and get data back
      var APIString = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + player + "?api_key=" + API;
      // Handle of the API call back
      axios.get(APIString).then(function (response) {
        setPlayerData(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    }

  }
  //searching for player rank matches
  function searchMatch(event) {
    if (playerData.name != undefined && playerData.name != null) {
      var APIString2 = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + playerData.id + "?api_key=" + API;
      axios.get(APIString2).then(function (response) {
        setMatchData(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    }


  }

  //giving variables json data 
  if (playerData.name != undefined) {
    playerIcon = { uri: `https://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/` + playerData.profileIconId + `.png` };
    playerName = "Summoner Name: " + playerData.name;
    playerDate = "Last Active Time: " + ((((Date.now() - playerData.revisionDate) / 1000) / 60) / 60).toFixed(2) + " Hours Ago";
    playerLevel = "Summoner Level: " + playerData.summonerLevel;

    for (var i = 0; i < matchData.length; i++) {
      if (matchData[i].queueType == "RANKED_SOLO_5x5") {
        playerSoloRank = matchData[i];
      }
      else if (matchData[i].queueType == "RANKED_FLEX_SR") {
        playerFlexRank = matchData[i];
      }

    }
    //displaying ranked data
    if ((playerSoloRank != "" && playerSoloRank != undefined) || (playerFlexRank != "" && playerFlexRank != undefined)) {
      if ((playerFlexRank != undefined && playerFlexRank != "") && (playerSoloRank != undefined && playerSoloRank != "")) {
        soloRank = "Player Solo Rank: " + playerSoloRank.tier + " " + playerSoloRank.rank + " \n| Wins " + playerSoloRank.wins + " | Loses " + playerSoloRank.losses + " | Win Rate " + ((playerSoloRank.wins / (playerSoloRank.losses + playerSoloRank.wins)) * 100).toFixed(3) + "%";
        flexRank = "Player Flex Rank: " + playerFlexRank.tier + " " + playerFlexRank.rank + " \n| Wins: " + playerFlexRank.wins + " | Loses " + playerFlexRank.losses + " | Win Rate " + ((playerFlexRank.wins / (playerFlexRank.losses + playerFlexRank.wins)) * 100).toFixed(3) + "%";
      }
      else if (playerFlexRank != undefined && playerFlexRank != "") {
        soloRank = "Player Solo Rank: Did not play this season";
        flexRank = "Player Flex Rank: " + playerFlexRank.tier + " " + playerFlexRank.rank + " Wins: " + playerFlexRank.wins + " | Loses " + playerFlexRank.losses + " | Win Rate " + ((playerFlexRank.wins / (playerFlexRank.losses + playerFlexRank.wins)) * 100).toFixed(3) + "%";
      }
      else if (playerSoloRank != undefined && playerSoloRank != "") {
        soloRank = "Player Solo Rank: " + playerSoloRank.tier + " " + playerSoloRank.rank + " | Wins: " + playerSoloRank.wins + " | Loses " + playerSoloRank.losses + " | Win Rate " + ((playerSoloRank.wins / (playerSoloRank.losses + playerSoloRank.wins)) * 100).toFixed(3) + "%";
        flexRank = "Player Flex Rank: Did not play this season";
      } else if ((playerSoloRank == "") && (playerFlexRank == "")) {
        soloRank = "Player did not play rank this season";
      }

    }
  }


  return (

    <View style={styles.container}>

      <ImageBackground source={image} resizeMode="cover" style={styles.backgroundimage}>
        <Text style={styles.text}>League Data App</Text>

        <ScrollView >

          <TextInput
            style={styles.input}
            onChange={e => setPlayer(e.target.value)}
          />
          <TouchableOpacity
            style={styles.box}
            onPress={searchPlayer}
          >
            <Text>Search Players</Text>

          </TouchableOpacity>

          <Image
            style={styles.image}
            source={playerIcon}
          />
          <Text style={styles.name}>
            {playerName} {"\n"}
            {playerLevel} {"\n"}
            {playerDate} {"\n"}

          </Text>
          <TouchableOpacity
            style={styles.box}
            onPress={searchMatch}
          >
            <Text>Rank This Season</Text>

          </TouchableOpacity>


          <Text style={styles.name}>
            {soloRank} {"\n"}
            {flexRank} {"\n"}

          </Text>

        </ScrollView>
      </ImageBackground>

      <StatusBar style="auto" />
    </View >


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 10,

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,

  },
  box: {
    borderWidth: 1,
    padding: 15,
    margin: 10,
    backgroundColor: "#ADD8E6",
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 5,
    fontSize: 25,
    color: "#00008B",
  },
  backgroundimage: {
    width: 420,
    height: '105%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    color: '#ADD8E6',
    textAlign: 'center',
    padding: 15,
    backgroundColor: 'rgba(52, 52, 52, 0.7)',
  }

});
