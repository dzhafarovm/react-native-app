import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";

import db from "../../firebase/config";

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const [comment, setComment] = useState("");
  const [allComment, setAllComment] = useState([]);
  const { nickname } = useSelector((state) => state.auth);

  useEffect(() => {
    getAllComments();
  }, []);

  const createPost = async () => {
    await db
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({ comment, nickname });
  };

  const getAllComments = async () => {
    await db
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .onSnapshot((data) =>
        setAllComment(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null}>
        <SafeAreaView>
          <FlatList
            data={allComment}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.title}>{item.nickname}</Text>
                <Text>{item.comment}</Text>
              </View>
            )}
          />
        </SafeAreaView>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={setComment} />
        </View>
        <View>
          <TouchableOpacity style={styles.sendBtn} onPress={createPost}>
            <Text style={styles.btnTitle}>add post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  commentContainer: {
    padding: 5,
    marginBottom: 7,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#f00",
    borderRadius: 10,
  },

  title: {
    fontWeight: "500",
    color: "#f00",
    textTransform: "uppercase",
  },

  inputContainer: {
    marginHorizontal: 10,
  },

  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "transparent",
    borderBottomColor: "#f00",
  },

  sendBtn: {
    marginHorizontal: 10,
    marginBottom: 30,
    height: 40,
    borderWidth: 2,
    borderColor: "#F00",
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  btnTitle: {
    fontSize: 18,
    color: "#f00",
  },
});

export default CommentsScreen;
