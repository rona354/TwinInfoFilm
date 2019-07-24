import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, ActivityIndicator, DrawerLayoutAndroid } from 'react-native'
import { Header, SearchBar, Button, Card, Image, Text, Tooltip } from 'react-native-elements';
import axios from 'axios'

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      responDatabase: [],
      loading: null,
      teksInput: '',
      errorInput: false,
    }
  }


  fetchingDatabase = async () => {                                                  //Pake fungsi async await untuk tombol
    try {
      let replaceURL = this.state.teksInput.replace(/ /g, '+');
      this.setState({ loading: true, errorInput: false });                                            //Loading true buat loading di poster sambil nunggu await
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: 'xxxxxxxx',                                                       //API key free registered ini maksimal 1000 per hari
          t: replaceURL
        }
      });
      {
        if (response.data.Error) {                                                  //Kalo hasil input error/tidak ada di database
          this.setState({ responDatabase: [], errorInput: true })                   //Error jadi true, dan respon database dikosongkan
        } else {
          this.setState({ responDatabase: response.data, errorInput: false })       //Error di-set false, database diisi, lanjut ke render
        }
      };
      this.setState({ loading: false });                                            //loading nya diset false dulu, biar lanjut ke render
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  }



  renderPoster = () => {
    if (this.state.errorInput) {              //Apakah ada error dalam input ??? lanjut jika false
      return <Text style={[styles.penjelasanBold, { textAlign: "center" }]}>Maaf, {'\n'}hasil pencarian tidak ada di dalam database.{'\n'}Mungkin salah ketik ?</Text>  //NO KEYWORD alias error
    } if (this.state.loading) {
      this.renderLoadingData()
    } else if (this.state.loading === null) {
      return <Image source={require('./assets/omdbLogo.png')} style={[styles.styleImage, { opacity: 0.3 }]} />
    }
    return <Image source={{ uri: this.state.responDatabase.Poster }} style={styles.styleImage} PlaceholderContent={<ActivityIndicator size="large" />} />     //ADA, LANJUT RENDER IMAGE
  }

  renderLoadingData = () => {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  toolTipComponent = () => {
    return (
      <Tooltip popover={<Text style={{ color: '#0984e3' }}>Database powered by OMDB.{'\n'}{'\n'}Ditunggu fitur & update selanjutnya!</Text>} backgroundColor='#ffeaa7' height={150} >
        <Image source={require('./assets/logoTwin.png')} style={{ height: 47, width: 47 }} />
      </Tooltip>
    )
  }

  navigationView = (
    <View style={{ flex: 1, backgroundColor: '#f39c12', justifyContent: "center", alignContent: "center" }}>

      <Text style={{ margin: 10, textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>
        Masih tahap pengembangan
      </Text>

      <Image source={require('./assets/logoTwin.png')} style={{ alignSelf: "center", height: 150, width: 150 }} />

      <Text style={{ margin: 10, textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>
        Ditunggu update dan fitur selanjutnya!
      </Text>
      <Text style={{ margin: 10, textAlign: 'center', fontSize: 13, color: '#dfe6e9', bottom: 0 }}>contact person: royanfauzan@gmail.com</Text>
    </View>
  )

  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => this.navigationView}
        style={{ flex: 1 }}>
        <ScrollView>

          <Header
            placement='left'
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'TWIN Info Film', style: { fontFamily: 'sans-serif-medium', color: '#fff', fontSize: 20, fontWeight: '400' } }}
            rightComponent={this.toolTipComponent()}
            backgroundColor='#f39c12'
            statusBarProps={{ hidden: true }}
          />

          <View style={styles.containernya}>

            <Text style={styles.judulFilm} h4>{this.state.responDatabase.Title}</Text>

            {/* render poster jika tidak error atau salah input */}
            <View style={{ borderWidth: 1, borderRadius: 25, borderColor: '#ecf0f1', marginBottom: 10 }}>
              {this.renderPoster()}
            </View>

            <Card>
              <View style={styles.styleViewPenjelasan}>
                <Text style={styles.penjelasannya}>Rating IMDB : </Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.imdbRating}</Text>
              </View>
              <View style={styles.styleViewPenjelasan}>
                <Text style={styles.penjelasannya}>Genre : </Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Genre}</Text>
              </View>
              <View style={styles.styleViewPenjelasan}>
                <Text style={styles.penjelasannya}>Released : </Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Released}</Text>
              </View>
              <View style={styles.styleViewPenjelasan}>
                <Text style={[styles.penjelasannya]}>Country :</Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Country}</Text>
              </View>
              <View style={styles.styleViewPenjelasan}>
                <Text style={styles.penjelasannya}>Director :</Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Director}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Text style={styles.penjelasannya}>Actors :</Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Actors}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Text style={styles.penjelasannya}>Plot :</Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Plot}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                <Text style={styles.penjelasannya}>Awards :</Text>
                <Text style={styles.penjelasanBold}>{this.state.responDatabase.Awards}</Text>
              </View>
            </Card>

          </View>
        </ScrollView>

        <Card containerStyle={{ backgroundColor: '#f39c12', borderRadius: 12, }}>
          <SearchBar
            containerStyle={{ borderRadius: 12, marginBottom: 10 }}
            platform='ios'
            placeholder="Masukan film yang ingin dicari..."
            value={this.state.teksInput}
            onChangeText={(teks) => this.setState({ teksInput: teks })}
            autoCompleteType='off'
            returnKeyType='done'
          />
          <Button
            buttonStyle={{ borderRadius: 12, height: 55, }}
            title="C A R I"
            type="outline"
            titleStyle={{ color: '#f39c12' }}
            raised={true}
            onPress={() => this.fetchingDatabase()}
          />
        </Card>
      </DrawerLayoutAndroid>
    )
  }
}

const styles = StyleSheet.create({
  containernya: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    justifyContent: "space-between",
    alignItems: "center",
  },
  judulFilm: {
    flexWrap: "wrap",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 22,
    fontFamily: 'lucida grande',
    fontWeight: 'bold'
  },
  styleImage: {
    width: 250,
    height: 350,
    alignSelf: 'center',
    resizeMode: "cover",
    borderWidth: 1,
    borderRadius: 25
  },
  styleViewPenjelasan: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  penjelasannya: {
    fontSize: 16,
    flexWrap: "wrap",
    fontFamily: 'lucida grande',
    textAlign: "left",
    padding: 10,
  },
  penjelasanBold: {
    fontSize: 16,
    flexWrap: "wrap",
    fontFamily: 'lucida grande',
    textAlign: "left",
    fontWeight: "bold",
    paddingHorizontal: 10,
  }
})



export default App
