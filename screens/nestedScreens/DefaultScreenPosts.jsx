import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";
import db from "../../firebase/config";

const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    await db
      .firestore()
      .collection("posts")
      .onSnapshot((data) =>
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, ind) => ind.toString()}
        renderItem={({ item }) => (
          <View style={styles.imgCont}>
            <Image source={{ uri: item.photo }} style={styles.img} />
            <View>
              <Text style={styles.title}>"{item.comment}"</Text>
            </View>
            <View style={styles.btnContainer}>
              <Button
                title="go to Map"
                color={"red"}
                onPress={() =>
                  navigation.navigate("Map", { location: item.location })
                }
              />
            </View>
            <View style={styles.btnContainer}>
              <Button
                title="go to Comments"
                color={"red"}
                onPress={() =>
                  navigation.navigate("Comments", { postId: item.id })
                }
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    padding: 3,
    fontSize: 18,
    color: "#f00",
  },

  btnContainer: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#f00",
    backgroundColor: "transparent",
  },

  imgCont: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  img: {
    flex: 1,
    width: "100%",
    height: 200,
  },
});

export default DefaultScreenPosts;
