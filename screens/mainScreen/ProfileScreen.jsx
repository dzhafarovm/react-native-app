import React, { useState, useEffect } from "react";
import { View, Button, FlatList, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { authSignOutUser } from "../../redux/auth/auth-operations";
import db from "../../firebase/config";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [userPost, setUserPost] = useState([]);
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    await db
      .firestore()
      .collection("posts")
      .where("userId", "==", userId)
      .onSnapshot((data) =>
        setUserPost(data.docs.map((doc) => ({ ...doc.data() })))
      );
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <Button title="LOG OUT" color={"red"} onPress={signOut} />
      </View>

      <FlatList
        data={userPost}
        keyExtractor={(item, ind) => ind.toString()}
        renderItem={({ item }) => (
          <View style={styles.imgCont}>
            <Image source={{ uri: item.photo }} style={styles.img} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  btnContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#f00",
  },

  imgCont: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },

  img: {
    flex: 1,
    width: "100%",
    height: 200,
  },
});

export default ProfileScreen;
