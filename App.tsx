import { useState } from 'react';
import { StyleSheet, Text, View,TextInput,Image,FlatList, Pressable, Alert } from 'react-native';
import axios from 'axios';

// Type Declaration
type bookDetailObject = {image: string, title: string, price: string}
type bookBoxProp = {  
                      bookDetailObj : bookDetailObject, 
                      index : number, 
                      removeBook: (index : number) => void
                   }

// Component for Rendering the book Detail
const BookBox = ({bookDetailObj, index, removeBook}:bookBoxProp) => {
  return (
    <View style={styles.bookBox}>
      <Image style={{width:'40%',height:170}} 
             source={{uri:bookDetailObj.image}}
             />
      <View style={styles.bookInfoBox}>
          <Text style={styles.bookTitle}>{bookDetailObj.title}</Text>
          <Text style={styles.bookPrice}>Price: {bookDetailObj.price}</Text>
          <Pressable style={styles.removeButton} onPress={() => removeBook(index)}>
             <Text style={{fontWeight:'600', color:'white'}}> Remove </Text>
          </Pressable>
      </View>
    </View>
  )
}

export default function App() {

  const [searchValue,setSearchValue] = useState<string>("");
  const [bookList,setBookList] = useState<bookDetailObject[]>([]);

  // Async function for API request to fetch bookList for the given searchedValue
  const fetchBookList = async (searchedValue: string) => {
    try{
      const response = await axios.get(`https://api.itbook.store/1.0/search/${searchedValue}`)
      const data = response.data;
       if(data.books.length === 0)
        {
          Alert.alert("No Books Founds!");
        }
      setBookList(data.books)
    }
    catch(error){
      Alert.alert("No Books Founds!");
      setBookList([]);
    }
  }

  // Getting the book list for the searched Value 
  const getBookList = () => {
    if(searchValue === "")
    {
      Alert.alert("Please enter a search term");
      return;
    }
    fetchBookList(searchValue);
  }

  // For Removing Books from the list.
  const removeBook = (index:  number) => {
    const bookListData = [...bookList];
    setBookList(bookListData.filter((item,ind) => ind != index));
  }

  return (
    <View style={styles.container}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <TextInput style={styles.textInput}
                    placeholder='Enter a word to search'
                    value={searchValue}
                    onChangeText={setSearchValue}/>
          <Pressable style={styles.searchButton} onPress={getBookList}>
              <Text style={{fontWeight:'600', color:'white'}}> SEARCH </Text>
          </Pressable>
        </View>
        {/* Book List Box */}
        <FlatList style={styles.bookListBox} 
                  data={bookList} 
                  renderItem={(itemObj: any) =><BookBox bookDetailObj={itemObj.item} 
                                                        index={itemObj.index}
                                                        removeBook={removeBook}/>}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchBox : {
    padding: 18,
    width:'100%'
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor:'grey',
    padding: 10,
    color:'grey'
  },
  searchButton : {
    backgroundColor:'purple',
    borderRadius: 5,
    width:'100%',
    alignItems:'center',
    marginTop:15,
    padding: 8,   
  },
  bookListBox: {
    paddingHorizontal:10,
    width:'100%'
  },
  bookBox: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 1,
    borderColor:'grey',
    borderRadius:5,
    margin:5,
  },
  bookInfoBox: {
    flex: 1,
    justifyContent:'center',
    padding:15
  },
  bookTitle: {
    fontSize: 20,
    fontWeight:'700',
  },
  bookPrice: {
    fontSize: 13,
    fontWeight:'700',
    color:'grey',
    marginVertical:6,
  },
  removeButton : {
    backgroundColor:'orange',
    borderRadius: 5,
    width:'65%',
    alignItems:'center',
    marginLeft: 5,
    marginTop:5,
    padding: 8,   
  }
});
